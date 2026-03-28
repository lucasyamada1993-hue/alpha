import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, TrendingUp, FileSpreadsheet } from "lucide-react";

const OPCOES = [
  {
    valor: "C",
    label: "Conforme",
    icon: CheckCircle2,
    bg: "bg-emerald-50 border-emerald-400 text-emerald-700",
    dot: "bg-emerald-500",
  },
  {
    valor: "NC",
    label: "Não Conforme",
    icon: XCircle,
    bg: "bg-red-50 border-red-400 text-red-700",
    dot: "bg-red-500",
  },
  {
    valor: "OM",
    label: "Oportunidade de Melhoria",
    icon: TrendingUp,
    bg: "bg-amber-50 border-amber-400 text-amber-700",
    dot: "bg-amber-500",
  },
];

function StatusBadge({ valor }) {
  if (!valor) return <span className="text-xs text-gray-300">—</span>;
  const op = OPCOES.find((o) => o.valor === valor);
  if (!op) return null;
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold border", op.bg)}>
      {op.valor}
    </span>
  );
}

export default function AuditoriaChecklist({ categoria, avaliacoes, onAvaliar, onGerarA3 }) {
  if (!categoria) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header da categoria */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">{categoria.label}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {categoria.itens.length} POPs a auditar · Selecione a avaliação para cada item
          </p>
        </div>
        <FileSpreadsheet className="w-5 h-5 text-gray-300" />
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-5 py-3 text-left font-semibold w-28">POP</th>
              <th className="px-5 py-3 text-left font-semibold">Descrição do Processo</th>
              <th className="px-5 py-3 text-center font-semibold w-72">Avaliação</th>
              <th className="px-5 py-3 text-center font-semibold w-24">Status</th>
              <th className="px-5 py-3 text-center font-semibold w-24">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categoria.itens.map((item) => {
              const atual = avaliacoes[item.id];
              return (
                <tr
                  key={item.id}
                  className={cn(
                    "transition-colors",
                    atual === "NC" && "bg-red-50/40",
                    atual === "OM" && "bg-amber-50/30",
                    atual === "C" && "bg-emerald-50/20"
                  )}
                >
                  {/* POP */}
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded">
                      {item.pop}
                    </span>
                  </td>

                  {/* Descrição */}
                  <td className="px-5 py-4 text-gray-700 text-xs leading-relaxed">
                    {item.descricao}
                  </td>

                  {/* Avaliação (botões C / NC / OM) */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {OPCOES.map((op) => {
                        const Icon = op.icon;
                        const selected = atual === op.valor;
                        return (
                          <button
                            key={op.valor}
                            onClick={() => onAvaliar(item.id, selected ? null : op.valor)}
                            title={op.label}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all",
                              selected
                                ? op.bg + " shadow-sm scale-105"
                                : "border-gray-200 text-gray-400 bg-white hover:border-gray-300 hover:text-gray-600"
                            )}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {op.valor}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 text-center">
                    <StatusBadge valor={atual} />
                  </td>

                  {/* Ação: Gerar A3 */}
                  <td className="px-5 py-4 text-center">
                    {(atual === "NC" || atual === "OM") && (
                      <button
                        onClick={() => onGerarA3({ ...item, avaliacao: atual })}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                          atual === "NC"
                            ? "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                            : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                        )}
                      >
                        Gerar A3
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}