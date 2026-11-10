import { useText } from '@senik/i18n';
type ToastMessage = { type?: 'success' | 'error' | 'warning' | 'info' };

export function Toast({
  message,
  type = 'success',
  onDismiss,
  t: _t,
  isAm,
}: {
  message: string;
  type?: ToastMessage['type'];
  onDismiss: () => void;
  t: (key: string) => string;
  isAm: boolean;
}) {
  const text = useText();
  const typeStyles = {
    success: 'bg-secondary text-on-secondary',
    error: 'bg-error text-on-error',
    warning: 'bg-tertiary text-on-tertiary',
    info: 'bg-primary text-on-primary',
  };

  return (
    <div
      className={`${typeStyles[type]} px-4 py-3 rounded-2xl shadow-level-3 flex items-center gap-3 animate-slide-up`}
      role="alert"
    >
      <span className="material-symbols-outlined">
        {type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'check_circle'}
      </span>
      <p className="text-body-md font-medium flex-1">{text(message ?? '')}</p>
      <button
        onClick={onDismiss}
        className="p-1 rounded-full hover:bg-black/10"
        aria-label={isAm ? 'ዝጋ' : 'Dismiss'}
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>
  );
}
