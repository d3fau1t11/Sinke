import { useText } from '@senik/i18n';
import { Button } from '@senik/ui';
import type { useProfile } from '../hooks/useProfile';

type Props = {
  model: ReturnType<typeof useProfile>;
  address: NonNullable<
    NonNullable<NonNullable<ReturnType<typeof useProfile>>['addresses']>['data']
  >[number];
};
export function ProfileSection1({ model, address }: Props) {
  const text = useText();
  return (
    <div className="border rounded-xl p-3 space-y-2">
      <p className="font-bold text-on-surface">
        {text(address.label ?? '')} {address.is_default && '· Default'}
      </p>
      <p className="text-sm text-on-surface-variant">{address.full_address}</p>
      <div className="flex flex-wrap gap-2">
        {!address.is_default && (
          <Button
            size="sm"
            variant="secondary"
            disabled={model.setDefault.isPending}
            onClick={() => model.setDefault.mutate(address.id)}
          >
            {text('Set Default')}
          </Button>
        )}
        <Button size="sm" variant="secondary" onClick={() => model.edit(address)}>
          {text('Edit')}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={model.remove.isPending}
          onClick={() => model.remove.mutate(address.id)}
        >
          {text('Delete')}
        </Button>
      </div>
    </div>
  );
}
