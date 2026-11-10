import { useText } from '@senik/i18n';
import type { BusinessListItem } from '@senik/types';
import { Card } from '@senik/ui';

interface BusinessCardProps {
  business: BusinessListItem;
  isAm: boolean;
  onOpen: () => void;
}

export function BusinessCard({ business, isAm, onOpen }: BusinessCardProps) {
  const text = useText();
  return (
    <Card variant="outlined" padding="md" hoverable onClick={onOpen}>
      <div className="flex items-center gap-3">
        <img
          src={business.avatar_image}
          alt={business.name_en}
          className="w-16 h-16 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-on-surface">
            {isAm ? business.name_am : business.name_en}
          </h3>
          <p className="text-sm text-on-surface-variant truncate">
            {isAm ? business.description_am : business.description_en}
          </p>
          <p className="text-xs text-on-surface-variant mt-2">
            ★ {business.rating} · {business.delivery_eta} · {business.delivery_fee} {text('ETB')}
          </p>
        </div>
        <span className="material-symbols-outlined text-primary">chevron_right</span>
      </div>
    </Card>
  );
}
