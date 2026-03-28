import { cn } from "@/lib/utils";

const INCIDENTES = [
  { tipo: "Near Miss (Quase falhas)", qtd: 12, cor: "bg-gray-400", percent: 70 },
  { tipo: "Eventos sem Dano", qtd: 5, cor: "bg-amber-400", percent: 30 },
  { tipo: "Eventos com Dano", qtd: 1, cor: "bg-red-500", percent: 6 },
];

export default function IncidentesCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Mapa de Eventos Adversos</h3>
      <div className="space-y-5">
        {INCIDENTES.map((inc, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">{inc.tipo}</p>
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                {inc.qtd}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", inc.cor)}
                style={{ width: `${inc.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}