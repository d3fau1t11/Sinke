import { describe, it, expect } from 'vitest';
import { formatCurrency, formatETB, parseCurrency } from './currency';

describe('currency', () => {
  describe('formatCurrency', () => {
    it('formats ETB currency', () => {
      expect(formatCurrency(1000, 'ETB', 'en')).toContain('1,000');
    });

    it('formats with custom locale', () => {
      expect(formatCurrency(500, 'ETB', 'am')).toContain('500');
    });
  });

  describe('formatETB', () => {
    it('formats in English', () => {
      expect(formatETB(1000, false)).toContain('ETB');
    });

    it('formats in Amharic', () => {
      expect(formatETB(1000, true)).toContain('ብር');
    });
  });

  describe('parseCurrency', () => {
    it('parses numeric string', () => {
      expect(parseCurrency('1000')).toBe(1000);
    });

    it('parses currency with symbol', () => {
      expect(parseCurrency('ETB 1,000')).toBe(1000);
    });

    it('returns 0 for invalid input', () => {
      expect(parseCurrency('invalid')).toBe(0);
    });
  });
});