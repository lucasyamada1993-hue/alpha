import { CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PROFISSIONAIS = [
  {
    id: 1,
    nome: "Carlos Lima",
    pdi15: { status: "concluido", data: "10/02/2026" },
    pdi30: { status: "concluido", data: "12/03/2026" },
    pdi60: { status: "alerta", data: "12/04/2026", diasRestantes: 15 },
    pdi90: { status: "pendente", data: "12/05/2026" },
  },
  {
    id: 2,
    nome: "Ana Souza",
    pdi15: { status: "pendente", data: "15/03/2026", diasRestantes: 3 },
    pdi30: { status: "pendente", data: "01/04/2026" },
    pdi60: { status: "pendente", data: "01/05/2026" },
    pdi90: { status: "pendente", data: "01/06/2026" },
  },
  {
    id: 3,
    nome: "Fernanda Melo",
    pdi15: { status: "concluido", data: "15/02/2026" },
    pdi30: { status: "concluido", data: "01/03/2026" },
    pdi60: { status: "atrasado", data: "01/04/2026" },
    pdi90: { status: "pendente", data: "01/05/2026" },
  },
];

function StatusIcon({ status }) {
  switch (status) {
    case "concluido":
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case "alerta":
      return <AlertCircle className="w-5 h-5 text-amber-500" />;
    case "atrasado":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
}

function StatusBadge({ status, diasRestantes }) {
  const map = {
    concluido: "bg-emerald-50 text-emerald-700 border-emerald-200",
    alerta: "bg-amber-50 text-amber-700 border-amber-200",
    atrasado: "bg-red-50 text-red-700 border-red-200",
    pendente: "bg-gray-50 text-gray-600 border-gray-200",
  };

  const labels = {
    concluido: "Concluído",
    alerta: diasRestantes != null ? `${diasRestantes} d` : "Alerta",
    atrasado: "Atrasado",
    pendente: "Pendente",
  };

  return (
    <span
      className={cn(
        "block w-full max-w-full px-1.5 py-1 rounded-md text-[10px] sm:text-xs font-semibold border text-center leading-tight break-words",
        map[status]
      )}
    >
      {labels[status]}
    </span>
  );
}

export default function PDICard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 text-sm">PDI — Período de Experiência (15/30/60/90)</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {PROFISSIONAIS.map((prof) => (
          <div key={prof.id} className="px-5 py-4">
            <p className="font-semibold text-gray-800 text-sm mb-3">{prof.nome}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-0">
              {[
                { dias: "15D", pdi: prof.pdi15 },
                { dias: "30D", pdi: prof.pdi30 },
                { dias: "60D", pdi: prof.pdi60 },
                { dias: "90D", pdi: prof.pdi90 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "min-w-0 flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg border-2 text-center",
                    item.pdi.status === "concluido" && "bg-emerald-50 border-emerald-300",
                    item.pdi.status === "alerta" && "bg-amber-50 border-amber-300",
                    item.pdi.status === "atrasado" && "bg-red-50 border-red-300",
                    item.pdi.status === "pendente" && "bg-gray-50 border-gray-300"
                  )}
                >
                  <div className="flex shrink-0 justify-center">
                    <StatusIcon status={item.pdi.status} />
                  </div>
                  <p className="text-xs font-bold text-gray-700 shrink-0">{item.dias}</p>
                  <div className="w-full min-w-0">
                    <StatusBadge
                      status={item.pdi.status}
                      diasRestantes={item.pdi.diasRestantes}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}