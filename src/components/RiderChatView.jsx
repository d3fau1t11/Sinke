import React, { useState } from 'react';

/**
 * Rider chat conversation: messages, quick replies, input.
 * Owns its local message state; parent only decides when to show this view.
 */
export default function RiderChatView({ isAm }) {
  const [messages, setMessages] = useState([
    {
      from: 'rider',
      textAm: 'ሰላም ወንድም ዳዊት፣ ትዕዛዝዎ ተነስቷል! ቶታል ማደያ ጋር ደርሻለሁ።',
      textEn: 'Hello brother Dawit, order picked up! Passing Total gas station now.',
      time: '12:48 PM'
    },
    {
      from: 'user',
      textAm: 'እሺ ወንድም፣ ሳይት 2 ብሎክ 42 በር 3 ጋር ጠብቅሃለሁ።',
      textEn: 'Okay brother, waiting at Site 2 Block 42 Gate 3.',
      time: '12:49 PM'
    },
    {
      from: 'rider',
      textAm: 'ገባኝ! በ3 ደቂቃ በር ላይ ነኝ።',
      textEn: 'Got it! Arriving at the gate in 3 minutes.',
      time: '12:50 PM'
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: 'user', textAm: inputVal, textEn: inputVal, time: 'Just Now' }
    ]);
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
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] shadow-level-1 ${
                  isRider
                    ? 'bg-white text-[#261911] rounded-tl-sm'
                    : 'bg-[#a73400] text-white rounded-tr-sm'
                }`}
              >
                <p className="leading-snug">{isAm ? m.textAm : m.textEn}</p>
                <span
                  className={`text-[10px] block text-right mt-1 ${isRider ? 'text-[#8d7168]' : 'text-white/80'}`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick response chips */}
      <div className="px-2.5 py-1.5 bg-[#fff1eb] border-t border-[#f3ebe6] flex gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setInputVal(isAm ? 'በር 3 ላይ ነኝ' : 'At Gate 3')}
          className="text-[12px] bg-white text-[#a73400] font-semibold px-3 py-1.5 rounded-full shrink-0 shadow-level-1"
        >
          {isAm ? '📍 በር 3 ላይ ነኝ' : '📍 At Gate 3'}
        </button>
        <button
          onClick={() => setInputVal(isAm ? 'ቴሌብር ከፍያለሁ' : 'Paid with telebirr')}
          className="text-[12px] bg-white text-[#a73400] font-semibold px-3 py-1.5 rounded-full shrink-0 shadow-level-1"
        >
          {isAm ? '💳 ቴሌብር ከፍያለሁ' : '💳 Paid telebirr'}
        </button>
        <button
          onClick={() => setInputVal(isAm ? 'እሺ እየጠበቅኩ ነው' : 'Okay waiting')}
          className="text-[12px] bg-white text-[#a73400] font-semibold px-3 py-1.5 rounded-full shrink-0 shadow-level-1"
        >
          {isAm ? '👍 እሺ' : '👍 Okay'}
        </button>
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-2.5 bg-white border-t border-[#f3ebe6] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={isAm ? 'መልእክት ይጻፉ...' : 'Type a message...'}
          className="flex-1 min-w-0 px-3.5 py-2.5 text-[14px] bg-[#fff8f5] rounded-full border border-[#eadfd9] focus:border-[#a73400] focus:ring-4 focus:ring-[#a73400]/10 outline-none transition-all text-[#261911]"
        />
        <button
          type="submit"
          className="w-9 h-9 rounded-full bg-[#a73400] text-white flex items-center justify-center active:scale-90 transition-all shadow-sm shrink-0"
          aria-label="Send message"
        >
          <span className="material-symbols-outlined text-[17px]">send</span>
        </button>
      </form>
    </div>
  );
}
