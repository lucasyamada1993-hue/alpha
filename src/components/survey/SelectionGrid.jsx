import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function SelectionGrid({ title, options, value, fieldName, onChange, icons, error }) {
  return (
    <div className="space-y-4">
      <p className={cn(
        "text-lg font-semibold text-center",
        error && "text-destructive"
      )}>
        {title}
        {error && <span className="text-destructive text-sm ml-2">*</span>}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-2xl mx-auto">
        {options.map((option, idx) => {
          const isSelected = value === option;
          const Icon = icons?.[idx];
          return (
            <motion.button
              key={option}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onChange(fieldName, option)}
              className={cn(
                "flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent"
              )}
            >
              {Icon && <Icon className="w-7 h-7" />}
              <span className="text-sm font-semibold text-center leading-tight">{option}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}