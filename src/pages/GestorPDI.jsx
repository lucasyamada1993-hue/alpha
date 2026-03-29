import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AvaliacaoTecnico from "@/components/gestor/pdi-tecnico/AvaliacaoTecnico";
import AvaliacaoEnfermeiro from "@/components/gestor/pdi-enfermeiro/AvaliacaoEnfermeiro";

/**
 * Persistência (sheetsClient): Técnico de Enfermagem → entidade PDITecnicoEnfermagem; Enfermeiro(a) → PDIEnfermeiro.
 * Planilhas distintas por categoria. Novas categorias = novas entidades no cliente + ramo por cargo em Avaliar.
 */

function kpisParaLista(rows) {
  const n = rows.length;
  let concluidos = 0;
  let pendentes = 0;
  for (const f of rows) {
    for (const key of ["pdi30", "pdi60", "pdi90"]) {
      if (f[key].status === "concluido") concluidos++;
      if (f[key].status === "pendente") pendentes++;
    }
  }
  const alertas = rows.filter((f) =>
    [f.pdi30, f.pdi60, f.pdi90].some((p) => p.status === "pendente")
  ).length;
  const denom = n * 3;
  const fmt = (num) => (n === 0 ? "0" : `${num}/${denom}`);
  return [
    { label: "PDIs Concluídos", value: fmt(concluidos), color: "bg-emerald-50 text-emerald-600 border-l-emerald-500" },
    { label: "PDIs Pendentes", value: fmt(pendentes), color: "bg-amber-50 text-amber-600 border-l-amber-500" },
    { label: "Funcionários Ativos", value: String(n), color: "bg-blue-50 text-blue-600 border-l-blue-500" },
    { label: "Alertas de Vencimento", value: String(alertas), color: "bg-red-50 text-red-600 border-l-red-500" },
  ];
}

// Nomes alinhados às listas TECNICOS / ENFERMEIROS em AvaliacaoTecnico / AvaliacaoEnfermeiro (mock). Fonte futura: cadastro único.
const FUNCIONARIOS_PDI = [
  {
    id: 1,
    nome: "Carlos Lima",
    cargo: "Técnico de Enfermagem",
    dataAdmissao: "10/02/2026",
    pdi30: { status: "concluido", data: "12/03/2026" },
    pdi60: { status: "pendente", data: null },
    pdi90: { status: "aguardando", data: null },
  },
  {
    id: 2,
    nome: "Ana Souza",
    cargo: "Enfermeiro(a)",
    dataAdmissao: "01/03/2026",
    pdi30: { status: "pendente", data: null },
    pdi60: { status: "aguardando", data: null },
    pdi90: { status: "aguardando", data: null },
  },
  {
    id: 3,
    nome: "Fernanda Melo",
    cargo: "Técnico de Enfermagem",
    dataAdmissao: "15/03/2026",
    pdi30: { status: "pendente", data: null },
    pdi60: { status: "aguardando", data: null },
    pdi90: { status: "aguardando", data: null },
  },
];

function BadgePDI({ status }) {
  const map = {
    concluido: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pendente: "bg-amber-50 text-amber-700 border-amber-200 animate-pulse",
    aguardando: "bg-gray-100 text-gray-600 border-gray-300",
  };
  const label = {
    concluido: "✓ Concluído",
    pendente: "⏳ Pendente",
    aguardando: "⏱ Aguardando",
  };
  return (
    <span className={cn("inline-block px-2.5 py-1 rounded-full text-xs font-semibold border", map[status])}>
      {label[status]}
    </span>
  );
}

const CARGO_TECNICO = "Técnico de Enfermagem";
const CARGO_ENFERMEIRO = "Enfermeiro(a)";

export default function GestorPDI() {
  const kpis = useMemo(() => kpisParaLista(FUNCIONARIOS_PDI), []);

  const [avaliacaoModal, setAvaliacaoModal] = useState(null);

  const abrirAvaliacaoCompleta = (funcionario) => {
    if (funcionario.cargo !== CARGO_TECNICO && funcionario.cargo !== CARGO_ENFERMEIRO) {
      toast.error("Cargo sem formulário PDI configurado. Use o cadastro para definir Técnico ou Enfermeiro.");
      return;
    }
    setAvaliacaoModal({ funcionario });
  };

  const fecharAvaliacao = () => setAvaliacaoModal(null);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">PDI — Plano de Desenvolvimento Individual</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhamento do período de experiência (30/60/90 dias)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className={cn("bg-white rounded-xl border border-gray-200 border-l-4 p-4 shadow-sm", k.color)}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm">Acompanhamento de PDIs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Funcionário</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cargo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admissão</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">PDI 30D</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">PDI 60D</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">PDI 90D</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ação</th>
              </tr>
            </thead>
            <tbody>
              {FUNCIONARIOS_PDI.map((func) => (
                <tr key={func.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-800">{func.nome}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{func.cargo}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{func.dataAdmissao}</td>
                  <td className="px-4 py-3 text-center">
                    <BadgePDI status={func.pdi30.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <BadgePDI status={func.pdi60.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <BadgePDI status={func.pdi90.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => abrirAvaliacaoCompleta(func)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Avaliar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {avaliacaoModal && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black/50">
          <div className="flex min-h-0 flex-1 flex-col bg-white md:mx-auto md:my-4 md:max-h-[calc(100vh-2rem)] md:max-w-4xl md:rounded-xl md:shadow-2xl w-full overflow-hidden">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Avaliação PDI completa</h2>
                <p className="text-xs text-gray-500">
                  {avaliacaoModal.funcionario.nome} · {avaliacaoModal.funcionario.cargo}
                </p>
              </div>
              <button
                type="button"
                onClick={fecharAvaliacao}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Fechar"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {avaliacaoModal.funcionario.cargo === CARGO_TECNICO && (
                <AvaliacaoTecnico
                  key={avaliacaoModal.funcionario.id}
                  colaboradorInicial={avaliacaoModal.funcionario.nome}
                  hideHeaderStats
                  modoEmbutido
                />
              )}
              {avaliacaoModal.funcionario.cargo === CARGO_ENFERMEIRO && (
                <AvaliacaoEnfermeiro
                  key={avaliacaoModal.funcionario.id}
                  colaboradorInicial={avaliacaoModal.funcionario.nome}
                  hideHeaderStats
                  modoEmbutido
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
