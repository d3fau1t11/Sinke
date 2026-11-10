import { useRef, useState, useId } from 'react';
import type { ChangeEvent } from 'react';
import { compressImageFile } from '../imageUtils';
import { isAndroid, takeDishPhoto } from '@senik/native';

export function useDishPhoto(onChange: (url: string) => void) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState('');
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    setCompressing(true);
    try {
      if (!file.type.startsWith('image/')) throw new Error('Choose an image file.');
      onChange(await compressImageFile(file));
    } catch {
      setError('Could not read this image. Try another photo.');
    } finally {
      setCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  return {
    inputId,
    fileInputRef,
    compressing,
    error,
    handleFileChange,
    openPicker: () => fileInputRef.current?.click(),
    isAndroid: isAndroid(),
    takePhoto: async () => {
      setError('');
      setCompressing(true);
      try {
        const photo = await takeDishPhoto();
        if (photo) onChange(await compressImageFile(photo));
      } catch {
        setError('Could not open the camera. Check Android permissions.');
      } finally {
        setCompressing(false);
      }
    },
  };
}
