import { useText } from '@senik/i18n';

type Props = { pending: boolean; status: string; onEnable: () => void };
export function DeviceNotificationsButton({ pending, status, onEnable }: Props) {
  const text = useText();
  return (
    <div className="px-4 py-2 text-sm">
      <button type="button" disabled={pending} onClick={onEnable} className="underline font-bold">
        {text('Enable order notifications')}
      </button>
      {status && <p role="status">{text(status)}</p>}
    </div>
  );
}
