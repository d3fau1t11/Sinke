import { useText } from '@senik/i18n';
import { useStartup } from './hooks/useStartup';
import { useApp } from '@senik/i18n';

export function SplashScreen() {
  const text = useText();
  const { isAm } = useApp();
  useStartup();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <img
          src="/senik-logo.jpg"
          alt={text('Senik')}
          className="w-24 h-24 mx-auto mb-4 rounded-xl shadow-level-2"
        />
        <h1 className="font-display font-bold text-3xl text-on-surface">
          ስንቅ <span className="text-primary">{text('SENIK')}</span>
        </h1>
        <p className="mt-2 text-on-surface-variant">
          {isAm ? 'የሰፈር ፈጣን ማድረሻ' : text('Hyperlocal Delivery')}
        </p>
        <div className="mt-8 w-32 h-2 mx-auto bg-primary rounded-full animate-pulse" />
      </div>
    </div>
  );
}
