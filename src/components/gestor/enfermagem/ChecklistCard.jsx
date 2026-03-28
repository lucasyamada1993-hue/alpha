import { useState } from "react";
import { ShieldCheck, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CHECKLIST_DADOS = [
  { local: "Sala de RM", status: "checado", hora: "07:00", lacre: "#4589" },
  { local: "Sala de TC", status: "checado", hora: "07:15", lacre: "#4590" },
  { local: "Farmácia Satélite", status: "alerta", hora: "—", alerta: "2 Contrastes vencendo em 15 dias" },
];

export default function ChecklistCard({ onRealizarChecagem }) {
  const [checklists] = useState(CHECKLIST_DADOS);

  const handleRealizarChecagem = () => {
    if (onRealizarChecagem) {
      onRealizarChecagem();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-800 text-sm">Checklist de Segurança Diário</h3>
        </div>
        <button onClick={handleRealizarChecagem} className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" /> Realizar Checagem
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {checklists.map((item, i) => (
          <div key={i} className={cn(
            "px-5 py-4 flex items-center justify-between",
            item.status === "alerta" ? "bg-amber-50" : "hover:bg-gray-50"
          )}>
            <div className="flex items-center gap-3">
              {item.status === "checado" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-gray-700">{item.local}</p>
                {item.alerta && <p className="text-xs text-amber-600 mt-0.5">{item.alerta}</p>}
              </div>
            </div>
            <div className="text-right">
              {item.lacre && (
                <>
                  <p className="text-xs text-gray-500">Checado às {item.hora}</p>
                  <p className="text-xs font-mono text-gray-600 mt-0.5">Lacre {item.lacre}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}