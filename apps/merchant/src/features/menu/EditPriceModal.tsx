import React, { useState, useEffect } from "react";
import { Button, Input } from "@senik/ui";
import { formatETB } from "@senik/utils";
import { productsApi } from "@senik/api";
import type { ProductWithOptions } from "@senik/types";
import { DishPhotoPicker } from "./DishPhotoPicker";

interface EditPriceModalProps {
  product: ProductWithOptions | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPriceModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: EditPriceModalProps) {
  const [priceStr, setPriceStr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setPriceStr(String(product.price));
      setImageUrl(product.image || "");
      setError("");
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAdjust = (delta: number) => {
    const cur = Number(priceStr) || product.price;
    const next = Math.max(1, cur + delta);
    setPriceStr(String(next));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const newPrice = Number(priceStr);
    if (!newPrice || newPrice <= 0)
      return setError("Please enter a valid price in ETB.");

    setLoading(true);
    try {
      await productsApi.update(product.id, {
        price: newPrice,
        image: imageUrl || product.image,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-6 shadow-level-3 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start border-b border-outline-variant/60 pb-3">
          <div>
            <h3 className="font-display font-bold text-title-md text-on-surface">
              Edit Dish &amp; Price
            </h3>
            <p className="text-body-sm text-on-surface-variant truncate max-w-[240px]">
              {product.name_en}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 -mr-1 -mt-1 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="text-center py-3 bg-surface-container-low rounded-2xl">
            <p className="text-micro font-bold text-on-surface-variant uppercase tracking-[0.05em]">
              Current Menu Price
            </p>
            <p className="font-display font-black text-title-lg text-on-surface mt-1 tabular-nums">
              {formatETB(product.price)}
            </p>
          </div>

          <div>
            <Input
              label="New Price (ETB)"
              type="number"
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              placeholder="Enter new price"
              fullWidth
            />
            <div className="flex justify-center gap-1.5 mt-2">
              {[-25, -10, +10, +25, +50].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => handleAdjust(delta)}
                  className="px-2.5 py-1 rounded-full text-body-sm font-semibold bg-surface-container-low text-on-surface hover:bg-surface-container hover:text-primary transition-colors tabular-nums"
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
          </div>

          <DishPhotoPicker imageUrl={imageUrl} onChange={setImageUrl} />

          {error && (
            <p className="text-body-sm text-error font-medium" role="alert">
              {error}
            </p>
          )}

          <div className="pt-2 flex gap-2">
            <Button type="button" variant="ghost" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
