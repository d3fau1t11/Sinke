import { describe, it, expect } from 'vitest';
import { queryKeys } from './queryKeys';

describe('queryKeys', () => {
  it('generates auth session key', () => {
    expect(queryKeys.auth.session()).toEqual(['auth', 'session']);
  });

  it('generates auth profile key', () => {
    expect(queryKeys.auth.profile('user-1')).toEqual(['auth', 'profile', 'user-1']);
  });

  it('generates zones all key', () => {
    expect(queryKeys.zones.all()).toEqual(['zones']);
  });

  it('generates businesses all key', () => {
    expect(queryKeys.businesses.all()).toEqual(['businesses', undefined]);
  });

  it('generates businesses by zone key', () => {
    expect(queryKeys.businesses.byZone('zone-1')).toEqual(['businesses', 'zone', 'zone-1', undefined]);
  });

  it('generates products by business key', () => {
    expect(queryKeys.products.byBusiness('biz-1')).toEqual(['products', 'business', 'biz-1', undefined]);
  });

  it('generates orders active key', () => {
    expect(queryKeys.orders.active()).toEqual(['orders', 'active']);
  });

  it('generates chat messages key', () => {
    expect(queryKeys.chat.messages('order-1')).toEqual(['chat', 'messages', 'order-1']);
  });
});
