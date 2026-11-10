import { useText } from '@senik/i18n';
import { StaffSignInForm } from '@senik/ui/StaffSignInForm';
import { Button, SenikLogo } from '@senik/ui';
import { useAdminLogin } from './hooks/useAdminLogin';

export function AdminLoginScreen() {
  const text = useText();
  const { enterDemo, ...live } = useAdminLogin();
  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center px-6 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <SenikLogo size="lg" />
          </div>
          <h1 className="text-2xl font-black text-white">{text('Senik Admin Sign In')}</h1>
          <p className="text-sm text-slate-400 mt-2">{text('Operations & Fleet Management')}</p>
        </div>
        <Button fullWidth size="lg" onClick={enterDemo}>
          {text('Demo Sign In · Admin')}
        </Button>
        <p className="text-xs text-slate-400 text-center">
          {text(
            'Explore sample orders, users, merchants, zones, and transactions. No password needed.',
          )}
        </p>
        <StaffSignInForm {...live} />
      </div>
    </div>
  );
}
