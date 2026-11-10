import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionsApi, getDemoRole } from '@senik/api';
import type { TransactionRecord } from '@senik/api';

interface Filters {
  type: string;
  method: string;
  status: string;
  search: string;
}
function matchesFilters(transaction: TransactionRecord, filters: Filters) {
  if (filters.type !== 'all' && transaction.type !== filters.type) return false;
  if (filters.method !== 'all' && transaction.method !== filters.method) return false;
  if (filters.status !== 'all' && transaction.status !== filters.status) return false;
  const term = filters.search.trim().toLowerCase();
  return (
    !term ||
    [transaction.reference, transaction.partyName, transaction.orderNumber ?? ''].some((value) =>
      value.toLowerCase().includes(term),
    )
  );
}

export function useAdminTransactions() {
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    method: 'all',
    status: 'all',
    search: '',
  });
  const query = useQuery({
    queryKey: ['transactions', getDemoRole()],
    queryFn: transactionsApi.getAll,
    refetchInterval: 12_000,
  });
  const transactions = query.data ?? [];
  return {
    transactions,
    filtered: transactions.filter((transaction) => matchesFilters(transaction, filters)),
    filters,
    onFilter: (field: keyof Filters, value: string) =>
      setFilters((current) => ({ ...current, [field]: value })),
    loading: query.isPending,
    error: query.error?.message ?? '',
    refresh: () => {
      void query.refetch();
    },
  };
}
