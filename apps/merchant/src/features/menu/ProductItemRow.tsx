import React from "react";
import { Card } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { ProductWithOptions } from "@senik/types";

interface ProductItemRowProps {
  product: ProductWithOptions;
  onToggleAvailability: (productId: string, current: boolean) => void;
  updatingId: string | null;
}

export function ProductItemRow({
  product,
  onToggleAvailability,
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
        <span className="font-mono font-bold text-xs text-primary mt-0.5 block">
          {formatETB(product.price)}
        </span>
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
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
        <span className="text-[10px] text-on-surface-variant">
          Tap to switch
        </span>
      </div>
    </Card>
  );
}
