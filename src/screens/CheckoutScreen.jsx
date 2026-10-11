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

      <form onSubmit={handleSubmitOrder} className="flex-1 px-4 py-4 space-y-4">
        {/* Delivery Location Section */}
        <section className="bg-white rounded-2xl p-4 shadow-level-1 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-[14px] text-[#261911] uppercase tracking-[0.05em] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#a73400] text-[19px]">location_on</span>
              <span>{isAm ? 'የማድረሻ አድራሻ' : 'Delivery Address'}</span>
            </h3>
            <span className="text-[12px] text-[#1b6d24] font-bold bg-[#e8f5e9] px-2.5 py-1 rounded-full">
              {isAm ? activeZoneObj.nameAm : activeZoneObj.nameEn}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#594139] block">
              {isAm ? 'ኮንዶሚኒየም / መንደር / ብሎክ' : 'Condominium Site / Block / Gate'}
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-3 text-[15px] bg-white rounded-xl border border-[#eadfd9] focus:border-[#a73400] focus:ring-4 focus:ring-[#a73400]/10 outline-none transition-all text-[#261911] font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#594139] block">
              {isAm ? 'ለአድራሹ ተጨማሪ መመሪያ (አማራጭ)' : 'Delivery Notes & Landmark (Optional)'}
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={isAm ? "ምሳሌ፡ ቶታል ጋ፣ 3ኛ ፎቅ ወይም ደውልልኝ..." : "e.g., Near Total Station, 3rd floor..."}
              className="w-full px-3.5 py-3 text-[15px] bg-white rounded-xl border border-[#eadfd9] focus:border-[#a73400] focus:ring-4 focus:ring-[#a73400]/10 outline-none transition-all text-[#261911] placeholder:text-[#9b857c]"
            />
          </div>
        </section>

        {/* Contact Phone Section */}
        <section className="bg-white rounded-2xl p-4 shadow-level-1 space-y-2.5">
          <h3 className="font-display font-bold text-[14px] text-[#261911] uppercase tracking-[0.05em] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a73400] text-[19px]">call</span>
            <span>{isAm ? 'ተቀባይ ስልክ ቁጥር' : 'Contact Phone Number'}</span>
          </h3>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-[#f6ede8] text-[15px] font-bold text-[#261911] shrink-0">
              <span>🇪🇹</span>
              <span>+251</span>
            </div>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="911234567"
              className="flex-1 min-w-0 px-3.5 py-3 text-[15px] bg-white rounded-xl border border-[#eadfd9] focus:border-[#a73400] focus:ring-4 focus:ring-[#a73400]/10 outline-none transition-all font-mono font-bold text-[#261911] tnum"
            />
          </div>
        </section>

        {/* Payment Methods (Demo Local Integrations) */}
        <section className="bg-white rounded-2xl p-4 shadow-level-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-[14px] text-[#261911] uppercase tracking-[0.05em] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#a73400] text-[19px]">payments</span>
              <span>{isAm ? 'የክፍያ ዘዴ' : 'Payment Method'}</span>
            </h3>
            <span className="text-[10px] text-[#693c00] font-extrabold bg-[#ffdcbe]/70 px-2 py-1 rounded-full uppercase tracking-[0.06em]">
              DEMO MODE
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Telebirr */}
            <label
              onClick={() => setPaymentMethod('telebirr')}
              className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'telebirr'
                  ? 'bg-[#fff1eb] border-[#a73400]'
                  : 'bg-white border-[#eadfd9] hover:border-[#d9c6bd]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0082c8]/10 flex items-center justify-center font-black text-[#0082c8] text-[13px]">
                  TB
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-[#261911]">ቴሌብር (telebirr)</h4>
                  <p className="text-[12px] text-[#594139]">
                    {isAm ? 'በቴሌብር ፈጣን የሞባይል ክፍያ' : 'Instant digital wallet payment'}
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'telebirr' ? 'bg-[#a73400] border-[#a73400] text-white' : 'border-[#c9b5ac]'
                }`}
              >
                {paymentMethod === 'telebirr' && (
                  <span className="material-symbols-outlined text-[15px]">check</span>
                )}
              </div>
            </label>

            {/* CBE Birr / Chapa */}
            <label
              onClick={() => setPaymentMethod('cbe')}
              className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'cbe'
                  ? 'bg-[#fff1eb] border-[#a73400]'
                  : 'bg-white border-[#eadfd9] hover:border-[#d9c6bd]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7c2079]/10 flex items-center justify-center font-black text-[#7c2079] text-[12px]">
                  CBE
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-[#261911]">ሲቢኢ ብር / Chapa (CBE Birr)</h4>
                  <p className="text-[12px] text-[#594139]">
                    {isAm ? 'የኢትዮጵያ ንግድ ባንክ ሞባይል ክፍያ' : 'Commercial Bank of Ethiopia'}
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'cbe' ? 'bg-[#a73400] border-[#a73400] text-white' : 'border-[#c9b5ac]'
                }`}
              >
                {paymentMethod === 'cbe' && (
                  <span className="material-symbols-outlined text-[15px]">check</span>
                )}
              </div>
            </label>

            {/* Cash on Delivery */}
            <label
              onClick={() => setPaymentMethod('cash')}
              className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'cash'
                  ? 'bg-[#fff1eb] border-[#a73400]'
                  : 'bg-white border-[#eadfd9] hover:border-[#d9c6bd]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1b6d24]/10 flex items-center justify-center text-[#1b6d24]">
                  <span className="material-symbols-outlined text-[22px]">local_atm</span>
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-[#261911]">
                    {isAm ? 'ሲደርስ በጥሬ ገንዘብ' : 'Cash on Delivery'}
                  </h4>
                  <p className="text-[12px] text-[#594139]">
                    {isAm ? 'አድራሹ እቃውን ሲያስረክብ ይክፈሉ' : 'Pay in cash directly to rider'}
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  paymentMethod === 'cash' ? 'bg-[#a73400] border-[#a73400] text-white' : 'border-[#c9b5ac]'
                }`}
              >
                {paymentMethod === 'cash' && (
                  <span className="material-symbols-outlined text-[15px]">check</span>
                )}
              </div>
            </label>
          </div>
        </section>

        {/* Order Summary Recap */}
        <section className="bg-white rounded-2xl p-4 shadow-level-1 flex items-center justify-between">
          <span className="text-[14px] text-[#594139] font-semibold">
            {isAm ? 'የሚከፈል ጠቅላላ ድምር' : 'Total to Pay'}
          </span>
          <span className="font-display font-extrabold text-[19px] text-[#a73400] tnum">
            {totalAmount} <span className="text-[13px] text-[#594139] font-bold">{isAm ? 'ብር' : 'ETB'}</span>
          </span>
        </section>

        {/* Submit Order Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#a73400] hover:bg-[#963000] disabled:bg-[#b99a8e] text-white font-bold py-4 px-6 rounded-2xl shadow-[0_16px_36px_-14px_rgba(167,52,0,0.6)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-[15px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2.5">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{isAm ? 'ትዕዛዙ እየተላከ ነው...' : 'Placing order...'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[21px]">check_circle</span>
                <span>{isAm ? 'ትዕዛዙን አረጋግጥና እዘዝ' : 'Confirm & Place Order'}</span>
                <span className="tnum">({totalAmount} {isAm ? 'ብር' : 'ETB'})</span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
