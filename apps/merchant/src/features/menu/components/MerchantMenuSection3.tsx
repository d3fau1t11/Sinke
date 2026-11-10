import type { useMerchantMenu } from '../hooks/useMerchantMenu';

import { ProductItemRow } from '../ProductItemRow';

type Props = {
  products: ReturnType<typeof useMerchantMenu>['products'];
  updatingId: ReturnType<typeof useMerchantMenu>['updatingId'];
  setEditingProduct: ReturnType<typeof useMerchantMenu>['setEditingProduct'];
  handleToggle: ReturnType<typeof useMerchantMenu>['handleToggle'];
  handleDelete: ReturnType<typeof useMerchantMenu>['handleDelete'];
};
export function MerchantMenuSection3({
  products,
  updatingId,
  setEditingProduct,
  handleToggle,
  handleDelete,
}: Props) {
  return (
    <div className="space-y-2">
      {products.map((prod) => (
        <ProductItemRow
          key={prod.id}
          product={prod}
          onToggleAvailability={handleToggle}
          onEditPrice={(p) => setEditingProduct(p)}
          onDelete={handleDelete}
          updatingId={updatingId}
        />
      ))}
    </div>
  );
}
