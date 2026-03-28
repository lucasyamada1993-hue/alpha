import EventosNaoConformidades from "@/components/gestor/enfermagem/EventosNaoConformidades";

export default function GestorEventosNaoConformidades() {
  return (
    <div className="space-y-6 bg-gray-50 -mx-6 -mb-6 px-6 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Eventos Adversos & Não Conformidades</h1>
        <p className="text-sm text-gray-500 mt-1">Notificação e acompanhamento de ocorrências na assistência</p>
      </div>

      {/* Componente */}
      <EventosNaoConformidades />
    </div>
  );
}