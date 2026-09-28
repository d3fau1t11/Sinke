import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';
import RiderSimModal from '../components/RiderSimModal';

export default function OrderTrackingScreen() {
  const {
    lang,
    activeTrackingOrder,
    trackingStageIndex,
    setTrackingStageIndex,
    isAutoTracking,
    setIsAutoTracking,
    navigateTo,
    showToast
  } = useApp();

  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simMode, setSimMode] = useState('call'); // 'call' or 'chat'
  const isAm = lang === 'am';

  const order = activeTrackingOrder;

  const stages = [
    {
      id: 'confirmed',
      titleAm: 'ትዕዛዝ ተረጋግጧል',
      titleEn: 'Order Confirmed',
      descAm: 'ሱቁ ትዕዛዝዎን ተቀብሎ አረጋግጧል',
      descEn: 'Store accepted & confirmed order',
      icon: 'check_circle'
    },
    {
      id: 'preparing',
      titleAm: 'በመዘጋጀት ላይ ነው',
      titleEn: 'Preparing Order',
      descAm: 'ምግቡ ትኩስ ሆኖ እየተዘጋጀ ነው',
      descEn: 'Kitchen is preparing your items',
      icon: 'restaurant'
    },
    {
      id: 'rider_assigned',
      titleAm: 'አድራሽ ተመድቧል',
      titleEn: 'Rider Assigned',
      descAm: 'አበበ ከበደ (ባጃጅ) ተመድቧል',
      descEn: 'Abebe Kebede (Bajaj) assigned',
      icon: 'two_wheeler'
    },
    {
      id: 'picked_up',
      titleAm: 'ትዕዛዙ ተነስቷል',
      titleEn: 'Order Picked Up',
      descAm: 'አድራሹ እቃውን ከሱቅ ተረክቧል',
      descEn: 'Rider picked up package',
      icon: 'inventory_2'
    },
    {
      id: 'on_way',
      titleAm: 'በመንገድ ላይ ነው',
      titleEn: 'On the Way',
      descAm: 'ወደ እርስዎ ኮንዶሚኒየም እየመጣ ነው',
      descEn: 'Heading to your condo gate',
      icon: 'navigation'
    },
    {
      id: 'delivered',
      titleAm: 'ደርሷል!',
      titleEn: 'Delivered!',
      descAm: 'መልካም ምግብ! ስንቅን ስለመረጡ እናመሰግናለን።',
      descEn: 'Delivered! Enjoy your meal.',
      icon: 'task_alt'
    }
  ];

  const currentStage = stages[trackingStageIndex] || stages[0];

  const handleOpenSim = (mode) => {
    setSimMode(mode);
    setSimModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-28">
      <HeaderBar
        showBack={true}
        onBack={() => navigateTo('orders')}
        title={isAm ? 'የቀጥታ ትዕዛዝ መከታተያ' : 'Live Order Tracking'}
      />

      {/* Simulated Map Banner */}
      <div className="relative h-60 w-full custom-map-grid border-b border-[#e1bfb5] overflow-hidden">
        {/* Map Route SVG Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 50 180 Q 150 120 220 150 T 360 60"
            fill="none"
            stroke="#a73400"
            strokeWidth="4"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
        </svg>

        {/* Origin: Merchant Pin */}
        <div className="absolute left-8 bottom-8 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#aa6400] text-white flex items-center justify-center shadow-md border-2 border-white">
            <span className="material-symbols-outlined text-[16px]">storefront</span>
          </div>
          <span className="text-[9px] font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1 text-[#261911]">
            {isAm ? order.businessNameAm : order.businessNameEn}
          </span>
        </div>

        {/* Destination: Customer Landmark Pin */}
        <div className="absolute right-8 top-8 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#1b6d24] text-white flex items-center justify-center shadow-md border-2 border-white">
            <span className="material-symbols-outlined text-[16px]">home</span>
          </div>
          <span className="text-[9px] font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1 text-[#261911]">
            {isAm ? 'ሳይት 2 ብሎክ 42' : 'Site 2 Condo'}
          </span>
        </div>

        {/* Moving Rider Icon with Radar Pulse */}
        <div
          className="absolute transition-all duration-700 flex flex-col items-center"
          style={{
            left: `${20 + trackingStageIndex * 13}%`,
            top: `${65 - trackingStageIndex * 8}%`
          }}
        >
          {/* Radar Ring */}
          <div className="absolute -inset-3 rounded-full bg-[#a73400]/30 animate-pulse-ring pointer-events-none"></div>

          <div className="w-10 h-10 rounded-full bg-[#a73400] text-white flex items-center justify-center shadow-xl border-2 border-white z-10">
            <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
          </div>
          <div className="bg-[#261911] text-white text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 shadow-md z-10 whitespace-nowrap">
            {trackingStageIndex === 5 ? (isAm ? 'ደርሷል!' : 'Arrived!') : (isAm ? 'በጉዞ ላይ' : 'In Transit')}
          </div>
        </div>

        {/* Map Top Status Pill */}
        <div className="absolute top-3 left-4 right-4 flex justify-between items-center z-10">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#e1bfb5] shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1b6d24] animate-pulse"></span>
            <span className="text-xs font-bold text-[#261911]">
              {trackingStageIndex === 5 
                ? (isAm ? 'ትዕዛዝዎ ደርሷል!' : 'Order Delivered!') 
                : `${isAm ? 'የሚደርስበት' : 'ETA'}: ~${Math.max(2, 25 - trackingStageIndex * 5)} ${isAm ? 'ደቂቃ' : 'mins'}`}
            </span>
          </div>

          <span className="bg-[#261911]/90 text-white font-mono text-xs px-2.5 py-1 rounded-full font-bold">
            {order.id}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="px-4 py-3 space-y-4">
        {/* Rider Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#e1bfb5] shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={order.rider?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt="Rider"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#ffdbcf]"
            />
            <div>
              <h4 className="font-display font-bold text-xs text-[#261911]">
                {order.rider?.name || (isAm ? 'አበበ ከበደ' : 'Abebe Kebede')}
              </h4>
              <p className="text-[11px] text-[#594139]">{order.rider?.vehicle || 'TVS King ባጃጅ • 3-38914'}</p>
              <div className="flex items-center gap-1 text-[10px] text-[#aa6400] font-bold">
                <span className="material-symbols-outlined text-[13px] fill-icon">star</span>
                <span>{order.rider?.rating || '4.9 ★'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Call & Chat */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleOpenSim('call')}
              className="w-9 h-9 rounded-full bg-[#1b6d24] text-white flex items-center justify-center active:scale-90 transition-all shadow-xs"
              title="Call Rider"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
            </button>
            <button
              onClick={() => handleOpenSim('chat')}
              className="w-9 h-9 rounded-full bg-[#a73400] text-white flex items-center justify-center active:scale-90 transition-all shadow-xs"
              title="Message Rider"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
            </button>
          </div>
        </div>

        {/* 6-Stage Delivery Timeline */}
        <div className="bg-white rounded-2xl p-4 border border-[#e1bfb5] shadow-2xs space-y-3">
          <h3 className="font-display font-bold text-xs text-[#261911] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a73400] text-[18px]">timeline</span>
            <span>{isAm ? 'የትዕዛዝ ሂደት ደረጃዎች' : 'Delivery Timeline'}</span>
          </h3>

          <div className="space-y-4 pt-1 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#f7ddd0]">
            {stages.map((stage, idx) => {
              const isPast = idx < trackingStageIndex;
              const isCurrent = idx === trackingStageIndex;
              const title = isAm ? stage.titleAm : stage.titleEn;
              const desc = isAm ? stage.descAm : stage.descEn;

              return (
                <div key={stage.id} className="flex items-start gap-3 relative z-10">
                  {/* Step bead indicator */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isPast
                        ? 'bg-[#1b6d24] text-white'
                        : isCurrent
                        ? 'bg-[#a73400] text-white ring-4 ring-[#ffdbcf] animate-pulse'
                        : 'bg-[#fff1eb] text-[#8d7168] border border-[#e1bfb5]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isPast ? 'check' : stage.icon}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h4
                      className={`text-xs font-bold leading-tight ${
                        isCurrent
                          ? 'text-[#a73400]'
                          : isPast
                          ? 'text-[#1b6d24]'
                          : 'text-[#8d7168]'
                      }`}
                    >
                      {title}
                    </h4>
                    <p className="text-[11px] text-[#594139] leading-snug mt-0.5">
                      {desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demo Controls Section */}
        <div className="bg-[#ffeadf] rounded-2xl p-3.5 border border-[#e1bfb5] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-display font-extrabold text-xs text-[#a73400] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>{isAm ? 'የዴሞ ደረጃ መቆጣጠሪያ' : 'Demo Simulation Controls'}</span>
            </span>
            <button
              onClick={() => setIsAutoTracking(!isAutoTracking)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                isAutoTracking
                  ? 'bg-[#1b6d24] text-white border-[#1b6d24]'
                  : 'bg-white text-[#594139] border-[#e1bfb5]'
              }`}
            >
              {isAutoTracking ? (isAm ? 'ራስ-ሰር በርቷል' : 'Auto Active') : (isAm ? 'ራስ-ሰር አብራ' : 'Auto Advance')}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setTrackingStageIndex((s) => Math.max(0, s - 1))}
              disabled={trackingStageIndex <= 0}
              className="flex-1 bg-white hover:bg-[#fff1eb] disabled:opacity-40 text-[#261911] text-xs font-bold py-2 rounded-xl border border-[#e1bfb5] active:scale-95 transition-all shadow-2xs flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>{isAm ? 'ያለፈው ደረጃ' : 'Prev Step'}</span>
            </button>

            <span className="text-xs font-bold font-mono text-[#a73400] px-2">
              {trackingStageIndex + 1} / 6
            </span>

            <button
              onClick={() => setTrackingStageIndex((s) => Math.min(5, s + 1))}
              disabled={trackingStageIndex >= 5}
              className="flex-1 bg-[#a73400] hover:bg-[#cb4914] disabled:opacity-40 text-white text-xs font-bold py-2 rounded-xl active:scale-95 transition-all shadow-2xs flex items-center justify-center gap-1"
            >
              <span>{isAm ? 'ቀጣይ ደረጃ' : 'Next Step'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Driver Simulation Modal */}
      <RiderSimModal
        isOpen={simModalOpen}
        onClose={() => setSimModalOpen(false)}
        mode={simMode}
        rider={order.rider}
      />
    </div>
  );
}
