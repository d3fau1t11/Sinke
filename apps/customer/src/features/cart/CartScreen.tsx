import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { Button, Card, EmptyState } from '@senik/ui';
import { useCartStore } from './store/cartStore';
import { useZoneStore } from '../zone/store/zoneStore';
import { formatETB } from '@senik/utils';

export function CartScreen() {
  const { t, isAm } = useApp();
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const { deliveryFee } = useZoneStore();

  const subtotal = getTotal();
  const serviceFee = items.length > 0 ? 15 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <EmptyState
          t={t}
          isAm={isAm}
          title={isAm ? 'ቅርጫትዎ ባዶ ነው' : 'Your Cart is Empty'}
          message={isAm ? 'የሚፈልጓቸውን ጣፋጭ ምግቦች ወይም ሸቀጦች ይምረጡና እዘዙ!' : 'Browse local restaurants and shops to add your favorite items!'}
          actionLabel={isAm ? 'ሱቆችን ያስሱ' : 'Explore Businesses'}
          onAction={() => navigate('/app/home')}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 pb-28">
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl text-on-surface">
            {isAm ? 'ቅርጫት' : 'Cart'}
          </h1>
          <span className="text-sm text-on-surface-variant">
            {items.length} {isAm ? 'ዕቃዎች' : 'items'}
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.productId} variant="outlined" padding="md">
              <div className="flex items-start gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-on-surface truncate">{item.name}</h3>
                  <p className="text-sm text-primary font-bold">{formatETB(item.price, isAm)}</p>

                  {item.options.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.options.map((opt) => (
                        <span key={opt.id} className="px-2 py-0.5 bg-surface-container-high text-xs rounded-full text-on-surface-variant">
                          {opt.nameAm || opt.name} + {formatETB(opt.price, isAm)}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {item.notes && (
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{item.notes}</p>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-2 text-on-surface disabled:opacity-50"
                        disabled={item.quantity <= 1}
                        aria-label={isAm ? 'መቀነስ' : 'Decrease quantity'}
                      >
                        <span className="material-symbols-outlined">remove</span>
                      </button>
                      <span className="px-3 font-bold text-on-surface w-10 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-2 text-on-surface"
                        aria-label={isAm ? 'መጨመር' : 'Increase quantity'}
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                      className="flex-1"
                    >
                      <span className="material-symbols-outlined text-error">delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card variant="elevated" padding="lg" className="sticky bottom-20 mx-4 mb-4 rounded-2xl shadow-level-3">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{isAm ? 'ንዑስ ድምር' : 'Subtotal'}</span>
              <span className="font-bold text-on-surface">{formatETB(subtotal, isAm)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{isAm ? 'የማድረሻ ክፍያ' : 'Delivery Fee'}</span>
              <span className="font-bold text-on-surface">{formatETB(deliveryFee, isAm)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{isAm ? 'የአገልግሎት ክፍያ' : 'Service Fee'}</span>
              <span className="font-bold text-on-surface">{formatETB(serviceFee, isAm)}</span>
            </div>
            <div className="border-t border-outline-variant pt-3"></div>
            <div className="flex justify-between text-lg">
              <span className="font-display font-bold text-on-surface">{isAm ? 'ጠቅላላ' : 'Total'}</span>
              <span className="font-display font-bold text-primary">{formatETB(total, isAm)}</span>
            </div>

            <Button
              variant="primary"
              size="xl"
              fullWidth
              onClick={() => navigate('/app/checkout')}
            >
              {isAm ? 'ወደ ክፍያ ቀጥል' : 'Proceed to Checkout'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={clearCart}
            >
              {isAm ? 'ቅርጫትን አጽዳ' : 'Clear Cart'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}