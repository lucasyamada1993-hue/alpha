import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PDCA_STAGES = [
  { id: "plan", label: "PLAN — Planejar", icon: "📋", color: "blue" },
  { id: "do", label: "DO — Fazer", icon: "✅", color: "emerald" },
  { id: "check", label: "CHECK — Checar", icon: "📊", color: "amber" },
  { id: "act", label: "ACT — Agir", icon: "🎯", color: "purple" },
];

const STAGE_COLORS = {
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  amber: "bg-amber-50 border-amber-200 text-amber-700",
  purple: "bg-purple-50 border-purple-200 text-purple-700",
};

export default function A3PDCAForm({ origin, onSave, onCancel }) {
  const [activeStage, setActiveStage] = useState("plan");
  const [formData, setFormData] = useState({
    titulo: "",
    dono: "",
    prioridade: "Alta",
    tipo: origin?.incident ? "Não Conformidade" : "Oportunidade de Melhoria",
    origem: origin?.incident ? `${origin.incident.id}: ${origin.incident.title}` : "Proativo",

    // Ciclo PDCA
    ciclo_pdca: 1,

    // PLAN
    plan_definicao_problema: "",
    plan_analise_causa_raiz: "",
    plan_meta: "",

    // DO
    do_acoes: [{ oQue: "", quem: "", quando: "", status: "Pendente" }],

    // CHECK
    check_indicador_medicao: "",
    check_data_verificacao: "",
    check_resultado: "Atingiu a meta",

    // ACT
    act_padronizacao: "",
    act_proximos_passos: "",
    act_status_final: "Em Andamento",
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAcaoChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      do_acoes: prev.do_acoes.map((acao, i) =>
        i === index ? { ...acao, [field]: value } : acao
      )
    }));
  };

  const addAcao = () => {
    setFormData(prev => ({
      ...prev,
      do_acoes: [...prev.do_acoes, { oQue: "", quem: "", quando: "", status: "Pendente" }]
    }));
  };

  const removeAcao = (index) => {
    setFormData(prev => ({
      ...prev,
      do_acoes: prev.do_acoes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.dono) {
      alert("Preencha Título e Dono do A3");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-lg">Novo A3 — Plano de Ação (PDCA)</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
            <p className="text-xs text-gray-500 font-semibold uppercase">Informações Básicas</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Título do A3 *</label>
                <input
                  type="text"
                  placeholder="Ex: Reduzir atraso na emissão de laudos"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Responsável (Dono) *</label>
                <input
                  type="text"
                  placeholder="Nome do responsável"
                  value={formData.dono}
                  onChange={(e) => handleInputChange("dono", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ciclo PDCA</label>
                <select
                  value={formData.ciclo_pdca}
                  onChange={(e) => handleInputChange("ciclo_pdca", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
                >
                  <option value={1}>Ciclo 1</option>
                  <option value={2}>Ciclo 2</option>
                  <option value={3}>Ciclo 3</option>
                  <option value={4}>Ciclo 4</option>
                  <option value={5}>Ciclo 5</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Prioridade</label>
                <select
                  value={formData.prioridade}
                  onChange={(e) => handleInputChange("prioridade", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
                >
                  <option>Alta</option>
                  <option>Média</option>
                  <option>Baixa</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo</label>
                <input type="text" disabled value={formData.tipo} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Origem</label>
                <input type="text" disabled value={formData.origem} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-600" />
              </div>
            </div>
          </div>

          {/* PDCA Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-2 flex-wrap">
              {PDCA_STAGES.map(stage => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 font-semibold text-sm border-b-2 transition-all",
                    activeStage === stage.id
                      ? `border-${stage.color}-500 ${STAGE_COLORS[stage.color]}`
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  )}
                >
                  <span>{stage.icon}</span>
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* STAGE CONTENT */}
          <div className="min-h-96">
            {/* PLAN */}
            {activeStage === "plan" && (
              <div className={cn("p-4 rounded-lg border-2", STAGE_COLORS["blue"])}>
                <h3 className="font-semibold mb-4">PLAN — Planejar</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Definição do Problema *</label>
                    <textarea
                      placeholder="Descreva o problema de forma clara e objetiva..."
                      value={formData.plan_definicao_problema}
                      onChange={(e) => handleInputChange("plan_definicao_problema", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Análise de Causa Raiz / 5 Porquês *</label>
                    <textarea
                      placeholder="Analise as causas raiz do problema..."
                      value={formData.plan_analise_causa_raiz}
                      onChange={(e) => handleInputChange("plan_analise_causa_raiz", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Meta a ser alcançada *</label>
                    <input
                      type="text"
                      placeholder="Ex: Reduzir tempo de laudo para máximo 2 horas"
                      value={formData.plan_meta}
                      onChange={(e) => handleInputChange("plan_meta", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DO */}
            {activeStage === "do" && (
              <div className={cn("p-4 rounded-lg border-2", STAGE_COLORS["emerald"])}>
                <h3 className="font-semibold mb-4">DO — Fazer (Plano de Ação 5W2H)</h3>
                <div className="space-y-3">
                  {formData.do_acoes.map((acao, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="O que será feito?"
                          value={acao.oQue}
                          onChange={(e) => handleAcaoChange(index, "oQue", e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs outline-none focus:border-emerald-400"
                        />
                        <input
                          type="text"
                          placeholder="Quem fará?"
                          value={acao.quem}
                          onChange={(e) => handleAcaoChange(index, "quem", e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                          type="date"
                          placeholder="Até quando?"
                          value={acao.quando}
                          onChange={(e) => handleAcaoChange(index, "quando", e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs outline-none focus:border-emerald-400"
                        />
                        <select
                          value={acao.status}
                          onChange={(e) => handleAcaoChange(index, "status", e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs outline-none focus:border-emerald-400"
                        >
                          <option>Pendente</option>
                          <option>Em andamento</option>
                          <option>Concluída</option>
                        </select>
                      </div>
                      {formData.do_acoes.length > 1 && (
                        <button
                          onClick={() => removeAcao(index)}
                          className="text-red-600 text-xs hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remover
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addAcao}
                    className="w-full px-3 py-2 border border-dashed border-emerald-400 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Adicionar Ação
                  </button>
                </div>
              </div>
            )}

            {/* CHECK */}
            {activeStage === "check" && (
              <div className={cn("p-4 rounded-lg border-2", STAGE_COLORS["amber"])}>
                <h3 className="font-semibold mb-4">CHECK — Checar</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Indicador de Medição / Como vamos medir o sucesso?</label>
                    <input
                      type="text"
                      placeholder="Ex: % de redução de tempo de laudo"
                      value={formData.check_indicador_medicao}
                      onChange={(e) => handleInputChange("check_indicador_medicao", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Data da Verificação</label>
                    <input
                      type="date"
                      value={formData.check_data_verificacao}
                      onChange={(e) => handleInputChange("check_data_verificacao", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Resultado</label>
                    <select
                      value={formData.check_resultado}
                      onChange={(e) => handleInputChange("check_resultado", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-amber-400"
                    >
                      <option>Atingiu a meta</option>
                      <option>Não atingiu</option>
                      <option>Piorou</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ACT */}
            {activeStage === "act" && (
              <div className={cn("p-4 rounded-lg border-2", STAGE_COLORS["purple"])}>
                <h3 className="font-semibold mb-4">ACT — Agir</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Padronização (Quais POPs foram alterados?)</label>
                    <textarea
                      placeholder="Descreva as alterações nos processos..."
                      value={formData.act_padronizacao}
                      onChange={(e) => handleInputChange("act_padronizacao", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Próximos Passos (Girar novo ciclo?)</label>
                    <textarea
                      placeholder="Se o objetivo não foi atingido, descreva os próximos passos..."
                      value={formData.act_proximos_passos}
                      onChange={(e) => handleInputChange("act_proximos_passos", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Status Final do A3</label>
                    <select
                      value={formData.act_status_final}
                      onChange={(e) => handleInputChange("act_status_final", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-400"
                    >
                      <option>Em Andamento</option>
                      <option>Concluído</option>
                      <option>Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm transition-colors"
          >
            Criar A3
          </button>
        </div>
      </div>
    </div>
  );
}