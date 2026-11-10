import { useText } from '@senik/i18n';

export function ConnectionBanner({ connected }: { connected: boolean }) {
  const text = useText();
  if (connected) return null;
  return (
    <p role="status" className="bg-amber-100 text-amber-900 p-3 text-center">
      {text('You are offline. Reconnect to update orders.')}
    </p>
  );
}
