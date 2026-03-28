import { useState } from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const DETRATORES_INICIAIS = [
  { id: 1, paciente: "Roberto A.", nota: 4, motivo: "Atraso de 1h na RM", status: "aguardando" },
  { id: 2, paciente: "Maria S.", nota: 3, motivo: "Comunicação durante procedimento", status: "em_contato" },
  { id: 3, paciente: "João P.", nota: 3, motivo: "Falta de orientações pré-exame", status: "resolvido" },
];

export default function DetratoresCard() {
  const [detratores, setDetratores] = useState(DETRATORES_INICIAIS);

  const handleReverter = (id) => {
    setDetratores(detratores.map(d => 
      d.id === id ? { ...d, status: "resolvido" } : d
    ));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Radar de Detratores e Reclamações</h3>
      <div className="space-y-3">
        {detratores.map((det) => (
          <div key={det.id} className={cn(
            "p-4 rounded-lg border-l-4 flex items-center justify-between",
            det.status === "resolvido" ? "bg-emerald-50 border-emerald-400" : 
            det.status === "em_contato" ? "bg-blue-50 border-blue-400" :
            "bg-red-50 border-red-400"
          )}>
            <div className="text-sm">
              <p className="font-semibold text-gray-800">
                {det.paciente} | Nota: <span className="text-amber-600 font-bold">{det.nota}</span>
              </p>
              <p className="text-gray-600 text-xs mt-1">Motivo: {det.motivo}</p>
              <p className="text-gray-500 text-xs mt-1">
                Status: {
                  det.status === "aguardando" ? "🔴 Aguardando Contato" :
                  det.status === "em_contato" ? "🟡 Em Contato" :
                  "✅ Resolvido"
                }
              </p>
            </div>
            {det.status !== "resolvido" && (
              <button
                onClick={() => handleReverter(det.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 ml-3"
              >
                <Phone className="w-3 h-3" />
                Reverter
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}