import { useText } from '@senik/i18n';
import type { useMerchantDetail } from '../hooks/useMerchantDetail';

type Props = {
  isAm: ReturnType<typeof useMerchantDetail>['isAm'];
  business: NonNullable<ReturnType<typeof useMerchantDetail>['business']>;
};
export function MerchantDetailSection2({ isAm, business }: Props) {
  const text = useText();
  return (
    <div className="relative h-48">
      <img
        src={business.cover_image}
        alt={isAm ? business.name_am : business.name_en}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-3">
          <img
            src={business.avatar_image}
            alt={isAm ? business.name_am : business.name_en}
            className="w-14 h-14 rounded-xl object-cover border-2 border-white"
          />
          <div className="text-white">
            <h1 className="font-display font-bold text-xl">
              {isAm ? business.name_am : business.name_en}
            </h1>
            <p className="text-white/80 text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">local_shipping</span>
              {business.delivery_eta} • {business.delivery_fee} {text('ETB')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
