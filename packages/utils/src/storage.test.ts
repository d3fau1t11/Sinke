import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from './storage';

describe('storage', () => {
  beforeEach(() => {
    storage.clear();
  });

  describe('get', () => {
    it('returns null for missing key', () => {
      expect(storage.get('missing')).toBeNull();
    });

    it('returns parsed value', () => {
      storage.set('test', { foo: 'bar' });
      expect(storage.get('test')).toEqual({ foo: 'bar' });
    });
  });

  describe('set', () => {
    it('stores value', () => {
      storage.set('key', 'value');
      expect(storage.get('key')).toBe('value');
    });
  });

  describe('remove', () => {
    it('removes key', () => {
      storage.set('key', 'value');
      storage.remove('key');
      expect(storage.get('key')).toBeNull();
    });
  });

  describe('clear', () => {
    it('clears all senik keys', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      storage.clear();
      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')).toBeNull();
    });
  });

  describe('session', () => {
    it('stores and retrieves session', () => {
      const session = { token: 'abc', expiresAt: Date.now() + 3600000 };
      storage.setSession(session);
      expect(storage.getSession()).toEqual(session);
    });

    it('clears session', () => {
      storage.setSession({ token: 'abc', expiresAt: Date.now() });
      storage.clearSession();
      expect(storage.getSession()).toBeNull();
    });
  });
});