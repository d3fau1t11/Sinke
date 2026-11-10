import { useText } from '@senik/i18n';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { productsApi } from '@senik/api';
import type { ProductWithOptions } from '@senik/types';
import { useMerchantAuthStore } from '../../auth/store/merchantAuthStore';

export function useMerchantMenu() {
  const text = useText();
  const { merchantId } = useMerchantAuthStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithOptions | null>(null);
  const menu = useQuery({
    queryKey: ['merchant-menu', merchantId],
    queryFn: () => productsApi.getAllByBusiness(merchantId!),
    enabled: Boolean(merchantId),
  });
  const toggle = useMutation({
    mutationFn: ({ id, current }: { id: string; current: boolean }) =>
      productsApi.setIsAvailable(id, !current),
    onSuccess: () => {
      void menu.refetch();
    },
  });
  const remove = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      void menu.refetch();
    },
  });
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(text('Are you sure you want to delete "{{name}}" from your menu?', { name })))
      remove.mutate(id);
  };
  return {
    error: menu.error?.message ?? toggle.error?.message ?? remove.error?.message ?? '',
    merchantId,
    products: menu.data ?? [],
    loading: menu.isPending,
    updatingId: toggle.isPending ? toggle.variables.id : remove.isPending ? remove.variables : null,
    isAddOpen,
    setIsAddOpen,
    editingProduct,
    setEditingProduct,
    loadMenu: menu.refetch,
    handleToggle: (id: string, current: boolean) => toggle.mutate({ id, current }),
    handleDelete,
  };
}
