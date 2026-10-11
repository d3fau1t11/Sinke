import React, { useState } from "react";
import { Button, Input } from "@senik/ui";
import { productsApi } from "@senik/api";

interface AddProductModalProps {
  businessId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_IMAGES = [
  {
    label: "Tibs",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
  },
  {
    label: "Kitfo",
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
  },
  {
    label: "Coffee",
    url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600",
  },
  {
    label: "Pastry",
    url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
  },
];

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
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0]?.url || "");
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
        image: imageUrl || PRESET_IMAGES[0]?.url,
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
      <div className="bg-surface w-full max-w-md rounded-2xl p-6 shadow-2xl border border-outline/10 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-outline/10 pb-3">
          <h3 className="font-bold text-lg text-on-surface">
            Add New Menu Dish
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface"
          >
            ✕
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
              className="block text-xs font-semibold text-on-surface-variant mb-1"
            >
              Category
            </label>
            <select
              id="dish-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface-container-low border border-outline/20 rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
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

          <div>
            <p className="block text-xs font-semibold text-on-surface-variant mb-1">
              Photo Preset
            </p>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_IMAGES.map((img) => (
                <button
                  type="button"
                  key={img.label}
                  onClick={() => setImageUrl(img.url)}
                  className={`p-1.5 rounded-xl border text-center transition-all ${imageUrl === img.url ? "border-primary bg-primary/10 font-bold" : "border-outline/20"}`}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-10 object-cover rounded-lg mb-1"
                  />
                  <span className="text-[10px] text-on-surface">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isFasting}
              onChange={(e) => setIsFasting(e.target.checked)}
              className="rounded text-primary focus:ring-primary w-4 h-4"
            />
            <span className="text-xs text-on-surface font-medium">
              Fasting Friendly / የጾም ምግብ
            </span>
          </label>

          {error && <p className="text-xs text-error font-medium">{error}</p>}

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
