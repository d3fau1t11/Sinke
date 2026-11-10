import { useText } from '@senik/i18n';
import { useRiderHeader } from './hooks/useRiderHeader';
import { formatETB } from '@senik/utils';
import { SenikLogo } from '@senik/ui';

export function RiderHeader() {
  const text = useText();
  const { riderName, isOnline, balance, logout, toggleOnline, pending, error } = useRiderHeader();
  return (
    <header className="bg-surface sticky top-0 z-20 border-b border-outline-variant">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <SenikLogo size="md" />
          <div className="min-w-0">
            <h1 className="font-display font-bold text-title-sm text-on-surface leading-tight truncate">
              {riderName || text('Rider')}
            </h1>
            <button
              type="button"
              onClick={() => void toggleOnline()}
              disabled={pending}
              aria-pressed={isOnline}
              className={`inline-flex items-center gap-1.5 text-micro font-bold uppercase tracking-[0.05em] px-2.5 py-1 rounded-full mt-1 transition-colors ${
                isOnline
                  ? 'bg-secondary/10 text-secondary hover:bg-secondary/15'
                  : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-secondary animate-pulse' : 'bg-outline'}`}
              />
              {isOnline ? text('Online') : text('Offline')}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="text-right">
            <p className="text-micro font-bold uppercase tracking-[0.05em] text-on-surface-variant">
              {text('Balance')}
            </p>
            {/* Money is always green */}
            <p className="font-mono font-bold text-body-sm text-secondary tabular-nums">
              {formatETB(balance)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
            aria-label={text('Log out')}
          >
            <span className="material-symbols-outlined text-[19px]">logout</span>
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="px-4 text-error">
          {text(error ?? '')}
        </p>
      )}
      {/* Tibeb accent strip */}
      <div className="h-0.5 tibeb-accent-strip" aria-hidden="true" />
    </header>
  );
}
