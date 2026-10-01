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
  isAm
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4 py-8 space-y-4',
        className
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

export function NetworkError({ onRetry, t, isAm }: { onRetry?: () => void; t: (key: string) => string; isAm: boolean }) {
  return (
    <ErrorState
      t={t}
      isAm={isAm}
      title={isAm ? 'አገናኝታ የለም' : 'No Connection'}
      titleAm="አገናኝታ የለም"
      message={isAm ? 'የኢንተርኔት አገናኝታዎን ያረጋግጡ እንደገና ይሞክሩ' : 'Check your internet connection and try again'}
      messageAm="የኢንተርኔት አገናኝታዎን ያረጋግጡ እንደገና ይሞክሩ"
      actionLabel={isAm ? 'እንደገና ይሞክር' : 'Try Again'}
      actionLabelAm="እንደገና ይሞክር"
      onAction={onRetry}
      icon={<span className="material-symbols-outlined text-[32px]">wifi_off</span>}
    />
  );
}

export function ServerError({ onRetry, t, isAm }: { onRetry?: () => void; t: (key: string) => string; isAm: boolean }) {
  return (
    <ErrorState
      t={t}
      isAm={isAm}
      title={isAm ? 'ስህተት ተከስቷል' : 'Something Went Wrong'}
      titleAm="ስህተት ተከስቷል"
      message={isAm ? 'ሰርቨሩ አሁን የለበት ነው። እባክዎ ዕድል በኋላ ይሞክሩ' : 'Server is unavailable. Please try again later'}
      messageAm="ሰርቨሩ አሁን የለበት ነው። እባክዎ ዕድል በኋላ ይሞክሩ"
      actionLabel={isAm ? 'እንደገና ይሞክር' : 'Retry'}
      actionLabelAm="እንደገና ይሞክር"
      onAction={onRetry}
    />
  );
}

export function NotFoundError({ onGoBack, t, isAm }: { onGoBack?: () => void; t: (key: string) => string; isAm: boolean }) {
  return (
    <ErrorState
      t={t}
      isAm={isAm}
      title={isAm ? 'ሳይተገኝ' : 'Not Found'}
      titleAm="ሳይተገኝ"
      message={isAm ? 'ፈለግተውን ገጽ ወይም እቃ አልተገኘም' : 'The page or item you\'re looking for doesn\'t exist'}
      messageAm="ፈለግተውን ገጽ ወይም እቃ አልተገኘም"
      actionLabel={isAm ? 'ወደ መነሻ ተመለስ' : 'Go Home'}
      actionLabelAm="ወደ መነሻ ተመለስ"
      onAction={onGoBack}
      icon={<span className="material-symbols-outlined text-[32px]">search_off</span>}
    />
  );
}

export function PermissionError({ onGoBack, t, isAm }: { onGoBack?: () => void; t: (key: string) => string; isAm: boolean }) {
  return (
    <ErrorState
      t={t}
      isAm={isAm}
      title={isAm ? 'አስተሳሰብ የለዎትም' : 'Access Denied'}
      titleAm="አስተሳሰብ የለዎትም"
      message={isAm ? 'ይህን ገጽ ማየት አይችሉም' : 'You don\'t have permission to view this page'}
      messageAm="ይህን ገጽ ማየት አይችሉም"
      actionLabel={isAm ? 'ወደ መነሻ ተመለስ' : 'Go Home'}
      actionLabelAm="ወደ መነሻ ተመለስ"
      onAction={onGoBack}
      icon={<span className="material-symbols-outlined text-[32px]">lock</span>}
    />
  );
}