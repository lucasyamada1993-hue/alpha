import { useState } from "react";
import { cn } from "@/lib/utils";

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

// Dynamic form content based on cargo
function PDIFormContent({ etapa, cargo }) {
  const isTecnico = cargo === "Técnico de Enfermagem";
  const isEnfermeiro = cargo === "Enfermeiro(a)";

  if (etapa === "30") {
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Avaliação de 30 Dias</h4>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-gray-700">Período de integração inicial e domínio de competências essenciais.</p>
        </div>
        {isTecnico && (
          <div>
            <p className="font-semibold text-gray-700 mb-2">Competências Técnicas Essenciais</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="comp30_tecnico" className="w-4 h-4" />
                <span className="text-sm text-gray-600">✅ Domina punção venosa e acesso periférico</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="comp30_tecnico" className="w-4 h-4" />
                <span className="text-sm text-gray-600">✅ Segue protocolos de biosseguranța</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="comp30_tecnico" className="w-4 h-4" />
                <span className="text-sm text-gray-600">❌ Requer acompanhamento</span>
              </label>
            </div>
          </div>
        )}
        {isEnfermeiro && (
          <div>
            <p className="font-semibold text-gray-700 mb-2">Competências Clínicas Avançadas</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="comp30_enf" className="w-4 h-4" />
                <span className="text-sm text-gray-600">✅ Conhecimento de protocolos de qualidade</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="comp30_enf" className="w-4 h-4" />
                <span className="text-sm text-gray-600">✅ Liderança e comunicação efetiva</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="comp30_enf" className="w-4 h-4" />
                <span className="text-sm text-gray-600">❌ Requer desenvolvimento</span>
              </label>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (etapa === "60") {
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Avaliação de 60 Dias</h4>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <p className="font-semibold text-gray-800 mb-2">⚠️ Desenvolvimento de Competências</p>
          <p className="text-sm text-gray-700">Avaliação de progresso e identificação de pontos para melhoria.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700 mb-2">O colaborador apresentou melhora desde o 30º dia?</p>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="melhoria60" className="w-4 h-4" />
              <span className="text-sm text-gray-600">✅ Melhorou significativamente</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="melhoria60" className="w-4 h-4" />
              <span className="text-sm text-gray-600">❌ Requer atenção e PDI</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  if (etapa === "90") {
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Avaliação Final - 90 Dias</h4>
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-sm text-gray-700">Decisão final sobre continuidade do vínculo e permanência na equipe.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700 mb-2">Desempenho Geral do Colaborador</p>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="desemp90" className="w-4 h-4" />
              <span className="text-sm text-gray-600">✅ Aprovado - Mantém Vínculo</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="desemp90" className="w-4 h-4" />
              <span className="text-sm text-gray-600">❌ Reprovado - Encerramento</span>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default function GestorPDI() {
  const [selecionado, setSelecionado] = useState(null);
  const [etapa, setEtapa] = useState("30");

  const abrirPDI = (funcionario, periodo) => {
    setSelecionado({ ...funcionario, periodo });
    setEtapa(periodo);
  };

  const fecharPDI = () => {
    setSelecionado(null);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">PDI — Plano de Desenvolvimento Individual</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhamento do período de experiência (30/60/90 dias)</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "PDIs Concluídos", value: "1/3", color: "bg-emerald-50 text-emerald-600 border-l-emerald-500" },
          { label: "PDIs Pendentes", value: "2/3", color: "bg-amber-50 text-amber-600 border-l-amber-500" },
          { label: "Funcionários Ativos", value: "3", color: "bg-blue-50 text-blue-600 border-l-blue-500" },
          { label: "Alertas de Vencimento", value: "1", color: "bg-red-50 text-red-600 border-l-red-500" },
        ].map((k, i) => (
          <div key={i} className={cn("bg-white rounded-xl border border-gray-200 border-l-4 p-4 shadow-sm", k.color)}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabela de PDIs */}
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
                      onClick={() => abrirPDI(func, "30")}
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

      {/* Modal de Avaliação */}
      {selecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Cabeçalho */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-bold text-gray-800 text-lg">
                PDI {etapa}D — {selecionado.nome} ({selecionado.cargo})
              </h3>
              <button onClick={fecharPDI} className="p-1 hover:bg-gray-100 rounded-lg">
                <span className="text-gray-400 text-2xl">×</span>
              </button>
            </div>

            {/* Abas */}
            <div className="px-6 py-3 border-b border-gray-100 flex gap-2 bg-gray-50">
              {["30", "60", "90"].map((periodo) => (
                <button
                  key={periodo}
                  onClick={() => setEtapa(periodo)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-semibold text-sm transition-all",
                    etapa === periodo
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {periodo} Dias
                </button>
              ))}
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              <PDIFormContent etapa={etapa} cargo={selecionado.cargo} />

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Observações</label>
                <textarea
                  placeholder="Adicione observações..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 resize-none h-24"
                />
              </div>
            </div>

            {/* Rodapé */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50 sticky bottom-0">
              <button
                onClick={fecharPDI}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert("PDI salvo com sucesso!");
                  fecharPDI();
                }}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm"
              >
                Salvar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}