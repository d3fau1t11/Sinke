import { useState } from 'react';
import { getNearestZoneId, type Coordinates } from '@senik/utils';
import type { ZoneListItem } from '@senik/types';
import { getPhoneLocation } from '@senik/native';

export function useUserLocation(
  zones: ZoneListItem[],
  onZoneMatched: (zone: ZoneListItem, coords: Coordinates) => void,
) {
  const [detecting, setDetecting] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const detectLocation = async () => {
    setDetecting(true);
    setGeoError(null);

    const onCoords = (coords: Coordinates) => {
      const nearestId = getNearestZoneId(coords, zones);
      const matched = zones.find((z) => z.id === nearestId) || zones[0];
      if (matched) {
        onZoneMatched(matched, coords);
      }
      setDetecting(false);
    };

    const onError = (msg: string) => {
      setGeoError(msg);
      setDetecting(false);
    };

    try {
      onCoords(await getPhoneLocation());
    } catch (_e) {
      onError('Allow location access in Android settings, then try again.');
    }
  };

  return { detectLocation, detecting, geoError };
}
