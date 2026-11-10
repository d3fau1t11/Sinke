import { useText } from '@senik/i18n';
import type { useLocationSelect } from '../hooks/useLocationSelect';
import { Card } from '@senik/ui';

type Props = {
  isAm: ReturnType<typeof useLocationSelect>['isAm'];
  filteredZones: ReturnType<typeof useLocationSelect>['filteredZones'];
  handleSelect: ReturnType<typeof useLocationSelect>['handleSelect'];
};
export function LocationSelectSection1({ isAm, filteredZones, handleSelect }: Props) {
  const text = useText();
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      {filteredZones.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 block">location_off</span>
          {isAm ? 'ሰፈር አልተገኘም' : text('No areas found')}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredZones.map((zone) => (
            <Card
              key={zone.id}
              variant="outlined"
              padding="md"
              hoverable
              onClick={() => handleSelect(zone)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-on-surface">
                    {isAm ? zone.name_am : zone.name_en}
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {isAm ? zone.subcity_am : zone.subcity_en}
                  </p>
                  <p className="text-xs text-primary mt-1 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                    {zone.delivery_fee} {text('ETB •')} {zone.delivery_eta}
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary">chevron_right</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
