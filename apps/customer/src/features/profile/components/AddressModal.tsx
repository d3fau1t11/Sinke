import { useText } from '@senik/i18n';
import { Button, Input, Textarea } from '@senik/ui';

interface AddressModalProps {
  visible: boolean;
  form: { label: string; full_address: string; landmark: string };
  onChange: (form: AddressModalProps['form']) => void;
  onClose: () => void;
  onSave: () => void;
  pending: boolean;
  error: string;
}

export function AddressModal({
  visible,
  form,
  onChange,
  onClose,
  onSave,
  pending,
  error,
}: AddressModalProps) {
  const text = useText();
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-label={text('Save address')}
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="font-bold text-lg text-on-surface">{text('Delivery Address')}</h2>
        <Input
          label={text('Label')}
          value={form.label}
          onChange={(event) => onChange({ ...form, label: event.target.value })}
          required
        />
        <Textarea
          label={text('Full Address')}
          value={form.full_address}
          onChange={(event) => onChange({ ...form, full_address: event.target.value })}
          required
        />
        <Input
          label={text('Landmark')}
          value={form.landmark}
          onChange={(event) => onChange({ ...form, landmark: event.target.value })}
        />
        {error && (
          <p className="text-error text-sm" role="alert">
            {text(error ?? '')}
          </p>
        )}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            {text('Cancel')}
          </Button>
          <Button type="submit" loading={pending}>
            {text('Save Address')}
          </Button>
        </div>
      </form>
    </div>
  );
}
