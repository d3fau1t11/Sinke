import { Button, Card } from '@senik/ui';
import { formatETB } from '@senik/utils';
import type { CartItem } from '../store/cartStore';

interface Props {
  item: CartItem;
  isAm: boolean;
  onQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}
export function CartItemCard({ item, isAm, onQuantity, onRemove }: Props) {
  return (
    <Card variant="outlined" padding="md">
      <div className="flex items-start gap-3">
        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-on-surface truncate">{item.name}</h3>
          <p className="text-sm text-primary font-bold">{formatETB(item.price, isAm)}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {item.options.map((option) => (
              <span
                key={option.id}
                className="px-2 py-0.5 bg-surface-container-high text-xs rounded-full"
              >
                {isAm ? option.nameAm : option.name} + {formatETB(option.price, isAm)}
              </span>
            ))}
          </div>
          {item.notes && <p className="text-xs text-on-surface-variant mt-1">{item.notes}</p>}
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="secondary"
              size="sm"
              disabled={item.quantity <= 1}
              aria-label={isAm ? 'መቀነስ' : 'Decrease quantity'}
              onClick={() => onQuantity(item.productId, item.quantity - 1)}
            >
              −
            </Button>
            <span className="font-bold text-on-surface w-10 text-center">{item.quantity}</span>
            <Button
              variant="secondary"
              size="sm"
              aria-label={isAm ? 'መጨመር' : 'Increase quantity'}
              onClick={() => onQuantity(item.productId, item.quantity + 1)}
            >
              +
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.productId)}
              aria-label={isAm ? 'ዕቃ አስወግድ' : 'Remove item'}
            >
              <span className="material-symbols-outlined text-error">delete</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
