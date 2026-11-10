import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const isAndroid = () => Capacitor.getPlatform() === 'android';

export async function getPhoneLocation() {
  if (Capacitor.isNativePlatform()) {
    const permission = await Geolocation.requestPermissions();
    if (permission.location !== 'granted' && permission.coarseLocation !== 'granted') {
      throw new Error('Allow location access in Android settings, then try again.');
    }
  }
  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 10000,
  });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export async function watchPhoneLocation(
  onPosition: (coords: { latitude: number; longitude: number; heading?: number }) => void,
  onError: () => void,
) {
  await getPhoneLocation();
  return Geolocation.watchPosition(
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
      minimumUpdateInterval: 10000,
    },
    (position, error) => {
      if (error || !position) {
        onError();
        return;
      }
      const { latitude, longitude, heading } = position.coords;
      onPosition({
        latitude,
        longitude,
        ...(heading == null ? {} : { heading }),
      });
    },
  );
}

export const clearPhoneLocationWatch = (id: string) => Geolocation.clearWatch({ id });

export async function takeDishPhoto(): Promise<File | null> {
  try {
    const photo = await Camera.getPhoto({
      quality: 80,
      width: 1200,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    if (!photo.webPath) return null;
    const response = await fetch(photo.webPath);
    return new File([await response.blob()], 'dish.jpg', {
      type: 'image/jpeg',
    });
  } catch (error) {
    if (error instanceof Error && /cancel/i.test(error.message)) return null;
    throw error;
  }
}
