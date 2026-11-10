import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { useCartStore } from '../../features/cart/store/cartStore';
import { useZoneStore } from '../../features/zone/store/zoneStore';

export function useMainLayout() {
  const { isAm } = useApp();
  const { pathname: currentPath } = useLocation();
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.getItemCount());
  const { selectedZoneName, selectedZoneNameAm } = useZoneStore();
  return {
    isAm,
    currentPath,
    navigate,
    cartCount,
    selectedZoneName,
    selectedZoneNameAm,
  };
}
