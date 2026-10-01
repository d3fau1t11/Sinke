import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  dismissToast: (id: string) => void;
  t: (key: string) => string;
  isAm: boolean;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
  t: (key: string) => string;
  isAm: boolean;
}

export function ToastProvider({ children, t, isAm }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = React.useCallback((message: string, type: ToastMessage['type'] = 'success', duration = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => dismissToast(id), duration);
    }
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast, t, isAm }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} t={t} isAm={isAm} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

function ToastContainer({ toasts, onDismiss, t: _t, isAm }: { toasts: ToastMessage[]; onDismiss: (id: string) => void; t: (key: string) => string; isAm: boolean }) {
  if (toasts.length === 0) return null;

  const typeStyles = {
    success: 'bg-secondary text-on-secondary',
    error: 'bg-error text-on-error',
    warning: 'bg-tertiary text-on-tertiary',
    info: 'bg-primary text-on-primary'
  };

  const typeIcons = {
    success: <span className="material-symbols-outlined">check_circle</span>,
    error: <span className="material-symbols-outlined">error</span>,
    warning: <span className="material-symbols-outlined">warning</span>,
    info: <span className="material-symbols-outlined">info</span>
  };

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-50 flex flex-col-reverse gap-2 pointer-events-none safe-area-bottom"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto animate-slide-up',
            typeStyles[toast.type || 'success'],
            'px-4 py-3 rounded-2xl shadow-level-3 flex items-center gap-3 max-w-md'
          )}
          role="alert"
        >
          <span className="flex-shrink-0">{typeIcons[toast.type || 'success']}</span>
          <p className="text-body-md font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
            aria-label={isAm ? 'ዝጋ' : 'Dismiss'}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export function Toast({ message, type = 'success', onDismiss, t: _t, isAm }: { message: string; type?: ToastMessage['type']; onDismiss: () => void; t: (key: string) => string; isAm: boolean }) {
  const typeStyles = {
    success: 'bg-secondary text-on-secondary',
    error: 'bg-error text-on-error',
    warning: 'bg-tertiary text-on-tertiary',
    info: 'bg-primary text-on-primary'
  };

  return (
    <div className={`${typeStyles[type]} px-4 py-3 rounded-2xl shadow-level-3 flex items-center gap-3 animate-slide-up`} role="alert">
      <span className="material-symbols-outlined">{type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'check_circle'}</span>
      <p className="text-body-md font-medium flex-1">{message}</p>
      <button onClick={onDismiss} className="p-1 rounded-full hover:bg-black/10" aria-label={isAm ? 'ዝጋ' : 'Dismiss'}>
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>
  );
}