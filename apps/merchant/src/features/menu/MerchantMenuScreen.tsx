import React, { useState, useEffect } from "react";
import { productsApi } from "@senik/api";
import { Button } from "@senik/ui";
import type { ProductWithOptions } from "@senik/types";
import { useMerchantAuthStore } from "../auth/store/merchantAuthStore";
import { ProductItemRow } from "./ProductItemRow";
import { AddProductModal } from "./AddProductModal";
import { EditPriceModal } from "./EditPriceModal";

export function MerchantMenuScreen() {
  const { merchantId } = useMerchantAuthStore();
  const [products, setProducts] = useState<ProductWithOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithOptions | null>(null);

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

  const handleDelete = async (productId: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${name}" from your menu?`,
      )
    ) {
      return;
    }
    setUpdatingId(productId);
    try {
      await productsApi.delete(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Failed to delete product", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-on-surface">
            Menu & Inventory
          </h2>
          <p className="text-xs text-on-surface-variant">
            Manage your dishes, adjust ETB prices, and toggle availability.
          </p>
        </div>
        <Button size="sm" variant="primary" onClick={() => setIsAddOpen(true)}>
          + Add Dish
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-on-surface-variant">Loading menu...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-outline/10 space-y-3">
          <p className="text-sm font-semibold text-on-surface">
            No products found for this store
          </p>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddOpen(true)}
          >
            Add Your First Dish
          </Button>
        </div>
      ) : (
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
      )}

      <AddProductModal
        businessId={merchantId || ""}
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
