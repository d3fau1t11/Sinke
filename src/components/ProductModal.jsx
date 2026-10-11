import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductOptions from './ProductOptions';

export default function ProductModal() {
  const { activeProduct, setActiveProduct, addToCart, lang } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [notes, setNotes] = useState('');

  if (!activeProduct) return null;

  const isAm = lang === 'am';
  const name = isAm ? activeProduct.nameAm : activeProduct.nameEn;

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
      <div className="relative w-full max-w-[430px] bg-[#fff8f5] rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl z-10 animate-slideUp">
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
        <ProductOptions
          product={activeProduct}
          isAm={isAm}
          selectedOptions={selectedOptions}
          onToggleOption={toggleOption}
          notes={notes}
          onNotesChange={setNotes}
        />

        {/* Footer Actions (Quantity Stepper + Add CTA) */}
        <div className="p-4 bg-white border-t border-[#f3ebe6] flex items-center gap-3 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-[#f6ede8] rounded-full p-1 gap-0.5 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full bg-white text-[#a73400] disabled:opacity-40 flex items-center justify-center font-bold active:scale-90 shadow-level-1"
              aria-label="Decrease quantity"
            >
              <span className="material-symbols-outlined text-[17px]">remove</span>
            </button>
            <span className="font-display font-bold text-[15px] w-7 text-center text-[#261911] tnum">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full bg-[#a73400] text-white flex items-center justify-center font-bold active:scale-90 shadow-sm"
              aria-label="Increase quantity"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#a73400] hover:bg-[#963000] text-white font-bold py-3.5 px-4 rounded-full flex items-center justify-between shadow-[0_12px_28px_-12px_rgba(167,52,0,0.55)] active:scale-[0.98] transition-all"
          >
            <span className="flex items-center gap-2 text-[15px]">
              <span className="material-symbols-outlined text-[19px]">shopping_bag</span>
              {isAm ? 'ወደ ቅርጫት ጨምር' : 'Add to Cart'}
            </span>
            <span className="font-display font-bold text-[15px] bg-black/20 px-3 py-1 rounded-full tnum">
              {grandTotal} {isAm ? 'ብር' : 'ETB'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
