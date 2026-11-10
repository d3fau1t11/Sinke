import { useText } from '@senik/i18n';
import { Button, Input, SenikLogo } from '@senik/ui';
import { usePhoneLogin } from './hooks/usePhoneLogin';

export function PhoneLoginScreen() {
  const text = useText();
  const { isAm, phone, setPhone, error, loading, loginDemo, submit } = usePhoneLogin();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-level-2">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <SenikLogo size="lg" />
          </div>
          <h1 className="font-display font-bold text-3xl text-on-surface">
            {isAm ? 'ወደ ስንቅ ይግቡ' : text('Welcome to Senik')}
          </h1>
          <p className="mt-2 text-on-surface-variant">
            {text('Customer · Order food from your neighborhood')}
          </p>
        </div>
        <Button fullWidth size="lg" onClick={loginDemo}>
          {text('Demo Sign In · Customer')}
        </Button>
        <p className="text-center text-sm text-on-surface-variant my-3">
          {text('Explore with sample data. No phone number or password needed.')}
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="space-y-4 border-t pt-5 mt-5"
        >
          <Input
            label={isAm ? 'ስልክ ቁጥር' : text('Phone Number')}
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+251 9xx xxx xxx"
            error={error}
            fullWidth
            disabled={loading}
          />
          <Button type="submit" variant="secondary" size="lg" fullWidth loading={loading}>
            {isAm ? 'ኮድ ይላክ' : text('Send Code')}
          </Button>
        </form>
      </div>
    </div>
  );
}
