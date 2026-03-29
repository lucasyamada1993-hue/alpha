import { useMemo, useState } from "react";
import { Plus, Trash2, Eye, MapPin, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for cart sectors
const MOCK_SETORES = [
  { id: 1, nome: "Tomografia 01" },
  { id: 2, nome: "Ressonância 02" },
  { id: 3, nome: "Sala de Preparo" },
  { id: 4, nome: "Raio-X 01" },
];

/** ISO no fim do dia da última verificação — alinhável a futura persistência (ex. ChecklistCarrinho + alertas). */
function alertaEmitidoDesdeVerificacao(dataYmd) {
  return `${dataYmd}T23:59:00.000Z`;
}

// Mock audit data — medicamentos com alerta: pendenciaResolvidaEm null até marcar na UI.
// Persistência futura: mapear para planilha/entidade (ex. ChecklistCarrinho + registos de alerta/resolução com ISO e responsável).
const MOCK_AUDITORIAS = [
  {
    id: 1,
    setor: "Tomografia 01",
    ultimaVerificacao: "2026-03-20",
    diasDesdeVerificacao: 8,
    alertaEmitidoEm: alertaEmitidoDesdeVerificacao("2026-03-20"),
    alertasQtd: { faltando: 0, ok: true },
    alertasValidade: { vencidos: 0, vencendoMes: 0, ok: true },
    checklist: {
      medicamentos: [
        { nome: "Epinefrina 1:1000", requerido: 2, presente: 2, validade: "2026-05-15", status: "ok", pendenciaResolvidaEm: null, resolvidoPor: null },
        { nome: "Atropina", requerido: 2, presente: 2, validade: "2026-06-10", status: "ok", pendenciaResolvidaEm: null, resolvidoPor: null },
        { nome: "Amiodarona", requerido: 1, presente: 1, validade: "2026-05-20", status: "ok", pendenciaResolvidaEm: null, resolvidoPor: null },
      ],
    },
  },
  {
    id: 2,
    setor: "Ressonância 02",
    ultimaVerificacao: "2026-03-10",
    diasDesdeVerificacao: 18,
    alertaEmitidoEm: alertaEmitidoDesdeVerificacao("2026-03-10"),
    alertasQtd: { faltando: 2, ok: false },
    alertasValidade: { vencidos: 0, vencendoMes: 1, ok: false },
    checklist: {
      medicamentos: [
        { nome: "Epinefrina 1:1000", requerido: 2, presente: 2, validade: "2026-05-15", status: "ok", pendenciaResolvidaEm: null, resolvidoPor: null },
        {
          nome: "Atropina",
          requerido: 2,
          presente: 0,
          validade: null,
          status: "faltando",
          pendenciaResolvidaEm: null,
          resolvidoPor: null,
        },
        {
          nome: "Amiodarona",
          requerido: 1,
          presente: 1,
          validade: "2026-04-05",
          status: "vencendo",
          pendenciaResolvidaEm: null,
          resolvidoPor: null,
        },
      ],
    },
  },
  {
    id: 3,
    setor: "Sala de Preparo",
    ultimaVerificacao: "2026-02-20",
    diasDesdeVerificacao: 36,
    alertaEmitidoEm: alertaEmitidoDesdeVerificacao("2026-02-20"),
    alertasQtd: { faltando: 1, ok: false },
    alertasValidade: { vencidos: 1, vencendoMes: 0, ok: false },
    checklist: {
      medicamentos: [
        {
          nome: "Epinefrina 1:1000",
          requerido: 2,
          presente: 2,
          validade: "2026-03-25",
          status: "vencido",
          pendenciaResolvidaEm: null,
          resolvidoPor: null,
        },
        {
          nome: "Atropina",
          requerido: 2,
          presente: 1,
          validade: "2026-06-10",
          status: "faltando",
          pendenciaResolvidaEm: null,
          resolvidoPor: null,
        },
        { nome: "Amiodarona", requerido: 1, presente: 1, validade: "2026-05-20", status: "ok", pendenciaResolvidaEm: null, resolvidoPor: null },
      ],
    },
  },
  {
    id: 4,
    setor: "Raio-X 01",
    ultimaVerificacao: "2026-03-18",
    diasDesdeVerificacao: 10,
    alertaEmitidoEm: alertaEmitidoDesdeVerificacao("2026-03-18"),
    alertasQtd: { faltando: 0, ok: true },
    alertasValidade: { vencidos: 0, vencendoMes: 0, ok: true },
    checklist: {
      medicamentos: [
        { nome: "Epinefrina 1:1000", requerido: 2, presente: 2, validade: "2026-05-15", status: "ok", pendenciaResolvidaEm: null, resolvidoPor: null },
        { nome: "Atropina", requerido: 2, presente: 2, validade: "2026-06-10", status: "ok", pendenciaResolvidaEm: null, resolvidoPor: null },
        { nome: "Amiodarona", requerido: 1, presente: 1, validade: "2026-05-20", status: "ok", pendenciaResolvidaEm: null, resolvidoPor: null },
      ],
    },
  },
];

function medTemAlerta(med) {
  return med.status !== "ok";
}

function formatarDataHoraBr(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

/** Resumo para coluna da tabela: — | Pendente | data da última resolução entre itens em alerta */
function resumoPendenciaResolvida(auditoria) {
  const comAlerta = auditoria.checklist.medicamentos.filter(medTemAlerta);
  if (comAlerta.length === 0) {
    return { texto: "—", variant: "neutral" };
  }
  const abertas = comAlerta.filter((m) => !m.pendenciaResolvidaEm);
  if (abertas.length > 0) {
    return { texto: "Pendente", variant: "open" };
  }
  const datas = comAlerta.map((m) => m.pendenciaResolvidaEm).filter(Boolean);
  const ultima = datas.reduce((a, b) => (new Date(a) > new Date(b) ? a : b));
  return { texto: formatarDataHoraBr(ultima), variant: "done" };
}

// Badge for check status based on days since verification
function StatusBadge({ diasDesdeVerificacao }) {
  if (diasDesdeVerificacao <= 20) {
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">🟢 Em dia</span>;
  } else if (diasDesdeVerificacao <= 30) {
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">🟡 Vencendo</span>;
  } else {
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">🔴 Atrasado</span>;
  }
}

// Modal to view cart details
function DetalhesModal({ auditoria, onClose, onMarcarResolvida, alertaEmitidoLabel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{auditoria.setor} — Detalhes da Auditoria</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Última Verificação:</span> {auditoria.ultimaVerificacao} ({auditoria.diasDesdeVerificacao} dias atrás)
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Alerta emitido (referência):</span> {alertaEmitidoLabel}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Status:</span> <StatusBadge diasDesdeVerificacao={auditoria.diasDesdeVerificacao} />
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Pendência resolvida (resumo):</span>{" "}
              {(() => {
                const r = resumoPendenciaResolvida(auditoria);
                return (
                  <span
                    className={cn(
                      r.variant === "open" && "text-amber-700 font-semibold",
                      r.variant === "done" && "text-emerald-700 font-semibold",
                      r.variant === "neutral" && "text-gray-600"
                    )}
                  >
                    {r.texto}
                  </span>
                );
              })()}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Medicações Verificadas</h3>
            <div className="space-y-3">
              {auditoria.checklist.medicamentos.map((med, i) => {
                const alerta = medTemAlerta(med);
                const resolvida = Boolean(med.pendenciaResolvidaEm);
                return (
                  <div
                    key={`${auditoria.id}-${med.nome}-${i}`}
                    className={cn(
                      "p-3 rounded-lg border flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
                      med.status === "ok" ? "bg-emerald-50 border-emerald-200" : "",
                      med.status === "faltando" ? "bg-red-50 border-red-200" : "",
                      med.status === "vencido" ? "bg-red-50 border-red-200" : "",
                      med.status === "vencendo" ? "bg-amber-50 border-amber-200" : ""
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800">{med.nome}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Requerido: {med.requerido} | Presente: {med.presente}
                        {med.validade && ` | Validade: ${med.validade}`}
                      </p>
                      {alerta && (
                        <div className="mt-2 text-xs space-y-1 border-t border-black/5 pt-2">
                          <p>
                            <span className="font-semibold text-gray-700">Pendência resolvida em: </span>
                            {resolvida ? (
                              <span className="text-emerald-800">{formatarDataHoraBr(med.pendenciaResolvidaEm)}</span>
                            ) : (
                              <span className="text-amber-700 font-medium">Pendente</span>
                            )}
                          </p>
                          {med.resolvidoPor && (
                            <p>
                              <span className="font-semibold text-gray-700">Por: </span>
                              {med.resolvidoPor}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {med.status === "ok" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {med.status === "faltando" && <AlertCircle className="w-5 h-5 text-red-600" />}
                      {med.status === "vencido" && <AlertCircle className="w-5 h-5 text-red-600" />}
                      {med.status === "vencendo" && <Clock className="w-5 h-5 text-amber-600" />}
                      {alerta && !resolvida && (
                        <button
                          type="button"
                          onClick={() => onMarcarResolvida(auditoria.id, i)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0D47A1] text-white hover:bg-[#0B3D91] transition-colors whitespace-nowrap"
                        >
                          Marcar pendência como resolvida
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function SetorModal({ onAdd, onClose }) {
  const [novoSetor, setNovoSetor] = useState("");

  const handleSubmit = () => {
    if (novoSetor.trim()) {
      onAdd(novoSetor);
      setNovoSetor("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Adicionar Novo Setor</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        <div className="p-6">
          <input
            type="text"
            placeholder="Ex: Ultrassom 03"
            value={novoSetor}
            onChange={(e) => setNovoSetor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
          />
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-sm transition-colors">
            Cancelar
          </button>
          <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-[#0D47A1] text-white rounded-lg hover:bg-[#0B3D91] font-semibold text-sm transition-colors">
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

function gestorLoginFromStorage() {
  try {
    const raw = localStorage.getItem("gestorAutenticado");
    if (!raw) return "";
    const data = JSON.parse(raw);
    return data.login || "";
  } catch {
    return "";
  }
}

export default function GestorQualidadeCarrinho() {
  const [setores, setSetores] = useState(MOCK_SETORES);
  const [auditorias, setAuditorias] = useState(MOCK_AUDITORIAS);
  const [showSetorModal, setShowSetorModal] = useState(false);
  const [selectedAuditoriaId, setSelectedAuditoriaId] = useState(null);

  const auditoriaSelecionada = useMemo(
    () => (selectedAuditoriaId == null ? null : auditorias.find((a) => a.id === selectedAuditoriaId) || null),
    [auditorias, selectedAuditoriaId]
  );

  const marcarResolvida = (auditoriaId, medIndex) => {
    const login = gestorLoginFromStorage() || "—";
    setAuditorias((prev) =>
      prev.map((a) => {
        if (a.id !== auditoriaId) return a;
        const meds = a.checklist.medicamentos.map((m, idx) => {
          if (idx !== medIndex) return m;
          if (m.status === "ok" || m.pendenciaResolvidaEm) return m;
          return {
            ...m,
            pendenciaResolvidaEm: new Date().toISOString(),
            resolvidoPor: login,
          };
        });
        return { ...a, checklist: { medicamentos: meds } };
      })
    );
  };

  const handleAddSetor = (novoSetor) => {
    setSetores([...setores, { id: setores.length + 1, nome: novoSetor }]);
    setShowSetorModal(false);
  };

  const handleDeleteSetor = (id) => {
    setSetores(setores.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">Auditoria de Carrinhos de Emergência</h1>
        <p className="text-sm text-gray-500 mt-1">Visão estratégica de conformidade e alertas de medicações</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Gerenciar Locais dos Carrinhos
          </h2>
          <button
            type="button"
            onClick={() => setShowSetorModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0D47A1] text-white rounded-lg hover:bg-[#0B3D91] font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Setor
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {setores.map((setor) => (
            <div key={setor.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
              <p className="font-semibold text-gray-800 text-sm">{setor.nome}</p>
              <button
                type="button"
                onClick={() => handleDeleteSetor(setor.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-lg">Tabela de Auditoria</h2>
          <p className="text-xs text-gray-400 mt-0.5">Conformidade mensal e alertas de medicações</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Setor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Última Verificação</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Alertas Qtd</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Alertas Validade</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Pendência resolvida em</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {auditorias.map((auditoria) => {
                const resumo = resumoPendenciaResolvida(auditoria);
                return (
                  <tr key={auditoria.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{auditoria.setor}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{auditoria.ultimaVerificacao}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge diasDesdeVerificacao={auditoria.diasDesdeVerificacao} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {auditoria.alertasQtd.ok ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">✅ Qtd Correta</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-700">
                          ⚠️ Faltam {auditoria.alertasQtd.faltando} itens
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {auditoria.alertasValidade.ok ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">✅ Validades OK</span>
                      ) : auditoria.alertasValidade.vencidos > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-700">
                          🔴 {auditoria.alertasValidade.vencidos} Vencid{auditoria.alertasValidade.vencidos > 1 ? "as" : "a"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-700">
                          🟡 {auditoria.alertasValidade.vencendoMes} Vencendo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          resumo.variant === "open" && "text-amber-700",
                          resumo.variant === "done" && "text-emerald-800",
                          resumo.variant === "neutral" && "text-gray-500"
                        )}
                      >
                        {resumo.texto}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedAuditoriaId(auditoria.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showSetorModal && <SetorModal onAdd={handleAddSetor} onClose={() => setShowSetorModal(false)} />}
      {auditoriaSelecionada && (
        <DetalhesModal
          auditoria={auditoriaSelecionada}
          alertaEmitidoLabel={formatarDataHoraBr(auditoriaSelecionada.alertaEmitidoEm)}
          onClose={() => setSelectedAuditoriaId(null)}
          onMarcarResolvida={marcarResolvida}
        />
      )}
    </div>
  );
}
