import { useText } from '@senik/i18n';
import { StaffSignInForm } from '@senik/ui/StaffSignInForm';
import { Button, Card, SenikLogo } from '@senik/ui';
import { useMerchantLogin } from './hooks/useMerchantLogin';

export function MerchantLoginScreen() {
  const text = useText();
  const { loginDemo, live } = useMerchantLogin();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-1 tibeb-accent-strip" aria-hidden="true" />
      <div className="flex-1 flex flex-col justify-center px-5 py-10 max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SenikLogo size="lg" />
          </div>
          <h1 className="font-display font-extrabold text-title-xl text-on-surface">
            {text('Senik Merchant')}
          </h1>
          <p className="text-body-sm text-on-surface-variant mt-2">
            የነጋዴ መግቢያ · Restaurant &amp; Store Operations
          </p>
        </div>
        <Card padding="lg" className="space-y-5">
          <h2 className="font-bold text-title-md text-on-surface">{text('Try Koye Kitchen')}</h2>
          <p className="text-body-sm text-on-surface-variant">
            {text('Manage incoming orders, edit dishes, change prices, and explore your earnings.')}
          </p>
          <Button fullWidth size="lg" onClick={loginDemo}>
            {text('Demo Sign In · Merchant')}
          </Button>
          <p className="text-label-sm text-on-surface-variant text-center">
            {text('Sample account. No credentials needed. Payments are simulated.')}
          </p>
          <StaffSignInForm {...live} />
        </Card>
      </div>
    </div>
  );
}
