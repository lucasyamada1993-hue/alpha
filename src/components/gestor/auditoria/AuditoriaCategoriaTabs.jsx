import { cn } from "@/lib/utils";
import { Shield, FileText, Wrench, Smile } from "lucide-react";

const ICON_MAP = {
  shield: Shield,
  file: FileText,
  tool: Wrench,
  smile: Smile,
};

const COR_MAP = {
  blue: { active: "bg-blue-600 text-white shadow-blue-200", dot: "bg-blue-500" },
  violet: { active: "bg-violet-600 text-white shadow-violet-200", dot: "bg-violet-500" },
  amber: { active: "bg-amber-500 text-white shadow-amber-200", dot: "bg-amber-500" },
  emerald: { active: "bg-emerald-600 text-white shadow-emerald-200", dot: "bg-emerald-500" },
};

function getProgresso(categoria, avaliacoes) {
  const total = categoria.itens.length;
  const avaliados = categoria.itens.filter((i) => avaliacoes[i.id]).length;
  return { total, avaliados };
}

export default function AuditoriaCategoriaTabs({ categorias, ativa, onSelect, avaliacoes }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {categorias.map((cat) => {
        const Icon = ICON_MAP[cat.icon] || FileText;
        const isAtiva = cat.id === ativa;
        const { total, avaliados } = getProgresso(cat, avaliacoes);
        const cor = COR_MAP[cat.cor] || COR_MAP.blue;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shadow-sm",
              isAtiva
                ? `${cor.active} shadow-md`
                : "bg-white text-gray-500 hover:text-gray-800 border border-gray-100 hover:border-gray-200"
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {cat.label}
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full font-bold ml-1",
              isAtiva ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            )}>
              {avaliados}/{total}
            </span>
          </button>
        );
      })}
    </div>
  );
}