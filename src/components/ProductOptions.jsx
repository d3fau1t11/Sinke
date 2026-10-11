import React from 'react';

/**
 * Scrollable product content: description, add-on options, special instructions.
 * Presentational — receives data + callbacks via props (AGENTS.md §3).
 */
export default function ProductOptions({
  product,
  isAm,
  selectedOptions,
  onToggleOption,
  notes,
  onNotesChange
}) {
  const desc = isAm ? product.descriptionAm : product.descriptionEn;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[#261911]">
      {/* Description */}
      <div>
        <h3 className="text-[13px] font-bold text-[#594139] uppercase tracking-[0.05em] mb-1.5">
          {isAm ? 'ዝርዝር ማብራሪያ' : 'Description'}
        </h3>
        <p className="text-[14px] text-[#594139] leading-relaxed">{desc}</p>
      </div>

      {/* Options / Add-ons */}
      {product.options && product.options.length > 0 && (
        <div className="space-y-2.5 pt-3 border-t border-[#f3ebe6]">
          <h3 className="text-[13px] font-bold text-[#261911] uppercase tracking-[0.05em] flex justify-between items-center gap-2">
            <span>{isAm ? 'ተጨማሪ ምርጫዎች' : 'Customizations & Add-ons'}</span>
            <span className="text-[12px] font-normal text-[#594139]">
              {isAm ? 'እንደ ፍላጎትዎ ይምረጡ' : 'Optional'}
            </span>
          </h3>

          <div className="space-y-2">
            {product.options.map((option, idx) => {
              const isChecked = selectedOptions.some((o) => o.nameEn === option.nameEn);
              const optName = isAm ? option.nameAm : option.nameEn;

              return (
                <label
                  key={idx}
                  onClick={() => onToggleOption(option)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all gap-2 ${
                    isChecked
                      ? 'bg-[#fff1eb] border-[#a73400]'
                      : 'bg-white border-transparent shadow-level-1'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-colors ${
                        isChecked
                          ? 'bg-[#a73400] border-[#a73400] text-white'
                          : 'border-[#c9b5ac] bg-white'
                      }`}
                    >
                      {isChecked && (
                        <span className="material-symbols-outlined text-[15px]">check</span>
                      )}
                    </div>
                    <span className={`text-[14px] ${isChecked ? 'font-semibold' : ''}`}>
                      {optName}
                    </span>
                  </div>
                  <span
                    className={`text-[13px] font-bold ${isChecked ? 'text-[#a73400]' : 'text-[#594139]'}`}
                  >
                    {option.price > 0
                      ? `+${option.price} ${isAm ? 'ብር' : 'ETB'}`
                      : isAm
                        ? 'ነጻ'
                        : 'Free'}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Special notes */}
      <div className="space-y-2 pt-3 border-t border-[#f3ebe6]">
        <label className="text-[13px] font-bold text-[#261911] uppercase tracking-[0.05em] block">
          {isAm ? 'ለማብሰያው ልዩ ማስታወሻ' : 'Special Instructions'}
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={
            isAm ? 'ምሳሌ፡ ቃሪያ እንዳይበዛበት፣ ለብቻው ይሁን...' : 'e.g., Less spicy, separate packaging...'
          }
          className="w-full px-3.5 py-3 text-[15px] bg-white rounded-xl border border-[#eadfd9] focus:border-[#a73400] focus:ring-4 focus:ring-[#a73400]/10 outline-none transition-all text-[#261911] placeholder:text-[#9b857c]"
        />
      </div>
    </div>
  );
}
