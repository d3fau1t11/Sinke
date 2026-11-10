import { useText } from '@senik/i18n';
import { MerchantDetailSection2 } from './MerchantDetailSection2';
import { MerchantDetailSection1 } from './MerchantDetailSection1';
import type { useMerchantDetail } from '../hooks/useMerchantDetail';
import { Button, EmptyState } from '@senik/ui';

type Props = {
  t: ReturnType<typeof useMerchantDetail>['t'];
  isAm: ReturnType<typeof useMerchantDetail>['isAm'];
  business: NonNullable<ReturnType<typeof useMerchantDetail>['business']>;
  filteredProducts: ReturnType<typeof useMerchantDetail>['filteredProducts'];
  selectedCategory: ReturnType<typeof useMerchantDetail>['selectedCategory'];
  setSelectedCategory: ReturnType<typeof useMerchantDetail>['setSelectedCategory'];
  categories: ReturnType<typeof useMerchantDetail>['categories'];
  handleAddToCart: ReturnType<typeof useMerchantDetail>['handleAddToCart'];
};
export function MerchantDetailSection3({
  t,
  isAm,
  business,
  filteredProducts,
  selectedCategory,
  setSelectedCategory,
  categories,
  handleAddToCart,
}: Props) {
  const text = useText();
  return (
    <div className="flex-1">
      <MerchantDetailSection2 {...{ isAm, business }} />

      <div className="px-4 py-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? (isAm ? 'ሁሉም' : text('All')) : cat}
            </Button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState
            t={t}
            isAm={isAm}
            title={isAm ? 'ምግቦች አልተገኙም' : 'No Items Available'}
            message={isAm ? 'በዚህ ምድብ ምንም እቃ አልተገኘም' : 'No items found in this category'}
          />
        ) : (
          <MerchantDetailSection1 {...{ isAm, filteredProducts, handleAddToCart }} />
        )}
      </div>
    </div>
  );
}
