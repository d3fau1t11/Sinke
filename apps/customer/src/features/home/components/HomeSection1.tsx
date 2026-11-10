import { useText } from '@senik/i18n';
import { Button, EmptyState, Skeleton } from '@senik/ui';
import type { useHome } from '../hooks/useHome';
import { BusinessCard } from './BusinessCard';

type Props = {
  t: ReturnType<typeof useHome>['t'];
  isAm: ReturnType<typeof useHome>['isAm'];
  navigate: ReturnType<typeof useHome>['navigate'];
  businesses: ReturnType<typeof useHome>['businesses'];
};
export function HomeSection1({ t, isAm, navigate, businesses }: Props) {
  const text = useText();
  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-on-surface">
          {isAm ? 'በቅርቡ ያሉ ሱቆች' : text('Nearby Businesses')}
        </h2>
        <Button variant="ghost" size="sm" onClick={() => navigate('/app/merchants')}>
          {isAm ? 'ሁሉንም አሳይ' : text('View All')}
        </Button>
      </div>
      {businesses.isPending ? (
        <Skeleton variant="rectangular" height="150px" />
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
        businesses.data
          ?.slice(0, 6)
          .map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              isAm={isAm}
              onOpen={() => navigate(`/app/merchant/${business.id}`)}
            />
          ))
      )}
    </section>
  );
}
