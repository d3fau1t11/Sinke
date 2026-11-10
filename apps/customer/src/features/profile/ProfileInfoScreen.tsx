import { useText } from '@senik/i18n';
import { Card } from '@senik/ui';

export function ProfileInfoScreen({ page }: { page: 'help' | 'about' }) {
  const text = useText();
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card padding="lg" className="space-y-4">
        <h1 className="font-display font-bold text-xl text-on-surface">
          {page === 'help' ? text('Help & Support') : text('About Senik')}
        </h1>
        {page === 'help' ? (
          <>
            <p className="text-on-surface">
              {text(
                'Choose an area, open a restaurant, add dishes to your cart, and place an order.',
              )}
            </p>
            <p className="text-on-surface-variant">
              {text(
                'In demo mode, use “Simulate next step” on the tracking page to follow a delivery. “Reset demo” restores the sample data.',
              )}
            </p>
            <p className="text-on-surface-variant">
              {text(
                'For real orders, your assigned rider’s contact details appear on the tracking page.',
              )}
            </p>
          </>
        ) : (
          <>
            <p className="text-on-surface">
              {text('Senik connects customers, neighborhood restaurants, and delivery riders.')}
            </p>
            <p className="text-on-surface-variant">{text('Customer app · Version 1.0.0')}</p>
            <p className="text-on-surface-variant">
              {text('Demo orders and payments use sample data saved on your device.')}
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
