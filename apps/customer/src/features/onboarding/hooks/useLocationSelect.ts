import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { useZoneStore } from '../../zone/store/zoneStore';

import { zonesApi } from '@senik/api/zones';
import type { ZoneListItem } from '@senik/types';
import { useUserLocation } from '.././useUserLocation';

export function useLocationSelect() {
  const { isAm } = useApp();
  const navigate = useNavigate();
  const { setZone } = useZoneStore();
  const [zones, setZones] = useState<ZoneListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadZones = async () => {
    try {
      const data = await zonesApi.getZones();
      setZones(data);
    } catch (_err) {
      setError(isAm ? 'ሰፈሮችን ማግኘት አልተሳካም' : 'Failed to load areas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadZones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredZones = zones.filter(
    (zone) =>
      (isAm ? zone.name_am : zone.name_en).toLowerCase().includes(search.toLowerCase()) ||
      (isAm ? zone.subcity_am : zone.subcity_en).toLowerCase().includes(search.toLowerCase()),
  );

  const { setUserCoords } = useZoneStore();
  const handleSelect = (zone: ZoneListItem, coords?: { latitude: number; longitude: number }) => {
    if (coords) setUserCoords(coords);
    setZone(zone.id, zone.name_en, zone.name_am, zone.delivery_fee);
    navigate('/app/home', { replace: true });
  };

  const { detectLocation, detecting, geoError } = useUserLocation(zones, (zone, coords) => {
    handleSelect(zone, coords);
  });

  return {
    isAm,
    navigate,
    setZone,
    zones,
    setZones,
    loading,
    setLoading,
    search,
    setSearch,
    error,
    setError,
    loadZones,
    filteredZones,
    setUserCoords,
    handleSelect,
    detectLocation,
    detecting,
    geoError,
  };
}
