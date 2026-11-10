import { useText } from '@senik/i18n';
import { EmptyState } from '@senik/ui';
import { useCart } from './hooks/useCart';
import { CartItemCard } from './components/CartItemCard';
import { CartTotals } from './components/CartTotals';

export function CartScreen() {
  const text = useText();
  const model = useCart();
  if (!model.items.length)
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <EmptyState
          t={model.t}
          isAm={model.isAm}
          title={model.isAm ? 'ቅርጫትዎ ባዶ ነው' : 'Your Cart is Empty'}
          message={
            model.isAm
              ? 'የሚፈልጓቸውን ምግቦች ይምረጡና እዘዙ!'
              : 'Browse local restaurants and shops to add your favorite items!'
          }
          actionLabel={model.isAm ? 'ሱቆችን ያስሱ' : 'Explore Businesses'}
          onAction={() => model.navigate('/app/home')}
        />
      </div>
    );
  return (
    <div className="flex-1 pb-28 px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-xl text-on-surface">
          {model.isAm ? 'ቅርጫት' : text('Cart')}
        </h1>
        <span className="text-sm text-on-surface-variant">
          {model.getItemCount()} {model.isAm ? 'ዕቃዎች' : 'items'}
        </span>
      </div>
      <div className="space-y-3">
        {model.items.map((item) => (
          <CartItemCard
            key={item.productId}
            item={item}
            isAm={model.isAm}
            onQuantity={model.updateQuantity}
            onRemove={model.removeItem}
          />
        ))}
      </div>
      <CartTotals model={model} />
    </div>
  );
}
