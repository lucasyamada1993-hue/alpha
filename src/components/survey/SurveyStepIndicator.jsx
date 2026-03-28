import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** labels: títulos reais dos passos da pesquisa (ex.: steps.map(s => s.title)) */
export default function SurveyStepIndicator({ currentStep, labels }) {
  const totalSteps = labels.length;
  return (
    <div className="w-full px-4 py-3">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {labels.map((label, index) => {
          const step = { label, short: String(index + 1) };
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                    isCompleted && "bg-secondary text-secondary-foreground scale-90",
                    isCurrent && "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.short}
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 font-medium transition-colors hidden sm:block",
                    isCurrent ? "text-primary" : isCompleted ? "text-secondary" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div className="flex-1 mx-1">
                  <div
                    className={cn(
                      "h-0.5 rounded-full transition-all duration-500",
                      index < currentStep ? "bg-secondary" : "bg-muted"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}