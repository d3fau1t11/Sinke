import React from "react";

const STEPS = ["Accepted", "Picked Up", "Delivered"] as const;

/**
 * Delivery progress: done steps fill terracotta, the current step is ringed,
 * upcoming steps stay neutral. (Terracotta = process, green = money only.)
 */
export function StepIndicator({ step }: { step: 0 | 1 | 2 }) {
  return (
    <div
      className="flex items-center justify-center gap-0"
      role="list"
      aria-label="Delivery progress"
    >
      {STEPS.map((label, idx) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center" role="listitem">
            <div
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-body-sm font-bold transition-all ${
                idx < step
                  ? "bg-primary border-primary text-on-primary"
                  : idx === step
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-surface-container-lowest border-outline-variant text-on-surface-variant"
              }`}
            >
              {idx < step ? (
                <span className="material-symbols-outlined text-[18px] fill-icon">
                  check
                </span>
              ) : (
                idx + 1
              )}
            </div>
            <span
              className={`text-micro font-semibold mt-1.5 ${
                idx === step ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`w-12 h-0.5 mb-5 mx-1 transition-all ${
                idx < step ? "bg-primary" : "bg-outline-variant"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
