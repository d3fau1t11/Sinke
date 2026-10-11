import React from "react";

export type PipelineTone = "primary" | "progress" | "success" | "neutral";

interface PipelineTileProps {
  label: string;
  count: number;
  helper: string;
  icon: string;
  tone: PipelineTone;
  onClick: () => void;
}

const TONE_STYLES: Record<
  PipelineTone,
  { chip: string; count: string; dot: string }
> = {
  primary: {
    chip: "bg-primary/10 text-primary",
    count: "text-primary",
    dot: "bg-primary",
  },
  progress: {
    chip: "bg-tertiary-fixed/60 text-tertiary",
    count: "text-tertiary",
    dot: "bg-tertiary-container",
  },
  success: {
    chip: "bg-secondary/10 text-secondary",
    count: "text-secondary",
    dot: "bg-secondary",
  },
  neutral: {
    chip: "bg-surface-container-highest text-on-surface-variant",
    count: "text-on-surface",
    dot: "bg-outline",
  },
};

/**
 * One tile of the order pipeline (Incoming → Preparing → Ready → Completed).
 * Tappable: deep-links into the Orders screen filtered to that status.
 */
export function PipelineTile({
  label,
  count,
  helper,
  icon,
  tone,
  onClick,
}: PipelineTileProps) {
  const styles = TONE_STYLES[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${count} ${label} orders — open filtered list`}
      className="text-left bg-surface-container-lowest rounded-2xl shadow-level-1 p-4 hover:shadow-level-2 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-center justify-between">
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center ${styles.chip}`}
        >
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </span>
        <span className={`w-2 h-2 rounded-full ${styles.dot}`} aria-hidden="true" />
      </div>
      <p className="text-micro font-bold uppercase tracking-[0.05em] text-on-surface-variant mt-3">
        {label}
      </p>
      <p
        className={`font-display font-black text-display leading-none mt-1 tabular-nums ${styles.count}`}
      >
        {count}
      </p>
      <p className="text-label-sm text-on-surface-variant/80 mt-1">{helper}</p>
    </button>
  );
}
