import { useText } from '@senik/i18n';
import { ProfileSection2 } from './components/ProfileSection2';

import { Button, Card } from '@senik/ui';
import { useProfile } from './hooks/useProfile';
import { AddressModal } from './components/AddressModal';

export function ProfileScreen() {
  const text = useText();
  const model = useProfile();
  return (
    <div className="p-4 space-y-5 max-w-2xl mx-auto">
      <Card padding="lg">
        <h1 className="font-display font-bold text-xl text-on-surface">{model.user?.full_name}</h1>
        <p className="text-on-surface-variant">{model.user?.phone}</p>
      </Card>
      <Card padding="lg" className="space-y-3">
        <h2 className="font-bold text-on-surface">{model.isAm ? 'ቋንቋ' : text('Language')}</h2>
        <div className="flex gap-3">
          {[
            ['am', 'አማርኛ'],
            ['en', 'English'],
          ].map(([code, label]) => (
            <Button
              key={code}
              variant={model.lang === code ? 'primary' : 'secondary'}
              onClick={() => void model.setLanguage(code === 'am' ? 'am' : 'en')}
            >
              {text(label ?? '')}
            </Button>
          ))}
        </div>
      </Card>
      <ProfileSection2 {...{ model }} />
      <Card padding="lg" className="space-y-3">
        {[
          ['Orders', '/app/orders'],
          ['Notification Preferences', '/app/profile/notifications'],
          ['Help & Support', '/app/profile/help'],
          ['About Senik', '/app/profile/about'],
        ].map(([label, path]) => (
          <Button key={path} fullWidth variant="secondary" onClick={() => model.navigate(path!)}>
            {text(label ?? '')}
          </Button>
        ))}
      </Card>
      {model.error && (
        <p role="alert" className="text-error">
          {text(model.error ?? '')}
        </p>
      )}
      <Button fullWidth variant="danger" onClick={() => void model.logout()}>
        {text('Log Out')}
      </Button>
      <AddressModal
        visible={model.showModal}
        form={model.form}
        onChange={model.setForm}
        onClose={() => model.setShowModal(false)}
        onSave={() => model.save.mutate()}
        pending={model.save.isPending}
        error={model.save.error?.message ?? ''}
      />
    </div>
  );
}
