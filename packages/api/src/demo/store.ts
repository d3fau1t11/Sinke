import type { Address, Business, OrderDetail, ProductWithOptions } from '@senik/types';
import { demoBusinesses, demoProducts } from './catalog';
import { seedDemoOrders } from './seedOrders';
import { demoAccounts, isDemoSession } from './session';

export const DEMO_DATA_KEY = 'senik-demo-data-v1';
export interface DemoData {
  businesses: Business[];
  products: ProductWithOptions[];
  orders: OrderDetail[];
  addresses: Address[];
}
const listeners = new Set<() => void>();

function seed(): DemoData {
  return structuredClone({
    businesses: demoBusinesses,
    products: demoProducts,
    orders: seedDemoOrders(),
    addresses: [
      {
        id: 'demo-address-home',
        user_id: demoAccounts.customer.id,
        label: 'home',
        full_address: 'Koye Feche, Block 42, Gate 3',
        landmark: 'Near the community market',
        latitude: null,
        longitude: null,
        is_default: true,
        created_at: new Date().toISOString(),
      },
    ],
  });
}

export function readDemoData(): DemoData {
  if (!isDemoSession()) throw new Error('Sign in to a demo account first.');
  const raw = globalThis.localStorage.getItem(DEMO_DATA_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as DemoData;
      if (
        Array.isArray(parsed.businesses) &&
        Array.isArray(parsed.products) &&
        Array.isArray(parsed.orders) &&
        Array.isArray(parsed.addresses)
      )
        return parsed;
    } catch {
      /* Recreate outdated or damaged sample data. */
    }
  }
  const data = seed();
  writeDemoData(data);
  return data;
}

export function writeDemoData(data: DemoData): void {
  if (!isDemoSession()) throw new Error('Sign in to a demo account first.');
  globalThis.localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(data));
  listeners.forEach((listener) => listener());
}

export function subscribeDemoData(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetDemoData(): void {
  writeDemoData(seed());
}
