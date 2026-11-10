import { useText } from '@senik/i18n';
import { WithdrawalFields } from './WithdrawalFields';
import { Button } from './Button';

import type { WithdrawalSheetProps } from './withdrawalTypes';
export type { WithdrawalForm, WithdrawalSheetProps } from './withdrawalTypes';

export function WithdrawalSheet({
  visible,
  balance,
  form,
  onChange,
  onSubmit,
  onClose,
  error,
  reference,
}: WithdrawalSheetProps) {
  const text = useText();
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-label={text('Demo withdrawal')}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="w-full max-w-md rounded-3xl bg-white p-6 space-y-4"
      >
        <h2 className="font-display font-bold text-xl text-on-surface">
          {reference ? text('Demo withdrawal recorded') : text('Request Demo Withdrawal')}
        </h2>
        <p className="text-sm text-on-surface-variant">
          {text('This is a simulation. No money is transferred.')}
        </p>
        {reference ? (
          <>
            <p className="font-mono text-primary">
              {text('Reference:')} {reference}
            </p>
            <Button fullWidth onClick={onClose}>
              {text('Done')}
            </Button>
          </>
        ) : (
          <>
            <p className="font-bold text-secondary">
              {text('Available:')} {balance} {text('ETB')}
            </p>
            <WithdrawalFields {...{ form, onChange, balance }} />
            {error && (
              <p className="text-error text-sm" role="alert">
                {text(error ?? '')}
              </p>
            )}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose}>
                {text('Cancel')}
              </Button>
              <Button type="submit">{text('Record Demo Withdrawal')}</Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
