import React from 'react';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';

export default function OrderConfirmationScreen() {
  const { lang, activeTrackingOrder, navigateTo } = useApp();
  const isAm = lang === 'am';

  const order = activeTrackingOrder;

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-24">
      <HeaderBar title={isAm ? 'ትዕዛዝ ተረጋግጧል' : 'Order Confirmed'} />

      <div className="flex-1 px-4 py-6 space-y-5 flex flex-col items-center">
        {/* Success Icon & Animation */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#1b6d24] border-4 border-[#a0f399]/50 shadow-lg">
            <span className="material-symbols-outlined text-[42px] fill-icon">check_circle</span>
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-[#1b6d24]/20 animate-pulse pointer-events-none"></div>
        </div>

        {/* Confirmation Headings */}
        <div className="text-center space-y-1">
          <span className="inline-block bg-[#ffeadf] text-[#a73400] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {order.id}
          </span>
          <h2 className="font-display font-black text-2xl text-[#261911]">
            {isAm ? 'ትዕዛዝዎ በተሳካ ሁኔታ ተቀምጧል!' : 'Order Placed Successfully!'}
          </h2>
          <p className="text-xs text-[#594139] max-w-[280px]">
            {isAm
              ? 'ሱቁ ትዕዛዝዎን ተቀብሎ ዝግጅት ጀምሯል። አድራሽ በቅርቡ ይደርሳል።'
              : 'The merchant has received your order and started preparation.'}
          </p>
        </div>

        {/* Order Receipt Card */}
        <div className="w-full bg-white rounded-2xl p-4 border border-[#e1bfb5] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#f7ddd0]">
            <div className="flex items-center gap-2.5">
              <img
                src={order.businessImage}
                alt={order.businessNameAm}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-display font-bold text-xs text-[#261911]">
                  {isAm ? order.businessNameAm : order.businessNameEn}
                </h4>
                <p className="text-[10px] text-[#594139]">{order.dateStr}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#594139] block">{isAm ? 'የሚደርስበት' : 'ETA'}</span>
              <span className="font-bold text-xs text-[#1b6d24] bg-[#e8f5e9] px-2 py-0.5 rounded">
                ~{order.etaMinutes || 25} {isAm ? 'ደቂቃ' : 'mins'}
              </span>
            </div>
          </div>

          {/* Ordered Items Preview */}
          <div className="space-y-1.5 py-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs text-[#594139]">
                <span>
                  {item.quantity}x {isAm ? item.nameAm : item.nameEn}
                </span>
                <span className="font-semibold text-[#261911]">
                  {item.price * item.quantity} {isAm ? 'ብር' : 'ETB'}
                </span>
              </div>
            ))}
          </div>

          {/* Location Landmark */}
          <div className="pt-2 border-t border-[#f7ddd0] flex items-start gap-2 text-[11px] text-[#594139]">
            <span className="material-symbols-outlined text-[#a73400] text-[16px] shrink-0 mt-0.5">location_on</span>
            <span className="line-clamp-2">{order.deliveryLocation}</span>
          </div>

          {/* Total */}
          <div className="pt-2 border-t border-[#f7ddd0] flex justify-between items-center text-sm font-bold">
            <span className="text-[#261911]">{isAm ? 'የተከፈለ ጠቅላላ ድምር' : 'Total Paid'}</span>
            <span className="font-display font-extrabold text-[#a73400] text-base">
              {order.total} {isAm ? 'ብር' : 'ETB'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2 pt-2">
          <button
            onClick={() => navigateTo('order-tracking', { orderId: order.id })}
            className="w-full bg-[#a73400] hover:bg-[#cb4914] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
            <span>{isAm ? 'ትዕዛዙን የቀጥታ ይከታተሉ' : 'Track Live Delivery'}</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="w-full bg-white hover:bg-[#fff1eb] text-[#594139] border border-[#e1bfb5] font-bold py-3 px-6 rounded-2xl active:scale-[0.98] transition-all text-xs"
          >
            {isAm ? 'ወደ ዋና ገጽ ተመለስ' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );
}
