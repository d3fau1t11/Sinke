import { useText } from '@senik/i18n';
import { Card } from '@senik/ui';
import { useNotificationPreferences } from './hooks/useNotificationPreferences';

export function NotificationPreferencesScreen() {
  const text = useText();
  const model = useNotificationPreferences();
  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="font-display font-bold text-xl text-on-surface">
        {text('Notification Preferences')}
      </h1>
      <Card padding="lg" className="space-y-4">
        <label className="flex justify-between text-on-surface">
          {text('Order updates')}
          <input
            type="checkbox"
            checked={model.orderUpdates}
            disabled={model.pending}
            onChange={(event) => void model.setOrderUpdates(event.target.checked)}
          />
        </label>
        <label className="flex justify-between text-on-surface">
          {text('Offers & promotions')}
          <input
            type="checkbox"
            checked={model.offers}
            disabled={!model.demo}
            onChange={(event) => model.setPreference('offers', event.target.checked)}
          />
        </label>
        <p className="text-sm text-on-surface-variant">
          {text(
            model.demo
              ? 'Preferences are saved on this device. Demo mode does not send notifications.'
              : 'Order notifications require Android permission. Promotional notifications are not available yet.',
          )}
        </p>
        {model.error && <p role="alert">{text(model.error)}</p>}
      </Card>
    </div>
  );
}
