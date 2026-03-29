import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** labels: títulos dos passos (ex.: steps.map(s => s.title)) */
export default function SurveyStepIndicator({ currentStep, labels }) {
  const totalSteps = labels.length;

  return (
    <div className="w-full px-2 py-3 sm:px-4">
      <div
        className="mx-auto grid w-full max-w-5xl gap-0"
        style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}
      >
        {labels.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="relative flex min-w-0 flex-col items-center">
              {/* Faixa do círculo + metades das linhas (grid equal-width) */}
              <div className="relative flex h-9 w-full items-center justify-center">
                {index > 0 && (
                  <div
                    className={cn(
                      "absolute left-0 top-1/2 z-0 h-0.5 w-1/2 -translate-y-1/2 rounded-full",
                      index - 1 < currentStep ? "bg-secondary" : "bg-muted"
                    )}
                    aria-hidden
                  />
                )}
                {index < totalSteps - 1 && (
                  <div
                    className={cn(
                      "absolute right-0 top-1/2 z-0 h-0.5 w-1/2 -translate-y-1/2 rounded-full",
                      index < currentStep ? "bg-secondary" : "bg-muted"
                    )}
                    aria-hidden
                  />
                )}
                <div
                  className={cn(
                    "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                    isCompleted && "scale-90 bg-secondary text-secondary-foreground",
                    isCurrent &&
                      "scale-110 bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : String(index + 1)}
                </div>
              </div>

              <span
                className={cn(
                  "mt-1.5 flex min-h-[2.75rem] w-full items-start justify-center px-0.5 text-center text-[9px] font-medium leading-tight transition-colors sm:text-[10px]",
                  isCurrent ? "text-primary" : isCompleted ? "text-secondary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
