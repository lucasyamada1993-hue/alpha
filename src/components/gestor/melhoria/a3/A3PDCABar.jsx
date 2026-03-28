import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const FASES = [
  { id: "PLAN", label: "PLAN", sub: "Diagnóstico", num: 1 },
  { id: "DO", label: "DO", sub: "Plano de Ação", num: 2 },
  { id: "CHECK", label: "CHECK", sub: "Verificação", num: 3 },
  { id: "ACT", label: "ACT", sub: "Padronização", num: 4 },
];

const ORDER = ["PLAN", "DO", "CHECK", "ACT", "Concluído"];

export default function A3PDCABar({ statusAtual, onAvancar, podeAvancar, avancando }) {
  const currentIdx = ORDER.indexOf(statusAtual);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0 flex-1">
          {FASES.map((fase, idx) => {
            const isDone = currentIdx > idx;
            const isActive = currentIdx === idx;
            return (
              <div key={fase.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all",
                    isDone ? "bg-[#0D47A1] border-[#0D47A1] text-white" :
                    isActive ? "bg-white border-[#0D47A1] text-[#0D47A1]" :
                    "bg-gray-50 border-gray-200 text-gray-300"
                  )}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : fase.num}
                  </div>
                  <div className="text-center">
                    <p className={cn("text-xs font-bold tracking-wider", isActive ? "text-[#0D47A1]" : isDone ? "text-gray-600" : "text-gray-300")}>{fase.label}</p>
                    <p className={cn("text-[10px]", isActive ? "text-blue-400" : "text-gray-300")}>{fase.sub}</p>
                  </div>
                </div>
                {idx < FASES.length - 1 && (
                  <div className={cn("flex-1 h-0.5 mx-2 mt-[-18px]", idx < currentIdx ? "bg-[#0D47A1]" : "bg-gray-100")} />
                )}
              </div>
            );
          })}
        </div>

        {statusAtual !== "Concluído" && (
          <button
            onClick={onAvancar}
            disabled={!podeAvancar || avancando}
            title={!podeAvancar ? "Preencha todos os campos obrigatórios desta fase antes de avançar." : ""}
            className={cn(
              "ml-6 flex-shrink-0 flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all",
              podeAvancar
                ? "bg-[#0D47A1] hover:bg-[#0B3D91] text-white shadow-sm shadow-blue-200"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            )}
          >
            {avancando ? "Salvando..." : `Avançar para ${ORDER[currentIdx + 1] || "Concluído"} →`}
          </button>
        )}

        {statusAtual === "Concluído" && (
          <span className="ml-6 flex-shrink-0 flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4" /> A3 Concluído
          </span>
        )}
      </div>
    </div>
  );
}