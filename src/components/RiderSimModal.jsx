import React from 'react';
import { useApp } from '../context/AppContext';
import RiderChatView from './RiderChatView';

export default function RiderSimModal({ isOpen, onClose, mode = 'call', rider = null }) {
  const { lang } = useApp();
  const isAm = lang === 'am';

  if (!isOpen) return null;

  const defaultRider = rider || {
    name: isAm ? "አበበ ከበደ" : "Abebe Kebede",
    phone: "+251 91 245 8899",
    vehicle: "TVS King ባጃጅ • 3-38914 አ.አ",
    rating: "4.9 ★",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[380px] bg-[#fff8f5] rounded-3xl overflow-hidden shadow-2xl z-10 animate-scaleUp">
        {/* Header */}
        <div className="bg-[#261911] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={defaultRider.avatar}
              alt={defaultRider.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-display font-bold text-[15px] text-[#ffdbcf] leading-tight">
                {defaultRider.name}
              </h3>
              <p className="text-[12px] text-[#efd5c8] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b6d24] animate-pulse"></span>
                {defaultRider.vehicle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all text-white"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[19px]">close</span>
          </button>
        </div>

        {/* Mode: Phone Call Simulation */}
        {mode === 'call' && (
          <div className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#ffeadf] flex items-center justify-center border-4 border-[#a73400]/20 animate-pulse">
                <img
                  src={defaultRider.avatar}
                  alt={defaultRider.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-[#1b6d24] text-white p-1.5 rounded-full shadow-md">
                <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-[19px] text-[#261911]">
                {defaultRider.name}
              </h4>
              <p className="font-mono text-[15px] text-[#594139] mt-0.5">
                {defaultRider.phone}
              </p>
              <div className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-[#e8f5e9] text-[#1b6d24] text-[13px] font-semibold">
                <span className="material-symbols-outlined text-[15px]">sensors</span>
                {isAm ? 'ጥሪ ላይ ነው (00:24)' : 'In Call (00:24)'}
              </div>
            </div>

            <p className="text-[13px] text-[#594139] bg-[#fff1eb] p-3.5 rounded-xl italic leading-relaxed">
              {isAm 
                ? '“ሰላም ዳዊት! ባጃጅ ላይ ነኝ በር 3 ጋ ስደርስ እደውልልሃለሁ።”'
                : '“Hello Dawit! On my Bajaj now, will ring you as soon as I pull up to Gate 3.”'}
            </p>

            <div className="flex items-center justify-center gap-6 pt-2 w-full">
              <button
                onClick={onClose}
                className="w-14 h-14 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shadow-lg active:scale-90 transition-all"
                title="End Call"
              >
                <span className="material-symbols-outlined text-[24px]">call_end</span>
              </button>
            </div>
          </div>
        )}

        {/* Mode: Chat Simulation */}
        {mode === 'chat' && <RiderChatView isAm={isAm} />}
      </div>
    </div>
  );
}
