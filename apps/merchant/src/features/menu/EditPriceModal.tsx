import React, { useState } from "react";
import { Button, Input } from "@senik/ui";
import { formatETB } from "@senik/utils";
import { productsApi } from "@senik/api";
import type { ProductWithOptions } from "@senik/types";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (product) {
      setPriceStr(String(product.price));
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
    if (!newPrice || newPrice <= 0) {
      setError("Please enter a valid price in ETB.");
      return;
    }

    setLoading(true);
    try {
      await productsApi.update(product.id, { price: newPrice });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to update item price.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-outline/10 space-y-4">
        <div className="flex justify-between items-center border-b border-outline/10 pb-3">
          <div>
            <h3 className="font-bold text-base text-on-surface">
              Adjust Item Price
            </h3>
            <p className="text-xs text-on-surface-variant truncate max-w-[240px]">
              {product.name_en}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center py-2 bg-surface-container-low rounded-xl border border-outline/10">
            <p className="text-[11px] text-on-surface-variant uppercase font-semibold">
              Current Menu Price
            </p>
            <p className="text-2xl font-black font-mono text-primary mt-0.5">
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
                  className="px-2 py-1 rounded text-xs font-semibold bg-surface-container border border-outline/10 hover:border-primary text-on-surface"
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-error font-medium">{error}</p>}

          <div className="pt-2 flex gap-2">
            <Button type="button" variant="ghost" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Save New Price
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
