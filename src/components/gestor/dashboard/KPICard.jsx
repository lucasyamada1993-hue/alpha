import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function KPICard({ label, value, unit = "", target, targetLabel, delta, deltaGoodUp = true, sparkData, color = "blue" }) {
  const isGood = delta !== undefined
    ? (deltaGoodUp ? delta.up : !delta.up)
    : null;

  const sparkColor = color === "blue" ? "#3b82f6"
    : color === "emerald" ? "#10b981"
    : color === "amber" ? "#f59e0b"
    : color === "rose" ? "#f43f5e"
    : color === "purple" ? "#8b5cf6"
    : "#6b7280";

  const chartData = sparkData ? sparkData.map((v) => ({ v })) : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider leading-tight">{label}</p>

      <div className="flex items-end justify-between gap-2">
        <div>
          <span className="text-3xl font-extrabold text-gray-800 leading-none">{value}</span>
          {unit && <span className="text-base font-semibold text-gray-400 ml-1">{unit}</span>}
        </div>
        {sparkData && (
          <div className="w-20 h-10 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="v" stroke={sparkColor} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {(target !== undefined || delta !== undefined) && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          {target !== undefined && (
            <span className="text-xs text-gray-400">{targetLabel || "Meta"}: <span className="font-semibold text-gray-600">{target}{unit}</span></span>
          )}
          {delta !== undefined && (
            <span className={cn("flex items-center gap-1 text-xs font-semibold", isGood ? "text-emerald-600" : "text-rose-500")}>
              {isGood ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {delta.up ? "+" : "-"}{delta.value}{unit} vs mês ant.
            </span>
          )}
        </div>
      )}
    </div>
  );
}