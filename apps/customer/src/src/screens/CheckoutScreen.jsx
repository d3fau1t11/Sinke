import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';

export default function CheckoutScreen() {
  const {
    lang,
    activeZoneObj,
    subtotal,
    deliveryFee,
    serviceFee,
    discountAmount,
    totalAmount,
    placeOrder,
    navigateTo,
    showToast
  } = useApp();

  const isAm = lang === 'am';

  const [address, setAddress] = useState(
    isAm
      ? `${activeZoneObj.nameAm}፣ ሳይት 2 ኮንዶሚኒየም፣ ብሎክ 42፣ በር 3`
      : `${activeZoneObj.nameEn}, Site 2 Condominium, Block 42, Gate 3`
  );
  const [phone, setPhone] = useState('0911234567');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('telebirr'); // 'telebirr', 'cbe', 'cash'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      showToast(isAm ? 'እባክዎን ትክክለኛ ስልክ ቁጥር ያስገቡ' : 'Please enter a valid phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        address,
        phone,
        instructions,
        paymentMethod
      });
      setIsSubmitting(false);
    }, 900);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-28">
      <HeaderBar
        showBack={true}
        onBack={() => navigateTo('cart')}
        title={isAm ? 'ክፍያ እና ማድረሻ' : 'Checkout'}
      />

      <form onSubmit={handleSubmitOrder} className="flex-1 px-4 py-3 space-y-4">
        {/* Delivery Location Section */}
        <section className="bg-white rounded-2xl p-4 border border-[#e1bfb5] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xs text-[#261911] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#a73400] text-[18px]">location_on</span>
              <span>{isAm ? 'የማድረሻ አድራሻ' : 'Delivery Address'}</span>
            </h3>
            <span className="text-[11px] text-[#1b6d24] font-bold bg-[#e8f5e9] px-2 py-0.5 rounded-full">
              {isAm ? activeZoneObj.nameAm : activeZoneObj.nameEn}
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#594139] block">
              {isAm ? 'ኮንዶሚኒየም / መንደር / ብሎክ' : 'Condominium Site / Block / Gate'}
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-[#fff8f5] rounded-xl border border-[#e1bfb5] focus:outline-none focus:border-[#a73400] text-[#261911] font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#594139] block">
              {isAm ? 'ለአድራሹ ተጨማሪ መመሪያ (አማራጭ)' : 'Delivery Notes & Landmark (Optional)'}
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={isAm ? "ምሳሌ፡ ቶታል ጋ፣ 3ኛ ፎቅ ወይም ደውልልኝ..." : "e.g., Near Total Station, 3rd floor..."}
              className="w-full px-3 py-2 text-xs bg-[#fff8f5] rounded-xl border border-[#e1bfb5] focus:outline-none focus:border-[#a73400] text-[#261911]"
            />
          </div>
        </section>

        {/* Contact Phone Section */}
        <section className="bg-white rounded-2xl p-4 border border-[#e1bfb5] shadow-2xs space-y-2">
          <h3 className="font-display font-bold text-xs text-[#261911] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a73400] text-[18px]">call</span>
            <span>{isAm ? 'ተቀባይ ስልክ ቁጥር' : 'Contact Phone Number'}</span>
          </h3>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-[#fff1eb] border border-[#e1bfb5] text-xs font-bold text-[#261911] shrink-0">
              <span>🇪🇹</span>
              <span>+251</span>
            </div>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="911234567"
              className="flex-1 px-3 py-2.5 text-xs bg-[#fff8f5] rounded-xl border border-[#e1bfb5] focus:outline-none focus:border-[#a73400] font-mono font-bold text-[#261911]"
            />
          </div>
        </section>

        {/* Payment Methods (Demo Local Integrations) */}
        <section className="bg-white rounded-2xl p-4 border border-[#e1bfb5] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xs text-[#261911] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#a73400] text-[18px]">payments</span>
              <span>{isAm ? 'የክፍያ ዘዴ' : 'Payment Method'}</span>
            </h3>
            <span className="text-[10px] text-[#aa6400] font-bold bg-[#ffdcbe]/60 px-2 py-0.5 rounded">
              DEMO MODE
            </span>
          </div>

          <div className="space-y-2">
            {/* Telebirr */}
            <label
              onClick={() => setPaymentMethod('telebirr')}
              className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'telebirr'
                  ? 'bg-[#e8f5e9] border-[#1b6d24] text-[#1b6d24]'
                  : 'bg-white border-[#e1bfb5] text-[#261911]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0082c8]/10 flex items-center justify-center font-black text-[#0082c8] text-xs">
                  TB
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#261911]">ቴሌብር (telebirr)</h4>
                  <p className="text-[10px] text-[#594139]">
                    {isAm ? 'በቴሌብር ፈጣን የሞባይል ክፍያ' : 'Instant digital wallet payment'}
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'telebirr' ? 'bg-[#1b6d24] border-[#1b6d24] text-white' : 'border-[#8d7168]'
                }`}
              >
                {paymentMethod === 'telebirr' && (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                )}
              </div>
            </label>

            {/* CBE Birr / Chapa */}
            <label
              onClick={() => setPaymentMethod('cbe')}
              className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'cbe'
                  ? 'bg-[#ffeadf] border-[#a73400] text-[#a73400]'
                  : 'bg-white border-[#e1bfb5] text-[#261911]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#7c2079]/10 flex items-center justify-center font-black text-[#7c2079] text-xs">
                  CBE
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#261911]">ሲቢኢ ብር / Chapa (CBE Birr)</h4>
                  <p className="text-[10px] text-[#594139]">
                    {isAm ? 'የኢትዮጵያ ንግድ ባንክ ሞባይል ክፍያ' : 'Commercial Bank of Ethiopia'}
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'cbe' ? 'bg-[#a73400] border-[#a73400] text-white' : 'border-[#8d7168]'
                }`}
              >
                {paymentMethod === 'cbe' && (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                )}
              </div>
            </label>

            {/* Cash on Delivery */}
            <label
              onClick={() => setPaymentMethod('cash')}
              className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'cash'
                  ? 'bg-[#ffeadf] border-[#a73400] text-[#a73400]'
                  : 'bg-white border-[#e1bfb5] text-[#261911]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1b6d24]/10 flex items-center justify-center text-[#1b6d24]">
                  <span className="material-symbols-outlined text-[20px]">local_atm</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#261911]">
                    {isAm ? 'ሲደርስ በጥሬ ገንዘብ' : 'Cash on Delivery'}
                  </h4>
                  <p className="text-[10px] text-[#594139]">
                    {isAm ? 'አድራሹ እቃውን ሲያስረክብ ይክፈሉ' : 'Pay in cash directly to rider'}
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'cash' ? 'bg-[#a73400] border-[#a73400] text-white' : 'border-[#8d7168]'
                }`}
              >
                {paymentMethod === 'cash' && (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                )}
              </div>
            </label>
          </div>
        </section>

        {/* Order Summary Recap */}
        <section className="bg-white rounded-2xl p-4 border border-[#e1bfb5] shadow-2xs space-y-2 text-xs text-[#594139]">
          <div className="flex justify-between font-extrabold text-sm text-[#a73400]">
            <span>{isAm ? 'የሚከፈል ጠቅላላ ድምር' : 'Total to Pay'}</span>
            <span className="font-display text-base">{totalAmount} {isAm ? 'ብር' : 'ETB'}</span>
          </div>
        </section>

        {/* Submit Order Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#a73400] hover:bg-[#cb4914] disabled:bg-[#8d7168] text-white font-bold py-4 px-6 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{isAm ? 'ትዕዛዙ እየተላከ ነው...' : 'Placing order...'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>{isAm ? 'ትዕዛዙን አረጋግጥና እዘዝ' : 'Confirm & Place Order'}</span>
                <span>({totalAmount} {isAm ? 'ብር' : 'ETB'})</span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
