import { useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "@/api/sheetsClient";
import A3ListaView from "@/components/gestor/melhoria/a3/A3ListaView";
import A3Editor from "@/components/gestor/melhoria/a3/A3Editor";
import OrigemA3Modal from "@/components/gestor/melhoria/a3/OrigemA3Modal";
import A3PDCAForm from "@/components/gestor/melhoria/a3/A3PDCAForm";

export default function GestorMelhoria() {
  const location = useLocation();
  const a3Inicial = location.state?.a3Item || null;

  const [a3Selecionado, setA3Selecionado] = useState(null);
  const [showOrigemModal, setShowOrigemModal] = useState(false);
  const [showPDCAForm, setShowPDCAForm] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState(null);

  // Handle origin selection
  const handleOrigemSelect = (origin) => {
    setSelectedOrigin(origin);
    setShowOrigemModal(false);
    setShowPDCAForm(true);
  };

  // Handle A3 form submission
  const handleA3FormSubmit = async (formData) => {
    try {
      const novoA3 = await db.entities.A3Relatorio.create({
        ...formData,
        status_pdca: "PLAN",
        deleted: false,
      });
      setA3Selecionado(novoA3);
      setShowPDCAForm(false);
      setSelectedOrigin(null);
    } catch (error) {
      console.error("Erro ao criar A3:", error);
    }
  };

  // Handle A3 from Auditoria/Qualidade with pre-filled data
  const handleA3VindoDeOutraFase = async () => {
    if (!a3Inicial || a3Selecionado) return;
    const novo = await db.entities.A3Relatorio.create({
      titulo: a3Inicial.pop || "Novo A3 via Auditoria",
      dono: "Coordenador de Qualidade",
      tipo: a3Inicial.avaliacao === "NC" ? "Não Conformidade" : "Oportunidade de Melhoria",
      prioridade: "Alta",
      pop_referencia: a3Inicial.pop || "",
      origem: "Auditoria de Processos",
      plan_condicao_atual: a3Inicial.descricao || "",
      status_pdca: "PLAN",
      deleted: false,
    });
    setA3Selecionado(novo);
  };

  // Auto-create if coming from another page
  if (a3Inicial && !a3Selecionado) {
    handleA3VindoDeOutraFase();
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-4 border-blue-200 border-t-[#0D47A1] rounded-full animate-spin" />
      </div>
    );
  }

  if (a3Selecionado) {
    return <A3Editor relatorio={a3Selecionado} onBack={() => setA3Selecionado(null)} />;
  }

  return (
    <div className="space-y-6 bg-gray-50 -mx-6 -mb-6 px-6 py-6">
      <A3ListaView 
        onNovoA3={() => setShowOrigemModal(true)} 
        onSelect={setA3Selecionado}
      />
      
      {showOrigemModal && (
        <OrigemA3Modal 
          onSelect={handleOrigemSelect} 
          onCancel={() => setShowOrigemModal(false)}
        />
      )}
      
      {showPDCAForm && (
        <A3PDCAForm 
          origin={selectedOrigin}
          onSave={handleA3FormSubmit}
          onCancel={() => {
            setShowPDCAForm(false);
            setSelectedOrigin(null);
          }}
        />
      )}
    </div>
  );
}