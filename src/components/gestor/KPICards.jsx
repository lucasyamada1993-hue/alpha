import { Clock, AlertTriangle, Star, ShieldCheck, Wrench, Lock, GraduationCap, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const KPI_DATA = [
  {
    title: "TAT Médio (Jornada)",
    value: "58 min",
    subtitle: "Meta: < 60 min",
    trend: "▼ 5 min vs mês anterior",
    trendGood: true,
    icon: Clock,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    borderColor: "border-l-blue-500",
  },
  {
    title: "Equipamentos Conformes",
    value: "6/8",
    subtitle: "Calibrações e manutenções",
    trend: "▼ 1 pendência vs mês anterior",
    trendGood: true,
    icon: Wrench,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    borderColor: "border-l-emerald-500",
  },
  {
    title: "Eventos Adversos (Mês)",
    value: "2",
    subtitle: "1 Near Miss registrado",
    trend: "▲ 1 vs mês anterior",
    trendGood: false,
    icon: AlertTriangle,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    borderColor: "border-l-red-500",
  },
  {
    title: "NPS Pacientes",
    value: "72",
    subtitle: "Zona de Excelência",
    trend: "▲ 4 pts vs mês anterior",
    trendGood: true,
    icon: Star,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    borderColor: "border-l-amber-500",
  },
  {
    title: "Alertas de Habilitação",
    value: "2",
    subtitle: "1 vencida · 1 vencendo",
    trend: "Ricardo Neves — CRTR vencido",
    trendGood: false,
    icon: GraduationCap,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
    borderColor: "border-l-orange-500",
  },
  {
    title: "POPs Desatualizados",
    value: "2",
    subtitle: "Revisão necessária",
    trend: "POP-RM-007 e POP-GE-002",
    trendGood: false,
    icon: ShieldCheck,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    borderColor: "border-l-purple-500",
  },
  {
    title: "Acessos Registrados Hoje",
    value: "47",
    subtitle: "Trilha LGPD ativa",
    trend: "▲ 3 vs ontem",
    trendGood: true,
    icon: Lock,
    iconColor: "text-slate-600",
    iconBg: "bg-slate-50",
    borderColor: "border-l-slate-500",
  },
  {
    title: "Taxa de Refação de Exames",
    value: "3,2%",
    subtitle: "Meta: < 5%",
    trend: "▼ 0,8% vs mês anterior",
    trendGood: true,
    icon: TrendingDown,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-50",
    borderColor: "border-l-sky-500",
  },
];

export default function KPICards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {KPI_DATA.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.title}
            className={cn(
              "bg-white rounded-xl p-5 border border-gray-100 border-l-4 shadow-sm hover:shadow-md transition-shadow",
              kpi.borderColor
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider leading-tight max-w-[140px]">
                {kpi.title}
              </p>
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", kpi.iconBg)}>
                <Icon className={cn("w-5 h-5", kpi.iconColor)} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-gray-800 mb-1">{kpi.value}</p>
            <p className="text-xs text-gray-400 mb-2">{kpi.subtitle}</p>
            <p className={cn("text-xs font-medium", kpi.trendGood ? "text-green-600" : "text-red-500")}>
              {kpi.trend}
            </p>
          </div>
        );
      })}
    </div>
  );
}