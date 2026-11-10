import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';

import { useCartStore } from '../../cart/store/cartStore';
import { useZoneStore } from '../../zone/store/zoneStore';
import { useBusinessCatalog } from '@senik/api';
import type { ProductWithOptions } from '@senik/types';

export function useMerchantDetail() {
  const { t, isAm } = useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedZoneId } = useZoneStore();
  const { addItem, items } = useCartStore();

  const catalog = useBusinessCatalog(id);
  const business = catalog.business.data ?? null;
  const products = catalog.products.data ?? [];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const loading = catalog.business.isPending || catalog.products.isPending;
  const error = catalog.business.error?.message ?? catalog.products.error?.message ?? '';

  const categories = ['all', ...new Set(products.map((p) => p.category))];

  const handleAddToCart = (product: ProductWithOptions) => {
    if (!business) return;

    if (!selectedZoneId) {
      navigate('/location');
      return;
    }

    const hasOtherBusiness = items.some((item) => item.businessId !== business.id);
    if (hasOtherBusiness) {
      alert(isAm ? 'በአንድ ጊዜ ከአንድ ሱቅ መግዛት አይቻልም' : 'Cannot order from multiple businesses at once');
      return;
    }

    addItem({
      productId: product.id,
      businessId: business.id,
      name: isAm ? product.name_am : product.name_en,
      nameAm: product.name_am,
      price: product.price,
      quantity: 1,
      image: product.image,
      options: [],
      notes: '',
    });
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return {
    filteredProducts,
    t,
    isAm,
    navigate,
    items,
    business,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    categories,
    handleAddToCart,
  };
}
