import { useState } from "react";
import { cn } from "@/lib/utils";

const GERENTES = [
  { id: 1, nome: "Carlos Silva", funcao: "Gerente Enfermagem", avaliacao: "Pendente" },
  { id: 2, nome: "Ana Paula", funcao: "Gerente Administrativo", avaliacao: "Concluído" },
  { id: 3, nome: "Roberto Ferreira", funcao: "Gerente de Treinamentos/RH", avaliacao: "Pendente" },
  { id: 4, nome: "Fernanda Souza", funcao: "Gerente Equipamentos", avaliacao: "Em Andamento" },
  { id: 5, nome: "Mariana Costa", funcao: "Gerente Qualidade", avaliacao: "Concluído" },
];

const COMPETENCIAS_GERENTES = [
  { nome: "Liderança e Visão Estratégica", campo: "lideranca" },
  { nome: "Gestão de Qualidade e Conformidade", campo: "gestaoQualidade" },
  { nome: "Comunicação e Relacionamento", campo: "comunicacao" },
  { nome: "Planejamento e Organização", campo: "planejamento" },
  { nome: "Tomada de Decisão", campo: "decisao" },
];

function BadgeAvaliacao({ status }) {
  const colors = {
    Pendente: "bg-amber-50 text-amber-700 border-amber-200",
    "Em Andamento": "bg-blue-50 text-blue-700 border-blue-200",
    Concluído: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full border", colors[status])}>
      {status}
    </span>
  );
}

function EstatisticasGerentes() {
  const dados = [
    { nome: "Carlos Silva", media: 82 },
    { nome: "Ana Paula", media: 90 },
    { nome: "Roberto Ferreira", media: 78 },
    { nome: "Fernanda Souza", media: 85 },
    { nome: "Mariana Costa", media: 92 },
  ];

  const statusColor = (valor) => {
    if (valor >= 85) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (valor >= 75) return "bg-blue-50 text-blue-700 border-blue-200";
    if (valor >= 65) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const statusLabel = (valor) => {
    if (valor >= 85) return "Excelente";
    if (valor >= 75) return "Bom";
    if (valor >= 65) return "Regular";
    return "Baixo";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Estatísticas de PDI — Gerentes</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Gerente</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700">Média (%)</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item) => (
              <tr key={item.nome} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-800">{item.nome}</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-bold text-blue-600 bg-blue-50">
                    {item.media}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold border", statusColor(item.media))}>
                    {statusLabel(item.media)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function QualidadePDI() {
  const [selecionado, setSelecionado] = useState(null);
  const [activeTab, setActiveTab] = useState("avaliacoes");
  const [avaliacao, setAvaliacao] = useState({
    lideranca: 0,
    gestaoQualidade: 0,
    comunicacao: 0,
    planejamento: 0,
    decisao: 0,
    observacoes: "",
  });

  const handleIniciarAvaliacao = (gerente) => {
    setSelecionado(gerente);
    setAvaliacao({
      lideranca: 0,
      gestaoQualidade: 0,
      comunicacao: 0,
      planejamento: 0,
      decisao: 0,
      observacoes: "",
    });
  };

  const handleSalvar = () => {
    alert(`Avaliação de ${selecionado.nome} salva com sucesso!`);
    setSelecionado(null);
  };

  return (
    <div className="space-y-6">
      {/* Abas */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "avaliacoes", label: "Avaliar Gerentes", icon: "👤" },
          { id: "estatisticas", label: "Estatísticas", icon: "📊" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all border",
              activeTab === tab.id
                ? "bg-[#0D47A1] text-white border-[#0D47A1] shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            )}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: AVALIACÕES */}
      {activeTab === "avaliacoes" && (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">Avaliação de Gerentes</h2>
          <p className="text-xs text-gray-500 mt-1">Avalie os gerentes em competências de liderança e gestão</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Gerente</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Função</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 text-xs">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 text-xs">Ação</th>
              </tr>
            </thead>
            <tbody>
              {GERENTES.map((gerente) => (
                <tr key={gerente.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800">{gerente.nome}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{gerente.funcao}</td>
                  <td className="px-4 py-3 text-center">
                    <BadgeAvaliacao status={gerente.avaliacao} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleIniciarAvaliacao(gerente)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {gerente.avaliacao === "Pendente" ? "Avaliar" : "Editar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* TAB: ESTATÍSTICAS */}
      {activeTab === "estatisticas" && (
        <EstatisticasGerentes />
      )}

      {/* Modal de Avaliação */}
      {selecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Avaliar: {selecionado.nome}</h3>
              <button
                onClick={() => setSelecionado(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">FUNÇÃO</p>
                <p className="text-sm text-gray-700">{selecionado.funcao}</p>
              </div>

              {/* Competências */}
              <div className="space-y-4">
                <p className="text-xs text-gray-500 font-semibold">COMPETÊNCIAS (Escala 1-4)</p>
                {COMPETENCIAS_GERENTES.map(({ nome, campo }) => (
                  <div key={campo}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700">{nome}</label>
                      <span className="text-sm font-bold text-blue-600">{avaliacao[campo]}/4</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((nota) => (
                        <button
                          key={nota}
                          onClick={() => setAvaliacao({ ...avaliacao, [campo]: nota })}
                          className={cn(
                            "flex-1 py-2 rounded-lg font-semibold text-sm transition-all",
                            avaliacao[campo] === nota
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          {nota === 1 && "Não Atende"}
                          {nota === 2 && "Em Desenvolvimento"}
                          {nota === 3 && "Atende"}
                          {nota === 4 && "Supera"}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Observações</label>
                <textarea
                  value={avaliacao.observacoes}
                  onChange={(e) => setAvaliacao({ ...avaliacao, observacoes: e.target.value })}
                  placeholder="Adicione observações sobre o desempenho..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 resize-none"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelecionado(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvar}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm transition-colors"
                >
                  Salvar Avaliação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}