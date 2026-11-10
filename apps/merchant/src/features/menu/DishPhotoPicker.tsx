import { useText } from '@senik/i18n';
import { useDishPhoto } from './hooks/useDishPhoto';
import { DishPhotoPresets } from './components/DishPhotoPresets';

interface DishPhotoPickerProps {
  imageUrl: string;
  onChange: (url: string) => void;
}
export function DishPhotoPicker({ imageUrl, onChange }: DishPhotoPickerProps) {
  const text = useText();
  const model = useDishPhoto(onChange);
  return (
    <div className="space-y-2">
      <input
        ref={model.fileInputRef}
        id={model.inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={model.handleFileChange}
      />
      <div className="flex items-center justify-between">
        <label htmlFor={model.inputId} className="text-xs font-semibold text-on-surface-variant">
          {text('Food Photo')}
        </label>
        <button
          type="button"
          onClick={model.openPicker}
          disabled={model.compressing}
          className="text-label-sm font-bold text-primary hover:underline inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[15px]">photo_camera</span>
          {model.compressing ? text('Compressing...') : text('Take Photo / Upload')}
        </button>
      </div>
      {model.isAndroid && (
        <button
          type="button"
          disabled={model.compressing}
          onClick={() => void model.takePhoto()}
          className="text-primary underline font-bold"
        >
          {text('Take Photo')}
        </button>
      )}
      <button
        type="button"
        onClick={model.openPicker}
        disabled={model.compressing}
        aria-label={imageUrl ? text('Change dish photo') : text('Choose dish photo')}
        className="w-full h-32 border-2 border-dashed border-outline-variant rounded-xl overflow-hidden flex items-center justify-center bg-surface-container-lowest"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={text('Food dish')} className="w-full h-full object-cover" />
        ) : (
          <span className="font-bold text-primary">
            {text('Choose a photo from camera or gallery')}
          </span>
        )}
      </button>
      {model.error && (
        <p role="alert" className="text-xs text-error">
          {text(model.error ?? '')}
        </p>
      )}
      <DishPhotoPresets imageUrl={imageUrl} onChange={onChange} />
    </div>
  );
}
