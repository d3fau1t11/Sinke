import React, { useState, useEffect } from "react";
import { productsApi } from "@senik/api";
import { Button, Skeleton, EmptyState } from "@senik/ui";
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
      <div className="flex justify-between items-center gap-3">
        <div>
          <h2 className="font-display font-bold text-title-lg text-on-surface">
            Menu &amp; Inventory
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            Manage dishes, prices and availability.
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsAddOpen(true)}
          className="shrink-0"
        >
          <span className="material-symbols-outlined text-[17px]">add</span>
          Add Dish
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-2xl shadow-level-1 p-3 flex items-center gap-3"
            >
              <Skeleton variant="rectangular" width="56px" height="56px" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </div>
              <Skeleton variant="text" width="64px" height="24px" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          t={(k) => k}
          isAm={false}
          title="No products yet"
          message="Add your first dish to start receiving orders."
          actionLabel="Add Your First Dish"
          onAction={() => setIsAddOpen(true)}
          icon={
            <span className="material-symbols-outlined text-[40px]">
              restaurant_menu
            </span>
          }
        />
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
