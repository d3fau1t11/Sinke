import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

export interface EmptyStateProps {
  title?: string;
  titleAm?: string;
  message?: string;
  messageAm?: string;
  actionLabel?: string;
  actionLabelAm?: string;
  onAction?: (() => void) | null | undefined;
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
  className?: string;
  /** Translation function */
  t: (key: string) => string;
  /** Whether the current language is Amharic */
  isAm: boolean;
}

export function EmptyState({
  title,
  titleAm,
  message,
  messageAm,
  actionLabel,
  actionLabelAm,
  onAction,
  icon,
  illustration,
  className,
  t: _t,
  isAm,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4 py-10 space-y-4',
        className,
      )}
    >
      {illustration ? (
        <div className="text-on-surface-variant/30">{illustration}</div>
      ) : (
        <div className="w-20 h-20 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant/40">
          {icon || <span className="material-symbols-outlined text-[40px]">inbox</span>}
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-title-lg font-bold text-on-surface">
          {isAm ? titleAm || title : title}
        </h3>
        <p className="text-body-md text-on-surface-variant max-w-sm">
          {isAm ? messageAm || message : message}
        </p>
      </div>
      {onAction && actionLabel && (
        <Button variant="primary" onClick={onAction} size="lg">
          {isAm ? actionLabelAm || actionLabel : actionLabel}
        </Button>
      )}
    </div>
  );
}
