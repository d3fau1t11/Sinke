import { useText } from '@senik/i18n';
interface DemoBannerProps {
  visible: boolean;
  onReset: () => void;
}

export function DemoBanner({ visible, onReset }: DemoBannerProps) {
  const text = useText();
  if (!visible) return null;
  return (
    <aside
      className="flex items-center justify-between gap-3 px-4 py-2 bg-amber-100 text-amber-950 text-xs border-b border-amber-200"
      aria-label={text('Demo mode')}
    >
      <span>
        <strong>{text('Demo mode')}</strong> {text('· Sample data. Payments are simulated.')}
      </span>
      <button type="button" onClick={onReset} className="font-bold underline shrink-0">
        {text('Reset demo')}
      </button>
    </aside>
  );
}
