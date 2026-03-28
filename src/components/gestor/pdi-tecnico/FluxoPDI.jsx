import { useState } from "react";
import { Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DADOS_PERIODOS = {
  "15": { nome: "15 Dias", dataPrazo: "12/04/2026", status: "aberto" },
  "30": { nome: "30 Dias", dataPrazo: "27/04/2026", status: "pendente" },
  "60": { nome: "60 Dias", dataPrazo: "27/05/2026", status: "pendente" },
  "90": { nome: "90 Dias", dataPrazo: "26/06/2026", status: "pendente" },
};

export default function FluxoPDI({ colaborador, onFormOpen }) {
  const [activePeriodo, setActivePeriodo] = useState("15");
  const [showForm, setShowForm] = useState(false);

  if (!colaborador) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
        <p className="text-gray-500">Selecione um colaborador para iniciar o PDI</p>
      </div>
    );
  }

  const handleAbrirFormulario = (periodo) => {
    setActivePeriodo(periodo);
    setShowForm(true);
  };

  const handleFecharFormulario = () => {
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-800">PDI — {colaborador}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Data de abertura: 28/03/2026</p>
          </div>
        </div>
      </div>

      {/* Sub-abas por período */}
      <div className="flex gap-1 px-6 py-4 border-b border-gray-100 bg-gray-50 flex-wrap">
        {Object.entries(DADOS_PERIODOS).map(([periodo, dados]) => (
          <button
            key={periodo}
            onClick={() => setActivePeriodo(periodo)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all border flex items-center gap-2",
              activePeriodo === periodo
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
            )}
          >
            {dados.nome}
            {dados.status === "pendente" && (
              <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                {dados.dataPrazo}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Conteúdo do período */}
      <div className="p-6 space-y-4">
        {activePeriodo === "15" ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900">Período de Integração Inicial</p>
              <p className="text-xs text-blue-700 mt-1">Avaliação dos primeiros 15 dias de experiência</p>
            </div>
            <button
              onClick={() => handleAbrirFormulario("15")}
              className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg transition-colors"
            >
              <span>Abrir Formulário de Avaliação</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-amber-900">Período: {DADOS_PERIODOS[activePeriodo].nome}</p>
              <p className="text-xs text-amber-700 mt-1">Prazo: {DADOS_PERIODOS[activePeriodo].dataPrazo}</p>
            </div>
            <button
              onClick={() => handleAbrirFormulario(activePeriodo)}
              className="w-full flex items-center justify-between bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-3 rounded-lg transition-colors"
            >
              <span>Abrir Formulário de Avaliação</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modal do formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                Avaliação — {DADOS_PERIODOS[activePeriodo].nome}
              </h2>
              <button
                onClick={handleFecharFormulario}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {onFormOpen ? (
                onFormOpen(activePeriodo, colaborador)
              ) : (
                <p className="text-gray-500 text-center py-8">Formulário de avaliação</p>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleFecharFormulario}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-sm"
              >
                Fechar
              </button>
              <button
                onClick={handleFecharFormulario}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm"
              >
                Salvar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}