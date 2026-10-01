import React from 'react';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product, horizontal = false }) {
  const { lang, setActiveProduct, addToCart } = useApp();
  const isAm = lang === 'am';

  const name = isAm ? product.nameAm : product.nameEn;
  const desc = isAm ? product.descriptionAm : product.descriptionEn;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (product.options && product.options.length > 0) {
      setActiveProduct(product);
    } else {
      addToCart(product, 1);
    }
  };

  if (horizontal) {
    return (
      <div
        onClick={() => setActiveProduct(product)}
        className="bg-white rounded-2xl border border-[#e1bfb5]/70 p-3 shadow-2xs hover:shadow-sm active:scale-[0.985] transition-all cursor-pointer flex gap-3 group items-center"
      >
        <img
          src={product.image}
          alt={name}
          className="w-20 h-20 rounded-xl object-cover shrink-0 bg-[#f7ddd0] group-hover:scale-105 transition-transform"
          loading="lazy"
        />
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h4 className="font-display font-bold text-[14px] text-[#261911] line-clamp-1">
                {name}
              </h4>
              {product.isFasting && (
                <span className="text-[9px] font-bold bg-[#1b6d24]/10 text-[#1b6d24] px-1.5 py-0.5 rounded shrink-0">
                  {isAm ? 'የፆም' : 'Tsom'}
                </span>
              )}
            </div>
            <p className="text-[#594139] text-xs line-clamp-2 mt-0.5">
              {desc}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#f7ddd0]/60">
            <span className="font-display font-extrabold text-[15px] text-[#a73400]">
              {product.price} <span className="text-xs font-semibold text-[#594139]">{isAm ? 'ብር' : 'ETB'}</span>
            </span>

            <button
              onClick={handleQuickAdd}
              className="bg-[#fff1eb] hover:bg-[#ffdbcf] text-[#a73400] font-bold text-xs px-3 py-1.5 rounded-full border border-[#e1bfb5] active:scale-95 transition-all flex items-center gap-1 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>{isAm ? 'ጨምር' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setActiveProduct(product)}
      className="bg-white rounded-2xl border border-[#e1bfb5]/70 overflow-hidden shadow-2xs hover:shadow-sm active:scale-[0.985] transition-all cursor-pointer flex flex-col group w-[170px] shrink-0"
    >
      <div className="relative w-full h-28 bg-[#f7ddd0] overflow-hidden">
        <img
          src={product.image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        {product.isFasting && (
          <span className="absolute top-1.5 left-1.5 bg-[#1b6d24] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
            {isAm ? 'የፆም' : 'Tsom'}
          </span>
        )}
      </div>

      <div className="p-2.5 flex flex-col justify-between flex-1 gap-1.5">
        <div>
          <h4 className="font-display font-bold text-[13px] text-[#261911] line-clamp-1 leading-snug">
            {name}
          </h4>
          <p className="text-[#594139] text-[11px] line-clamp-1 mt-0.5">
            {desc}
          </p>
        </div>

        <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#f7ddd0]">
          <span className="font-display font-bold text-[14px] text-[#a73400]">
            {product.price} <span className="text-[10px] text-[#594139]">{isAm ? 'ብር' : 'ETB'}</span>
          </span>

          <button
            onClick={handleQuickAdd}
            className="w-7 h-7 rounded-full bg-[#a73400] hover:bg-[#cb4914] text-white flex items-center justify-center active:scale-90 transition-all shadow-xs"
            aria-label="Add to cart"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
