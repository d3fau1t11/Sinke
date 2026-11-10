import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { useBusinessCatalog } from '@senik/api';
import { useCartStore } from '../store/cartStore';
import { useZoneStore } from '../../zone/store/zoneStore';

export function useCart() {
  const app = useApp();
  const navigate = useNavigate();
  const cart = useCartStore();
  const zone = useZoneStore();
  const catalog = useBusinessCatalog(cart.items[0]?.businessId);
  const deliveryFee = catalog.business.data?.delivery_fee ?? zone.deliveryFee;
  const subtotal = cart.getTotal();
  const serviceFee = cart.items.length ? 15 : 0;
  return {
    ...app,
    navigate,
    ...cart,
    subtotal,
    serviceFee,
    deliveryFee,
    total: subtotal + serviceFee + deliveryFee,
    quoteReady: Boolean(catalog.business.data),
    error: catalog.business.error?.message ?? '',
  };
}
