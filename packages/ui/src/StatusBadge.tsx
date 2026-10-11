import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

export type StatusTone =
  | 'primary' // incoming / on the way (terracotta)
  | 'progress' // preparing / pending (amber)
  | 'success' // ready / delivered / completed (green)
  | 'neutral' // sold out / cancelled / archived
  | 'danger'; // rejected / failed (red)

const toneStyles: Record<StatusTone, string> = {
  primary: 'bg-primary/10 text-primary',
  progress: 'bg-tertiary-fixed/60 text-tertiary',
  success: 'bg-secondary/10 text-secondary',
  neutral: 'bg-surface-container-highest text-on-surface-variant',
  danger: 'bg-error-container text-on-error-container'
};

export interface StatusBadgeProps {
  tone?: StatusTone;
  children: React.ReactNode;
  /** Show a pulsing live dot (use for active statuses only). */
  dot?: boolean | undefined;
  className?: string;
}

/**
 * Unified status pill — Quiet Luxury token tints, uppercase micro type.
 * Used by merchant (order/payout statuses) and rider (job/withdrawal statuses).
 */
export function StatusBadge({ tone = 'neutral', children, dot = false, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-micro font-bold uppercase tracking-[0.05em] whitespace-nowrap',
        toneStyles[tone],
        className
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" aria-hidden="true" />}
      {children}
    </span>
  );
}
