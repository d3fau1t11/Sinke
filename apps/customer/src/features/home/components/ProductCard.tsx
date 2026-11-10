import { useText } from '@senik/i18n';
import type { ProductListItem } from '@senik/types';
import { Card } from '@senik/ui';

interface ProductCardProps {
  product: ProductListItem;
  isAm: boolean;
  onOpen: () => void;
}

export function ProductCard({ product, isAm, onOpen }: ProductCardProps) {
  const text = useText();
  return (
    <Card variant="outlined" padding="none" className="w-40 shrink-0" onClick={onOpen}>
      <img
        src={product.image}
        alt={product.name_en}
        className="w-full aspect-square object-cover rounded-t-xl"
      />
      <div className="p-3">
        <h3 className="font-bold text-sm text-on-surface">
          {isAm ? product.name_am : product.name_en}
        </h3>
        <p className="text-primary text-sm font-bold mt-1">
          {product.price} {text('ETB')}
        </p>
      </div>
    </Card>
  );
}
