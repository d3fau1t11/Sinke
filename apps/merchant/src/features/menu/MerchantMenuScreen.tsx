import React, { useState, useEffect } from "react";
import { productsApi } from "@senik/api";
import type { ProductWithOptions } from "@senik/types";
import { useMerchantAuthStore } from "../auth/store/merchantAuthStore";
import { ProductItemRow } from "./ProductItemRow";

export function MerchantMenuScreen() {
  const { merchantId } = useMerchantAuthStore();
  const [products, setProducts] = useState<ProductWithOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadMenu = async () => {
    if (!merchantId) return;
    try {
      const data = await productsApi.getAllByBusiness(merchantId);
      setProducts(data);
    } catch (err) {
      console.error("Failed to load menu", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId]);

  const handleToggle = async (productId: string, current: boolean) => {
    setUpdatingId(productId);
    try {
      await productsApi.setIsAvailable(productId, !current);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, is_available: !current } : p,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle availability", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Menu & Inventory</h2>
        <p className="text-xs text-on-surface-variant">
          Toggle item availability in real-time when dishes run out.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-on-surface-variant">Loading menu...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-outline/10">
          <p className="text-sm font-semibold text-on-surface">
            No products found for this store
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((prod) => (
            <ProductItemRow
              key={prod.id}
              product={prod}
              onToggleAvailability={handleToggle}
              updatingId={updatingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
