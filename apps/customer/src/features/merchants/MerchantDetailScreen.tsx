import { useText } from '@senik/i18n';
import { MerchantDetailSection3 } from './components/MerchantDetailSection3';

import { useMerchantDetail } from './hooks/useMerchantDetail';

import { Skeleton, EmptyState } from '@senik/ui';

export function MerchantDetailScreen() {
  const text = useText();
  const {
    t,
    isAm,
    business,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    categories,
    handleAddToCart,
  } = useMerchantDetail();
  if (loading) {
    return (
      <div className="flex-1 px-4 py-4 space-y-4">
        <Skeleton variant="text" lines={3} className="mx-4" />
        <Skeleton variant="rectangular" className="mx-4 h-48" />
        <Skeleton variant="text" lines={2} className="mx-4" />
        <div className="space-y-3 px-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <EmptyState
          t={t}
          isAm={isAm}
          title={isAm ? 'ሱቅ አልተገኘም' : 'Business Not Found'}
          message={text(error ?? '')}
        />
      </div>
    );
  }

  return (
    <MerchantDetailSection3
      {...{
        t,
        isAm,
        business,
        filteredProducts,
        selectedCategory,
        setSelectedCategory,
        categories,
        handleAddToCart,
      }}
    />
  );
}
