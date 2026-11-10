import { useState, useEffect } from 'react';
import { zonesApi } from '@senik/api';

import type { ZoneListItem } from '@senik/types';

export function useAdminZones() {
  const [error, setError] = useState('');
  const [zones, setZones] = useState<ZoneListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadZones = async () => {
    try {
      const data = await zonesApi.getZones();
      setZones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load zones. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadZones();
  }, []);

  return { error, zones, setZones, loading, setLoading, loadZones };
}
