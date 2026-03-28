import { useState } from "react";
import { Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const CONFORMIDADES_INICIAL = [
  {
    id: 1,
    titulo: "Falta de Dupla Checagem",
    tipo: "Não Conformidade",
    origem: "Gerente Enfermagem",
    data: "2026-03-15",
    gravidade: "Alta",
    status: "Aberta",
    descricao: "Falta de dupla checagem em medicação de alto risco",
  },
  {
    id: 2,
    titulo: "Equipamento com Manutenção Vencida",
    tipo: "Não Conformidade",
    origem: "Gerente Equipamentos",
    data: "2026-03-10",
    gravidade: "Alta",
    status: "Aberta",
    descricao: "Equipamento de tomografia com manutenção vencida há 2 meses",
  },
  {
    id: 3,
    titulo: "Documentação Incompleta",
    tipo: "Não Conformidade",
    origem: "Gerente Administrativo",
    data: "2026-03-05",
    gravidade: "Média",
    status: "Em Análise",
    descricao: "Prontuário com campos obrigatórios não preenchidos",
  },
  {
    id: 4,
    titulo: "Near Miss - Queda de Paciente",
    tipo: "Evento Adverso",
    origem: "Gerente Enfermagem",
    data: "2026-02-28",
    gravidade: "Média",
    status: "Aberta",
    descricao: "Paciente quase caiu durante transferência de maca",
  },
];

function BadgeGravidade({ gravidade }) {
  const colors = {
    Alta: "bg-red-50 text-red-700 border-red-200",
    Média: "bg-amber-50 text-amber-700 border-amber-200",
    Baixa: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full border", colors[gravidade])}>
      {gravidade}
    </span>
  );
}

function BadgeStatus({ status }) {
  const colors = {
    Aberta: "bg-red-50 text-red-700 border-red-200",
    "Em Análise": "bg-blue-50 text-blue-700 border-blue-200",
    Resolvida: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full border", colors[status])}>
      {status}
    </span>
  );
}

export default function QualidadeConformidades() {
  const [conformidades, setConformidades] = useState(CONFORMIDADES_INICIAL);
  const [selecionado, setSelecionado] = useState(null);
  const [filtroOrigem, setFiltroOrigem] = useState("Todos");

  const origens = ["Todos", ...new Set(conformidades.map(c => c.origem))];
  
  const filtradas = filtroOrigem === "Todos" 
    ? conformidades 
    : conformidades.filter(c => c.origem === filtroOrigem);

  const handleAbrirA3 = (conformidade) => {
    // Redirecionar para melhoria contínua com dados do evento
    window.location.href = `/gestor-qualidade/melhoria?evento=${conformidade.id}&tipo=${conformidade.tipo}`;
  };

  const handleDeletar = (id) => {
    if (confirm("Tem certeza que deseja deletar?")) {
      setConformidades(conformidades.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Qualidade & Não Conformidades</h2>
            <p className="text-xs text-gray-500 mt-1">Todos os eventos registrados pelos gerentes</p>
          </div>
          <select
            value={filtroOrigem}
            onChange={(e) => setFiltroOrigem(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400"
          >
            {origens.map(origem => (
              <option key={origem} value={origem}>{origem}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Título</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Tipo</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Origem</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Data</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 text-xs">Gravidade</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 text-xs">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 text-xs">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((conf) => (
                <tr key={conf.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelecionado(conf)}
                      className="font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      {conf.titulo}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                      {conf.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{conf.origem}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{conf.data}</td>
                  <td className="px-4 py-3 text-center">
                    <BadgeGravidade gravidade={conf.gravidade} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <BadgeStatus status={conf.status} />
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button
                      onClick={() => setSelecionado(conf)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAbrirA3(conf)}
                      className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Criar A3
                    </button>
                    <button
                      onClick={() => handleDeletar(conf.id)}
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

        {filtradas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma conformidade encontrada
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">{selecionado.titulo}</h3>
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
                  <p className="text-xs text-gray-500 font-semibold">TIPO</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{selecionado.tipo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">ORIGEM</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{selecionado.origem}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">DATA</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{selecionado.data}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">GRAVIDADE</p>
                  <div className="mt-1">
                    <BadgeGravidade gravidade={selecionado.gravidade} />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">DESCRIÇÃO</p>
                <p className="text-sm text-gray-700 mt-2">{selecionado.descricao}</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelecionado(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-sm transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    handleAbrirA3(selecionado);
                    setSelecionado(null);
                  }}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm transition-colors"
                >
                  Criar A3
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}