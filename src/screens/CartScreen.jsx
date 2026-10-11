import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';

export default function CartScreen() {
  const {
    lang,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    subtotal,
    deliveryFee,
    serviceFee,
    discountAmount,
    totalAmount,
    activeZoneObj,
    navigateTo
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const isAm = lang === 'am';

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-24">
        <HeaderBar showBack={true} onBack={() => navigateTo('home')} title={isAm ? 'የእርስዎ ቅርጫት' : 'Your Cart'} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#ffeadf] flex items-center justify-center text-[#a73400]">
            <span className="material-symbols-outlined text-[40px]">shopping_basket</span>
          </div>
          <div className="space-y-1.5">
            <h2 className="font-display font-bold text-xl text-[#261911]">
              {isAm ? 'ቅርጫትዎ ባዶ ነው' : 'Your cart is empty'}
            </h2>
            <p className="text-[13px] text-[#594139] max-w-[260px] leading-relaxed">
              {isAm
                ? 'የሚፈልጓቸውን ጣፋጭ ምግቦች ወይም ሸቀጦች ይምረጡና እዘዙ!'
                : 'Browse local restaurants and stores to fill your cart with delicious items!'}
            </p>
          </div>
          <button
            onClick={() => navigateTo('home')}
            className="bg-[#a73400] hover:bg-[#963000] text-white font-bold text-[14px] px-7 py-3.5 rounded-2xl shadow-[0_12px_28px_-14px_rgba(167,52,0,0.6)] active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>{isAm ? 'ሱቆችን ያስሱ' : 'Explore Businesses'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-28">
      <HeaderBar
        showBack={true}
        onBack={() => navigateTo('home')}
        title={isAm ? 'የእርስዎ ቅርጫት' : 'Your Cart'}
      />

      <div className="flex-1 px-4 py-3 space-y-4">
        {/* Delivery Guarantee Pill */}
        <div className="bg-[#eef6ef] rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1b6d24]/10 flex items-center justify-center text-[#1b6d24]">
              <span className="material-symbols-outlined text-[19px] fill-icon">verified</span>
            </div>
            <div>
              <p className="font-bold text-[13px] text-[#261911]">
                {isAm ? 'የፈጣን ማድረሻ ዋስትና' : 'Hyperlocal Speed Guarantee'}
              </p>
              <p className="text-[12px] text-[#594139] tnum">
                {isAm ? `${activeZoneObj.nameAm} • 20-35 ደቂቃ` : `${activeZoneObj.nameEn} • 20-35 mins`}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('location-select')}
            className="text-[13px] font-bold text-[#a73400] px-2 py-1"
          >
            {isAm ? 'ቀይር' : 'Change'}
          </button>
        </div>

        {/* Cart Items List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-extrabold text-[15px] text-[#261911]">
              {isAm ? 'የተመረጡ ዕቃዎች' : 'Selected Items'} ({cart.length})
            </h3>
            <button
              onClick={clearCart}
              className="text-[13px] text-[#ba1a1a] font-semibold flex items-center gap-1 px-1 py-1"
            >
              <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
              <span>{isAm ? 'ሁሉንም አጥፋ' : 'Clear All'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {cart.map((item) => {
              const name = isAm ? item.product.nameAm : item.product.nameEn;
              const optionsPrice = (item.selectedOptions || []).reduce((sum, o) => sum + (o.price || 0), 0);
              const itemTotal = (item.product.price + optionsPrice) * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl p-3.5 shadow-level-1 flex gap-3.5 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#f7ddd0]"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display font-bold text-[14px] text-[#261911] line-clamp-1">
                        {name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#8d7168] hover:text-[#ba1a1a] p-1 -m-1"
                        title="Remove"
                        aria-label="Remove item"
                      >
                        <span className="material-symbols-outlined text-[17px]">close</span>
                      </button>
                    </div>

                    {/* Selected Options chips */}
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.selectedOptions.map((opt, oIdx) => (
                          <span
                            key={oIdx}
                            className="text-[11px] bg-[#fff1eb] text-[#a73400] font-semibold px-2 py-0.5 rounded-full"
                          >
                            +{isAm ? opt.nameAm : opt.nameEn}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#f3ebe6]">
                      <span className="font-display font-extrabold text-[15px] text-[#a73400] tnum">
                        {itemTotal} <span className="text-[12px] text-[#594139] font-semibold">{isAm ? 'ብር' : 'ETB'}</span>
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-[#f6ede8] rounded-full p-1 gap-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-8 h-8 rounded-full bg-white text-[#a73400] flex items-center justify-center font-bold active:scale-90 shadow-level-1"
                          aria-label="Decrease quantity"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="font-display font-bold text-[14px] w-7 text-center text-[#261911] tnum">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-8 h-8 rounded-full bg-[#a73400] text-white flex items-center justify-center font-bold active:scale-90 shadow-sm"
                          aria-label="Increase quantity"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Promo Voucher Code */}
        <div className="bg-white rounded-2xl p-3.5 shadow-level-1 space-y-2.5">
          <label className="text-[14px] font-bold text-[#261911] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a73400] text-[18px]">loyalty</span>
            <span>{isAm ? 'የቅናሽ ኩፖን ኮድ' : 'Promo / Voucher Code'}</span>
          </label>

          {appliedPromo ? (
            <div className="flex items-center justify-between bg-[#e8f5e9] text-[#1b6d24] p-3 rounded-xl">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <div>
                  <span className="font-mono font-bold text-[13px]">{appliedPromo.code}</span>
                  <p className="text-[12px]">
                    {appliedPromo.discountPercent > 0 
                      ? `${appliedPromo.discountPercent}% ${isAm ? 'ቅናሽ ተተግብሯል' : 'discount applied'}`
                      : isAm ? 'ነጻ ማድረሻ ተተግብሯል' : 'Free delivery applied'}
                  </p>
                </div>
              </div>
              <button
                onClick={removePromoCode}
                className="text-[13px] text-[#ba1a1a] font-bold px-2 py-1"
              >
                {isAm ? 'አንሳ' : 'Remove'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder={isAm ? "ኮድ ያስገቡ (ምሳሌ፡ SENIK15)" : "Enter promo code (e.g. SENIK15)"}
                className="flex-1 min-w-0 px-3.5 py-2.5 bg-white rounded-xl border border-[#eadfd9] focus:border-[#a73400] focus:ring-4 focus:ring-[#a73400]/10 outline-none transition-all text-[14px] uppercase font-mono font-bold text-[#261911]"
              />
              <button
                type="submit"
                className="bg-[#261911] hover:bg-[#3c2d25] text-white text-[14px] font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-all"
              >
                {isAm ? 'ተግብር' : 'Apply'}
              </button>
            </form>
          )}
        </div>

        {/* Order Bill Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-level-1 space-y-2.5 text-[13px] text-[#594139]">
          <h4 className="font-display font-bold text-[15px] text-[#261911] pb-2 border-b border-[#f3ebe6]">
            {isAm ? 'የትዕዛዝ ሂሳብ ዝርዝር' : 'Payment Summary'}
          </h4>

          <div className="flex justify-between">
            <span>{isAm ? 'የዕቃዎች ድምር' : 'Items Subtotal'}</span>
            <span className="font-bold text-[#261911] tnum">{subtotal} {isAm ? 'ብር' : 'ETB'}</span>
          </div>

          <div className="flex justify-between">
            <span>{isAm ? 'የማድረሻ ክፍያ' : 'Delivery Fee'}</span>
            <span className="font-bold text-[#261911] tnum">{deliveryFee} {isAm ? 'ብር' : 'ETB'}</span>
          </div>

          <div className="flex justify-between">
            <span>{isAm ? 'የአገልግሎት ክፍያ' : 'Platform Fee'}</span>
            <span className="font-bold text-[#261911] tnum">{serviceFee} {isAm ? 'ብር' : 'ETB'}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-[#1b6d24] font-bold">
              <span>{isAm ? 'የኩፖን ቅናሽ' : 'Promo Discount'}</span>
              <span className="tnum">-{discountAmount} {isAm ? 'ብር' : 'ETB'}</span>
            </div>
          )}

          <div className="flex justify-between items-baseline text-[15px] font-extrabold text-[#a73400] pt-2.5 border-t border-[#f3ebe6]">
            <span>{isAm ? 'ጠቅላላ ክፍያ' : 'Total Amount'}</span>
            <span className="font-display text-[17px] tnum">{totalAmount} {isAm ? 'ብር' : 'ETB'}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="pt-2">
          <button
            onClick={() => navigateTo('checkout')}
            className="w-full bg-[#a73400] hover:bg-[#963000] text-white font-bold py-4 px-6 rounded-2xl shadow-[0_16px_36px_-14px_rgba(167,52,0,0.6)] active:scale-[0.98] transition-all flex items-center justify-between text-[15px]"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[21px]">lock</span>
              <span>{isAm ? 'ወደ ክፍያ ቀጥል' : 'Proceed to Checkout'}</span>
            </span>
            <span className="font-display font-extrabold text-[15px] bg-black/20 px-3 py-1.5 rounded-full tnum">
              {totalAmount} {isAm ? 'ብር' : 'ETB'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
