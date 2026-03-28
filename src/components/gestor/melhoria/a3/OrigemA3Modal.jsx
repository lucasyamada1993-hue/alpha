import { useState } from "react";
import { AlertTriangle, Lightbulb, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const INCIDENTS_MOCK = [
  { id: "NC-001", title: "Atraso Laudo RM", tipo: "Não Conformidade", data: "2026-03-15" },
  { id: "EA-045", title: "Extravasamento de Contraste", tipo: "Evento Adverso", data: "2026-03-18" },
  { id: "NC-003", title: "Falha na Dupla Checagem", tipo: "Não Conformidade", data: "2026-03-20" },
  { id: "EA-052", title: "Queda de Paciente", tipo: "Evento Adverso", data: "2026-03-22" },
];

export default function OrigemA3Modal({ onSelect, onCancel }) {
  const [step, setStep] = useState(1); // 1: Select origin | 2: Select incident
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const handleOriginSelect = (origin) => {
    setSelectedOrigin(origin);
    if (origin === "proativo") {
      onSelect({ origin: "proativo", incident: null });
    } else {
      setStep(2);
    }
  };

  const handleIncidentSelect = (incident) => {
    setSelectedIncident(incident);
    onSelect({ origin: "nc_evento", incident });
  };

  const handleBack = () => {
    setStep(1);
    setSelectedOrigin(null);
    setSelectedIncident(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-lg">Origem da Melhoria</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            // Step 1: Select Origin
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-6">
                Selecione a origem do A3. Você pode criar um novo plano de melhoria vinculado a uma não conformidade/evento adverso ou iniciar um novo plano proativo.
              </p>

              <button
                onClick={() => handleOriginSelect("nc_evento")}
                className={cn(
                  "w-full p-4 rounded-xl border-2 transition-all text-left",
                  selectedOrigin === "nc_evento"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white hover:border-red-300"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Vincular a uma Não Conformidade / Evento Adverso
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Selecione um incidente aberto para criar um plano de ação corretiva
                    </p>
                  </div>
                  <ChevronRight className={cn("w-5 h-5 ml-auto mt-1 transition-transform", selectedOrigin === "nc_evento" && "text-red-500")} />
                </div>
              </button>

              <button
                onClick={() => handleOriginSelect("proativo")}
                className={cn(
                  "w-full p-4 rounded-xl border-2 transition-all text-left",
                  selectedOrigin === "proativo"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-emerald-300"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Lightbulb className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Novo / Avulso (Proativo)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Inicie um plano de melhoria proativa sem vincular a um incidente específico
                    </p>
                  </div>
                  <ChevronRight className={cn("w-5 h-5 ml-auto mt-1 transition-transform", selectedOrigin === "proativo" && "text-emerald-500")} />
                </div>
              </button>
            </div>
          ) : (
            // Step 2: Select Incident
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={handleBack}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                >
                  ← Voltar
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Selecione o incidente para vincular a este A3:
              </p>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {INCIDENTS_MOCK.map((incident) => (
                  <button
                    key={incident.id}
                    onClick={() => handleIncidentSelect(incident)}
                    className={cn(
                      "w-full p-3 rounded-lg border transition-all text-left",
                      selectedIncident?.id === incident.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{incident.id}: {incident.title}</p>
                        <div className="flex gap-2 mt-1">
                          <span className={cn("text-xs px-2 py-0.5 rounded-full", incident.tipo === "Não Conformidade" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700")}>
                            {incident.tipo}
                          </span>
                          <span className="text-xs text-gray-500">{incident.data}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-sm transition-colors"
          >
            Cancelar
          </button>
          {step === 2 && (
            <button
              onClick={() => selectedIncident && handleIncidentSelect(selectedIncident)}
              disabled={!selectedIncident}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
            >
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}