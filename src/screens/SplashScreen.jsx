import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import TibebStripe from '../components/TibebStripe';

export default function SplashScreen() {
  const { navigateTo, lang } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('onboarding');
    }, 2400);
    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div
      onClick={() => navigateTo('onboarding')}
      className="min-h-[85vh] flex flex-col justify-between items-center bg-[#fff8f5] px-6 py-10 cursor-pointer select-none relative overflow-hidden"
    >
      <TibebStripe className="absolute top-0 left-0 right-0 h-1.5" />

      {/* Decorative glow in background */}
      <div className="absolute w-72 h-72 rounded-full bg-[#ffdbcf]/50 blur-3xl pointer-events-none -top-10 -right-10"></div>
      <div className="absolute w-72 h-72 rounded-full bg-[#ffdcbe]/40 blur-3xl pointer-events-none -bottom-10 -left-10"></div>

      {/* Top tiny area pill */}
      <div className="z-10 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffeadf] text-[#a73400] text-[12px] font-semibold shadow-level-1">
          <span className="w-2 h-2 rounded-full bg-[#1b6d24] animate-pulse"></span>
          <span>Tuludimtu • Koye Feche • Akaki Kality</span>
        </div>
      </div>

      {/* Center Brand Identity */}
      <div className="z-10 flex flex-col items-center text-center space-y-4 my-auto">
        {/* Animated Brand Logo Container */}
        <div className="relative group">
          <div className="w-28 h-28 rounded-3xl bg-white shadow-level-3 p-2 flex items-center justify-center relative overflow-hidden transition-transform duration-500 hover:scale-105">
            <img
              src="/senik-logo.jpg"
              alt="ስንቅ (Senik) Logo"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
          {/* Subtle pulse ring around logo */}
          <div className="absolute -inset-2 rounded-[28px] border-2 border-[#a73400]/20 animate-pulse pointer-events-none"></div>
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-1">
          <h1 className="font-display font-black text-4xl sm:text-5xl text-[#a73400] tracking-tight drop-shadow-sm">
            ስንቅ
          </h1>
          <p className="font-display font-extrabold text-xl text-[#aa6400] tracking-widest">
            SENIK
          </p>
        </div>

        <p className="text-[#594139] text-[15px] max-w-[250px] font-medium leading-relaxed">
          {lang === 'am' ? 'የሰፈርዎ ፈጣን አቅርቦት' : 'Your neighborhood, delivered.'}
        </p>
      </div>

      {/* Footer loading / prompt */}
      <div className="z-10 flex flex-col items-center gap-3 pb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#a73400] animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 rounded-full bg-[#aa6400] animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 rounded-full bg-[#1b6d24] animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
        <span className="text-[12px] text-[#8d7168] font-medium">
          {lang === 'am' ? 'ለመቀጠል ይንኩ • Tap anywhere to enter' : 'Tap anywhere to enter • ለመቀጠል ይንኩ'}
        </span>
      </div>
    </div>
  );
}
