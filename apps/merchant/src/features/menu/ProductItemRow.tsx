import React from "react";
import { Card } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { ProductWithOptions } from "@senik/types";

interface ProductItemRowProps {
  product: ProductWithOptions;
  onToggleAvailability: (productId: string, current: boolean) => void;
  onEditPrice: (product: ProductWithOptions) => void;
  onDelete: (productId: string, name: string) => void;
  updatingId: string | null;
}

export function ProductItemRow({
  product,
  onToggleAvailability,
  onEditPrice,
  onDelete,
  updatingId,
}: ProductItemRowProps) {
  const isUpdating = updatingId === product.id;

  return (
    <Card variant="outlined" padding="sm" className="flex items-center gap-3">
      <img
        src={product.image}
        alt={product.name_en}
        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-on-surface truncate">
          {product.name_en}
        </h4>
        <p className="text-xs text-on-surface-variant truncate">
          {product.name_am}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono font-bold text-xs text-primary">
            {formatETB(product.price)}
          </span>
          <button
            type="button"
            onClick={() => onEditPrice(product)}
            className="text-[11px] text-primary hover:underline font-semibold"
          >
            ✏ Edit Price
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onToggleAvailability(product.id, product.is_available)}
          className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
            product.is_available
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {isUpdating ? "..." : product.is_available ? "Available" : "Sold Out"}
        </button>

        <button
          type="button"
          onClick={() => onDelete(product.id, product.name_en)}
          className="text-[11px] text-error/80 hover:text-error hover:underline"
        >
          🗑 Remove
        </button>
      </div>
    </Card>
  );
}
