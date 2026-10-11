import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';
import AboutModal from '../components/AboutModal';

export default function ProfileScreen() {
  const { lang, setLang, activeZoneObj, setSelectedLocation, navigateTo, showToast } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const isAm = lang === 'am';

  const savedAddresses = [
    {
      id: 'addr-1',
      titleAm: 'የመኖሪያ ቤት (Home)',
      titleEn: 'Home',
      descAm: 'ኮዬ ፈጬ ሳይት 2፣ ብሎክ 42፣ በር 3',
      descEn: 'Koye Feche Site 2, Block 42, Gate 3',
      zoneId: 'koye-feche',
      isDefault: true
    },
    {
      id: 'addr-2',
      titleAm: 'የስራ ቦታ (Work)',
      titleEn: 'Workplace',
      descAm: 'ቱሉ ዲምቱ ቶታል አደባባይ፣ ንግድ ህንፃ ቁ. 3',
      descEn: 'Tuludimtu Total Roundabout, Plaza 3',
      zoneId: 'tuludimtu',
      isDefault: false
    },
    {
      id: 'addr-3',
      titleAm: 'የቤተሰብ ቤት (Family)',
      titleEn: 'Family Home',
      descAm: 'አቃቂ ቃሊቲ ገብርኤል በር 1 አጠገብ',
      descEn: 'Akaki Kality near Gabriel Gate 1',
      zoneId: 'akaki-kality',
      isDefault: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-28">
      <HeaderBar
        title={isAm ? 'መለያ እና ማስተካከያ' : 'Profile & Settings'}
        showBack={false}
      />

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* User Card */}
        <section className="bg-white rounded-2xl p-4 shadow-level-1 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#ffeadf] flex items-center justify-center text-[#a73400] font-black text-xl">
              ዳ
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-[17px] text-[#261911]">
                  {isAm ? 'ዳዊት ታደሰ' : 'Dawit Tadesse'}
                </h3>
                <span className="material-symbols-outlined text-[#1b6d24] text-[18px] fill-icon">verified</span>
              </div>
              <p className="font-mono text-[13px] text-[#594139]">+251 91 123 4567</p>
              <span className="text-[11px] text-[#a73400] font-bold bg-[#ffeadf] px-2.5 py-0.5 rounded-full mt-1.5 inline-block">
                {isAm ? activeZoneObj.nameAm : activeZoneObj.nameEn}
              </span>
            </div>
          </div>

          <button
            onClick={() => showToast(isAm ? 'የመለያ መረጃ ተቀምጧል' : 'Profile updated')}
            className="w-10 h-10 rounded-full bg-[#fff1eb] text-[#a73400] flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Edit profile"
          >
            <span className="material-symbols-outlined text-[19px]">edit</span>
          </button>
        </section>

        {/* Language Selection Card */}
        <section className="bg-white rounded-2xl p-4 shadow-level-1 space-y-3">
          <h3 className="font-display font-bold text-[14px] text-[#261911] uppercase tracking-[0.05em] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a73400] text-[19px]">translate</span>
            <span>{isAm ? 'የቋንቋ ምርጫ' : 'Language / ቋንቋ'}</span>
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                setLang('am');
                showToast('ቋንቋ ወደ አማርኛ ተቀይሯል');
              }}
              className={`py-3 px-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all ${
                lang === 'am'
                  ? 'bg-[#a73400] text-white shadow-[0_6px_16px_-8px_rgba(167,52,0,0.55)]'
                  : 'bg-[#f6ede8] text-[#261911] hover:bg-[#ffeadf]'
              }`}
            >
              <span>🇪🇹</span>
              <span>አማርኛ (Amharic)</span>
            </button>

            <button
              onClick={() => {
                setLang('en');
                showToast('Language changed to English');
              }}
              className={`py-3 px-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all ${
                lang === 'en'
                  ? 'bg-[#a73400] text-white shadow-[0_6px_16px_-8px_rgba(167,52,0,0.55)]'
                  : 'bg-[#f6ede8] text-[#261911] hover:bg-[#ffeadf]'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </section>

        {/* Saved Condominium Addresses */}
        <section className="bg-white rounded-2xl p-4 shadow-level-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-[14px] text-[#261911] uppercase tracking-[0.05em] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#a73400] text-[19px]">home_pin</span>
              <span>{isAm ? 'የተቀመጡ አድራሻዎች' : 'Saved Addresses'}</span>
            </h3>
            <button
              onClick={() => navigateTo('location-select')}
              className="text-[13px] font-bold text-[#a73400] px-1 py-1"
            >
              {isAm ? '+ አዲስ ጨምር' : '+ Add New'}
            </button>
          </div>

          <div className="space-y-2.5">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => {
                  setSelectedLocation(addr.zoneId);
                  showToast(isAm ? `አድራሻ ተመርጧል: ${addr.titleAm}` : `Selected address: ${addr.titleEn}`);
                }}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  activeZoneObj.id === addr.zoneId
                    ? 'bg-[#fff1eb] border-[#a73400]'
                    : 'bg-[#f6ede8] border-transparent hover:bg-[#ffeadf]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#a73400] shrink-0 shadow-level-1">
                    <span className="material-symbols-outlined text-[17px]">
                      {addr.id === 'addr-1' ? 'home' : addr.id === 'addr-2' ? 'apartment' : 'family_restroom'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-[#261911]">
                      {isAm ? addr.titleAm : addr.titleEn}
                    </h4>
                    <p className="text-[12px] text-[#594139]">
                      {isAm ? addr.descAm : addr.descEn}
                    </p>
                  </div>
                </div>

                {activeZoneObj.id === addr.zoneId && (
                  <span className="material-symbols-outlined text-[#a73400] text-[20px]">check_circle</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Preferences & Settings */}
        <section className="bg-white rounded-2xl p-4 shadow-level-1 space-y-3.5">
          <h3 className="font-display font-bold text-[14px] text-[#261911] uppercase tracking-[0.05em]">
            {isAm ? 'ማስተካከያዎች እና አማራጮች' : 'Preferences'}
          </h3>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between py-1 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#fff1eb] flex items-center justify-center text-[#a73400] shrink-0">
                <span className="material-symbols-outlined text-[19px]">notifications</span>
              </div>
              <div>
                <h4 className="font-bold text-[13px] text-[#261911]">
                  {isAm ? 'የትዕዛዝ ማሳወቂያዎች' : 'Order Notifications'}
                </h4>
                <p className="text-[12px] text-[#594139]">
                  {isAm ? 'የአድራሽና የሱቅ ወቅታዊ ሁኔታዎች' : 'Real-time rider and store status'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 shrink-0 ${
                notificationsEnabled ? 'bg-[#1b6d24]' : 'bg-[#c9b5ac]'
              }`}
              role="switch"
              aria-checked={notificationsEnabled}
              aria-label="Toggle order notifications"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Payment Methods */}
          <div
            onClick={() => showToast(isAm ? 'ቴሌብርና ሲቢኢ ብር ተገናኝተዋል' : 'telebirr & CBE Birr active')}
            className="flex items-center justify-between py-2 -mx-1 px-1 cursor-pointer hover:bg-[#fff8f5] rounded-xl transition-colors gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#fff1eb] flex items-center justify-center text-[#a73400] shrink-0">
                <span className="material-symbols-outlined text-[19px]">account_balance_wallet</span>
              </div>
              <div>
                <h4 className="font-bold text-[13px] text-[#261911]">
                  {isAm ? 'የክፍያ አካውንቶች' : 'Payment Accounts'}
                </h4>
                <p className="text-[12px] text-[#594139]">
                  telebirr • CBE Birr • Cash
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-[#8d7168]">chevron_right</span>
          </div>

          {/* Help & Support */}
          <div
            onClick={() => showToast(isAm ? 'የደንበኞች አገልግሎት መስመር፡ 8820' : 'Customer Hotline: 8820')}
            className="flex items-center justify-between py-2 -mx-1 px-1 cursor-pointer hover:bg-[#fff8f5] rounded-xl transition-colors gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#fff1eb] flex items-center justify-center text-[#a73400] shrink-0">
                <span className="material-symbols-outlined text-[19px]">headset_mic</span>
              </div>
              <div>
                <h4 className="font-bold text-[13px] text-[#261911]">
                  {isAm ? 'እርዳታ እና ድጋፍ' : 'Help & Support'}
                </h4>
                <p className="text-[12px] text-[#594139]">
                  {isAm ? 'የስልክ መስመር፡ 8820 • ቴሌግራም' : 'Hotline: 8820 • Telegram'}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-[#8d7168]">chevron_right</span>
          </div>

          {/* About Senik */}
          <div
            onClick={() => setAboutModalOpen(true)}
            className="flex items-center justify-between py-2 -mx-1 px-1 cursor-pointer hover:bg-[#fff8f5] rounded-xl transition-colors gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#fff1eb] flex items-center justify-center text-[#a73400] shrink-0">
                <span className="material-symbols-outlined text-[19px]">info</span>
              </div>
              <div>
                <h4 className="font-bold text-[13px] text-[#261911]">
                  {isAm ? 'ስለ ስንቅ (About Senik)' : 'About Senik'}
                </h4>
                <p className="text-[12px] text-[#594139]">
                  Version 1.0.0 Hyperlocal Delivery
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-[#8d7168]">chevron_right</span>
          </div>
        </section>
      </div>

      {/* About Modal */}
      <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} isAm={isAm} />
    </div>
  );
}
