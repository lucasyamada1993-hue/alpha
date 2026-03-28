import { Plus, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const COLUNAS = [
  { key: "o_que", label: "O Quê?", placeholder: "Ação a executar", width: "w-40" },
  { key: "por_que", label: "Por Quê?", placeholder: "Justificativa", width: "w-36" },
  { key: "quem", label: "Quem?", placeholder: "Responsável", width: "w-32" },
  { key: "onde", label: "Onde?", placeholder: "Local / Setor", width: "w-28" },
  { key: "quando", label: "Quando?", placeholder: "Data alvo", width: "w-28", tipo: "date" },
  { key: "como", label: "Como?", placeholder: "Método / Recurso", width: "w-36" },
  { key: "quanto_custa", label: "Quanto Custa?", placeholder: "R$ 0,00", width: "w-28" },
  { key: "status", label: "Status", placeholder: "Status", width: "w-28", tipo: "select" },
];

const STATUS_ACAO = ["Pendente", "Em andamento", "Concluída"];

const STATUS_COLOR = {
  Pendente: "bg-gray-100 text-gray-500",
  "Em andamento": "bg-amber-100 text-amber-700",
  Concluída: "bg-emerald-100 text-emerald-700",
};

const novaAcao = () => ({ o_que: "", por_que: "", quem: "", onde: "", quando: "", como: "", quanto_custa: "", status: "Pendente" });

export default function FaseDo({ data, onChange }) {
  const acoes = data.do_acoes_5w2h || [novaAcao()];

  const set = (idx, campo, valor) => {
    const arr = [...acoes];
    arr[idx] = { ...arr[idx], [campo]: valor };
    onChange("do_acoes_5w2h", arr);
  };

  const add = () => onChange("do_acoes_5w2h", [...acoes, novaAcao()]);
  const remove = (idx) => onChange("do_acoes_5w2h", acoes.filter((_, i) => i !== idx));

  const hoje = new Date().toISOString().split("T")[0];
  const atrasadas = acoes.filter((a) => a.quando && a.quando < hoje && a.status !== "Concluída").length;

  return (
    <div className="space-y-5">
      {atrasadas > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">{atrasadas} ação(ões) com prazo vencido e ainda não concluída(s).</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 rounded-full bg-amber-400" />
            <div>
              <h3 className="font-bold text-gray-800">Plano de Ação 5W2H</h3>
              <p className="text-xs text-gray-400 mt-0.5">{acoes.length} ação(ões) definida(s)</p>
            </div>
          </div>
          <button onClick={add} className="flex items-center gap-1.5 bg-[#0D47A1] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#0B3D91] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Adicionar Ação
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase tracking-wider">
                <th className="px-3 py-3 text-left w-6 text-center">#</th>
                {COLUNAS.map((c) => (
                  <th key={c.key} className="px-3 py-3 text-left">{c.label}</th>
                ))}
                <th className="px-3 py-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {acoes.map((acao, idx) => {
                const atrasada = acao.quando && acao.quando < hoje && acao.status !== "Concluída";
                return (
                  <tr key={idx} className={cn("border-t border-gray-50", atrasada ? "bg-red-50/40" : "hover:bg-gray-50/50")}>
                    <td className="px-3 py-2.5 text-center text-gray-400 font-mono font-bold">{idx + 1}</td>
                    {COLUNAS.map((c) => (
                      <td key={c.key} className="px-3 py-2">
                        {c.tipo === "select" ? (
                          <select value={acao[c.key]} onChange={(e) => set(idx, c.key, e.target.value)}
                            className={cn("rounded-lg px-2 py-1.5 text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-200", STATUS_COLOR[acao[c.key]])}>
                            {STATUS_ACAO.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        ) : (
                          <input
                            type={c.tipo || "text"}
                            value={acao[c.key]}
                            onChange={(e) => set(idx, c.key, e.target.value)}
                            placeholder={c.placeholder}
                            className={cn("border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-200", c.width,
                              atrasada && c.key === "quando" ? "border-red-300 bg-red-50" : ""
                            )}
                          />
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <button onClick={() => remove(idx)} className="text-gray-200 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Resumo */}
        <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center gap-6 flex-wrap">
          {STATUS_ACAO.map((s) => {
            const count = acoes.filter((a) => a.status === s).length;
            return (
              <div key={s} className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", s === "Pendente" ? "bg-gray-400" : s === "Em andamento" ? "bg-amber-400" : "bg-emerald-400")} />
                <span className="text-xs text-gray-500">{s}: <span className="font-bold text-gray-700">{count}</span></span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}