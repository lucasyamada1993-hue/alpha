import { useState, useEffect } from "react";
import { Plus, FileText, ChevronRight, AlertTriangle, Clock, Circle, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/api/sheetsClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import A3CreateModal from "./A3CreateModal";

const PDCA_CONFIG = {
  PLAN: { label: "PLAN", color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500", step: 1 },
  DO: { label: "DO", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500", step: 2 },
  CHECK: { label: "CHECK", color: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-500", step: 3 },
  ACT: { label: "ACT", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", step: 4 },
  "Concluído": { label: "Concluído", color: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400", step: 5 },
};

const PRIORIDADE_COLOR = {
  Alta: "text-red-600 bg-red-50 border-red-200",
  Média: "text-amber-600 bg-amber-50 border-amber-200",
  Baixa: "text-emerald-600 bg-emerald-50 border-emerald-200",
};

const TIPO_ICON = {
  "Não Conformidade": AlertTriangle,
  "Oportunidade de Melhoria": Circle,
  "Evento Adverso": AlertTriangle,
  "Near Miss": Clock,
};

/**
 * Dono no A3 é texto livre (nome); o login do perfil costuma ser e-mail.
 * Igualdade ignorando maiúsculas, ou dono contém o login completo, ou (se e-mail) a parte local aparece no nome.
 */
function donoAcessivelParaGestor(a, loginRaw) {
  const dono = (a.dono || "").trim().toLowerCase();
  const login = (loginRaw || "").trim().toLowerCase();
  if (!login || !dono) return false;
  if (dono === login) return true;
  if (dono.includes(login)) return true;
  if (login.includes("@")) {
    const local = login.split("@")[0];
    if (local.length >= 3 && dono.includes(local)) return true;
  }
  return false;
}

export default function A3Lista({ onSelect, hideNovoButton = false, onNovoA3 }) {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [gestorAuth, setGestorAuth] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("gestorAutenticado");
    if (raw) setGestorAuth(JSON.parse(raw));
  }, []);

  const { data: relatorios = [], refetch } = useQuery({
    queryKey: ["a3relatorios"],
    queryFn: async () => {
      const auth = JSON.parse(localStorage.getItem("gestorAutenticado") || "{}");
      const todos = await db.entities.A3Relatorio.filter({ deleted: false }, "-created_date", 50);

      if (auth.funcoes?.includes("Gerente Enfermagem")) {
        return todos.filter((a) => donoAcessivelParaGestor(a, auth.login));
      }

      return todos;
    },
  });

  const filtrados = filtroStatus === "todos"
    ? relatorios
    : relatorios.filter((r) => r.status_pdca === filtroStatus);

  const handleExcluir = async (e, r) => {
    e.stopPropagation();
    if (!r?.id) return;
    if (!window.confirm(`Arquivar o A3 "${r.titulo || r.id}"? O registo deixa de aparecer na lista (soft delete).`)) return;
    setExcluindoId(r.id);
    try {
      await db.entities.A3Relatorio.update(r.id, {
        ...r,
        deleted: true,
        deleted_by: "Usuário",
        deleted_at: new Date().toISOString(),
        updated_by: "Usuário",
      });
      await qc.invalidateQueries({ queryKey: ["a3relatorios"] });
      refetch();
      toast.success("A3 arquivado.");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Erro ao arquivar o A3.");
    } finally {
      setExcluindoId(null);
    }
  };

  const estatisticas = {
    total: relatorios.length,
    plan: relatorios.filter((r) => r.status_pdca === "PLAN").length,
    do: relatorios.filter((r) => r.status_pdca === "DO").length,
    check: relatorios.filter((r) => r.status_pdca === "CHECK").length,
    act: relatorios.filter((r) => r.status_pdca === "ACT").length,
    concluidos: relatorios.filter((r) => r.status_pdca === "Concluído").length,
  };

  return (
    <div className="space-y-5">
      {/* KPIs do Funil PDCA */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "PLAN", value: estatisticas.plan, color: "border-l-blue-500 text-blue-700" },
          { label: "DO", value: estatisticas.do, color: "border-l-amber-500 text-amber-700" },
          { label: "CHECK", value: estatisticas.check, color: "border-l-purple-500 text-purple-700" },
          { label: "ACT", value: estatisticas.act, color: "border-l-emerald-500 text-emerald-700" },
          { label: "Concluídos", value: estatisticas.concluidos, color: "border-l-gray-400 text-gray-600" },
        ].map((k) => (
          <div key={k.label} className={cn("bg-white rounded-xl p-4 border border-gray-100 border-l-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow", k.color.split(" ")[0])}
            onClick={() => setFiltroStatus(k.label === "Concluídos" ? "Concluído" : k.label)}>
            <p className={cn("text-2xl font-extrabold", k.color.split(" ")[1])}>{k.value}</p>
            <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wider">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Header da lista */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800">Relatórios A3</h3>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{filtrados.length} encontrados</span>
          {filtroStatus !== "todos" && (
            <button onClick={() => setFiltroStatus("todos")} className="text-xs text-blue-600 hover:underline ml-1">limpar filtro</button>
          )}
        </div>
        {gestorAuth?.funcoes?.includes("Gerente Enfermagem") ? (
          <div className="text-xs text-gray-500 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            Visualização: Apenas seus A3s
          </div>
        ) : hideNovoButton ? null : (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-[#0D47A1] hover:bg-[#0B3D91] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-blue-200"
          >
            <Plus className="w-4 h-4" /> Novo A3
          </button>
        )}
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-400">Nenhum relatório A3 encontrado.</p>
          <p className="text-xs text-gray-300 mt-1">Clique em &quot;Novo A3&quot; para começar.</p>
          {onNovoA3 && (
            <button
              type="button"
              onClick={onNovoA3}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#0D47A1] text-white rounded-lg hover:bg-[#0B3D91] font-semibold text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Novo A3
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtrados.map((r) => {
            const pdca = PDCA_CONFIG[r.status_pdca] || PDCA_CONFIG.PLAN;
            const Icon = TIPO_ICON[r.tipo] || FileText;
            const atrasado = r.prazo_conclusao && new Date(r.prazo_conclusao) < new Date() && r.status_pdca !== "Concluído";
            return (
              <div
                key={r.id}
                onClick={() => onSelect(r)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
              >
                <div className="px-5 py-4 flex items-center gap-4">
                  {/* Ícone */}
                  <div className="w-9 h-9 rounded-xl bg-[#0D47A1]/8 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#0D47A1]" />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{r.titulo}</p>
                      {atrasado && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600 border border-red-200 flex-shrink-0">ATRASADO</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-gray-400">Dono: <span className="text-gray-600 font-medium">{r.dono}</span></span>
                      <span className="text-gray-200 text-xs">·</span>
                      <span className="text-xs text-gray-400">{r.tipo}</span>
                      {r.pop_referencia && (
                        <>
                          <span className="text-gray-200 text-xs">·</span>
                          <span className="text-xs font-mono text-blue-600">{r.pop_referencia}</span>
                        </>
                      )}
                      {r.prazo_conclusao && (
                        <>
                          <span className="text-gray-200 text-xs">·</span>
                          <span className={cn("text-xs", atrasado ? "text-red-500 font-semibold" : "text-gray-400")}>
                            Prazo: {new Date(r.prazo_conclusao).toLocaleDateString("pt-BR")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status + Prioridade + Excluir */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", PRIORIDADE_COLOR[r.prioridade])}>{r.prioridade}</span>
                    <span className={cn("text-xs font-bold px-3 py-1 rounded-full border tracking-wider", pdca.color)}>{pdca.label}</span>
                    <button
                      type="button"
                      title="Arquivar A3"
                      onClick={(e) => handleExcluir(e, r)}
                      disabled={excluindoId === r.id}
                      className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      {excluindoId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>

                {/* Progress bar PDCA */}
                <div className="px-5 pb-3">
                  <div className="flex gap-1">
                    {["PLAN", "DO", "CHECK", "ACT"].map((fase, idx) => (
                      <div key={fase} className={cn("h-1 flex-1 rounded-full transition-all",
                        pdca.step > idx + 1 ? "bg-[#0D47A1]" : pdca.step === idx + 1 ? "bg-[#0D47A1]/40" : "bg-gray-100"
                      )} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-0.5">
                    {["PLAN", "DO", "CHECK", "ACT"].map((f) => (
                      <span key={f} className="text-[9px] text-gray-300 font-bold">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <A3CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={(novo) => { refetch(); onSelect(novo); setShowCreate(false); }}
        />
      )}
    </div>
  );
}