import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Star, ThumbsUp, Minus, ThumbsDown } from "lucide-react";

const RATING_CONFIG = {
  "Ótimo": { icon: Star, colorClass: "border-emerald-400 bg-emerald-50 text-emerald-700", activeClass: "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200" },
  "Bom": { icon: ThumbsUp, colorClass: "border-sky-400 bg-sky-50 text-sky-700", activeClass: "border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-200" },
  "Regular": { icon: Minus, colorClass: "border-amber-400 bg-amber-50 text-amber-700", activeClass: "border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-200" },
  "Ruim": { icon: ThumbsDown, colorClass: "border-rose-400 bg-rose-50 text-rose-700", activeClass: "border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-200" },
};

export default function RatingButton({ value, selected, onSelect }) {
  const config = RATING_CONFIG[value];
  if (!config) return null;
  const Icon = config.icon;
  const isActive = selected === value;

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      onClick={() => onSelect(value)}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 min-w-[80px] cursor-pointer",
        isActive ? config.activeClass : config.colorClass
      )}
    >
      <Icon className="w-7 h-7" />
      <span className="text-sm font-semibold">{value}</span>
    </motion.button>
  );
}