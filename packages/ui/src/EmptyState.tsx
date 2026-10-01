import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

export interface EmptyStateProps {
  title?: string;
  titleAm?: string;
  message?: string;
  messageAm?: string;
  actionLabel?: string;
  actionLabelAm?: string;
  onAction?: (() => void) | null | undefined;
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
  className?: string;
  /** Translation function */
  t: (key: string) => string;
  /** Whether the current language is Amharic */
  isAm: boolean;
}

export function EmptyState({
  title,
  titleAm,
  message,
  messageAm,
  actionLabel,
  actionLabelAm,
  onAction,
  icon,
  illustration,
  className,
  t: _t,
  isAm
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4 py-10 space-y-4',
        className
      )}
    >
      {illustration ? (
        <div className="text-on-surface-variant/30">{illustration}</div>
      ) : (
        <div className="w-20 h-20 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant/40">
          {icon || <span className="material-symbols-outlined text-[40px]">inbox</span>}
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-title-lg font-bold text-on-surface">
          {isAm ? titleAm || title : title}
        </h3>
        <p className="text-body-md text-on-surface-variant max-w-sm">
          {isAm ? messageAm || message : message}
        </p>
      </div>
      {onAction && actionLabel && (
        <Button variant="primary" onClick={onAction} size="lg">
          {isAm ? actionLabelAm || actionLabel : actionLabel}
        </Button>
      )}
    </div>
  );
}

export function EmptyCart({ onExplore, t, isAm }: { onExplore?: () => void; t: (key: string) => string; isAm: boolean }) {
  return (
    <EmptyState
      t={t}
      isAm={isAm}
      title={isAm ? 'ቅርጫትዎ ባዶ ነው' : 'Your Cart is Empty'}
      titleAm="ቅርጫትዎ ባዶ ነው"
      message={isAm ? 'የሚፈልጓቸውን ጣፋጭ ምግቦች ወይም ሸቀጦች ይምረጡና እዘዙ!' : 'Browse local restaurants and shops to add your favorite items!'}
      messageAm="የሚፈልጓቸውን ጣፋጭ ምግቦች ወይም ሸቀጦች ይምረጡና እዘዙ!"
      actionLabel={isAm ? 'ሱቆችን ያስሱ' : 'Explore Businesses'}
      actionLabelAm="ሱቆችን ያስሱ"
      onAction={onExplore}
      icon={<span className="material-symbols-outlined text-[40px]">shopping_cart</span>}
    />
  );
}

export function EmptyOrders({ onStartOrdering, t, isAm }: { onStartOrdering?: () => void; t: (key: string) => string; isAm: boolean }) {
  return (
    <EmptyState
      t={t}
      isAm={isAm}
      title={isAm ? 'ምንም ትዕዛዝ አልተገኘም' : 'No Orders Yet'}
      titleAm="ምንም ትዕዛዝ አልተገኘም"
      message={isAm ? 'የመጀመሪያዎን ትዕዛዝ ይስጡ እና የሰፈርዎ ምግብ ይመጣል' : 'Place your first order and get local food delivered'}
      messageAm="የመጀመሪያዎን ትዕዛዝ ይስጡ እና የሰፈርዎ ምግብ ይመጣል"
      actionLabel={isAm ? 'ማዘዝ ጀምር' : 'Start Ordering'}
      actionLabelAm="ማዘዝ ጀምር"
      onAction={onStartOrdering}
      icon={<span className="material-symbols-outlined text-[40px]">receipt_long</span>}
    />
  );
}

export function EmptySearch({ onClear, t, isAm }: { onClear?: () => void; t: (key: string) => string; isAm: boolean }) {
  return (
    <EmptyState
      t={t}
      isAm={isAm}
      title={isAm ? 'ውጤት አልተገኘም' : 'No Results Found'}
      titleAm="ውጤት አልተገኘም"
      message={isAm ? 'የፈለግቱን ጥያቄ ይቀይሩ ወይም ሌላ ይፈልጉ' : 'Try a different search term or browse categories'}
      messageAm="የፈለግቱን ጥያቄ ይቀይሩ ወይም ሌላ ይፈልጉ"
      actionLabel={isAm ? 'ፈልግን አስቀርብ' : 'Clear Search'}
      actionLabelAm="ፈልግን አስቀርብ"
      onAction={onClear}
      icon={<span className="material-symbols-outlined text-[40px]">search_off</span>}
    />
  );
}

export function EmptyFavorites({ onBrowse, t, isAm }: { onBrowse?: () => void; t: (key: string) => string; isAm: boolean }) {
  return (
    <EmptyState
      t={t}
      isAm={isAm}
      title={isAm ? 'የትዕትና ምግቦች' : 'Favorite Dishes'}
      titleAm="የትዕትና ምግቦች"
      message={isAm ? 'እዚህ የሚያደርጉ የትዕትና ምግቦችዎ ይ𥨡ያሉ' : 'Your favorite dishes will appear here'}
      messageAm="እዚህ የሚያደርጉ የትዕትና ምግቦችዎ ይ𥨡ያሉ"
      actionLabel={isAm ? 'ምግቦችን ያስሱ' : 'Browse Dishes'}
      actionLabelAm="ምግቦችን ያስሱ"
      onAction={onBrowse}
      icon={<span className="material-symbols-outlined text-[40px]">favorite</span>}
    />
  );
}

export function EmptyAddresses({ onAdd, t, isAm }: { onAdd?: () => void; t: (key: string) => string; isAm: boolean }) {
  return (
    <EmptyState
      t={t}
      isAm={isAm}
      title={isAm ? 'የተቀመጡ አድራሻዎች የለም' : 'No Saved Addresses'}
      titleAm="የተቀመጡ አድራሻዎች የለም"
      message={isAm ? 'አድራሻ አስገባልን ይጫኑ ለፈጣን ማድረሻ' : 'Add an address for faster checkout'}
      messageAm="አድራሻ አስገባልን ይጫኑ ለፈጣን ማድረሻ"
      actionLabel={isAm ? 'አድራሻ አስገባ' : 'Add Address'}
      actionLabelAm="አድራሻ አስገባ"
      onAction={onAdd}
      icon={<span className="material-symbols-outlined text-[40px]">location_on</span>}
    />
  );
}