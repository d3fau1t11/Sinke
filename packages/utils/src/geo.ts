export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
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
  averageSpeedKmh: number = 25
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

export function formatDuration(minutes: number, isAmharic: boolean = false): string {
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