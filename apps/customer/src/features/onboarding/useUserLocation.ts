import { useState } from "react";
import { getNearestZoneId, type Coordinates } from "@senik/utils";
import type { ZoneListItem } from "@senik/types";

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
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            onCoords({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          (err) => {
            onError(err.message || "GPS location permission denied");
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
        );
      } else {
        onError("Geolocation is not supported by your device");
      }
    } catch (_e) {
      onError("Failed to acquire GPS location");
    }
  };

  return { detectLocation, detecting, geoError };
}
