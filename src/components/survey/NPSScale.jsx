import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function NPSScale({ value, onChange, error }) {
  const getColor = (num) => {
    if (num <= 6) return { bg: "bg-rose-500", ring: "ring-rose-300", text: "Detrator" };
    if (num <= 8) return { bg: "bg-amber-500", ring: "ring-amber-300", text: "Neutro" };
    return { bg: "bg-emerald-500", ring: "ring-emerald-300", text: "Promotor" };
  };

  return (
    <div className="space-y-4">
      <p className={cn(
        "text-lg font-semibold text-center",
        error && "text-destructive"
      )}>
        O quanto você confiaria em recomendar a Alphasonic para amigos e familiares?
        {error && <span className="text-destructive text-sm ml-2">*</span>}
      </p>
      <div className="flex justify-center">
        <div className="grid grid-cols-11 gap-2 max-w-lg">
          {Array.from({ length: 11 }, (_, i) => {
            const isSelected = value === i;
            const colors = getColor(i);
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => onChange("nps_recomendacao", i)}
                className={cn(
                  "w-12 h-12 rounded-xl font-bold text-lg transition-all duration-200 border-2 cursor-pointer",
                  isSelected
                    ? `${colors.bg} text-white border-transparent shadow-lg ring-2 ${colors.ring} scale-110`
                    : "bg-card text-foreground border-border hover:border-primary/40"
                )}
              >
                {i}
              </motion.button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground max-w-lg mx-auto px-1">
        <span>Não recomendaria</span>
        <span>Com toda certeza!</span>
      </div>
      {value !== null && value !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className={cn(
            "inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white",
            getColor(value).bg
          )}>
            {value} — {getColor(value).text}
          </span>
        </motion.div>
      )}
    </div>
  );
}