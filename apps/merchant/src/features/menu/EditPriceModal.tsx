import { useLocalizedName } from '@senik/i18n';
import { useText } from '@senik/i18n';
import { Button, Input } from '@senik/ui';
import type { ProductWithOptions } from '@senik/types';
import { DishPhotoPicker } from './DishPhotoPicker';
import { useEditProduct } from './hooks/useEditProduct';

interface EditPriceModalProps {
  product: ProductWithOptions | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPriceModal({ product, isOpen, onClose, onSuccess }: EditPriceModalProps) {
  const localizedName = useLocalizedName();
  const text = useText();
  const { price, setPrice, image, setImage, mutation } = useEditProduct(
    product,
    onSuccess,
    onClose,
  );
  if (!isOpen || !product) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-label={text('Edit dish')}
        className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <h2 className="font-display font-bold text-xl text-on-surface">
          {text('Edit')} {localizedName(product)}
        </h2>
        <Input
          label={text('Price (ETB)')}
          type="number"
          min="1"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />
        <DishPhotoPicker imageUrl={image} onChange={setImage} />
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
            {text('Save Changes')}
          </Button>
        </div>
      </form>
    </div>
  );
}
