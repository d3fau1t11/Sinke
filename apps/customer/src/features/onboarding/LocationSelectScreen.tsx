import { useText } from '@senik/i18n';
import { LocationSelectSection2 } from './components/LocationSelectSection2';

import { useLocationSelect } from './hooks/useLocationSelect';

export function LocationSelectScreen() {
  const text = useText();
  const {
    isAm,
    loading,
    search,
    setSearch,
    error,
    filteredZones,
    handleSelect,
    detectLocation,
    detecting,
    geoError,
  } = useLocationSelect();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant">
            {isAm ? 'ሰፈሮችን በመጫን ላይ...' : text('Loading areas...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <LocationSelectSection2
      {...{
        isAm,
        search,
        setSearch,
        error,
        filteredZones,
        handleSelect,
        detectLocation,
        detecting,
        geoError,
      }}
    />
  );
}
