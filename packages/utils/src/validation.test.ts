import { describe, it, expect } from 'vitest';
import { isValidPhone, isValidEmail, isValidOTP, sanitizePhone, formatPhone } from './validation';

describe('validation', () => {
  describe('isValidPhone', () => {
    it('validates Ethiopian phone numbers', () => {
      expect(isValidPhone('+251912345678')).toBe(true);
      expect(isValidPhone('0912345678')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(isValidPhone('12345')).toBe(false);
      expect(isValidPhone('abcdefghij')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('validates email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('isValidOTP', () => {
    it('validates 6-digit OTP', () => {
      expect(isValidOTP('123456')).toBe(true);
    });

    it('rejects non-6-digit OTP', () => {
      expect(isValidOTP('123')).toBe(false);
      expect(isValidOTP('1234567')).toBe(false);
      expect(isValidOTP('abcdef')).toBe(false);
    });
  });

  describe('sanitizePhone', () => {
    it('removes spaces and dashes', () => {
      expect(sanitizePhone('+251 912-345-678')).toBe('+251912345678');
    });
  });

  describe('formatPhone', () => {
    it('converts local format to international', () => {
      expect(formatPhone('0912345678')).toBe('+251912345678');
    });

    it('keeps international format', () => {
      expect(formatPhone('+251912345678')).toBe('+251912345678');
    });
  });
});