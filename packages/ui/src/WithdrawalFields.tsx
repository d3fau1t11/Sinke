import { PaymentLogo } from './PaymentLogo';
import { useText } from '@senik/i18n';
import { Input } from './Input';
import type { WithdrawalSheetProps } from './withdrawalTypes';

type Props = Pick<WithdrawalSheetProps, 'form' | 'onChange' | 'balance'>;

export function WithdrawalFields({ form, onChange, balance }: Props) {
  const text = useText();
  return (
    <div className="space-y-4">
      <label className="block text-on-surface text-sm" htmlFor="withdrawal-method">
        {text('Payment Method')}
      </label>
      <select
        id="withdrawal-method"
        className="w-full border rounded-xl p-3 text-on-surface"
        value={form.method}
        onChange={(event) =>
          onChange({
            ...form,
            method: event.target.value === 'cbe' ? 'cbe' : 'telebirr',
          })
        }
      >
        <option value="cbe">{text('CBE Bank')}</option>
        <option value="telebirr">{text('Telebirr')}</option>
      </select>
      <PaymentLogo method={form.method} />
      <Input
        label={text('Amount (ETB)')}
        type="number"
        value={form.amount}
        min="50"
        max={balance}
        onChange={(event) => onChange({ ...form, amount: event.target.value })}
        required
      />
      <Input
        label={text('Demo Account Number')}
        value={form.accountNumber}
        onChange={(event) => onChange({ ...form, accountNumber: event.target.value })}
        placeholder={text('Use sample account details')}
        required
      />
      <Input
        label={text('Demo Account Name')}
        value={form.accountName}
        onChange={(event) => onChange({ ...form, accountName: event.target.value })}
        required
      />
    </div>
  );
}
