import { useNavigate } from 'react-router-dom';
import { useBusinessesInZone, usePopularProducts } from '@senik/api';
import { useApp } from '@senik/i18n';
import { useZoneStore } from '../../zone/store/zoneStore';

export function useHome() {
  const { t, isAm } = useApp();
  const navigate = useNavigate();
  const zone = useZoneStore();
  const businesses = useBusinessesInZone(zone.selectedZoneId);
  const products = usePopularProducts();
  return { t, isAm, navigate, zone, businesses, products };
}
