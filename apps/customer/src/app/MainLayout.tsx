import { useDeviceNotifications } from '@senik/native/useDeviceNotifications';
import { DeviceNotificationsButton } from '@senik/ui/DeviceNotificationsButton';
import { MainLayoutSection1 } from './components/MainLayoutSection1';
import { useMainLayout } from './hooks/useMainLayout';
import { DemoBanner } from '@senik/ui/DemoBanner';
import { useDemoPreview } from '../shared/hooks/useDemoPreview';
import { Outlet } from 'react-router-dom';
import { Button, SenikLogo } from '@senik/ui';

export function MainLayout() {
  const notifications = useDeviceNotifications();
  const { isDemo, reset } = useDemoPreview();
  const { isAm, currentPath, navigate, cartCount, selectedZoneName, selectedZoneNameAm } =
    useMainLayout();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-outline-variant shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <SenikLogo size="sm" showText={true} />
            <button
              type="button"
              onClick={() => navigate('/location')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant hover:border-primary/40 transition-colors text-left"
            >
              <span className="material-symbols-outlined text-primary text-[16px]">
                location_on
              </span>
              <span className="truncate max-w-[100px] font-medium text-xs text-on-surface">
                {isAm ? selectedZoneNameAm : selectedZoneName}
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-[14px]">
                expand_more
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/location')}>
              <span className="material-symbols-outlined">edit_location</span>
            </Button>
          </div>
        </div>
      </header>

      <DemoBanner visible={isDemo} onReset={reset} />
      <DeviceNotificationsButton
        status={notifications.status}
        pending={notifications.pending}
        onEnable={() => void notifications.enable()}
      />
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <MainLayoutSection1 {...{ isAm, currentPath, cartCount }} />
    </div>
  );
}
