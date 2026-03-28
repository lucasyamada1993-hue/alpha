import { useState } from "react";

import KPIEnfermagem from "@/components/gestor/enfermagem/KPIEnfermagem";
import EscalaCard from "@/components/gestor/enfermagem/EscalaCard";
import ChecklistCard from "@/components/gestor/enfermagem/ChecklistCard";
import PDICard from "@/components/gestor/enfermagem/PDICard";
import PDIForm from "@/components/gestor/enfermagem/PDIForm";
import ChecklistMedicamentos from "@/components/gestor/enfermagem/ChecklistMedicamentos";

export default function GestorEnfermagem() {
  const [showPDIForm, setShowPDIForm] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);

  return (
    <div className="space-y-6 bg-gray-50 -mx-6 -mb-6 px-6 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Gestão Assistencial e Enfermagem</h1>
        <p className="text-sm text-gray-500 mt-1">Monitoramento de Escala, Insumos e Operacional</p>
      </div>

      {/* KPIs */}
      <KPIEnfermagem />

      {/* Painel Principal */}
      <div className="grid grid-cols-12 gap-6">
        {/* Coluna esquerda 60% */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <EscalaCard />
          <ChecklistCard onRealizarChecagem={() => setShowChecklistModal(true)} />
        </div>

        {/* Coluna direita 40% */}
        <div className="col-span-12 lg:col-span-5">
          <PDICard />
        </div>
      </div>

      {showPDIForm && <PDIForm onClose={() => setShowPDIForm(false)} />}

      {/* Modal Checklist de Medicamentos */}
      {showChecklistModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Checklist de Medicações Críticas</h2>
              <button
                onClick={() => setShowChecklistModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <ChecklistMedicamentos onClose={() => setShowChecklistModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}