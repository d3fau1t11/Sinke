import type { Address } from '@senik/types';
import { readDemoData, writeDemoData } from './store';
import { requireDemoRole } from './session';

export interface AddressInput {
  label: string;
  full_address: string;
  landmark?: string;
}

export function saveDemoAddress(input: AddressInput, id?: string): Address {
  const profile = requireDemoRole('customer');
  if (!input.label.trim() || !input.full_address.trim())
    throw new Error('Enter a label and delivery address.');
  const data = readDemoData();
  const existing = id ? data.addresses.find((row) => row.id === id) : null;
  if (id && !existing) throw new Error('Address not found.');
  const address: Address = {
    id: id ?? crypto.randomUUID(),
    user_id: profile.id,
    label: input.label.trim(),
    full_address: input.full_address.trim(),
    landmark: input.landmark?.trim() || null,
    latitude: null,
    longitude: null,
    is_default: existing?.is_default ?? data.addresses.length === 0,
    created_at: existing?.created_at ?? new Date().toISOString(),
  };
  data.addresses = id
    ? data.addresses.map((row) => (row.id === id ? address : row))
    : [...data.addresses, address];
  writeDemoData(data);
  return address;
}

export function deleteDemoAddress(id: string): void {
  requireDemoRole('customer');
  const data = readDemoData();
  const removedDefault = data.addresses.find((row) => row.id === id)?.is_default;
  data.addresses = data.addresses.filter((row) => row.id !== id);
  if (removedDefault && data.addresses[0]) data.addresses[0].is_default = true;
  writeDemoData(data);
}

export function setDemoDefaultAddress(id: string): void {
  requireDemoRole('customer');
  const data = readDemoData();
  if (!data.addresses.some((row) => row.id === id)) throw new Error('Address not found.');
  data.addresses.forEach((row) => {
    row.is_default = row.id === id;
  });
  writeDemoData(data);
}
