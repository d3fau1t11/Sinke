import { useText } from '@senik/i18n';
import { Button } from '@senik/ui';
import { useOtpVerification } from './hooks/useOtpVerification';

export function OtpVerificationScreen() {
  const text = useText();
  const model = useOtpVerification();
  return (
    <form className="max-w-md mx-auto p-6 space-y-5 bg-white rounded-2xl"
      onSubmit={(event) => { event.preventDefault(); void model.verify(); }}>
      <h1 className="text-2xl font-bold">{text('Enter Verification Code')}</h1>
      <p>{text('Enter the code sent to {{phone}}', { phone: model.phone })}</p>
      <label className="block font-bold" htmlFor="verification-code">{text('Verification code')}</label>
      <input id="verification-code" type="text" inputMode="numeric" autoComplete="one-time-code"
        pattern="[0-9]{6}" maxLength={6} required value={model.otp}
        onChange={(event) => model.setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
        disabled={model.loading} className="w-full p-3 border rounded-xl text-center tracking-widest" />
      {model.error && <p role="alert" className="text-error">{text(model.error)}</p>}
      <Button type="submit" fullWidth loading={model.loading} disabled={model.otp.length !== 6}>
        {text('Verify')}
      </Button>
      <Button type="button" fullWidth variant="ghost" disabled={model.cooldown > 0}
        loading={model.resendLoading} onClick={() => void model.resend()}>
        {model.cooldown ? text('Resend in {{seconds}} seconds', { seconds: model.cooldown }) : text('Resend Code')}
      </Button>
    </form>
  );
}
