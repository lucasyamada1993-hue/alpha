import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { db } from "@/api/sheetsClient";

const hoje = new Date().toLocaleDateString("pt-BR");
const RESPONSAVEIS = ["Coordenador de Qualidade", "Técnico Responsável", "Gerente de Operações", "Engenheiro Clínico"];
const PRIORIDADES = ["Alta", "Média", "Baixa"];

export default function PlanoA3({ itemInicial }) {
  const [item, setItem] = useState(itemInicial || null);
  const [loading, setLoading] = useState(false);
  const [plano, setPlano] = useState(null);
  const [responsavel, setResponsavel] = useState(RESPONSAVEIS[0]);
  const [prioridade, setPrioridade] = useState("Alta");
  const [prazo, setPrazo] = useState("");
  const [pop, setPop] = useState("");
  const [descricao, setDescricao] = useState("");
  const [avaliacao, setAvaliacao] = useState("NC");

  const itemAtual = item || { pop, descricao, avaliacao };

  const gerarPlano = async () => {
    if (!itemAtual.pop && !pop) return;
    setLoading(true);
    const resultado = await db.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em qualidade hospitalar (ONA e ISO 9001).
      
Gere um Plano de Ação A3 estruturado para a seguinte não conformidade encontrada em auditoria:

POP: ${itemAtual.pop}
Processo: ${itemAtual.descricao}
Avaliação: ${itemAtual.avaliacao === "NC" ? "Não Conforme" : "Oportunidade de Melhoria"}
Responsável: ${responsavel}
Prioridade: ${prioridade}
Data da auditoria: ${hoje}

O A3 deve conter:
1. Situação Atual: Descrição objetiva do problema
2. Causa Raiz: Análise das possíveis causas (use 5 Porquês simplificado)
3. Ações Corretivas: Lista de 3 a 5 ações específicas e mensuráveis
4. Indicadores de Acompanhamento: Como medir o sucesso das ações
5. Prazo de Resolução: Estimativa realista

Responda em JSON conforme o schema abaixo.`,
      response_json_schema: {
        type: "object",
        properties: {
          situacao_atual: { type: "string" },
          causa_raiz: { type: "string" },
          acoes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                acao: { type: "string" },
                responsavel: { type: "string" },
                prazo: { type: "string" },
              },
            },
          },
          indicadores: { type: "string" },
          prazo_resolucao: { type: "string" },
        },
      },
    });
    setPlano(resultado);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl bg-[#0D47A1] flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Plano de Ação A3</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {item ? "Vindo da auditoria — preencha e gere o plano com IA." : "Insira os dados da não conformidade manualmente ou venha da auditoria."}
          </p>
        </div>
      </div>

      {/* Formulário de entrada (quando não há plano gerado) */}
      {!plano && (
        <div className="space-y-4">
          {/* Dados do item */}
          {item ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Item de Auditoria</p>
              <p className="text-sm font-semibold text-blue-800">{item.pop}</p>
              <p className="text-xs text-blue-600 mt-0.5">{item.descricao}</p>
              <button onClick={() => setItem(null)} className="text-xs text-blue-400 hover:underline mt-1">
                Limpar e inserir manualmente
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">POP / Processo</label>
                <input
                  type="text"
                  value={pop}
                  onChange={(e) => setPop(e.target.value)}
                  placeholder="Ex: POP-RX-003"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tipo</label>
                <select
                  value={avaliacao}
                  onChange={(e) => setAvaliacao(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                >
                  <option value="NC">Não Conforme</option>
                  <option value="OM">Oportunidade de Melhoria</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descrição</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o problema identificado..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>
            </div>
          )}

          {/* Configurações */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Responsável</label>
              <select value={responsavel} onChange={(e) => setResponsavel(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all">
                {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prioridade</label>
              <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all">
                {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prazo Alvo</label>
              <input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={gerarPlano}
              disabled={loading || (!item && !pop)}
              className="flex items-center gap-2 bg-[#0D47A1] hover:bg-[#0B3D91] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm shadow-blue-200 disabled:opacity-40"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Gerando...</> : "Gerar Plano A3 com IA"}
            </button>
          </div>
        </div>
      )}

      {/* Plano gerado */}
      {plano && (
        <div className="space-y-4">
          <Section titulo="Situação Atual" cor="border-blue-400 text-blue-700">
            <p className="text-sm text-gray-700 leading-relaxed">{plano.situacao_atual}</p>
          </Section>
          <Section titulo="Análise de Causa Raiz (5 Porquês)" cor="border-amber-400 text-amber-700">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{plano.causa_raiz}</p>
          </Section>
          <Section titulo="Ações Corretivas" cor="border-blue-400 text-blue-700">
            <div className="space-y-2">
              {plano.acoes?.map((a, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0D47A1] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">{a.acao}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Responsável: {a.responsavel} · Prazo: {a.prazo}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
          <Section titulo="Indicadores de Acompanhamento" cor="border-emerald-400 text-emerald-700">
            <p className="text-sm text-gray-700 leading-relaxed">{plano.indicadores}</p>
          </Section>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prazo de Resolução</span>
            <span className="text-sm font-bold text-[#0D47A1]">{plano.prazo_resolucao}</span>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => setPlano(null)} className="text-sm text-[#0D47A1] hover:underline">
              Gerar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ titulo, cor, children }) {
  const [borderCor, textCor] = cor.split(" ");
  return (
    <div className={`border-l-4 pl-4 ${borderCor}`}>
      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${textCor}`}>{titulo}</p>
      {children}
    </div>
  );
}