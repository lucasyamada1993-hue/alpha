import { useState, useRef } from "react";
import { FileDown, Loader2, AlertCircle } from "lucide-react";
import { db } from "@/api/sheetsClient";

export default function RelatorioExecutivo({ problema, porques, causaRaiz, acoes, ishikawa }) {
  const [loading, setLoading] = useState(false);
  const [relatorio, setRelatorio] = useState(null);
  const printRef = useRef(null);

  const todasCausas = Object.values(ishikawa).flat();

  const gerarRelatorio = async () => {
    if (!problema) return alert("Defina o problema antes de gerar o relatório.");
    setLoading(true);
    const result = await db.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em qualidade hospitalar (ONA, ISO 9001). Gere um relatório executivo conciso e profissional para a diretoria com base nos dados abaixo.
      
Problema: ${problema}
Análise 5 Porquês: ${porques.filter(Boolean).join(" → ")}
Causa Raiz: ${causaRaiz}
Causas Ishikawa: ${todasCausas.join(", ")}
Ações Planejadas: ${acoes.filter(a => a.o_que).map(a => `${a.o_que} (Resp: ${a.quem}, Prazo: ${a.quando}`).join("; ")}

Retorne um JSON com: titulo (string), data (string hoje), resumo_executivo (string 2-3 frases), problema_descrito (string), causa_raiz_identificada (string), analise_resumida (string), acoes_principais (array de {descricao, responsavel, prazo}), indicadores_sucesso (array de strings), assinatura (string genérica).`,
      response_json_schema: {
        type: "object",
        properties: {
          titulo: { type: "string" },
          data: { type: "string" },
          resumo_executivo: { type: "string" },
          problema_descrito: { type: "string" },
          causa_raiz_identificada: { type: "string" },
          analise_resumida: { type: "string" },
          acoes_principais: {
            type: "array",
            items: { type: "object", properties: { descricao: { type: "string" }, responsavel: { type: "string" }, prazo: { type: "string" } } },
          },
          indicadores_sucesso: { type: "array", items: { type: "string" } },
          assinatura: { type: "string" },
        },
      },
    });
    setRelatorio(result);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!relatorio && !loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileDown className="w-7 h-7 text-[#0D47A1]" />
        </div>
        <h3 className="font-bold text-gray-800 mb-2">Relatório Executivo para Diretoria</h3>
        <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
          Preencha o problema, os 5 Porquês e o plano de ação, depois gere o relatório com IA.
        </p>
        {!problema && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-xs text-amber-700 font-medium max-w-xs mx-auto mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Defina o problema antes de continuar.
          </div>
        )}
        <button
          onClick={gerarRelatorio}
          disabled={!problema}
          className="bg-[#0D47A1] hover:bg-[#0B3D91] disabled:opacity-40 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-colors shadow-md shadow-blue-200"
        >
          Gerar Relatório com IA
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
        <Loader2 className="w-10 h-10 text-[#0D47A1] animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-medium">Gerando relatório executivo com IA...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400">Relatório gerado por IA · Revise antes de compartilhar</p>
        <div className="flex gap-2">
          <button
            onClick={() => setRelatorio(null)}
            className="text-xs text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Regenerar
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#0D47A1] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-[#0B3D91] transition-colors shadow-md shadow-blue-200"
          >
            <FileDown className="w-3.5 h-3.5" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Documento */}
      <div ref={printRef} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden print:shadow-none print:border-none">
        {/* Cabeçalho do relatório */}
        <div className="bg-[#0D47A1] px-8 py-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Alphasonic · Gestão de Qualidade</p>
              <h1 className="text-xl font-bold">{relatorio.titulo}</h1>
            </div>
            <div className="text-right text-xs text-blue-200">
              <p>Data: {relatorio.data}</p>
              <p className="mt-1">Confidencial — Uso Interno</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Resumo executivo */}
          <div className="bg-blue-50 border-l-4 border-[#0D47A1] rounded-r-xl px-5 py-4">
            <p className="text-xs font-bold text-[#0D47A1] uppercase tracking-widest mb-1.5">Resumo Executivo</p>
            <p className="text-sm text-gray-700 leading-relaxed">{relatorio.resumo_executivo}</p>
          </div>

          {/* Problema & Causa Raiz */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section label="Problema Identificado" color="border-red-400">
              <p className="text-sm text-gray-700">{relatorio.problema_descrito}</p>
            </Section>
            <Section label="Causa Raiz" color="border-amber-400">
              <p className="text-sm text-gray-700">{relatorio.causa_raiz_identificada}</p>
            </Section>
          </div>

          {/* Análise */}
          <Section label="Análise do Processo" color="border-blue-400">
            <p className="text-sm text-gray-700 leading-relaxed">{relatorio.analise_resumida}</p>
          </Section>

          {/* Ações */}
          <Section label="Plano de Ação" color="border-green-400">
            <table className="w-full text-xs mt-2">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase tracking-wider">
                  <th className="px-3 py-2 text-left">Ação</th>
                  <th className="px-3 py-2 text-left">Responsável</th>
                  <th className="px-3 py-2 text-left">Prazo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {relatorio.acoes_principais.map((a, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-gray-700">{a.descricao}</td>
                    <td className="px-3 py-2 text-gray-600">{a.responsavel}</td>
                    <td className="px-3 py-2 text-gray-600">{a.prazo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* Indicadores */}
          <Section label="Indicadores de Sucesso" color="border-purple-400">
            <ul className="space-y-1.5 mt-1">
              {relatorio.indicadores_sucesso.map((ind, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  {ind}
                </li>
              ))}
            </ul>
          </Section>

          {/* Assinatura */}
          <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
            {relatorio.assinatura} · Gerado em {new Date().toLocaleDateString("pt-BR")} · Sistema de Gestão Alphasonic
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ label, color, children }) {
  return (
    <div className={`border-l-4 ${color} pl-4 py-1`}>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</p>
      {children}
    </div>
  );
}