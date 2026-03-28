import { useState } from "react";
import { Plus, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const EVENTOS_INICIAL = [
  {
    id: 1,
    tipo: "Extravasamento",
    data: "2026-03-20",
    paciente: "John Doe",
    setor: "Radiologia",
    gravidade: "Leve",
    notificadoPor: "Dra. Paula",
    status: "Aberto",
  },
  {
    id: 2,
    tipo: "Flebite",
    data: "2026-03-18",
    paciente: "Maria Silva",
    setor: "SADT",
    gravidade: "Moderada",
    notificadoPor: "Enfermeiro João",
    status: "Aberto",
  },
  {
    id: 3,
    tipo: "Queda",
    data: "2026-03-15",
    paciente: "Carlos Santos",
    setor: "Radiologia",
    gravidade: "Grave",
    notificadoPor: "Técnico Ricardo",
    status: "A3 Aberto",
  },
];

function BadgeGravidade({ gravidade }) {
  const colors = {
    Leve: "bg-green-50 text-green-700 border-green-200",
    Moderada: "bg-amber-50 text-amber-700 border-amber-200",
    Grave: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full border", colors[gravidade])}>
      {gravidade}
    </span>
  );
}

function BadgeStatus({ status }) {
  const colors = {
    Aberto: "bg-red-50 text-red-700 border-red-200",
    "A3 Aberto": "bg-blue-50 text-blue-700 border-blue-200",
    Resolvido: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full border", colors[status])}>
      {status}
    </span>
  );
}

export default function QualidadeEventos() {
  const [eventos, setEventos] = useState(EVENTOS_INICIAL);
  const [selecionado, setSelecionado] = useState(null);

  const handleAbrirA3 = (evento) => {
    // Redirecionar para melhoria contínua com dados do evento
    setEventos(eventos.map(e => 
      e.id === evento.id ? { ...e, status: "A3 Aberto" } : e
    ));
    window.location.href = `/gestor-qualidade/melhoria?evento=${evento.id}&tipo=EventoAdverso`;
  };

  const handleDeletar = (id) => {
    if (confirm("Tem certeza que deseja deletar?")) {
      setEventos(eventos.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Eventos Adversos & Near Miss</h2>
            <p className="text-xs text-gray-500 mt-1">Monitoramento de ocorrências na assistência</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors">
            <Plus className="w-4 h-4" />
            Novo Evento
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Tipo</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Paciente</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Setor</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Data</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 text-xs">Gravidade</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 text-xs">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 text-xs">Ações</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelecionado(evento)}
                      className="font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      {evento.tipo}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{evento.paciente}</td>
                  <td className="px-4 py-3 text-gray-600">{evento.setor}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{evento.data}</td>
                  <td className="px-4 py-3 text-center">
                    <BadgeGravidade gravidade={evento.gravidade} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <BadgeStatus status={evento.status} />
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button
                      onClick={() => setSelecionado(evento)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {evento.status === "Aberto" && (
                      <button
                        onClick={() => handleAbrirA3(evento)}
                        className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Abrir A3
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletar(evento.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {eventos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum evento registrado
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Evento: {selecionado.tipo}</h3>
              <button
                onClick={() => setSelecionado(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">PACIENTE</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{selecionado.paciente}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">SETOR</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{selecionado.setor}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">DATA</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{selecionado.data}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">NOTIFICADO POR</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{selecionado.notificadoPor}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">GRAVIDADE</p>
                  <div className="mt-1">
                    <BadgeGravidade gravidade={selecionado.gravidade} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">STATUS</p>
                  <div className="mt-1">
                    <BadgeStatus status={selecionado.status} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelecionado(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-sm transition-colors"
                >
                  Fechar
                </button>
                {selecionado.status === "Aberto" && (
                  <button
                    onClick={() => {
                      handleAbrirA3(selecionado);
                      setSelecionado(null);
                    }}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm transition-colors"
                  >
                    Abrir A3
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}