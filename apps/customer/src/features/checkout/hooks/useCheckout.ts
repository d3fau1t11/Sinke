import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { isDemoSession, useBusinessCatalog } from '@senik/api';
import { useApp } from '@senik/i18n';
import { useCartStore } from '../../cart/store/cartStore';
import { useAuthStore } from '../../auth/store/authStore';
import { useZoneStore } from '../../zone/store/zoneStore';
import { placeCheckoutOrder } from '../services/placeCheckoutOrder';

export type CheckoutMethod = 'cash' | 'telebirr' | 'cbe_birr';

export function useCheckout() {
  const app = useApp();
  const navigate = useNavigate();
  const cart = useCartStore();
  const zone = useZoneStore();
  const catalog = useBusinessCatalog(cart.items[0]?.businessId);
  const deliveryFee = catalog.business.data?.delivery_fee ?? zone.deliveryFee;
  const user = useAuthStore((state) => state.user);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [method, setMethod] = useState<CheckoutMethod>('cash');
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const subtotal = cart.getTotal();
  const serviceFee = cart.items.length ? 15 : 0;
  const mutation = useMutation({
    mutationFn: () =>
      placeCheckoutOrder(
        {
          businessId: cart.items[0]?.businessId ?? '',
          deliveryAddress: address,
          deliveryNotes: notes,
          paymentMethod: method,
          idempotencyKey,
          items: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            selectedOptions: item.options,
            notes: item.notes,
          })),
        },
        phone,
      ),
    onSuccess: (order) => {
      cart.clearCart();
      navigate(`/app/orders/${order.id}`, { replace: true });
    },
  });
  return {
    ...app,
    navigate,
    items: cart.items,
    address,
    setAddress,
    notes,
    setNotes,
    phone,
    setPhone,
    method,
    setMethod,
    isDemo: isDemoSession(),
    subtotal,
    deliveryFee,
    serviceFee,
    total: subtotal + deliveryFee + serviceFee,
    quoteReady: Boolean(catalog.business.data),
    quoteError: catalog.business.error?.message ?? '',
    mutation,
  };
}
