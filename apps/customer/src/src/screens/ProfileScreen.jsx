import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';

export default function ProfileScreen() {
  const { lang, setLang, toggleLanguage, activeZoneObj, setSelectedLocation, navigateTo, showToast } = useApp();
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

      <div className="flex-1 px-4 py-3 space-y-4">
        {/* User Card */}
        <section className="bg-white rounded-2xl p-4 border border-[#e1bfb5] shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#ffeadf] border-2 border-[#a73400] flex items-center justify-center text-[#a73400] font-black text-xl shadow-xs">
              ዳ
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-base text-[#261911]">
                  {isAm ? 'ዳዊት ታደሰ' : 'Dawit Tadesse'}
                </h3>
                <span className="material-symbols-outlined text-[#1b6d24] text-[18px] fill-icon">verified</span>
              </div>
              <p className="font-mono text-xs text-[#594139]">+251 91 123 4567</p>
              <span className="text-[10px] text-[#a73400] font-bold bg-[#ffeadf] px-2 py-0.5 rounded mt-1 inline-block">
                {isAm ? activeZoneObj.nameAm : activeZoneObj.nameEn}
              </span>
            </div>
          </div>

          <button
            onClick={() => showToast(isAm ? 'የመለያ መረጃ ተቀምጧል' : 'Profile updated')}
            className="w-9 h-9 rounded-full bg-[#fff1eb] text-[#a73400] flex items-center justify-center border border-[#e1bfb5] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </section>

        {/* Language Selection Card */}
        <section className="bg-white rounded-2xl p-4 border border-[#e1bfb5] shadow-2xs space-y-2.5">
          <h3 className="font-display font-bold text-xs text-[#261911] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a73400] text-[18px]">translate</span>
            <span>{isAm ? 'የቋንቋ ምርጫ' : 'Language / ቋንቋ'}</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setLang('am');
                showToast('ቋንቋ ወደ አማርኛ ተቀይሯል');
              }}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                lang === 'am'
                  ? 'bg-[#a73400] text-white border-[#a73400] shadow-xs'
                  : 'bg-[#fff8f5] text-[#261911] border-[#e1bfb5]'
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
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                lang === 'en'
                  ? 'bg-[#a73400] text-white border-[#a73400] shadow-xs'
                  : 'bg-[#fff8f5] text-[#261911] border-[#e1bfb5]'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </section>

        {/* Saved Condominium Addresses */}
        <section className="bg-white rounded-2xl p-4 border border-[#e1bfb5] shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xs text-[#261911] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#a73400] text-[18px]">home_pin</span>
              <span>{isAm ? 'የተቀመጡ አድራሻዎች' : 'Saved Addresses'}</span>
            </h3>
            <button
              onClick={() => navigateTo('location-select')}
              className="text-[11px] font-bold text-[#a73400] hover:underline"
            >
              {isAm ? '+ አዲስ ጨምር' : '+ Add New'}
            </button>
          </div>

          <div className="space-y-2">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => {
                  setSelectedLocation(addr.zoneId);
                  showToast(isAm ? `አድራሻ ተመርጧል: ${addr.titleAm}` : `Selected address: ${addr.titleEn}`);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  activeZoneObj.id === addr.zoneId
                    ? 'bg-[#fff1eb] border-[#a73400]'
                    : 'bg-[#fff8f5] border-[#e1bfb5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#a73400] border border-[#e1bfb5] shrink-0">
                    <span className="material-symbols-outlined text-[16px]">
                      {addr.id === 'addr-1' ? 'home' : addr.id === 'addr-2' ? 'apartment' : 'family_restroom'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#261911]">
                      {isAm ? addr.titleAm : addr.titleEn}
                    </h4>
                    <p className="text-[10px] text-[#594139]">
                      {isAm ? addr.descAm : addr.descEn}
                    </p>
                  </div>
                </div>

                {activeZoneObj.id === addr.zoneId && (
                  <span className="material-symbols-outlined text-[#a73400] text-[18px]">check_circle</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Preferences & Settings */}
        <section className="bg-white rounded-2xl p-4 border border-[#e1bfb5] shadow-2xs space-y-3">
          <h3 className="font-display font-bold text-xs text-[#261911] uppercase tracking-wider">
            {isAm ? 'ማስተካከያዎች እና አማራጮች' : 'Preferences'}
          </h3>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#fff1eb] flex items-center justify-center text-[#a73400]">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#261911]">
                  {isAm ? 'የትዕዛዝ ማሳወቂያዎች' : 'Order Notifications'}
                </h4>
                <p className="text-[10px] text-[#594139]">
                  {isAm ? 'የአድራሽና የሱቅ ወቅታዊ ሁኔታዎች' : 'Real-time rider and store status'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                notificationsEnabled ? 'bg-[#1b6d24]' : 'bg-[#8d7168]/30'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Payment Methods */}
          <div
            onClick={() => showToast(isAm ? 'ቴሌብርና ሲቢኢ ብር ተገናኝተዋል' : 'telebirr & CBE Birr active')}
            className="flex items-center justify-between py-1 cursor-pointer hover:bg-[#fff1eb]/50 rounded-xl p-1 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#fff1eb] flex items-center justify-center text-[#a73400]">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#261911]">
                  {isAm ? 'የክፍያ አካውንቶች' : 'Payment Accounts'}
                </h4>
                <p className="text-[10px] text-[#594139]">
                  telebirr • CBE Birr • Cash
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#8d7168]">chevron_right</span>
          </div>

          {/* Help & Support */}
          <div
            onClick={() => showToast(isAm ? 'የደንበኞች አገልግሎት መስመር፡ 8820' : 'Customer Hotline: 8820')}
            className="flex items-center justify-between py-1 cursor-pointer hover:bg-[#fff1eb]/50 rounded-xl p-1 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#fff1eb] flex items-center justify-center text-[#a73400]">
                <span className="material-symbols-outlined text-[18px]">headset_mic</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#261911]">
                  {isAm ? 'እርዳታ እና ድጋፍ' : 'Help & Support'}
                </h4>
                <p className="text-[10px] text-[#594139]">
                  {isAm ? 'የስልክ መስመር፡ 8820 • ቴሌግራም' : 'Hotline: 8820 • Telegram'}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#8d7168]">chevron_right</span>
          </div>

          {/* About Senik */}
          <div
            onClick={() => setAboutModalOpen(true)}
            className="flex items-center justify-between py-1 cursor-pointer hover:bg-[#fff1eb]/50 rounded-xl p-1 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#fff1eb] flex items-center justify-center text-[#a73400]">
                <span className="material-symbols-outlined text-[18px]">info</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#261911]">
                  {isAm ? 'ስለ ስንቅ (About Senik)' : 'About Senik'}
                </h4>
                <p className="text-[10px] text-[#594139]">
                  Version 1.0.0 Hyperlocal Delivery
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#8d7168]">chevron_right</span>
          </div>
        </section>
      </div>

      {/* About Modal */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setAboutModalOpen(false)} />
          <div className="relative w-full max-w-[360px] bg-[#fff8f5] rounded-3xl p-6 shadow-2xl border border-[#e1bfb5] z-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-[#e1bfb5] mx-auto p-1">
              <img src="/senik-logo.jpg" alt="ስንቅ Logo" className="w-full h-full object-contain rounded-xl" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-black text-2xl text-[#a73400]">ስንቅ • SENIK</h3>
              <p className="text-xs font-semibold text-[#aa6400]">Hyperlocal Delivery Startup Prototype</p>
              <span className="inline-block text-[10px] bg-[#ffeadf] text-[#a73400] px-2 py-0.5 rounded-full font-bold">
                Tuludimtu • Koye Feche • Akaki Kality
              </span>
            </div>

            <p className="text-xs text-[#594139] leading-relaxed">
              {isAm
                ? 'ስንቅ የአዲስ አበባ ነዋሪዎችን ከአቅራቢያቸው ምግብ ቤቶች፣ ሸቀጣ ሸቀጦች እና ፋርማሲዎች ጋር የሚያገናኝ ፈጣን የሰፈር ማድረሻ መተግበሪያ ነው።'
                : 'Senik connects suburban Addis Ababa neighborhoods with nearby restaurants, grocery merchants, and pharmacies with hyperfast local delivery.'}
            </p>

            <button
              onClick={() => setAboutModalOpen(false)}
              className="w-full bg-[#a73400] text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 shadow-md"
            >
              {isAm ? 'እሺ' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
