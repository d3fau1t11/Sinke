import { useState, useEffect } from 'react';
import { businessesApi } from '@senik/api';

import type { Business } from '@senik/types';

export function useAdminMerchants() {
  const [error, setError] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadMerchants = async () => {
    try {
      const data = await businessesApi.getAll();
      setBusinesses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load merchants. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMerchants();
  }, []);

  const handleToggleOpen = async (biz: Business) => {
    setTogglingId(biz.id);
    try {
      await businessesApi.setIsOpen(biz.id, !biz.is_open);
      setBusinesses((prev) =>
        prev.map((b) => (b.id === biz.id ? { ...b, is_open: !biz.is_open } : b)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle merchant status. Try again.');
    } finally {
      setTogglingId(null);
    }
  };

  return {
    error,
    businesses,
    setBusinesses,
    loading,
    setLoading,
    togglingId,
    setTogglingId,
    loadMerchants,
    handleToggleOpen,
  };
}
