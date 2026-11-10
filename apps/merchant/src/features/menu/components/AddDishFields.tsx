import { useText } from '@senik/i18n';
import { Input } from '@senik/ui';
import { DishPhotoPicker } from '../DishPhotoPicker';
import type { useAddProduct } from '../hooks/useAddProduct';

type Props = Pick<ReturnType<typeof useAddProduct>, 'form' | 'setForm'>;

export function AddDishFields({ form, setForm }: Props) {
  const text = useText();
  return (
    <div className="space-y-4">
      <Input
        label={text('Dish Name (English)')}
        value={form.nameEn}
        onChange={(event) => setForm({ ...form, nameEn: event.target.value })}
        required
      />
      <Input
        label={text('Dish Name (Amharic)')}
        value={form.nameAm}
        onChange={(event) => setForm({ ...form, nameAm: event.target.value })}
        required
      />
      <Input
        label={text('Price (ETB)')}
        type="number"
        min="1"
        value={form.price}
        onChange={(event) => setForm({ ...form, price: event.target.value })}
        required
      />
      <Input
        label={text('Category')}
        value={form.category}
        onChange={(event) => setForm({ ...form, category: event.target.value })}
        required
      />
      <DishPhotoPicker imageUrl={form.image} onChange={(image) => setForm({ ...form, image })} />
      <label className="flex items-center gap-2 text-on-surface text-sm">
        <input
          type="checkbox"
          checked={form.fasting}
          onChange={(event) => setForm({ ...form, fasting: event.target.checked })}
        />
        {text('Fasting friendly')}
      </label>
    </div>
  );
}
