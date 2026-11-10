import { useLocalizedName } from '@senik/i18n';
import { useText } from '@senik/i18n';
import type { OrderSummary } from '@senik/types';

type Props = { order: OrderSummary };
export function DeliveryCardSection1({ order }: Props) {
  const localizedName = useLocalizedName();
  const text = useText();
  return (
    <div className="space-y-2">
      {/* Pickup */}
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-primary text-[15px]">store</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-micro font-bold text-on-surface-variant uppercase tracking-wide">
            {text('Pickup')}
          </p>
          <p className="font-bold text-body-sm text-on-surface truncate">
            {localizedName(order.business) ?? text('Merchant')}
          </p>
        </div>
      </div>

      {/* Route connector */}
      <div className="ml-3.5 w-px h-4 bg-outline-variant" />

      {/* Dropoff */}
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-tertiary-fixed/50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-tertiary text-[15px]">home_pin</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-micro font-bold text-on-surface-variant uppercase tracking-wide">
            {text('Deliver to')}
          </p>
          <p className="font-bold text-body-sm text-on-surface truncate">
            {order.delivery_address}
          </p>
        </div>
      </div>
    </div>
  );
}
