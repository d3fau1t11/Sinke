import { useText } from '@senik/i18n';
import { StaffSignInForm } from '@senik/ui/StaffSignInForm';
import { Button, Card, SenikLogo } from '@senik/ui';
import { useRiderLogin } from './hooks/useRiderLogin';

export function RiderLoginScreen() {
  const text = useText();
  const { loginDemo, live } = useRiderLogin();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-1 tibeb-accent-strip" aria-hidden="true" />
      <div className="flex-1 flex flex-col justify-center px-5 py-10 max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SenikLogo size="xl" />
          </div>
          <h1 className="font-display font-black text-title-xl text-on-surface">
            {text('Senik Rider')}
          </h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            Earn More. Deliver Faster. · የአሽከርካሪ
          </p>
        </div>
        <Card padding="lg" className="space-y-5">
          <h2 className="font-bold text-title-md text-on-surface">
            {text('Meet Abebe, your demo rider')}
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            {text(
              'Accept a ready job, pick it up, complete the delivery, and see your earnings update.',
            )}
          </p>
          <Button fullWidth size="lg" onClick={() => void loginDemo()}>
            {text('Demo Sign In · Rider')}
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
