import { useState } from "react";
import { Plus, Trash2, Eye, MapPin, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for cart sectors
const MOCK_SETORES = [
  { id: 1, nome: "Tomografia 01" },
  { id: 2, nome: "Ressonância 02" },
  { id: 3, nome: "Sala de Preparo" },
  { id: 4, nome: "Raio-X 01" },
];

// Mock audit data
const MOCK_AUDITORIAS = [
  {
    id: 1,
    setor: "Tomografia 01",
    ultimaVerificacao: "2026-03-20",
    diasDesdeVerificacao: 8,
    alertasQtd: { faltando: 0, ok: true },
    alertasValidade: { vencidos: 0, vencendoMes: 0, ok: true },
    checklist: {
      medicamentos: [
        { nome: "Epinefrina 1:1000", requerido: 2, presente: 2, validade: "2026-05-15", status: "ok" },
        { nome: "Atropina", requerido: 2, presente: 2, validade: "2026-06-10", status: "ok" },
        { nome: "Amiodarona", requerido: 1, presente: 1, validade: "2026-05-20", status: "ok" },
      ]
    }
  },
  {
    id: 2,
    setor: "Ressonância 02",
    ultimaVerificacao: "2026-03-10",
    diasDesdeVerificacao: 18,
    alertasQtd: { faltando: 2, ok: false },
    alertasValidade: { vencidos: 0, vencendoMes: 1, ok: false },
    checklist: {
      medicamentos: [
        { nome: "Epinefrina 1:1000", requerido: 2, presente: 2, validade: "2026-05-15", status: "ok" },
        { nome: "Atropina", requerido: 2, presente: 0, validade: null, status: "faltando" },
        { nome: "Amiodarona", requerido: 1, presente: 1, validade: "2026-04-05", status: "vencendo" },
      ]
    }
  },
  {
    id: 3,
    setor: "Sala de Preparo",
    ultimaVerificacao: "2026-02-20",
    diasDesdeVerificacao: 36,
    alertasQtd: { faltando: 1, ok: false },
    alertasValidade: { vencidos: 1, vencendoMes: 0, ok: false },
    checklist: {
      medicamentos: [
        { nome: "Epinefrina 1:1000", requerido: 2, presente: 2, validade: "2026-03-25", status: "vencido" },
        { nome: "Atropina", requerido: 2, presente: 1, validade: "2026-06-10", status: "faltando" },
        { nome: "Amiodarona", requerido: 1, presente: 1, validade: "2026-05-20", status: "ok" },
      ]
    }
  },
  {
    id: 4,
    setor: "Raio-X 01",
    ultimaVerificacao: "2026-03-18",
    diasDesdeVerificacao: 10,
    alertasQtd: { faltando: 0, ok: true },
    alertasValidade: { vencidos: 0, vencendoMes: 0, ok: true },
    checklist: {
      medicamentos: [
        { nome: "Epinefrina 1:1000", requerido: 2, presente: 2, validade: "2026-05-15", status: "ok" },
        { nome: "Atropina", requerido: 2, presente: 2, validade: "2026-06-10", status: "ok" },
        { nome: "Amiodarona", requerido: 1, presente: 1, validade: "2026-05-20", status: "ok" },
      ]
    }
  },
];

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
function DetalhesModal({ auditoria, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{auditoria.setor} — Detalhes da Auditoria</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-600"><span className="font-semibold">Última Verificação:</span> {auditoria.ultimaVerificacao} ({auditoria.diasDesdeVerificacao} dias atrás)</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Status:</span> <StatusBadge diasDesdeVerificacao={auditoria.diasDesdeVerificacao} /></p>
          </div>

          {/* Medication Checklist */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Medicações Verificadas</h3>
            <div className="space-y-2">
              {auditoria.checklist.medicamentos.map((med, i) => (
                <div key={i} className={cn(
                  "p-3 rounded-lg border flex items-start justify-between",
                  med.status === "ok" ? "bg-emerald-50 border-emerald-200" :
                  med.status === "faltando" ? "bg-red-50 border-red-200" :
                  med.status === "vencido" ? "bg-red-50 border-red-200" :
                  med.status === "vencendo" ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"
                )}>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{med.nome}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Requerido: {med.requerido} | Presente: {med.presente}
                      {med.validade && ` | Validade: ${med.validade}`}
                    </p>
                  </div>
                  <div className="text-right">
                    {med.status === "ok" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {med.status === "faltando" && <AlertCircle className="w-5 h-5 text-red-600" />}
                    {med.status === "vencido" && <AlertCircle className="w-5 h-5 text-red-600" />}
                    {med.status === "vencendo" && <Clock className="w-5 h-5 text-amber-600" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button
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

// Add/Edit sector modal
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
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
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
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#0D47A1] text-white rounded-lg hover:bg-[#0B3D91] font-semibold text-sm transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GestorQualidadeCarrinho() {
  const [setores, setSetores] = useState(MOCK_SETORES);
  const [auditorias] = useState(MOCK_AUDITORIAS);
  const [showSetorModal, setShowSetorModal] = useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = useState(null);

  const handleAddSetor = (novoSetor) => {
    setSetores([...setores, { id: setores.length + 1, nome: novoSetor }]);
    setShowSetorModal(false);
  };

  const handleDeleteSetor = (id) => {
    setSetores(setores.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">Auditoria de Carrinhos de Emergência</h1>
        <p className="text-sm text-gray-500 mt-1">Visão estratégica de conformidade e alertas de medicações</p>
      </div>

      {/* Section A: Manage Cart Locations */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Gerenciar Locais dos Carrinhos
          </h2>
          <button
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
                onClick={() => handleDeleteSetor(setor.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section B: Audit Dashboard */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-lg">Tabela de Auditoria</h2>
          <p className="text-xs text-gray-400 mt-0.5">Conformidade mensal e alertas de medicações</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Setor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Última Verificação</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Alertas Qtd</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Alertas Validade</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {auditorias.map((auditoria) => (
                <tr key={auditoria.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800">{auditoria.setor}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {auditoria.ultimaVerificacao}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge diasDesdeVerificacao={auditoria.diasDesdeVerificacao} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {auditoria.alertasQtd.ok ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                        ✅ Qtd Correta
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-700">
                        ⚠️ Faltam {auditoria.alertasQtd.faltando} itens
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {auditoria.alertasValidade.ok ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                        ✅ Validades OK
                      </span>
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
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedAuditoria(auditoria)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showSetorModal && (
        <SetorModal onAdd={handleAddSetor} onClose={() => setShowSetorModal(false)} />
      )}
      {selectedAuditoria && (
        <DetalhesModal auditoria={selectedAuditoria} onClose={() => setSelectedAuditoria(null)} />
      )}
    </div>
  );
}