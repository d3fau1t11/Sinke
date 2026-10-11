export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates,
): number {
  const R = 6371;
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.latitude)) *
      Math.cos(toRad(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateETA(
  distanceKm: number,
  averageSpeedKmh: number = 25,
): number {
  const timeHours = distanceKm / averageSpeedKmh;
  const timeMinutes = Math.ceil(timeHours * 60);
  return Math.max(5, timeMinutes);
}

export function formatDistance(km: number, isAmharic: boolean = false): string {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return isAmharic ? `${meters} ሜትር` : `${meters}m`;
  }
  return isAmharic ? `${km.toFixed(1)} ኪ.ሜ` : `${km.toFixed(1)}km`;
}

export function formatDuration(
  minutes: number,
  isAmharic: boolean = false,
): string {
  if (minutes < 60) {
    return isAmharic ? `${minutes} ደቂቃ` : `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return isAmharic ? `${hours} ሰዓት` : `${hours} hr`;
  }
  return isAmharic ? `${hours}ሰ ${mins}ደ` : `${hours}h ${mins}m`;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export const ZONE_CENTERS: Record<string, Coordinates> = {
  "koye-feche": { latitude: 9.0522, longitude: 38.7468 },
  tuludimtu: { latitude: 9.0456, longitude: 38.7523 },
  "akaki-kality": { latitude: 9.0389, longitude: 38.7612 },
};

export function getNearestZoneId(
  userCoords: Coordinates,
  availableZones: Array<{ id: string; name_en: string }>,
): string | null {
  if (availableZones.length === 0) return null;
  let nearestId = availableZones[0]?.id ?? null;
  let minDistance = Infinity;

  for (const zone of availableZones) {
    const key = Object.keys(ZONE_CENTERS).find(
      (k) =>
        zone.name_en.toLowerCase().includes(k.replace("-", " ")) ||
        zone.name_en.toLowerCase().includes(k.replace("-", "")) ||
        k.includes(zone.name_en.toLowerCase().replace(/\s+/g, "-")),
    );
    const center =
      key && ZONE_CENTERS[key]
        ? ZONE_CENTERS[key]
        : { latitude: 9.04, longitude: 38.75 };
    const dist = calculateDistance(userCoords, center);
    if (dist < minDistance) {
      minDistance = dist;
      nearestId = zone.id;
    }
  }
  return nearestId;
}
