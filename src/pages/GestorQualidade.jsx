import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import QualidadeDashboard from "@/components/gestor/qualidade/QualidadeDashboard";

const TABS_QUALIDADE = [
  { id: "visao-geral", label: "Visão Geral", icon: ShieldCheck },
];



export default function GestorQualidade() {
  const [activeTab, setActiveTab] = useState("visao-geral");

  return (
    <div className="space-y-6 bg-gray-50 -mx-6 -mb-6 px-6 py-6">
      {/* CABEÇALHO */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard de Qualidade</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhamento em tempo real dos indicadores de qualidade - Controle e Avaliação</p>
      </div>

      {/* ABAS */}
      <div className="flex gap-2 flex-wrap">
        {TABS_QUALIDADE.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all border",
              activeTab === id
                ? "bg-[#0D47A1] text-white border-[#0D47A1] shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* CONTEÚDO DAS ABAS */}
      {activeTab === "visao-geral" && <QualidadeDashboard />}
    </div>
  );
}