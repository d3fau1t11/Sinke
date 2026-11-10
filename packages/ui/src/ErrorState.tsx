import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

export interface ErrorStateProps {
  title?: string;
  titleAm?: string;
  message?: string;
  messageAm?: string;
  actionLabel?: string;
  actionLabelAm?: string;
  onAction?: (() => void) | null | undefined;
  icon?: React.ReactNode;
  className?: string;
  /** Translation function */
  t: (key: string) => string;
  /** Whether the current language is Amharic */
  isAm: boolean;
}

export function ErrorState({
  title,
  titleAm,
  message,
  messageAm,
  actionLabel,
  actionLabelAm,
  onAction,
  icon,
  className,
  t: _t,
  isAm,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4 py-8 space-y-4',
        className,
      )}
      role="alert"
    >
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error">
        {icon || <span className="material-symbols-outlined text-[32px]">error_outline</span>}
      </div>
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
