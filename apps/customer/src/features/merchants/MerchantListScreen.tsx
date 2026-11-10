import { useText } from '@senik/i18n';
import { Button, EmptyState, Skeleton } from '@senik/ui';
import { useHome } from '../home/hooks/useHome';
import { BusinessCard } from '../home/components/BusinessCard';

export function MerchantListScreen() {
  const text = useText();
  const { t, isAm, navigate, businesses, zone } = useHome();
  return (
    <div className="p-4 space-y-4">
      <h1 className="font-display font-bold text-xl text-on-surface">
        {isAm ? 'ሱቆች' : text('Nearby Businesses')}
      </h1>
      {!zone.selectedZoneId ? (
        <Button onClick={() => navigate('/location')}>{text('Select Area')}</Button>
      ) : businesses.isPending ? (
        <Skeleton variant="rectangular" height="160px" />
      ) : businesses.isError ? (
        <EmptyState
          t={t}
          isAm={isAm}
          title={text('Could not load businesses')}
          actionLabel={text('Try again')}
          onAction={() => void businesses.refetch()}
        />
      ) : businesses.data?.length === 0 ? (
        <EmptyState t={t} isAm={isAm} title={text('No open businesses in this area')} />
      ) : (
        businesses.data?.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            isAm={isAm}
            onOpen={() => navigate(`/app/merchant/${business.id}`)}
          />
        ))
      )}
    </div>
  );
}
