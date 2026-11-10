import { useText } from '@senik/i18n';
import { Button } from './Button';

type Props = {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  error: string;
  pending: boolean;
  configured: boolean;
  submit: () => void;
};

export function StaffSignInForm(model: Props) {
  const text = useText();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        model.submit();
      }}
      className="space-y-3"
    >
      <h2 className="font-bold">{text('Sign in to your account')}</h2>
      {!model.configured && <p>{text('Live sign-in needs backend configuration.')}</p>}
      <label className="block">
        {text('Email Address')}
        <input
          type="email"
          autoComplete="username"
          required
          value={model.email}
          onChange={(event) => model.setEmail(event.target.value)}
          className="w-full rounded-xl border bg-white text-slate-900 px-3 py-2"
        />
      </label>
      <label className="block">
        {text('Password')}
        <input
          type="password"
          autoComplete="current-password"
          required
          value={model.password}
          onChange={(event) => model.setPassword(event.target.value)}
          className="w-full rounded-xl border bg-white text-slate-900 px-3 py-2"
        />
      </label>
      {model.error && <p role="alert">{text(model.error)}</p>}
      <Button type="submit" fullWidth loading={model.pending} disabled={!model.configured}>
        {text('Sign In')}
      </Button>
    </form>
  );
}
