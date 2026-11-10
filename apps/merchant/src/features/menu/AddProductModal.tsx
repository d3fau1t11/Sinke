import { useText } from '@senik/i18n';
import { AddDishFields } from './components/AddDishFields';
import { Button } from '@senik/ui';
import { useAddProduct } from './hooks/useAddProduct';

interface AddProductModalProps {
  businessId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProductModal({ businessId, isOpen, onClose, onSuccess }: AddProductModalProps) {
  const text = useText();
  const { form, setForm, mutation } = useAddProduct(businessId, onSuccess, onClose);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-label={text('Add dish')}
        className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <h2 className="font-display font-bold text-xl text-on-surface">{text('Add Dish')}</h2>
        <AddDishFields {...{ form, setForm }} />
        {mutation.error && (
          <p className="text-error text-sm" role="alert">
            {text(mutation.error.message ?? '')}
          </p>
        )}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={mutation.isPending}>
            {text('Cancel')}
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            {text('Add to Menu')}
          </Button>
        </div>
      </form>
    </div>
  );
}
