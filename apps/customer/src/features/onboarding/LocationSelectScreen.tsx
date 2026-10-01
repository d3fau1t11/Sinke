import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { useZoneStore } from '../zone/store/zoneStore';
import { Button, Card, Input } from '@senik/ui';
import { zonesApi } from '@senik/api/zones';

export function LocationSelectScreen() {
  const { isAm } = useApp();
  const navigate = useNavigate();
  const { setZone } = useZoneStore();
  type Zone = { id: string; nameAm: string; nameEn: string; subcityAm: string; subcityEn: string; deliveryFee: number; deliveryEta: string };
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadZones = async () => {
    try {
      const data = await zonesApi.getZones();
      setZones(data as unknown as Zone[]);
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

  const filteredZones = zones.filter((zone) =>
    (isAm ? zone.nameAm : zone.nameEn).toLowerCase().includes(search.toLowerCase()) ||
    (isAm ? zone.subcityAm : zone.subcityEn).toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (zone: typeof zones[0]) => {
    setZone(zone.id, isAm ? zone.nameAm : zone.nameEn, isAm ? zone.nameAm : zone.nameEn, zone.deliveryFee);
    navigate('/app/home', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant">
            {isAm ? 'ሰፈሮችን በመጫን ላይ...' : 'Loading areas...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4">
        <h1 className="font-display font-bold text-2xl text-on-surface mb-2">
          {isAm ? 'የእርስዎን ሰፈር ይምረጡ' : 'Choose Your Area'}
        </h1>
        <p className="text-on-surface-variant text-sm mb-4">
          {isAm ? 'ስንቅ በዚህ ሰፈር አገልግሎት ይሰጣል' : 'Senik delivers in this area'}
        </p>
      </div>

      <Input
        placeholder={isAm ? 'ሰፈር ይፈልጉ...' : 'Search area...'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={<span className="material-symbols-outlined">search</span>}
        className="px-4"
      />

      {error && (
        <div className="p-4 mx-4 text-center text-error text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredZones.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 block">location_off</span>
            {isAm ? 'ሰፈር አልተገኘም' : 'No areas found'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredZones.map((zone) => (
              <Card
                key={zone.id}
                variant="outlined"
                padding="md"
                hoverable
                onClick={() => handleSelect(zone)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-on-surface">
                      {isAm ? zone.nameAm : zone.nameEn}
                    </h3>
                    <p className="text-sm text-on-surface-variant mt-1">
                      {isAm ? zone.subcityAm : zone.subcityEn}
                    </p>
                    <p className="text-xs text-primary mt-1 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                      {zone.deliveryFee} ETB • {zone.deliveryEta}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary">chevron_right</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}