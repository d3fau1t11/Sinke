import { useRiderCoordinate } from '@senik/api';
import { useText } from '@senik/i18n';

export function RiderLocationLink({ riderId }: { riderId: string | null }) {
  const text = useText();
  const { data } = useRiderCoordinate(riderId);
  if (!data || Date.now() - new Date(data.updated_at).getTime() > 120000) return null;
  return <a className="text-primary underline block" target="_blank" rel="noopener noreferrer"
    href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}>
    {text('View rider location')}
  </a>;
}
