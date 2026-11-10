import { useText } from '@senik/i18n';
import { ProfileSection1 } from './ProfileSection1';
import { Button, Card, EmptyState, Skeleton } from '@senik/ui';
import type { useProfile } from '../hooks/useProfile';

type Props = { model: ReturnType<typeof useProfile> };
export function ProfileSection2({ model }: Props) {
  const text = useText();
  return (
    <Card padding="lg" className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-on-surface">{text('Saved Addresses')}</h2>
        <Button size="sm" onClick={() => model.edit()}>
          {text('Add Address')}
        </Button>
      </div>
      {model.addresses.isPending ? (
        <Skeleton variant="rectangular" height="80px" />
      ) : model.addresses.isError ? (
        <EmptyState
          t={model.t}
          isAm={model.isAm}
          title={text('Could not load addresses')}
          actionLabel={text('Try again')}
          onAction={() => void model.addresses.refetch()}
        />
      ) : (
        model.addresses.data?.map((address) => (
          <ProfileSection1 key={address.id} {...{ model, address }} />
        ))
      )}
      {(model.remove.error || model.setDefault.error) && (
        <p role="alert" className="text-error text-sm">
          {model.remove.error?.message || model.setDefault.error?.message}
        </p>
      )}
    </Card>
  );
}
