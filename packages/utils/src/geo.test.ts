import { describe, it, expect } from 'vitest';
import { calculateDistance, calculateETA, formatDistance, formatDuration } from './geo';

describe('geo', () => {
  describe('calculateDistance', () => {
    it('calculates distance between two points', () => {
      const point1 = { latitude: 9.0522, longitude: 38.7468 };
      const point2 = { latitude: 9.0456, longitude: 38.7523 };
      const distance = calculateDistance(point1, point2);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(10);
    });

    it('returns 0 for same point', () => {
      const point = { latitude: 9.0522, longitude: 38.7468 };
      expect(calculateDistance(point, point)).toBe(0);
    });
  });

  describe('calculateETA', () => {
    it('calculates ETA based on distance and speed', () => {
      const eta = calculateETA(10, 30);
      expect(eta).toBeGreaterThan(0);
    });

    it('returns minimum 5 minutes', () => {
      const eta = calculateETA(0.1, 30);
      expect(eta).toBeGreaterThanOrEqual(5);
    });
  });

  describe('formatDistance', () => {
    it('formats kilometers', () => {
      expect(formatDistance(5.5, false)).toContain('km');
    });

    it('formats meters for short distances', () => {
      expect(formatDistance(0.5, false)).toContain('m');
    });
  });

  describe('formatDuration', () => {
    it('formats minutes', () => {
      expect(formatDuration(30, false)).toContain('min');
    });

    it('formats hours', () => {
      expect(formatDuration(90, false)).toContain('h');
    });
  });
});