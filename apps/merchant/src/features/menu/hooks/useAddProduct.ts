import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { productsApi } from '@senik/api';

const initial = {
  nameEn: '',
  nameAm: '',
  price: '',
  category: 'Food',
  image: '',
  fasting: false,
};

export function useAddProduct(businessId: string, onSuccess: () => void, onClose: () => void) {
  const [form, setForm] = useState(initial);
  const mutation = useMutation({
    mutationFn: async () => {
      const price = Number(form.price);
      if (!form.nameEn.trim() || !form.nameAm.trim())
        throw new Error('Enter the English and Amharic dish names.');
      if (!Number.isFinite(price) || price <= 0)
        throw new Error('Enter a price greater than zero.');
      return productsApi.create({
        business_id: businessId,
        name_en: form.nameEn.trim(),
        name_am: form.nameAm.trim(),
        description_en: form.nameEn.trim(),
        description_am: form.nameAm.trim(),
        category: form.category,
        price,
        image: form.image || '/senik-logo.jpg',
        is_fasting: form.fasting,
        is_available: true,
        popular: false,
      });
    },
    onSuccess: () => {
      setForm(initial);
      onSuccess();
      onClose();
    },
  });
  return { form, setForm, mutation };
}
