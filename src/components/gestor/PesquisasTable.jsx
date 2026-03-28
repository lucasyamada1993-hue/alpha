import { useState } from "react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TIPO_COLORS = {
  "Escala Ótimo-Ruim": "bg-blue-50 text-blue-700",
  "Múltipla Escolha": "bg-purple-50 text-purple-700",
  "NPS 0-10": "bg-amber-50 text-amber-700",
  "Texto Aberto": "bg-gray-100 text-gray-600",
};

export default function PesquisasTable({ perguntas, onEdit, onDelete, onToggleStatus, onReorder }) {
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

  // Agrupar por categoria mantendo a ordem global
  const categorias = [];
  const grouped = {};
  perguntas.forEach((p) => {
    if (!grouped[p.categoria]) {
      grouped[p.categoria] = [];
      categorias.push(p.categoria);
    }
    grouped[p.categoria].push(p);
  });

  const activeCount = perguntas.filter((p) => p.status === "Ativo").length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Perguntas da Pesquisa</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {perguntas.length} pergunta{perguntas.length !== 1 ? "s" : ""} · Arraste para reordenar
          </p>
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
              <th className="px-4 py-3 text-left">Pergunta</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria, catIndex) => {
              const items = grouped[categoria];
              return (
                <>
                  {/* Separador de categoria */}
                  <tr key={`cat-${categoria}`}>
                    <td colSpan={6} className={cn("px-4 pt-4 pb-2", catIndex === 0 && "pt-3")}>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#0D47A1] uppercase tracking-widest whitespace-nowrap">
                          {categoria}
                        </span>
                        <div className="flex-1 h-px bg-blue-100" />
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {items.filter(p => p.status === "Ativo").length}/{items.length} ativas
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Linhas das perguntas desta categoria */}
                  {items.map((item) => {
                    const index = perguntas.findIndex((p) => p.id === item.id);
                    return (
                      <tr
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "transition-colors group border-t border-gray-50",
                          item.status === "Inativo" && "opacity-50",
                          dragging === index && "opacity-40",
                          dragOver === index && dragging !== index && "bg-blue-50 border-t-2 border-blue-400"
                        )}
                      >
                        {/* Drag Handle */}
                        <td className="px-4 py-3.5">
                          <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-400 cursor-grab active:cursor-grabbing transition-colors" />
                        </td>

                        {/* Ordem */}
                        <td className="px-4 py-3.5 font-bold text-gray-400 text-xs">{item.ordem}</td>

                        {/* Pergunta */}
                        <td className="px-4 py-3.5 text-gray-700 text-xs max-w-xs leading-relaxed">
                          {item.pergunta}
                        </td>

                        {/* Tipo */}
                        <td className="px-4 py-3.5">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", TIPO_COLORS[item.tipo] || "bg-gray-100 text-gray-600")}>
                            {item.tipo}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => onToggleStatus(item.id)}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-semibold transition-colors",
                              item.status === "Ativo"
                                ? "bg-green-50 text-green-600 hover:bg-green-100"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            )}
                          >
                            {item.status}
                          </button>
                        </td>

                        {/* Ações */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(item.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                              title="Excluir"
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