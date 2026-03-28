import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuditoriaHeader from "@/components/gestor/auditoria/AuditoriaHeader";
import AuditoriaCategoriaTabs from "@/components/gestor/auditoria/AuditoriaCategoriaTabs";
import AuditoriaChecklist from "@/components/gestor/auditoria/AuditoriaChecklist";
import AuditoriaResumo from "@/components/gestor/auditoria/AuditoriaResumo";
import { CHECKLISTS } from "@/lib/auditoriaData";

export default function GestorAuditoria() {
  const navigate = useNavigate();
  const [categoriaAtiva, setCategoriaAtiva] = useState(CHECKLISTS[0].id);
  const [avaliacoes, setAvaliacoes] = useState({});

  const handleAvaliar = (itemId, valor) => {
    setAvaliacoes((prev) => ({ ...prev, [itemId]: valor }));
  };

  const handleGerarA3 = (item) => {
    navigate("/gestor/melhoria", { state: { a3Item: item } });
  };

  const categoriaAtual = CHECKLISTS.find((c) => c.id === categoriaAtiva);

  return (
    <>
      <AuditoriaHeader />
      <AuditoriaCategoriaTabs
        categorias={CHECKLISTS}
        ativa={categoriaAtiva}
        onSelect={setCategoriaAtiva}
        avaliacoes={avaliacoes}
      />
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <AuditoriaChecklist
            categoria={categoriaAtual}
            avaliacoes={avaliacoes}
            onAvaliar={handleAvaliar}
            onGerarA3={handleGerarA3}
          />
        </div>
        <div>
          <AuditoriaResumo
            categorias={CHECKLISTS}
            avaliacoes={avaliacoes}
          />
        </div>
      </div>
    </>
  );
}