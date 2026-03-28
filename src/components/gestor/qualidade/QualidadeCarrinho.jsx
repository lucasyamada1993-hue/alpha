import { useState } from "react";
import { Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const CARRINHOS_INICIAL = [
  {
    id: 1,
    carrinho: "RM 01",
    dataConferencia: "2026-03-25",
    dataAbertura: "2026-03-25",
    novoLacre: "#5847",
    status: "Conforme",
    vencidosRemovidos: 2,
    medicamentosRemovidos: ["Adrenalina 1mg/ml (3 unidades)", "Amiodarona 150mg/3ml (2 unidades)"],
  },
  {
    id: 2,
    carrinho: "TC 01",
    dataConferencia: "2026-03-24",
    dataAbertura: "2026-03-24",
    novoLacre: "#5846",
    status: "Conforme",
    vencidosRemovidos: 0,
    medicamentosRemovidos: [],
  },
  {
    id: 3,
    carrinho: "Sala Preparo 01",
    dataConferencia: "2026-03-20",
    dataAbertura: "2026-03-20",
    novoLacre: "#5840",
    status: "Não Conforme",
    vencidosRemovidos: 1,
    medicamentosRemovidos: ["Flumazenil 0,1mg/ml (1 unidade)"],
  },
  {
    id: 4,
    carrinho: "RM 02",
    dataConferencia: "2026-03-15",
    dataAbertura: "2026-03-15",
    novoLacre: "#5835",
    status: "Conforme",
    vencidosRemovidos: 0,
    medicamentosRemovidos: [],
  },
];

function BadgeStatus({ status }) {
  const colors = {
    Conforme: "bg-green-50 text-green-700 border-green-200",
    "Não Conforme": "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full border", colors[status])}>
      {status}
    </span>
  );
}

export default function QualidadeCarrinho() {
  const [carrinhos, setCarrinhos] = useState(CARRINHOS_INICIAL);
  const [selecionado, setSelecionado] = useState(null);

  const handleDeletar = (id) => {
    if (confirm("Tem certeza que deseja deletar?")) {
      setCarrinhos(carrinhos.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">Histórico de Carrinhos de Emergência</h2>
          <p className="text-xs text-gray-500 mt-1">Conferência mensal com data de abertura, medicamentos vencidos removidos e número do novo lacre</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Carrinho</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Data Conferência</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Data Abertura</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">Novo Lacre</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 text-xs">Vencidos Removidos</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 text-xs">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 text-xs">Ações</th>
              </tr>
            </thead>
            <tbody>
              {carrinhos.map((carrinho) => (
                <tr key={carrinho.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelecionado(carrinho)}
                      className="font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      {carrinho.carrinho}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{carrinho.dataConferencia}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{carrinho.dataAbertura}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                      {carrinho.novoLacre}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-full",
                      carrinho.vencidosRemovidos > 0 
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    )}>
                      {carrinho.vencidosRemovidos}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <BadgeStatus status={carrinho.status} />
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button
                      onClick={() => setSelecionado(carrinho)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletar(carrinho.id)}
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

        {carrinhos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum carrinho conferido
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Carrinho: {selecionado.carrinho}</h3>
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
                  <p className="text-xs text-gray-500 font-semibold">DATA CONFERÊNCIA</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{selecionado.dataConferencia}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">DATA ABERTURA</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{selecionado.dataAbertura}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">NOVO LACRE</p>
                  <p className="text-sm font-mono font-bold bg-gray-100 text-gray-800 mt-1 px-2 py-1 rounded inline-block">
                    {selecionado.novoLacre}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">STATUS</p>
                  <div className="mt-1">
                    <BadgeStatus status={selecionado.status} />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-semibold mb-2">MEDICAMENTOS VENCIDOS REMOVIDOS</p>
                {selecionado.medicamentosRemovidos.length > 0 ? (
                  <ul className="space-y-1">
                    {selecionado.medicamentosRemovidos.map((med, idx) => (
                      <li key={idx} className="text-sm text-gray-700 bg-red-50 p-2 rounded border border-red-100">
                        • {med}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 bg-green-50 p-2 rounded border border-green-100">
                    Nenhum medicamento vencido
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelecionado(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-sm transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}