import { useText } from '@senik/i18n';
import { Button } from '@senik/ui';
import type { useAdminLogin } from '../hooks/useAdminLogin';

type Props = Pick<
  ReturnType<typeof useAdminLogin>,
  'email' | 'setEmail' | 'password' | 'setPassword' | 'error' | 'submit'
>;

export function AdminCredentialsForm({
  email,
  setEmail,
  password,
  setPassword,
  error,
  submit,
}: Props) {
  const text = useText();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="space-y-4 border-t border-slate-800 pt-5"
    >
      <p className="text-xs text-slate-400">Or use a demo account below</p>
      <label className="block text-sm text-slate-300" htmlFor="admin-email">
        {text('Email Address')}
      </label>
      <input
        id="admin-email"
        type="email"
        autoComplete="username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3"
      />
      <label className="block text-sm text-slate-300" htmlFor="admin-password">
        {text('Password')}
      </label>
      <input
        id="admin-password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3"
      />
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {text(error ?? '')}
        </p>
      )}
      <Button type="submit" variant="secondary" fullWidth>
        Sign In to Demo Console
      </Button>
    </form>
  );
}
