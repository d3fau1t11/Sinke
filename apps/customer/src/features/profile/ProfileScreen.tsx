import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { Button, Card, Input, Textarea, EmptyState, Skeleton } from '@senik/ui';
import { useAuthStore } from '../auth/store/authStore';
import { useLanguageStore } from '../language/store/languageStore';
import { useZoneStore } from '../zone/store/zoneStore';
import { useCartStore } from '../cart/store/cartStore';
import { addressesApi } from '@senik/api/addresses';
import { zonesApi } from '@senik/api/zones';

export function ProfileScreen() {
  const { t, isAm } = useApp();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { language, toggleLanguage } = useLanguageStore();
  const { clearCart } = useCartStore();

  type Addr = Record<string, unknown> & { id: string; label: string; full_address: string; landmark?: string; is_default?: boolean };
  const [addresses, setAddresses] = useState<Addr[]>([]);
  const [_zones, setZones] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Addr | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: 'home',
    full_address: '',
    landmark: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [addrData, zonesData] = await Promise.all([
        addressesApi.getMyAddresses(),
        zonesApi.getZones(),
      ]);
      setAddresses(addrData as unknown as Addr[]);
      setZones(zonesData as unknown as Array<Record<string, unknown>>);
    } catch (_err) {
      console.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      void loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleSaveAddress = async () => {
    try {
      if (editingAddress) {
        await addressesApi.updateAddress(editingAddress.id, addressForm);
      } else {
        await addressesApi.addAddress(addressForm);
      }
      setShowAddressModal(false);
      setEditingAddress(null);
      setAddressForm({ label: 'home', full_address: '', landmark: '' });
      void loadData();
    } catch (_err) {
      console.error('Failed to save address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await addressesApi.deleteAddress(id);
      void loadData();
    } catch (_err) {
      console.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressesApi.setDefault(id);
      void loadData();
    } catch (_err) {
      console.error('Failed to set default');
    }
  };

  const handleLogout = async () => {
    await logout();
    clearCart();
    navigate('/auth/phone', { replace: true });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <EmptyState
          t={t}
          isAm={isAm}
          title={isAm ? 'አልገባም' : 'Not Logged In'}
          message={isAm ? 'ለመግባት ስልክ ቁጥርዎን ያስገቡ' : 'Please log in to view your profile'}
          actionLabel={isAm ? 'ግባ' : 'Log In'}
          onAction={() => navigate('/auth/phone')}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 px-4 py-4 space-y-4">
        <Skeleton variant="circular" width="24" height="24" className="mx-auto" />
        <Skeleton variant="text" className="mx-auto" width="100px" />
        <Skeleton variant="text" className="mx-auto" width="150px" />
        <div className="space-y-3 px-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" className="h-16" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="px-4 py-4 space-y-6">
        <Card variant="outlined" padding="lg">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">person</span>
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-xl text-on-surface">
                {user?.full_name || (isAm ? 'ተጠቃሚ' : 'User')}
              </h2>
              <p className="text-on-surface-variant">{user?.phone || ''}</p>
              <p className="text-xs text-on-surface-variant mt-1">
                {isAm ? 'የሚያደርገው ዘመን: ' : 'Member since: '}
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="outlined" padding="lg">
          <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">language</span>
            {isAm ? 'ቋንቋ' : 'Language'}
          </h3>
          <div className="flex gap-3">
            {['am', 'en'].map((lang) => (
              <Button
                key={lang}
                variant={language === lang ? 'primary' : 'secondary'}
                size="lg"
                fullWidth
                onClick={() => language !== lang && toggleLanguage()}
              >
                {lang === 'am' ? 'አማርኛ' : 'English'}
              </Button>
            ))}
          </div>
        </Card>

        <Card variant="outlined" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">location_on</span>
              {isAm ? 'የተቀመጡ አድራሻዎች' : 'Saved Addresses'}
            </h3>
            <Button variant="primary" size="sm" onClick={() => { setEditingAddress(null); setAddressForm({ label: 'home', full_address: '', landmark: '' }); setShowAddressModal(true); }}>
              <span className="material-symbols-outlined mr-1">add</span>
              {isAm ? 'አድራሻ አስገባ' : 'Add Address'}
            </Button>
          </div>

          {addresses.length === 0 ? (
            <EmptyState
              t={t}
              isAm={isAm}
              title={isAm ? 'የተቀመጡ አድራሻዎች የለም' : 'No Saved Addresses'}
              message={isAm ? 'አድራሻ አስገባልን ይጫኑ ለፈጣን ማድረሻ' : 'Add an address for faster checkout'}
              actionLabel={isAm ? 'አድራሻ አስገባ' : 'Add Address'}
              onAction={() => { setEditingAddress(null); setAddressForm({ label: 'home', full_address: '', landmark: '' }); setShowAddressModal(true); }}
            />
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <Card key={addr.id} variant="outlined" padding="md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-on-surface capitalize">{addr.label}</h4>
                        {addr.is_default && (
                          <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full">
                            {isAm ? 'ነባሪ' : 'Default'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-on-surface-variant mt-1">{addr.full_address}</p>
                      {addr.landmark && (
                        <p className="text-xs text-on-surface-variant mt-1 italic">
                          {isAm ? 'ምልክት: ' : 'Landmark: '}{addr.landmark}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!addr.is_default && (
                        <Button variant="ghost" size="sm" onClick={() => handleSetDefault(addr.id)}>
                          {isAm ? 'ነባሪ ይደርግ' : 'Set Default'}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => { setEditingAddress(addr); setAddressForm({ label: addr.label, full_address: addr.full_address, landmark: addr.landmark || '' }); setShowAddressModal(true); }}>
                        <span className="material-symbols-outlined">edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-error" onClick={() => handleDeleteAddress(addr.id)}>
                        <span className="material-symbols-outlined">delete</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <Card variant="outlined" padding="lg">
          <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">settings</span>
            {isAm ? 'ቅንብሮች' : 'Settings'}
          </h3>
          <div className="space-y-3">
            <Button variant="secondary" size="md" fullWidth onClick={() => navigate('/app/orders')}>
              <span className="material-symbols-outlined mr-2">receipt_long</span>
              {isAm ? 'የትዕዛዝ ታሪክ' : 'Order History'}
            </Button>
            <Button variant="secondary" size="md" fullWidth onClick={() => navigate('/app/profile/notifications')}>
              <span className="material-symbols-outlined mr-2">notifications</span>
              {isAm ? 'ማሳወቂያዎች' : 'Notifications'}
            </Button>
            <Button variant="secondary" size="md" fullWidth onClick={() => navigate('/app/profile/help')}>
              <span className="material-symbols-outlined mr-2">help</span>
              {isAm ? 'እርዳታ እና ድጋፍ' : 'Help & Support'}
            </Button>
            <Button variant="secondary" size="md" fullWidth onClick={() => navigate('/app/profile/about')}>
              <span className="material-symbols-outlined mr-2">info</span>
              {isAm ? 'ስለ ስንቅ' : 'About Senik'}
            </Button>
          </div>
        </Card>

        <Card variant="outlined" padding="lg" className="border-error">
          <Button variant="danger" size="lg" fullWidth onClick={handleLogout}>
            <span className="material-symbols-outlined mr-2">logout</span>
            {isAm ? 'ውጣ' : 'Logout'}
          </Button>
        </Card>

        <div className="text-center text-xs text-on-surface-variant py-4">
          <p>Senik v1.0.0</p>
          <p>{isAm ? 'የተሰራ በ ኢትዮጵያ 🇪🇹' : 'Made in Ethiopia 🇪🇹'}</p>
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={() => setShowAddressModal(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-on-surface">
                {editingAddress ? (isAm ? 'አድራሻ አርትእ' : 'Edit Address') : (isAm ? 'አድራሻ አስገባ' : 'Add Address')}
              </h2>
              <button onClick={() => setShowAddressModal(false)} className="p-2 rounded-full hover:bg-surface-container-low">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <Input
                label={isAm ? 'የአድራሻ መለያ' : 'Address Label'}
                value={addressForm.label}
                onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                placeholder={isAm ? 'ስምምነት: ቤት, ሥራ, ሌላ' : 'e.g., Home, Work, Other'}
              />
              <Textarea
                label={isAm ? 'ሙሉ አድራሻ' : 'Full Address'}
                value={addressForm.full_address}
                onChange={(e) => setAddressForm({ ...addressForm, full_address: e.target.value })}
                placeholder={isAm ? 'ስምምነት: ሳይት 2, ብሎክ 42, 3ኛ ፎቅ' : 'e.g., Site 2, Block 42, 3rd Floor'}
                rows={3}
              />
              <Input
                label={isAm ? 'ምልክታዊ ቦታ (አማራጭ)' : 'Landmark (Optional)'}
                value={addressForm.landmark}
                onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                placeholder={isAm ? 'ምሳሌ: በር 5, ወይም የቶታል ጋ' : 'e.g., Near Gate 5, behind Total'}
              />
              <div className="flex gap-2 pt-4">
                <Button variant="secondary" size="lg" fullWidth onClick={() => setShowAddressModal(false)}>
                  {isAm ? 'ሰርዝ' : 'Cancel'}
                </Button>
                <Button variant="primary" size="lg" fullWidth onClick={handleSaveAddress}>
                  {isAm ? (editingAddress ? 'አዘምን' : 'አስቀምጥ') : (editingAddress ? 'Update' : 'Save')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}