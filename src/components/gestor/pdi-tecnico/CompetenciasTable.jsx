import { useState } from "react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIA_COLORS = {
  "Competências Técnicas Assistenciais": "bg-blue-50 text-blue-700 border-l-blue-500",
  "Qualidade e Segurança do Paciente": "bg-emerald-50 text-emerald-700 border-l-emerald-500",
  "Proteção Radiológica e Biossegurança": "bg-amber-50 text-amber-700 border-l-amber-500",
  "Competências Comportamentais": "bg-purple-50 text-purple-700 border-l-purple-500",
};

export default function CompetenciasTable({ competencias, onEdit, onDelete, onToggleStatus, onReorder }) {
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const handleDragStart = (index) => setDragging(index);
  const handleDragOver = (e, index) => { e.preventDefault(); setDragOver(index); };
  const handleDrop = (index) => {
    if (dragging !== null && dragging !== index) onReorder(dragging, index);
    setDragging(null);
    setDragOver(null);
  };
  const handleDragEnd = () => { setDragging(null); setDragOver(null); };

  const categorias = [];
  const grouped = {};
  competencias.forEach((c) => {
    if (!grouped[c.categoria]) {
      grouped[c.categoria] = [];
      categorias.push(c.categoria);
    }
    grouped[c.categoria].push(c);
  });

  const activeCount = competencias.filter((c) => c.ativa).length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Competências do PDI</h3>
          <p className="text-xs text-gray-400 mt-0.5">{competencias.length} competência(s) · Arraste para reordenar</p>
        </div>
        <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full">
          {activeCount} ativas
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left w-10"></th>
              <th className="px-4 py-3 text-left w-12">Ord.</th>
              <th className="px-4 py-3 text-left">Competência</th>
              <th className="px-4 py-3 text-left">Descrição</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => {
              const items = grouped[categoria];
              const colorClass = CATEGORIA_COLORS[categoria] || "bg-gray-50";
              return (
                <>
                  <tr key={`cat-${categoria}`}>
                    <td colSpan={6} className={cn("px-4 pt-4 pb-2 border-l-4", colorClass.split(" ").find(c => c.startsWith("border-l")))}>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#0D47A1] uppercase tracking-widest">{categoria}</span>
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400">{items.filter(c => c.ativa).length}/{items.length} ativas</span>
                      </div>
                    </td>
                  </tr>

                  {items.map((item) => {
                    const index = competencias.findIndex((c) => c.id === item.id);
                    return (
                      <tr
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "border-t border-gray-50 group transition-colors",
                          !item.ativa && "opacity-50",
                          dragging === index && "opacity-40",
                          dragOver === index && dragging !== index && "bg-blue-50 border-t-2 border-blue-400"
                        )}
                      >
                        <td className="px-4 py-3.5">
                          <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-400 cursor-grab" />
                        </td>
                        <td className="px-4 py-3.5 font-bold text-gray-400 text-xs">{item.ordem}</td>
                        <td className="px-4 py-3.5 text-gray-700 text-xs font-semibold max-w-xs">{item.nome}</td>
                        <td className="px-4 py-3.5 text-gray-600 text-xs max-w-sm leading-snug">{item.descricao.substring(0, 60)}...</td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => onToggleStatus(item.id)}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-semibold transition-colors",
                              item.ativa
                                ? "bg-green-50 text-green-600 hover:bg-green-100"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            )}
                          >
                            {item.ativa ? "Ativa" : "Inativa"}
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(item.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}