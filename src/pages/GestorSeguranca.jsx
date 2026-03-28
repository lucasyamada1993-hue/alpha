import { useState } from "react";
import SegurancaHeader from "@/components/gestor/seguranca/SegurancaHeader";
import SegurancaPlacar from "@/components/gestor/seguranca/SegurancaPlacar";
import SegurancaCards from "@/components/gestor/seguranca/SegurancaCards";
import SegurancaTabela from "@/components/gestor/seguranca/SegurancaTabela";
import SegurancaModal from "@/components/gestor/seguranca/SegurancaModal";

const EVENTOS_INICIAIS = [
  { id: 1, data: "27/03/2026", setor: "Tomografia", categoria: "Contraste", grau: "Sem Dano", status: "Investigação Concluída" },
  { id: 2, data: "20/03/2026", setor: "Ressonância", categoria: "Queda", grau: "Leve", status: "Em Investigação" },
  { id: 3, data: "14/03/2026", setor: "Raio-X", categoria: "Identificação", grau: "Sem Dano", status: "Ação Corretiva Aberta" },
  { id: 4, data: "08/03/2026", setor: "Ultrassom", categoria: "Medicação", grau: "Grave", status: "Em Investigação" },
  { id: 5, data: "02/03/2026", setor: "Recepção", categoria: "Queda", grau: "Leve", status: "Investigação Concluída" },
];

export default function GestorSeguranca() {
  const [eventos, setEventos] = useState(EVENTOS_INICIAIS);
  const [modalAberto, setModalAberto] = useState(false);

  const handleRegistrar = (novoEvento) => {
    setEventos((prev) => [
      { id: Date.now(), ...novoEvento },
      ...prev,
    ]);
    setModalAberto(false);
  };

  return (
    <div className="space-y-6">
      <SegurancaHeader onNova={() => setModalAberto(true)} />
      <SegurancaPlacar dias={45} />
      <SegurancaCards eventos={eventos} />
      <SegurancaTabela eventos={eventos} />
      {modalAberto && (
        <SegurancaModal onClose={() => setModalAberto(false)} onRegistrar={handleRegistrar} />
      )}
    </div>
  );
}