import { beforeEach, describe, expect, it, vi } from 'vitest';
import { normalizeEthiopianPhone, sendCustomerOtp, verifyCustomerOtp } from './customerAuth';

const api = vi.hoisted(() => ({
  signInWithOtp: vi.fn(), verifyOtp: vi.fn(), signOut: vi.fn(), from: vi.fn(),
}));
vi.mock('./client', () => ({
  supabase: { auth: api, from: api.from },
  asRow: (data: unknown) => data,
}));

describe('customer phone authentication', () => {
  beforeEach(() => vi.clearAllMocks());
  it('normalizes phone numbers for Supabase SMS and rejects invalid input', async () => {
    expect(normalizeEthiopianPhone('0911 123 456')).toBe('+251911123456');
    expect(normalizeEthiopianPhone('+251-911-123456')).toBe('+251911123456');
    expect(() => normalizeEthiopianPhone('123456')).toThrow();
    api.signInWithOtp.mockResolvedValue({ error: null });
    await sendCustomerOtp('0911123456');
    expect(api.signInWithOtp).toHaveBeenCalledWith({
      phone: '+251911123456', options: { channel: 'sms' },
    });
  });
  it('rejects a disabled SMS provider without accepting a development bypass', async () => {
    api.signInWithOtp.mockResolvedValue({ error: new Error('phone_provider_disabled') });
    await expect(sendCustomerOtp('0911123456')).rejects.toThrow('phone_provider_disabled');
    expect(api.verifyOtp).not.toHaveBeenCalled();
  });
  it('rejects an invalid verification code before provisioning a profile', async () => {
    api.verifyOtp.mockResolvedValue({ data: {}, error: new Error('Invalid code') });
    await expect(verifyCustomerOtp('0911123456', '123456')).rejects.toThrow('Invalid code');
    expect(api.from).not.toHaveBeenCalled();
  });
});
