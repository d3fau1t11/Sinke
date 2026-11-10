import { useText } from '@senik/i18n';
interface Payout {
  id: string;
  amount: number;
  method: string;
  status: string;
  requestedAt: string;
}

export function PayoutHistory({ payouts }: { payouts: Payout[] }) {
  const text = useText();
  return (
    <section className="rounded-2xl bg-white p-4 shadow-level-1 space-y-3">
      <h2 className="font-bold text-on-surface">{text('Withdrawal History')}</h2>
      {payouts.length === 0 ? (
        <p className="text-sm text-on-surface-variant">{text('No withdrawals yet.')}</p>
      ) : (
        payouts.map((payout) => (
          <div key={payout.id} className="flex items-center justify-between gap-3 border-t pt-3">
            <div>
              <p className="font-bold text-on-surface uppercase">{payout.method}</p>
              <p className="text-xs text-on-surface-variant">
                {new Date(payout.requestedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-secondary">
                −{payout.amount} {text('ETB')}
              </p>
              <p className="text-xs text-on-surface-variant capitalize">
                {text(payout.status ?? '')}
              </p>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
