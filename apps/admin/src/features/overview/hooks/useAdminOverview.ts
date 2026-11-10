import { useState, useEffect } from 'react';
import { ordersApi, businessesApi, zonesApi } from '@senik/api';

import type { OrderSummary, Business, ZoneListItem } from '@senik/types';

export function useAdminOverview() {
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [zones, setZones] = useState<ZoneListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ordersData, bizData, zoneData] = await Promise.all([
          ordersApi.getAll(),
          businessesApi.getAll(),
          zonesApi.getZones(),
        ]);
        setOrders(ordersData);
        setBusinesses(bizData);
        setZones(zoneData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load overview data. Try again.');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const totalGMV = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const openMerchants = businesses.filter((b) => b.is_open).length;

  return {
    error,
    orders,
    setOrders,
    businesses,
    setBusinesses,
    zones,
    setZones,
    loading,
    setLoading,
    totalGMV,
    openMerchants,
  };
}
