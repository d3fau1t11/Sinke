import { useText } from '@senik/i18n';
import { MerchantMenuSection3 } from './components/MerchantMenuSection3';
import { MerchantMenuSection2 } from './components/MerchantMenuSection2';
import { MerchantMenuSection1 } from './components/MerchantMenuSection1';
import { useMerchantMenu } from './hooks/useMerchantMenu';

import { EmptyState } from '@senik/ui';

import { AddProductModal } from './AddProductModal';
import { EditPriceModal } from './EditPriceModal';

export function MerchantMenuScreen() {
  const text = useText();
  const {
    error,
    merchantId,
    products,
    loading,
    updatingId,
    isAddOpen,
    setIsAddOpen,
    editingProduct,
    setEditingProduct,
    loadMenu,
    handleToggle,
    handleDelete,
  } = useMerchantMenu();
  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-red-500 text-sm">
          {text(error ?? '')}
        </p>
      )}
      <MerchantMenuSection1 {...{ setIsAddOpen }} />

      {loading ? (
        <MerchantMenuSection2 />
      ) : products.length === 0 ? (
        <EmptyState
          t={(k) => k}
          isAm={false}
          title={text('No products yet')}
          message={text('Add your first dish to start receiving orders.')}
          actionLabel={text('Add Your First Dish')}
          onAction={() => setIsAddOpen(true)}
          icon={<span className="material-symbols-outlined text-[40px]">restaurant_menu</span>}
        />
      ) : (
        <MerchantMenuSection3
          {...{ products, updatingId, setEditingProduct, handleToggle, handleDelete }}
        />
      )}

      <AddProductModal
        businessId={merchantId || ''}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => void loadMenu()}
      />

      <EditPriceModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSuccess={() => void loadMenu()}
      />
    </div>
  );
}
