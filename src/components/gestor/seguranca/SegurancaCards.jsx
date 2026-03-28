import { Bell, AlertTriangle, ClipboardCheck } from "lucide-react";

export default function SegurancaCards({ eventos }) {
  const mes = new Date().getMonth();
  const ano = new Date().getFullYear();

  const noMes = eventos.filter((e) => {
    const [, m, a] = e.data.split("/");
    return parseInt(m) - 1 === mes && parseInt(a) === ano;
  }).length;

  const emInvestigacao = eventos.filter((e) => e.status === "Em Investigação").length;
  const acoesAbertas = eventos.filter((e) => e.status === "Ação Corretiva Aberta").length;

  const cards = [
    {
      label: "Notificações no Mês",
      value: noMes,
      icon: Bell,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      border: "border-l-blue-500",
    },
    {
      label: "Eventos em Investigação",
      value: emInvestigacao,
      icon: AlertTriangle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      border: "border-l-amber-500",
    },
    {
      label: "Ações Corretivas Abertas",
      value: acoesAbertas,
      icon: ClipboardCheck,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      border: "border-l-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {cards.map(({ label, value, icon: Icon, iconBg, iconColor, border }) => (
        <div
          key={label}
          className={`bg-white rounded-xl p-5 border border-gray-100 border-l-4 shadow-sm ${border}`}
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider leading-tight max-w-[140px]">
              {label}
            </p>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-gray-800">{value}</p>
        </div>
      ))}
    </div>
  );
}