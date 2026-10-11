import React from 'react';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';

export default function OnboardingScreen() {
  const { lang, navigateTo } = useApp();
  const isAm = lang === 'am';

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-10">
      <HeaderBar />

      <div className="flex-1 px-4 py-3 space-y-4 flex flex-col">
        {/* Bento Hero Card */}
        <section className="w-full rounded-2xl bg-white p-4 shadow-level-1 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#ffeadf] pointer-events-none opacity-60"></div>
          
          <div className="flex flex-col gap-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffeadf] text-[#a73400] w-fit shadow-level-1">
              <span className="material-symbols-outlined text-[16px] fill-icon">local_shipping</span>
              <span className="text-[11px] uppercase tracking-[0.06em] font-bold">
                Koye Feche • Tuludimtu • Akaki
              </span>
            </div>

            <h2 className="font-display font-extrabold text-[22px] text-[#261911] leading-snug">
              {isAm ? 'የሰፈርዎ ፈጣን አቅርቦት' : 'Your neighborhood, delivered.'}
            </h2>
            
            <p className="text-[13px] text-[#594139] leading-relaxed">
              {isAm 
                ? 'የሚወዱት ትኩስ ምግብ፣ የየዕለት ሸቀጥና መድሃኒት በቀጥታ እስከ ኮንዶሚኒየም በርዎ ድረስ።'
                : 'Authentic local taste, daily essentials, and pharmacy right to your condominium gate.'}
            </p>
          </div>

          {/* Hero Visual Banner with Delivery Rider */}
          <div className="mt-3 w-full h-44 rounded-xl overflow-hidden relative bg-[#f7ddd0]">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80"
              alt="Senik Local Neighborhood Delivery"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-3">
              <span className="text-[12px] text-white flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg font-semibold">
                <span className="material-symbols-outlined text-[15px] text-[#a3f69c]">bolt</span>
                {isAm ? 'ከ20–35 ደቂቃ ባጃጅና ሞተር ማድረሻ' : '20–35 min Bajaj & Motor delivery'}
              </span>
            </div>
          </div>

          {/* Value Proposition Mini Grid */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#f3ebe6]">
            <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-[#fff8f5]">
              <div className="w-8 h-8 rounded-full bg-[#cb4914]/10 flex items-center justify-center text-[#a73400] mb-1.5">
                <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
              </div>
              <span className="text-[12px] font-bold text-[#261911]">
                {isAm ? '20–35 ደቂቃ' : '20–35 Mins'}
              </span>
              <span className="text-[11px] text-[#594139] leading-tight">
                {isAm ? 'ፈጣን ማድረሻ' : 'Hyperfast'}
              </span>
            </div>

            <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-[#fff8f5]">
              <div className="w-8 h-8 rounded-full bg-[#1b6d24]/10 flex items-center justify-center text-[#1b6d24] mb-1.5">
                <span className="material-symbols-outlined text-[18px]">restaurant</span>
              </div>
              <span className="text-[12px] font-bold text-[#261911]">
                {isAm ? 'ትኩስ ምግብ' : 'Fresh Meals'}
              </span>
              <span className="text-[11px] text-[#594139] leading-tight">
                {isAm ? 'ከምርጥ ሱቆች' : 'Top Kitchens'}
              </span>
            </div>

            <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-[#fff8f5]">
              <div className="w-8 h-8 rounded-full bg-[#aa6400]/10 flex items-center justify-center text-[#aa6400] mb-1.5">
                <span className="material-symbols-outlined text-[18px]">local_pharmacy</span>
              </div>
              <span className="text-[12px] font-bold text-[#261911]">
                {isAm ? 'መድሃኒትና ሸቀጥ' : 'Pharmacy'}
              </span>
              <span className="text-[11px] text-[#594139] leading-tight">
                {isAm ? 'የዕለት ፍላጎት' : 'Essentials'}
              </span>
            </div>
          </div>
        </section>

        {/* Coverage Neighborhoods Preview */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-[15px] text-[#261911] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#a73400]">pin_drop</span>
              <span>{isAm ? 'የአገልግሎት ክልሎች' : 'Active Service Zones'}</span>
            </h3>
            <span className="text-[12px] text-[#a73400] font-bold">
              Addis Ababa, ET
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-xl bg-white shadow-level-1">
              <p className="font-bold text-[13px] text-[#261911]">{isAm ? 'ኮዬ ፈጬ' : 'Koye Feche'}</p>
              <span className="text-[11px] text-[#1b6d24] font-medium block mt-0.5">Site 1 & 2</span>
            </div>
            <div className="p-3 rounded-xl bg-white shadow-level-1">
              <p className="font-bold text-[13px] text-[#261911]">{isAm ? 'ቱሉ ዲምቱ' : 'Tuludimtu'}</p>
              <span className="text-[11px] text-[#1b6d24] font-medium block mt-0.5">Total & Hub</span>
            </div>
            <div className="p-3 rounded-xl bg-white shadow-level-1">
              <p className="font-bold text-[13px] text-[#261911]">{isAm ? 'አቃቂ ቃሊቲ' : 'Akaki Kality'}</p>
              <span className="text-[11px] text-[#1b6d24] font-medium block mt-0.5">Central Hub</span>
            </div>
          </div>
        </section>

        {/* CTA Button */}
        <div className="pt-2 mt-auto">
          <button
            onClick={() => navigateTo('location-select')}
            className="w-full bg-[#a73400] hover:bg-[#963000] text-white font-bold py-4 px-6 rounded-2xl shadow-[0_16px_36px_-14px_rgba(167,52,0,0.6)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-[15px]"
          >
            <span>
              {isAm ? 'የእርስዎን ሰፈር ይምረጡ' : 'Choose Your Neighborhood'}
            </span>
            <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
