import { useQuery } from '@tanstack/react-query';
import { businessesApi } from './businesses';
import { productsApi } from './products';
import { getDemoRole } from './demo/session';

export function useBusinessesInZone(zoneId: string | null) {
  return useQuery({
    queryKey: ['catalog', getDemoRole(), 'zone', zoneId],
    queryFn: () => businessesApi.getByZone(zoneId!),
    enabled: Boolean(zoneId),
  });
}

export function usePopularProducts() {
  return useQuery({
    queryKey: ['catalog', getDemoRole(), 'popular'],
    queryFn: productsApi.getPopular,
  });
}

export function useBusinessCatalog(id: string | undefined) {
  const business = useQuery({
    queryKey: ['catalog', getDemoRole(), 'business', id],
    queryFn: () => businessesApi.getById(id!),
    enabled: Boolean(id),
  });
  const products = useQuery({
    queryKey: ['catalog', getDemoRole(), 'products', id],
    queryFn: () => productsApi.getByBusiness(id!),
    enabled: Boolean(id),
  });
  return { business, products };
}
