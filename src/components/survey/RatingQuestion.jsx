import RatingButton from "./RatingButton";
import { cn } from "@/lib/utils";

const RATINGS = ["Ótimo", "Bom", "Regular", "Ruim"];

export default function RatingQuestion({ question, fieldName, value, onChange, error }) {
  return (
    <div className="space-y-3">
      <p className={cn(
        "text-base font-medium text-foreground leading-relaxed",
        error && "text-destructive"
      )}>
        {question}
        {error && <span className="text-destructive text-sm ml-2">*</span>}
      </p>
      <div className="grid grid-cols-4 gap-3">
        {RATINGS.map((rating) => (
          <RatingButton
            key={rating}
            value={rating}
            selected={value}
            onSelect={(v) => onChange(fieldName, v)}
          />
        ))}
      </div>
    </div>
  );
}