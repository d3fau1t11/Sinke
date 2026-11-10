import { useText } from '@senik/i18n';
interface WalletSummaryProps {
  balance: number;
  earned: number;
  pending: number;
}

export function WalletSummary({ balance, earned, pending }: WalletSummaryProps) {
  const text = useText();
  return (
    <section
      className="rounded-3xl bg-gradient-to-br from-secondary to-[#14521c] p-5 text-white shadow-level-3 space-y-4"
      aria-label={text('Wallet summary')}
    >
      <div>
        <p className="text-sm text-white/80">{text('Available Balance')}</p>
        <p className="font-display font-black text-4xl mt-1">
          {balance.toLocaleString()} {text('ETB')}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-3">
        <div>
          <p className="text-sm text-white/80">{text('Lifetime Earned')}</p>
          <p className="font-bold">
            {earned.toLocaleString()} {text('ETB')}
          </p>
        </div>
        <div>
          <p className="text-sm text-white/80">{text('Pending Withdrawals')}</p>
          <p className="font-bold">
            {pending.toLocaleString()} {text('ETB')}
          </p>
        </div>
      </div>
    </section>
  );
}
