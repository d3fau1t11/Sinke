import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { businessesApi } from '../businesses';
import { productsApi } from '../products';
import { ordersApi } from '../orders';
import { addressesApi } from '../addresses';
import { usersApi } from '../users';
import { zonesApi } from '../zones';
import { transactionsApi } from '../transactions';
import {
  startDemoSession,
  endDemoSession,
  demoAccounts,
  DEMO_BUSINESS_ID,
  getDemoRole,
} from './session';
import { readDemoData, resetDemoData } from './store';
import { advanceDemoOrder } from './orders';
import type { CreateOrderInput } from '../orderInput';

const input: CreateOrderInput = {
  businessId: DEMO_BUSINESS_ID,
  items: [{ productId: 'demo-shiro', quantity: 2 }],
  deliveryAddress: 'Demo address',
  paymentMethod: 'cash',
  idempotencyKey: 'demo-checkout-key',
};

beforeEach(() => {
  const values = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  });
  vi.stubGlobal(
    'fetch',
    vi.fn(() => {
      throw new Error('Demo attempted a network request');
    }),
  );
  vi.stubEnv('VITE_SUPABASE_URL', '');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
});
afterEach(() => {
  expect(fetch).not.toHaveBeenCalled();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('independent demo accounts', () => {
  it.each(['customer', 'merchant', 'rider', 'admin'] as const)(
    'starts %s without a backend or credentials',
    (role) => {
      expect(startDemoSession(role).id).toBe(demoAccounts[role].id);
      expect(getDemoRole()).toBe(role);
      expect(readDemoData().orders.length).toBeGreaterThan(0);
    },
  );

  it('ends demo access without clearing a real Supabase session', () => {
    localStorage.setItem('senik-supabase-auth', 'real-session');
    startDemoSession('customer');
    endDemoSession();
    expect(getDemoRole()).toBeNull();
    expect(() => readDemoData()).toThrow('Sign in');
    expect(localStorage.getItem('senik-supabase-auth')).toBe('real-session');
  });

  it('loads catalog, zones, user directory and transactions with no network', async () => {
    startDemoSession('admin');
    expect(await businessesApi.getAll()).toHaveLength(3);
    expect(await zonesApi.getZones()).toHaveLength(3);
    expect(await usersApi.getAll()).toHaveLength(4);
    expect((await transactionsApi.getAll()).length).toBeGreaterThan(0);
    expect((await productsApi.search('shiro'))[0]?.name_en).toBe('Shiro');
  });
});

describe('customer checkout and tracking', () => {
  beforeEach(() => startDemoSession('customer'));

  it('saves the displayed fees and prevents duplicate checkout', async () => {
    const created = await ordersApi.create(input);
    expect((await ordersApi.getById(created.id))?.total).toBe(295);
    expect(await ordersApi.create(input)).toEqual(created);
    expect((await ordersApi.getMyOrders()).filter((order) => order.id === created.id)).toHaveLength(
      1,
    );
  });

  it('simulates online payment without contacting a payment provider', async () => {
    const created = await ordersApi.create({ ...input, paymentMethod: 'telebirr' });
    expect((await ordersApi.getById(created.id))?.payment_status).toBe('paid');
  });

  it.each([0, -1, 1.5, Number.NaN])('rejects invalid quantity %s', async (quantity) => {
    await expect(
      ordersApi.create({ ...input, items: [{ productId: 'demo-shiro', quantity }] }),
    ).rejects.toThrow('Quantity');
  });

  it('rejects dishes from another restaurant and unavailable items', async () => {
    await expect(
      ordersApi.create({ ...input, items: [{ productId: 'demo-tulu-meal', quantity: 1 }] }),
    ).rejects.toThrow('unavailable');
    startDemoSession('merchant');
    await productsApi.setIsAvailable('demo-shiro', false);
    startDemoSession('customer');
    await expect(ordersApi.create(input)).rejects.toThrow('unavailable');
  });

  it('advances a sample order through delivery and prevents another completion', async () => {
    const created = await ordersApi.create(input);
    for (let step = 0; step < 5; step++) advanceDemoOrder(created.id);
    expect((await ordersApi.getById(created.id))?.status).toBe('delivered');
    expect(() => advanceDemoOrder(created.id)).toThrow('finished');
  });

  it('cannot change merchant status or menu prices', async () => {
    await expect(businessesApi.setIsOpen(DEMO_BUSINESS_ID, false)).rejects.toThrow('cannot');
    await expect(productsApi.update('demo-shiro', { price: 1 })).rejects.toThrow('cannot');
  });
});

describe('merchant menu and rider delivery', () => {
  it('persists edits and restores the original sample data on reset', async () => {
    startDemoSession('merchant');
    await productsApi.update('demo-shiro', { price: 135 });
    expect((await productsApi.getById('demo-shiro'))?.price).toBe(135);
    endDemoSession();
    startDemoSession('merchant');
    expect((await productsApi.getById('demo-shiro'))?.price).toBe(135);
    resetDemoData();
    expect((await productsApi.getById('demo-shiro'))?.price).toBe(120);
  });

  it('allows only ready jobs and only one active job per rider', async () => {
    startDemoSession('rider');
    const riderId = demoAccounts.rider.id;
    const jobs = await ordersApi.getAvailableForRiders();
    expect(jobs.every((job) => job.status === 'ready')).toBe(true);
    await expect(ordersApi.acceptDelivery('demo-order-1', riderId)).rejects.toThrow(
      'no longer available',
    );
    await ordersApi.acceptDelivery(jobs[0]!.id, riderId);
    await expect(ordersApi.acceptDelivery(jobs[1]!.id, riderId)).rejects.toThrow('Finish');
    await ordersApi.updateStatus(jobs[0]!.id, 'picked_up');
    await ordersApi.updateStatus(jobs[0]!.id, 'delivered');
    await expect(ordersApi.updateStatus(jobs[0]!.id, 'delivered')).rejects.toThrow('closed');
    expect(
      (await ordersApi.getRiderOrders(riderId)).filter((job) => job.status === 'delivered'),
    ).toHaveLength(3);
  });

  it('keeps exactly one default address when adding, switching and deleting', async () => {
    startDemoSession('customer');
    const added = await addressesApi.addAddress({ label: 'work', full_address: 'Demo workplace' });
    await addressesApi.setDefault(added.id);
    expect((await addressesApi.getMyAddresses()).filter((row) => row.is_default)).toHaveLength(1);
    await addressesApi.deleteAddress(added.id);
    expect((await addressesApi.getMyAddresses())[0]?.is_default).toBe(true);
    await expect(addressesApi.addAddress({ label: 'work', full_address: '' })).rejects.toThrow(
      'address',
    );
  });
});
