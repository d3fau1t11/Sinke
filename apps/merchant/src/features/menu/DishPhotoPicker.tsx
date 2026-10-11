import React, { useRef, useState } from "react";
import { Button } from "@senik/ui";
import { compressImageFile } from "./imageUtils";

interface DishPhotoPickerProps {
  imageUrl: string;
  onChange: (url: string) => void;
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

export function DishPhotoPicker({ imageUrl, onChange }: DishPhotoPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setCompressing(true);
    try {
      const compressedDataUrl = await compressImageFile(file);
      onChange(compressedDataUrl);
    } catch {
      setError("Failed to read image from camera.");
    } finally {
      setCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        id="dish-camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center justify-between">
        <label
          htmlFor="dish-camera-input"
          className="text-xs font-semibold text-on-surface-variant"
        >
          Food Photo
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={compressing}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          {compressing ? "⏳ Compressing..." : "📸 Take Photo / Upload"}
        </button>
      </div>

      {imageUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-outline/20 bg-surface-container-low h-32 flex items-center justify-center group">
          <img
            src={imageUrl}
            alt="Food dish"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={compressing}
            >
              📸 Retake
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={compressing}
          className="w-full h-24 border-2 border-dashed border-outline/30 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors bg-surface-container-lowest"
        >
          <span className="text-2xl">📸</span>
          <span className="text-xs font-bold text-on-surface">
            Snap Photo from Phone
          </span>
          <span className="text-[10px] text-on-surface-variant">
            Tap to launch camera or gallery
          </span>
        </button>
      )}

      {error && <p className="text-xs text-error">{error}</p>}

      <div>
        <p className="text-[10px] font-semibold text-on-surface-variant mb-1">
          Or Pick Preset:
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {PRESET_IMAGES.map((img) => (
            <button
              type="button"
              key={img.label}
              onClick={() => onChange(img.url)}
              className={`p-1 rounded-lg border text-center transition-all ${
                imageUrl === img.url
                  ? "border-primary bg-primary/10 font-bold"
                  : "border-outline/20"
              }`}
            >
              <img
                src={img.url}
                alt={img.label}
                className="w-full h-8 object-cover rounded mb-0.5"
              />
              <span className="text-[9px] text-on-surface block truncate">
                {img.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
