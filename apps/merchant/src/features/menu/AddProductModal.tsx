import React, { useState } from "react";
import { Button, Input } from "@senik/ui";
import { productsApi } from "@senik/api";
import { DishPhotoPicker } from "./DishPhotoPicker";

interface AddProductModalProps {
  businessId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=600";

export function AddProductModal({
  businessId,
  isOpen,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const [nameEn, setNameEn] = useState("");
  const [nameAm, setNameAm] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [category, setCategory] = useState("Food");
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const [isFasting, setIsFasting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const price = Number(priceStr);
    if (!nameEn.trim()) return setError("Please enter English name.");
    if (!nameAm.trim()) return setError("Please enter Amharic name.");
    if (!price || price <= 0)
      return setError("Please enter a valid price in ETB.");

    setLoading(true);
    try {
      await productsApi.create({
        business_id: businessId,
        name_en: nameEn.trim(),
        name_am: nameAm.trim(),
        description_en: nameEn.trim(),
        description_am: nameAm.trim(),
        category,
        price,
        image: imageUrl || DEFAULT_IMAGE,
        is_fasting: isFasting,
        is_available: true,
        popular: false,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add menu item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-level-3 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3">
          <h3 className="font-display font-bold text-title-md text-on-surface">
            Add New Menu Dish
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 -mr-1 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Dish Name (English)"
            placeholder="e.g. Special Beef Tibs"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            fullWidth
          />
          <Input
            label="Dish Name (Amharic)"
            placeholder="e.g. ልዩ የበሬ ጥብስ"
            value={nameAm}
            onChange={(e) => setNameAm(e.target.value)}
            fullWidth
          />
          <Input
            label="Price (ETB)"
            type="number"
            placeholder="e.g. 350"
            value={priceStr}
            onChange={(e) => setPriceStr(e.target.value)}
            fullWidth
          />

          <div>
            <label
              htmlFor="dish-category"
              className="block text-label-md text-on-surface-variant mb-1.5"
            >
              Category
            </label>
            <select
              id="dish-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="Food">Food / ዋና ምግብ</option>
              <option value="Meat & Tibs">Meat & Tibs / ጥብስ እና ክትፎ</option>
              <option value="Breakfast">Breakfast / ቁርስ</option>
              <option value="Drinks & Coffee">
                Drinks & Coffee / ቡና እና መጠጦች
              </option>
              <option value="Bakery & Cakes">Bakery & Cakes / ዳቦ እና ኬክ</option>
            </select>
          </div>

          <DishPhotoPicker imageUrl={imageUrl} onChange={setImageUrl} />

          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isFasting}
              onChange={(e) => setIsFasting(e.target.checked)}
              className="rounded text-primary focus:ring-primary w-4 h-4"
            />
            <span className="text-body-sm text-on-surface font-medium">
              Fasting Friendly / የጾም ምግብ
            </span>
          </label>

          {error && (
            <p className="text-body-sm text-error font-medium" role="alert">
              {error}
            </p>
          )}

          <div className="pt-3 flex gap-2">
            <Button type="button" variant="ghost" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Save & Publish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
