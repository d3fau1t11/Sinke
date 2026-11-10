import { useText } from '@senik/i18n';
const PRESET_IMAGES = [
  {
    label: 'Tibs',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
  },
  {
    label: 'Kitfo',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
  },
  {
    label: 'Coffee',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600',
  },
  {
    label: 'Pastry',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
  },
];

interface Props {
  imageUrl: string;
  onChange: (url: string) => void;
}
export function DishPhotoPresets({ imageUrl, onChange }: Props) {
  const text = useText();
  return (
    <div>
      <p className="text-label-sm font-semibold text-on-surface-variant mb-1">
        {text('Or Pick Preset:')}
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {PRESET_IMAGES.map((image) => (
          <button
            type="button"
            key={image.label}
            onClick={() => onChange(image.url)}
            aria-pressed={imageUrl === image.url}
            className={`p-1 rounded-lg border-2 text-center transition-all ${
              imageUrl === image.url
                ? 'border-primary bg-primary/5 font-bold'
                : 'border-transparent bg-surface-container-low hover:bg-surface-container'
            }`}
          >
            <img
              src={image.url}
              alt={text(image.label ?? '')}
              className="w-full h-8 object-cover rounded mb-0.5"
            />
            <span className="text-micro text-on-surface block truncate">
              {text(image.label ?? '')}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
