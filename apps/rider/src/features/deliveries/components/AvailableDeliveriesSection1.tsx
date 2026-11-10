import { useText } from '@senik/i18n';
import type { useAvailableDeliveries } from '../hooks/useAvailableDeliveries';

type Props = {
  loadDeliveries: ReturnType<typeof useAvailableDeliveries>['loadDeliveries'];
};
export function AvailableDeliveriesSection1({ loadDeliveries }: Props) {
  const text = useText();
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="font-display font-bold text-title-lg text-on-surface">
          {text('Available Jobs')}
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          {text('Orders ready for pickup near you')}
        </p>
      </div>
      <button
        type="button"
        onClick={() => void loadDeliveries()}
        className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-level-1 flex items-center justify-center text-primary active:scale-95 transition-all shrink-0"
        aria-label={text('Refresh jobs')}
      >
        <span className="material-symbols-outlined text-[19px]">refresh</span>
      </button>
    </div>
  );
}
