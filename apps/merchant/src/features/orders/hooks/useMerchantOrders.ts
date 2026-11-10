import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ordersApi } from '@senik/api';
import type { OrderSummary, OrderStatus } from '@senik/types';
import { useMerchantAuthStore } from '../../auth/store/merchantAuthStore';

type FilterTab = 'all' | 'placed' | 'preparing' | 'ready' | 'completed';
const TABS: FilterTab[] = ['placed', 'preparing', 'ready', 'completed', 'all'];
const TAB_LABELS: Record<FilterTab, { en: string; am: string }> = {
  placed: { en: 'Incoming', am: 'አዲስ' },
  preparing: { en: 'Preparing', am: 'በዝግጅት' },
  ready: { en: 'Ready', am: 'ዝግጁ' },
  completed: { en: 'Done', am: 'ተከፍሏል' },
  all: { en: 'All', am: 'ሁሉም' },
};

function matchesTab(order: OrderSummary, tab: FilterTab) {
  if (tab === 'all') return true;
  if (tab === 'completed') return order.status === 'delivered' || order.status === 'cancelled';
  if (tab === 'preparing') return order.status === 'preparing' || order.status === 'accepted';
  return order.status === tab;
}

export function useMerchantOrders() {
  const { merchantId } = useMerchantAuthStore();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<FilterTab>(() => {
    const param = searchParams.get('tab') as FilterTab | null;
    return param && TABS.includes(param) ? param : 'placed';
  });
  const query = useQuery({
    queryKey: ['merchant-orders', merchantId],
    queryFn: () => ordersApi.getByBusiness(merchantId!),
    enabled: Boolean(merchantId),
    refetchInterval: 10_000,
  });
  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      void query.refetch();
    },
  });
  const orders = query.data ?? [];
  return {
    error: query.error?.message ?? update.error?.message ?? '',
    loading: query.isPending,
    activeTab,
    setActiveTab,
    updatingId: update.isPending ? update.variables.id : null,
    loadOrders: query.refetch,
    handleUpdateStatus: (id: string, status: OrderStatus) => update.mutate({ id, status }),
    countFor: (tab: FilterTab) => orders.filter((order) => matchesTab(order, tab)).length,
    filteredOrders: orders.filter((order) => matchesTab(order, activeTab)),
    TABS,
    TAB_LABELS,
  };
}
