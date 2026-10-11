import React from 'react';

/**
 * About Senik modal — presentational only.
 * Receives data + callbacks via props (AGENTS.md §3).
 */
export default function AboutModal({ isOpen, onClose, isAm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[360px] bg-[#fff8f5] rounded-3xl p-6 shadow-2xl z-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-level-2 mx-auto p-1">
          <img src="/senik-logo.jpg" alt="ስንቅ Logo" className="w-full h-full object-contain rounded-xl" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display font-black text-[24px] text-[#a73400]">ስንቅ • SENIK</h3>
          <p className="text-[13px] font-semibold text-[#aa6400]">Hyperlocal Delivery Startup Prototype</p>
          <span className="inline-block text-[11px] bg-[#ffeadf] text-[#a73400] px-3 py-1 rounded-full font-bold">
            Tuludimtu • Koye Feche • Akaki Kality
          </span>
        </div>

        <p className="text-[13px] text-[#594139] leading-relaxed">
          {isAm
            ? 'ስንቅ የአዲስ አበባ ነዋሪዎችን ከአቅራቢያቸው ምግብ ቤቶች፣ ሸቀጣ ሸቀጦች እና ፋርማሲዎች ጋር የሚያገናኝ ፈጣን የሰፈር ማድረሻ መተግበሪያ ነው።'
            : 'Senik connects suburban Addis Ababa neighborhoods with nearby restaurants, grocery merchants, and pharmacies with hyperfast local delivery.'}
        </p>

        <button
          onClick={onClose}
          className="w-full bg-[#a73400] hover:bg-[#963000] text-white font-bold py-3 rounded-2xl text-[14px] active:scale-95 transition-all shadow-[0_12px_28px_-14px_rgba(167,52,0,0.6)]"
        >
          {isAm ? 'እሺ' : 'Close'}
        </button>
      </div>
    </div>
  );
}
