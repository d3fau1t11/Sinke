import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProductModal() {
  const { activeProduct, setActiveProduct, addToCart, lang } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [notes, setNotes] = useState('');

  if (!activeProduct) return null;

  const isAm = lang === 'am';
  const name = isAm ? activeProduct.nameAm : activeProduct.nameEn;
  const desc = isAm ? activeProduct.descriptionAm : activeProduct.descriptionEn;

  const toggleOption = (option) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((o) => o.nameEn === option.nameEn);
      if (exists) {
        return prev.filter((o) => o.nameEn !== option.nameEn);
      } else {
        return [...prev, option];
      }
    });
  };

  const optionsTotalPrice = selectedOptions.reduce((sum, opt) => sum + (opt.price || 0), 0);
  const unitPrice = activeProduct.price + optionsTotalPrice;
  const grandTotal = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(activeProduct, quantity, selectedOptions, notes);
    setActiveProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      {/* Backdrop click */}
      <div 
        className="absolute inset-0"
        onClick={() => setActiveProduct(null)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[430px] bg-[#fff8f5] rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-t sm:border border-[#e1bfb5] z-10 animate-slideUp">
        {/* Header Image & Close */}
        <div className="relative h-52 sm:h-56 bg-[#f7ddd0] shrink-0">
          <img
            src={activeProduct.image}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={() => setActiveProduct(null)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 active:scale-90 transition-all backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          {/* Product Title on Image */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            {activeProduct.isFasting && (
              <span className="inline-block bg-[#1b6d24] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                {isAm ? 'የፆም ምግብ' : 'Tsom (Fasting)'}
              </span>
            )}
            <h2 className="font-display font-bold text-[20px] leading-tight drop-shadow-md">
              {name}
            </h2>
            <p className="font-display font-extrabold text-[18px] text-[#ffdbcf] mt-0.5">
              {activeProduct.price} <span className="text-xs font-semibold">{isAm ? 'ብር' : 'ETB'}</span>
            </p>
          </div>
        </div>

        {/* Scrollable Options Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[#261911]">
          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-[#594139] uppercase tracking-wider mb-1">
              {isAm ? 'ዝርዝር ማብራሪያ' : 'Description'}
            </h3>
            <p className="text-sm text-[#594139] leading-relaxed">
              {desc}
            </p>
          </div>

          {/* Options / Add-ons */}
          {activeProduct.options && activeProduct.options.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#f7ddd0]">
              <h3 className="text-xs font-bold text-[#261911] uppercase tracking-wider flex justify-between items-center">
                <span>{isAm ? 'ተጨማሪ ምርጫዎች' : 'Customizations & Add-ons'}</span>
                <span className="text-[11px] font-normal text-[#594139]">{isAm ? 'እንደ ፍላጎትዎ ይምረጡ' : 'Optional'}</span>
              </h3>

              <div className="space-y-1.5">
                {activeProduct.options.map((option, idx) => {
                  const isChecked = selectedOptions.some((o) => o.nameEn === option.nameEn);
                  const optName = isAm ? option.nameAm : option.nameEn;

                  return (
                    <label
                      key={idx}
                      onClick={() => toggleOption(option)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#ffeadf] border-[#a73400] text-[#a73400] font-semibold'
                          : 'bg-white border-[#e1bfb5] text-[#261911]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isChecked ? 'bg-[#a73400] border-[#a73400] text-white' : 'border-[#8d7168] bg-white'
                          }`}
                        >
                          {isChecked && <span className="material-symbols-outlined text-[16px]">check</span>}
                        </div>
                        <span className="text-sm">{optName}</span>
                      </div>
                      <span className="text-xs font-bold">
                        {option.price > 0 ? `+${option.price} ${isAm ? 'ብር' : 'ETB'}` : isAm ? 'ነጻ' : 'Free'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special notes */}
          <div className="space-y-1.5 pt-2 border-t border-[#f7ddd0]">
            <label className="text-xs font-bold text-[#261911] uppercase tracking-wider block">
              {isAm ? 'ለማብሰያው ልዩ ማስታወሻ' : 'Special Instructions'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isAm ? "ምሳሌ፡ ቃሪያ እንዳይበዛበት፣ ለብቻው ይሁን..." : "e.g., Less spicy, separate packaging..."}
              className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-[#e1bfb5] focus:outline-none focus:border-[#a73400] text-[#261911]"
            />
          </div>
        </div>

        {/* Footer Actions (Quantity Stepper + Add CTA) */}
        <div className="p-4 bg-white border-t border-[#e1bfb5] flex items-center gap-3 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-[#ffeadf] border border-[#e1bfb5] rounded-full p-1 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full bg-white text-[#a73400] disabled:opacity-40 flex items-center justify-center font-bold active:scale-90 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="font-display font-bold text-sm w-7 text-center text-[#261911]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full bg-[#a73400] text-white flex items-center justify-center font-bold active:scale-90 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#a73400] hover:bg-[#cb4914] text-white font-bold py-3 px-4 rounded-full flex items-center justify-between shadow-md active:scale-[0.98] transition-all"
          >
            <span className="flex items-center gap-1.5 text-sm">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              {isAm ? 'ወደ ቅርጫት ጨምር' : 'Add to Cart'}
            </span>
            <span className="font-display font-bold text-sm bg-black/20 px-2.5 py-0.5 rounded-full">
              {grandTotal} {isAm ? 'ብር' : 'ETB'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
