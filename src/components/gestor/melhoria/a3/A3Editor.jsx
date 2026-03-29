import { useState, useCallback } from "react";
import { ArrowLeft, Save, Loader2, Trash2, FileDown } from "lucide-react";
import { db } from "@/api/sheetsClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import A3PDCABar from "./A3PDCABar";
import FasePlan from "./FasePlan";
import FaseDo from "./FaseDo";
import FaseCheck from "./FaseCheck";
import FaseAct from "./FaseAct";
import A3PdfTemplate from "./A3PdfTemplate";
import { exportA3ToPdf } from "./a3ExportPdf";
import { cn } from "@/lib/utils";

const ORDER = ["PLAN", "DO", "CHECK", "ACT", "Concluído"];

/** Evita indexOf -1 com valores da planilha (espaços, capitalização). */
function normalizeStatusPdca(raw) {
  const s = String(raw ?? "").trim();
  if (ORDER.includes(s)) return s;
  const found = ORDER.find((o) => o.toLowerCase() === s.toLowerCase());
  return found ?? "PLAN";
}

const PRIORIDADE_COLOR = {
  Alta: "bg-red-50 text-red-700 border-red-200",
  Média: "bg-amber-50 text-amber-700 border-amber-200",
  Baixa: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function validarFase(data, fase) {
  if (fase === "PLAN") {
    const temContexto = data.plan_contexto?.trim();
    const temCondicao = data.plan_condicao_atual?.trim();
    const temMeta = data.plan_meta?.trim();
    const temCausaRaiz = data.plan_causa_raiz?.trim();
    return !!(temContexto && temCondicao && temMeta && temCausaRaiz);
  }
  if (fase === "DO") {
    const acoes = data.do_acoes_5w2h || [];
    return acoes.length > 0 && acoes.every((a) => a.o_que?.trim() && a.quem?.trim() && a.quando?.trim());
  }
  if (fase === "CHECK") {
    return !!(data.check_resultados?.trim() && data.check_indicadores?.trim() && data.check_eficaz !== undefined && data.check_eficaz !== null);
  }
  if (fase === "ACT") {
    return !!(data.act_licoes_aprendidas?.trim() && data.act_padronizacao?.trim());
  }
  return false;
}

/** Mensagem para toast quando não cumpre validação da fase (alinhada a validarFase). */
function mensagemValidacaoFase(data, fase) {
  if (fase === "PLAN") {
    const faltas = [];
    if (!data.plan_contexto?.trim()) faltas.push("Contexto e histórico");
    if (!data.plan_condicao_atual?.trim()) faltas.push("Condição atual");
    if (!data.plan_meta?.trim()) faltas.push("Meta / condição alvo");
    if (!data.plan_causa_raiz?.trim()) faltas.push("Causa raiz consolidada");
    return faltas.length ? `PLAN: preencha ${faltas.join(", ")}.` : null;
  }
  if (fase === "DO") {
    const acoes = data.do_acoes_5w2h || [];
    if (acoes.length === 0) return "DO: adicione pelo menos uma ação no plano 5W2H.";
    const idx = acoes.findIndex((a) => !a.o_que?.trim() || !a.quem?.trim() || !a.quando?.trim());
    if (idx >= 0) return `DO: na ação ${idx + 1}, preencha O quê, Quem e Quando.`;
    return null;
  }
  if (fase === "CHECK") {
    const faltas = [];
    if (!data.check_resultados?.trim()) faltas.push("Resultados observados");
    if (!data.check_indicadores?.trim()) faltas.push("Indicadores acompanhados");
    if (data.check_eficaz === undefined || data.check_eficaz === null) faltas.push("Avaliação de eficácia (Sim/Não)");
    return faltas.length ? `CHECK: preencha ${faltas.join(", ")}.` : null;
  }
  if (fase === "ACT") {
    const faltas = [];
    if (!data.act_licoes_aprendidas?.trim()) faltas.push("Lições aprendidas");
    if (!data.act_padronizacao?.trim()) faltas.push("Padronização / alterações no processo");
    return faltas.length ? `ACT: preencha ${faltas.join(", ")}.` : null;
  }
  return "Não é possível avançar nesta fase.";
}

export default function A3Editor({ relatorio, onBack }) {
  const qc = useQueryClient();
  const [data, setData] = useState(relatorio);
  const [saving, setSaving] = useState(false);
  const [avancando, setAvancando] = useState(false);
  const [pdfExporting, setPdfExporting] = useState(false);

  const set = useCallback((campo, valor) => {
    setData((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  const salvar = async () => {
    setSaving(true);
    try {
      const updated = await db.entities.A3Relatorio.update(data.id, { ...data, updated_by: "Usuário" });
      setData(updated);
      qc.invalidateQueries({ queryKey: ["a3relatorios"] });
      toast.success("Relatório A3 guardado.");
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Erro ao guardar o A3.");
    } finally {
      setSaving(false);
    }
  };

  const avancarFase = async () => {
    const faseAtual = normalizeStatusPdca(data.status_pdca);
    if (!validarFase(data, faseAtual)) {
      const msg = mensagemValidacaoFase(data, faseAtual) || "Preencha os campos obrigatórios desta fase antes de avançar.";
      toast.error(msg);
      return;
    }
    const idx = ORDER.indexOf(faseAtual);
    const proxima = ORDER[idx + 1];
    if (!proxima) {
      toast.error("Não há próxima fase.");
      return;
    }

    setAvancando(true);
    try {
      const payload = { ...data, status_pdca: proxima, updated_by: "Usuário" };
      const updated = await db.entities.A3Relatorio.update(data.id, payload);
      setData(updated);
      qc.invalidateQueries({ queryKey: ["a3relatorios"] });
      toast.success(`Fase atual: ${proxima}.`);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Erro ao avançar a fase.");
    } finally {
      setAvancando(false);
    }
  };

  const excluir = async () => {
    if (!window.confirm("Deseja arquivar este A3? O registro não será apagado.")) return;
    await db.entities.A3Relatorio.update(data.id, { deleted: true, deleted_by: "Usuário", deleted_at: new Date().toISOString() });
    qc.invalidateQueries({ queryKey: ["a3relatorios"] });
    onBack();
  };

  const handleExportPdf = async () => {
    if (!data.id) {
      toast.error("Salve o relatório antes de exportar.");
      return;
    }
    setPdfExporting(true);
    try {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await exportA3ToPdf(`Plano_A3_${data.id}`);
      toast.success("PDF gerado com sucesso.");
    } catch (e) {
      console.error(e);
      toast.error(e?.message || "Falha ao gerar o PDF.");
    } finally {
      setPdfExporting(false);
    }
  };

  const fasAtual = normalizeStatusPdca(data.status_pdca);
  const podeAvancar = validarFase(data, fasAtual);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button onClick={onBack} className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-gray-800 text-base leading-snug">{data.titulo}</h2>
                <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border", PRIORIDADE_COLOR[data.prioridade])}>{data.prioridade}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{data.tipo}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Dono: <span className="font-medium text-gray-600">{data.dono}</span>
                {data.pop_referencia && <> · <span className="font-mono text-blue-600">{data.pop_referencia}</span></>}
                {data.prazo_conclusao && <> · Prazo: {new Date(data.prazo_conclusao).toLocaleDateString("pt-BR")}</>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={pdfExporting || !data.id}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              {pdfExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              {pdfExporting ? "A gerar PDF..." : "Exportar Relatório A3 (PDF)"}
            </button>
            <button onClick={excluir} className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={salvar} disabled={saving}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>

      {/* Barra PDCA */}
      <A3PDCABar
        statusAtual={fasAtual}
        onAvancar={avancarFase}
        podeAvancar={podeAvancar}
        avancando={avancando}
      />

      {/* Aviso de validação */}
      {!podeAvancar && fasAtual !== "Concluído" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
          <span className="font-semibold">Para avançar de fase:</span>
          {fasAtual === "PLAN" && " preencha Contexto, Condição Atual, Meta e Causa Raiz Consolidada."}
          {fasAtual === "DO" && " adicione ao menos uma ação com O Quê, Quem e Quando preenchidos."}
          {fasAtual === "CHECK" && " descreva os Resultados, Indicadores e selecione a Eficácia."}
          {fasAtual === "ACT" && " preencha Lições Aprendidas e o que foi Padronizado."}
        </div>
      )}

      {/* Conteúdo da Fase Ativa */}
      {fasAtual === "PLAN" && <FasePlan data={data} onChange={set} />}
      {fasAtual === "DO" && <FaseDo data={data} onChange={set} />}
      {fasAtual === "CHECK" && <FaseCheck data={data} onChange={set} />}
      {fasAtual === "ACT" && <FaseAct data={data} onChange={set} />}
      <A3PdfTemplate data={data} />

      {fasAtual === "Concluído" && (
        <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
            <span className="text-2xl">✓</span>
          </div>
          <h3 className="font-bold text-gray-800 text-lg">A3 Concluído com Sucesso</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">Este relatório passou por todas as fases do ciclo PDCA. Todas as etapas, responsáveis e evidências estão registradas para fins de auditoria ONA/ISO 9001.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-left">
            {[
              { label: "Problema", value: data.titulo },
              { label: "Dono", value: data.dono },
              { label: "Tipo", value: data.tipo },
              { label: "POP Vinculado", value: data.act_pop_vinculado || data.pop_referencia || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-700 leading-snug">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}