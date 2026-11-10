import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { productsApi } from '@senik/api';
import type { ProductWithOptions } from '@senik/types';

export function useEditProduct(
  product: ProductWithOptions | null,
  onSuccess: () => void,
  onClose: () => void,
) {
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  useEffect(() => {
    setPrice(String(product?.price ?? ''));
    setImage(product?.image ?? '');
  }, [product]);
  const mutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error('Select a dish first.');
      const amount = Number(price);
      if (!Number.isFinite(amount) || amount <= 0)
        throw new Error('Enter a price greater than zero.');
      return productsApi.update(product.id, {
        price: amount,
        image: image || product.image,
      });
    },
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });
  return { price, setPrice, image, setImage, mutation };
}
