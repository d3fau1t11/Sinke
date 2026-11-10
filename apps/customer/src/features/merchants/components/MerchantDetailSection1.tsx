import { useText } from '@senik/i18n';
import type { useMerchantDetail } from '../hooks/useMerchantDetail';
import { Button, Card } from '@senik/ui';

type Props = {
  isAm: ReturnType<typeof useMerchantDetail>['isAm'];
  filteredProducts: ReturnType<typeof useMerchantDetail>['filteredProducts'];
  handleAddToCart: ReturnType<typeof useMerchantDetail>['handleAddToCart'];
};
export function MerchantDetailSection1({ isAm, filteredProducts, handleAddToCart }: Props) {
  const text = useText();
  return (
    <div className="space-y-3">
      {filteredProducts.map((prod) => (
        <Card key={prod.id} variant="outlined" padding="md" hoverable>
          <div className="flex items-center gap-3">
            <img
              src={prod.image}
              alt={isAm ? prod.name_am : prod.name_en}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-on-surface truncate">
                {isAm ? prod.name_am : prod.name_en}
              </h3>
              {prod.description_en && (
                <p className="text-sm text-on-surface-variant truncate mt-1">
                  {isAm ? prod.description_am : prod.description_en}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-primary font-bold">
                  {prod.price} {text('ETB')}
                </span>
                {prod.is_fasting && (
                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full">
                    {isAm ? '🌿 የፆም' : text('🌿 Fasting')}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              aria-label={`Add ${prod.name_en} to cart`}
              onClick={() => handleAddToCart(prod)}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
