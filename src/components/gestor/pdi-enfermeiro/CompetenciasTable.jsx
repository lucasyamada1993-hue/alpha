import { Trash2, Edit2, Eye, EyeOff, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = {
  "Competências Clínicas e Assistenciais Avançadas (Hard Skills)": "bg-blue-50 border-blue-200",
  "Gestão da Qualidade e Segurança do Paciente (Padrão ONA)": "bg-emerald-50 border-emerald-200",
  "Proteção Radiológica e Biossegurança": "bg-amber-50 border-amber-200",
  "Liderança, Comportamento e Experiência do Paciente (Soft Skills)": "bg-purple-50 border-purple-200",
};

export default function CompetenciasTable({
  competencias,
  onEdit,
  onDelete,
  onToggleStatus,
  onReorder,
}) {
  const grouped = Object.entries(competencias).reduce((acc, [categoria, items]) => {
    acc[categoria] = items;
    return acc;
  }, {});

  const handleDragStart = (e, index, categoria) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify({ index, categoria }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, toIndex, toCategoria) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (data.categoria === toCategoria && data.index !== toIndex) {
      onReorder(data.index, toIndex);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Competências Cadastradas</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {Object.entries(grouped).map(([categoria, items]) => (
          <div key={categoria}>
            <div className={cn("px-6 py-3 font-semibold text-sm text-gray-700 bg-gray-50", COLORS[categoria])}>
              {categoria} ({items.length})
            </div>

            {items.length === 0 ? (
              <div className="px-6 py-4 text-center text-xs text-gray-400">
                Nenhuma competência nesta categoria
              </div>
            ) : (
              items.map((comp, idx) => (
                <div
                  key={comp.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx, categoria)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx, categoria)}
                  className="px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-move flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <GripVertical className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{comp.nome}</p>
                      <p className="text-xs text-gray-500 mt-1">{comp.descricao}</p>
                      {comp.exemplos && (
                        <p className="text-xs text-gray-400 mt-1 italic">Exemplos: {comp.exemplos}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onToggleStatus(comp.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={comp.ativa ? "Desativar" : "Ativar"}
                    >
                      {comp.ativa ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onEdit(comp)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(comp.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}