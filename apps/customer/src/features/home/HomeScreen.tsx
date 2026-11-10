import { useText } from '@senik/i18n';
import { HomeSection1 } from './components/HomeSection1';
import { Button, EmptyState } from '@senik/ui';
import { useHome } from './hooks/useHome';

import { ProductCard } from './components/ProductCard';

export function HomeScreen() {
  const text = useText();
  const { t, isAm, navigate, zone, businesses, products } = useHome();
  if (!zone.selectedZoneId)
    return (
      <EmptyState
        t={t}
        isAm={isAm}
        title={text('Select your delivery area')}
        actionLabel={text('Select Area')}
        onAction={() => navigate('/location')}
      />
    );
  return (
    <div className="px-4 py-4 space-y-6">
      <div className="flex justify-between items-center gap-3">
        <div>
          <p className="text-sm text-on-surface-variant">
            {isAm ? 'ወደ' : text('Delivering to')}{' '}
            {isAm ? zone.selectedZoneNameAm : zone.selectedZoneName}
          </p>
          <h1 className="font-display font-bold text-xl text-on-surface">
            {isAm ? 'ምን እናቅርብልዎ?' : text('What can we bring you?')}
          </h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/location')}>
          {isAm ? 'ቀይር' : text('Change')}
        </Button>
      </div>
      <HomeSection1 {...{ t, isAm, navigate, businesses }} />
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-on-surface">
            {isAm ? 'ተወዳጅ ምግቦች' : text('Popular Dishes')}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/app/search')}>
            {isAm ? 'ሁሉንም አሳይ' : text('View All')}
          </Button>
        </div>
        {products.isError ? (
          <EmptyState
            t={t}
            isAm={isAm}
            title={text('Could not load dishes')}
            actionLabel={text('Try again')}
            onAction={() => void products.refetch()}
          />
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {products.data?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAm={isAm}
                onOpen={() => navigate(`/app/merchant/${product.business_id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
