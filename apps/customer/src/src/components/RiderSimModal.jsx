import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function RiderSimModal({ isOpen, onClose, mode = 'call', rider = null }) {
  const { lang } = useApp();
  const isAm = lang === 'am';
  const [messages, setMessages] = useState([
    { from: 'rider', textAm: 'ሰላም ወንድም ዳዊት፣ ትዕዛዝዎ ተነስቷል! ቶታል ማደያ ጋር ደርሻለሁ።', textEn: 'Hello brother Dawit, order picked up! Passing Total gas station now.', time: '12:48 PM' },
    { from: 'user', textAm: 'እሺ ወንድም፣ ሳይት 2 ብሎክ 42 በር 3 ጋር ጠብቅሃለሁ።', textEn: 'Okay brother, waiting at Site 2 Block 42 Gate 3.', time: '12:49 PM' },
    { from: 'rider', textAm: 'ገባኝ! በ3 ደቂቃ በር ላይ ነኝ።', textEn: 'Got it! Arriving at the gate in 3 minutes.', time: '12:50 PM' }
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const defaultRider = rider || {
    name: isAm ? "አበበ ከበደ" : "Abebe Kebede",
    phone: "+251 91 245 8899",
    vehicle: "TVS King ባጃጅ • 3-38914 አ.አ",
    rating: "4.9 ★",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const newMsg = {
      from: 'user',
      textAm: inputVal,
      textEn: inputVal,
      time: 'Just Now'
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    // Auto simulated response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: 'rider',
          textAm: 'እሺ ወንድሜ ደርሻለሁ አመሰግናለሁ!',
          textEn: 'Okay brother, almost there, thanks!',
          time: 'Just Now'
        }
      ]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[380px] bg-[#fff8f5] rounded-3xl overflow-hidden shadow-2xl border border-[#e1bfb5] z-10 animate-scaleUp">
        {/* Header */}
        <div className="bg-[#261911] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={defaultRider.avatar}
              alt={defaultRider.name}
              className="w-10 h-10 rounded-full object-cover border border-[#8d7168]"
            />
            <div>
              <h3 className="font-display font-bold text-sm text-[#ffdbcf] leading-tight">
                {defaultRider.name}
              </h3>
              <p className="text-[11px] text-[#efd5c8] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b6d24] animate-pulse"></span>
                {defaultRider.vehicle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
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
              <h4 className="font-display font-bold text-lg text-[#261911]">
                {defaultRider.name}
              </h4>
              <p className="font-mono text-sm text-[#594139] mt-0.5">
                {defaultRider.phone}
              </p>
              <div className="inline-flex items-center gap-1 mt-2 px-3 py-0.5 rounded-full bg-[#e8f5e9] text-[#1b6d24] text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">sensors</span>
                {isAm ? 'ጥሪ ላይ ነው (00:24)' : 'In Call (00:24)'}
              </div>
            </div>

            <p className="text-xs text-[#594139] bg-[#fff1eb] p-3 rounded-xl border border-[#e1bfb5] italic">
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
        {mode === 'chat' && (
          <div className="flex flex-col h-[340px]">
            {/* Messages body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#fdfbf7]">
              {messages.map((m, idx) => {
                const isRider = m.from === 'rider';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isRider ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs shadow-2xs ${
                        isRider
                          ? 'bg-white text-[#261911] border border-[#e1bfb5] rounded-tl-xs'
                          : 'bg-[#a73400] text-white rounded-tr-xs'
                      }`}
                    >
                      <p>{isAm ? m.textAm : m.textEn}</p>
                      <span className={`text-[9px] block text-right mt-1 ${isRider ? 'text-[#8d7168]' : 'text-white/80'}`}>
                        {m.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick response chips */}
            <div className="px-2 py-1 bg-[#fff1eb] border-t border-[#e1bfb5] flex gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setInputVal(isAm ? 'በር 3 ላይ ነኝ' : 'At Gate 3')}
                className="text-[10px] bg-white border border-[#e1bfb5] text-[#a73400] font-semibold px-2 py-0.5 rounded-full shrink-0"
              >
                {isAm ? '📍 በር 3 ላይ ነኝ' : '📍 At Gate 3'}
              </button>
              <button
                onClick={() => setInputVal(isAm ? 'ቴሌብር ከፍያለሁ' : 'Paid with telebirr')}
                className="text-[10px] bg-white border border-[#e1bfb5] text-[#a73400] font-semibold px-2 py-0.5 rounded-full shrink-0"
              >
                {isAm ? '💳 ቴሌብር ከፍያለሁ' : '💳 Paid telebirr'}
              </button>
              <button
                onClick={() => setInputVal(isAm ? 'እሺ እየጠበቅኩ ነው' : 'Okay waiting')}
                className="text-[10px] bg-white border border-[#e1bfb5] text-[#a73400] font-semibold px-2 py-0.5 rounded-full shrink-0"
              >
                {isAm ? '👍 እሺ' : '👍 Okay'}
              </button>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-2 bg-white border-t border-[#e1bfb5] flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={isAm ? "መልእክት ይጻፉ..." : "Type a message..."}
                className="flex-1 px-3 py-2 text-xs bg-[#fff8f5] rounded-full border border-[#e1bfb5] focus:outline-none focus:border-[#a73400] text-[#261911]"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-[#a73400] text-white flex items-center justify-center active:scale-90 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
