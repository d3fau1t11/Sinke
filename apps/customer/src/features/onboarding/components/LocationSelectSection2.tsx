import { useText } from '@senik/i18n';
import { LocationSelectSection1 } from './LocationSelectSection1';
import type { useLocationSelect } from '../hooks/useLocationSelect';
import { Input } from '@senik/ui';

type Props = {
  isAm: ReturnType<typeof useLocationSelect>['isAm'];
  search: ReturnType<typeof useLocationSelect>['search'];
  setSearch: ReturnType<typeof useLocationSelect>['setSearch'];
  error: ReturnType<typeof useLocationSelect>['error'];
  filteredZones: ReturnType<typeof useLocationSelect>['filteredZones'];
  handleSelect: ReturnType<typeof useLocationSelect>['handleSelect'];
  detectLocation: ReturnType<typeof useLocationSelect>['detectLocation'];
  detecting: ReturnType<typeof useLocationSelect>['detecting'];
  geoError: ReturnType<typeof useLocationSelect>['geoError'];
};
export function LocationSelectSection2({
  isAm,
  search,
  setSearch,
  error,
  filteredZones,
  handleSelect,
  detectLocation,
  detecting,
  geoError,
}: Props) {
  const text = useText();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4">
        <h1 className="font-display font-bold text-2xl text-on-surface mb-2">
          {isAm ? 'የእርስዎን ሰፈር ይምረጡ' : text('Choose Your Area')}
        </h1>
        <p className="text-on-surface-variant text-sm mb-4">
          {isAm ? 'ስንቅ በዚህ ሰፈር አገልግሎት ይሰጣል' : text('Senik delivers in this area')}
        </p>

        <button
          type="button"
          onClick={() => void detectLocation()}
          disabled={detecting}
          className="w-full mb-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium border border-primary/20"
        >
          <span className="material-symbols-outlined text-[20px]">
            {detecting ? 'sync' : 'my_location'}
          </span>
          <span>
            {detecting
              ? isAm
                ? 'አካባቢዎን በመፈለግ ላይ...'
                : text('Detecting GPS Location...')
              : isAm
                ? 'አሁን ያሉበትን በGPS ያግኙ'
                : text('Use Current Location (GPS)')}
          </span>
        </button>

        {geoError && <p className="text-xs text-error mb-2 text-center">{text(geoError ?? '')}</p>}
      </div>

      <Input
        placeholder={isAm ? 'ሰፈር ይፈልጉ...' : 'Search area...'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={<span className="material-symbols-outlined">search</span>}
        className="px-4"
      />

      {error && <div className="p-4 mx-4 text-center text-error text-sm">{text(error ?? '')}</div>}

      <LocationSelectSection1 {...{ isAm, filteredZones, handleSelect }} />
    </div>
  );
}
