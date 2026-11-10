import { useQuery } from '@tanstack/react-query';
import { ordersApi } from './orders';
import { getDemoRole } from './demo/session';

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['order-detail', getDemoRole(), id],
    queryFn: () => ordersApi.getById(id!),
    enabled: Boolean(id),
    refetchInterval: 5000,
  });
}

export function useCustomerOrders() {
  return useQuery({
    queryKey: ['customer-orders', getDemoRole()],
    queryFn: ordersApi.getMyOrders,
    refetchInterval: 5000,
  });
}
