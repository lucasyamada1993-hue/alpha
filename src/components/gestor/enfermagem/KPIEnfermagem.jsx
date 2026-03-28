import { Users, ShieldCheck, BookOpen, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const KPIS = [
  {
    label: "Plantão Atual",
    value: "12/12",
    subtitulo: "Profissionais escalados",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
    border: "border-l-blue-500",
  },
  {
    label: "Carrinhos de Emergência",
    value: "100%",
    subtitulo: "Checados",
    badge: "Lacre OK",
    badgeBg: "bg-emerald-50 text-emerald-700",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600",
    border: "border-l-emerald-500",
  },
  {
    label: "PDIs Ativos",
    value: "8",
    subtitulo: "2 concluídos este mês",
    icon: BookOpen,
    color: "bg-purple-50 text-purple-600",
    border: "border-l-purple-500",
  },
  {
    label: "Alertas Assistenciais",
    value: "1",
    subtitulo: "Flebite notificada (TC)",
    icon: AlertTriangle,
    color: "bg-red-50 text-red-600",
    border: "border-l-red-500",
  },
];

export default function KPIEnfermagem() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {KPIS.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <div
            key={i}
            className={cn(
              "bg-white rounded-xl border border-gray-200 border-l-4 shadow-sm p-4 flex items-start gap-3",
              kpi.border
            )}
          >
            <div className={cn("w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0", kpi.color)}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.subtitulo}</p>
              {kpi.badge && (
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2 inline-block", kpi.badgeBg)}>
                  {kpi.badge}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}