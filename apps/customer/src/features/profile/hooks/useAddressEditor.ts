import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addressesApi } from '@senik/api';
import type { Address } from '@senik/types';

const blankAddress = { label: 'home', full_address: '', landmark: '' };

export function useAddressEditor(refresh: () => void) {
  const [editing, setEditing] = useState<Address | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(blankAddress);
  const save = useMutation({
    mutationFn: () => {
      if (!form.full_address.trim() || !form.label.trim())
        throw new Error('Enter an address and label.');
      return editing ? addressesApi.updateAddress(editing.id, form) : addressesApi.addAddress(form);
    },
    onSuccess: () => {
      setShowModal(false);
      refresh();
    },
  });
  const edit = (address?: Address) => {
    setEditing(address ?? null);
    setForm(
      address
        ? {
            label: address.label,
            full_address: address.full_address,
            landmark: address.landmark ?? '',
          }
        : blankAddress,
    );
    save.reset();
    setShowModal(true);
  };
  return { editing, showModal, setShowModal, form, setForm, save, edit };
}
