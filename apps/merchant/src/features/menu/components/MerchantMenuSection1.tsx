import { useText } from '@senik/i18n';
import type { useMerchantMenu } from '../hooks/useMerchantMenu';
import { Button } from '@senik/ui';

type Props = {
  setIsAddOpen: ReturnType<typeof useMerchantMenu>['setIsAddOpen'];
};
export function MerchantMenuSection1({ setIsAddOpen }: Props) {
  const text = useText();
  return (
    <div className="flex justify-between items-center gap-3">
      <div>
        <h2 className="font-display font-bold text-title-lg text-on-surface">
          {text('Menu & Inventory')}
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          {text('Manage dishes, prices and availability.')}
        </p>
      </div>
      <Button
        size="sm"
        variant="primary"
        onClick={() => setIsAddOpen(true)}
        className="shrink-0"
        aria-label={text('Add Dish')}
      >
        <span className="material-symbols-outlined text-[17px]">add</span>
        {text('Add Dish')}
      </Button>
    </div>
  );
}
