import React from 'react';
import { useApp } from '../context/AppContext';
import { NEIGHBORHOODS } from '../data/mockData';
import HeaderBar from '../components/HeaderBar';

export default function LocationSelectScreen() {
  const { lang, selectedLocation, setSelectedLocation, navigateTo, showToast } = useApp();
  const isAm = lang === 'am';

  const handleSelect = (zoneId) => {
    setSelectedLocation(zoneId);
    const zone = NEIGHBORHOODS.find((n) => n.id === zoneId);
    showToast(isAm ? `ሰፈርዎ ወደ "${zone.nameAm}" ተቀይሯል` : `Location set to "${zone.nameEn}"`);
  };

  const handleProceed = () => {
    navigateTo('home');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-24">
      <HeaderBar showBack={true} onBack={() => navigateTo('home')} />

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Title Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffeadf] text-[#a73400] text-[12px] font-bold">
            <span className="material-symbols-outlined text-[16px]">near_me</span>
            <span>{isAm ? 'አካባቢ ይምረጡ' : 'Delivery Zone'}</span>
          </div>
          <h2 className="font-display font-extrabold text-[24px] text-[#261911]">
            {isAm ? 'የት ነው የሚገኙት?' : 'Where are you located?'}
          </h2>
          <p className="text-[13px] text-[#594139] leading-relaxed">
            {isAm 
              ? 'ለኮዬ ፈጬ፣ ቱሉ ዲምቱ እና አቃቂ ቃሊቲ ኮንዶሚኒየሞችና በሮች የተስተካከለ የቀጥታ ማድረሻ።'
              : 'Tailored for specific condominium blocks and gates across suburban Addis Ababa.'}
          </p>
        </div>

        {/* Zones List */}
        <div className="space-y-3 pt-1">
          {NEIGHBORHOODS.map((zone) => {
            const isSelected = selectedLocation === zone.id;
            const name = isAm ? zone.nameAm : zone.nameEn;
            const subcity = isAm ? zone.subcityAm : zone.subcityEn;
            const sites = isAm ? zone.sitesAm : zone.sitesEn;
            const badge = isAm ? zone.statusBadgeAm : zone.statusBadgeEn;

            return (
              <div
                key={zone.id}
                onClick={() => handleSelect(zone.id)}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-150 relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#fff1eb] border-[#a73400] shadow-[0_8px_20px_-10px_rgba(167,52,0,0.35)]'
                    : 'bg-white border-transparent shadow-level-1 hover:shadow-level-2'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 items-start flex-1">
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected ? 'bg-[#a73400] text-white' : 'bg-[#fff1eb] text-[#a73400]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>
                        {zone.icon}
                      </span>
                    </div>

                    {/* Zone Info */}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-[16px] text-[#261911]">
                          {name}
                        </h3>
                        <span className="text-[11px] text-[#594139] bg-[#f6ede8] px-2 py-0.5 rounded-full font-medium">
                          {subcity}
                        </span>
                      </div>

                      <p className="text-[13px] text-[#594139] leading-snug">
                        {sites}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8f5e9] text-[#1b6d24] text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1b6d24] animate-pulse"></span>
                          {badge}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffeadf] text-[#a73400] text-[11px] font-semibold">
                          <span className="material-symbols-outlined text-[13px]">motorcycle</span>
                          {zone.deliveryEta}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Radio indicator */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                      isSelected
                        ? 'bg-[#a73400] border-[#a73400] text-white'
                        : 'border-[#c9b5ac] bg-white'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Condominium Landmark tip */}
        <div className="p-3.5 rounded-2xl bg-[#ffeadf] flex items-start gap-2.5 text-[13px] text-[#594139]">
          <span className="material-symbols-outlined text-[#a73400] text-[20px] shrink-0 mt-0.5">info</span>
          <p>
            {isAm
              ? 'አድራሾቻችን የኮንዶሚኒየም ሳይት ቁጥር፣ የብሎክ ቁጥር እና በር በትክክል ስለሚያውቁ ትዕዛዝዎ በፍጥነት ይደርሳል።'
              : 'Our local riders know every condominium site, block gate, and landmark for seamless direct-to-door delivery.'}
          </p>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <button
            onClick={handleProceed}
            className="w-full bg-[#a73400] hover:bg-[#963000] text-white font-bold py-4 px-6 rounded-2xl shadow-[0_16px_36px_-14px_rgba(167,52,0,0.6)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-[15px]"
          >
            <span>
              {isAm ? 'ማዘዝ ጀምር' : 'Continue to Home'}
            </span>
            <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
