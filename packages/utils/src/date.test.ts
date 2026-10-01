import { describe, it, expect } from 'vitest';
import { formatDate, formatTime, formatRelativeTime, isToday, isYesterday } from './date';

describe('date', () => {
  describe('formatDate', () => {
    it('formats date in English', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date, 'en')).toContain('Jan');
    });
  });

  describe('formatTime', () => {
    it('formats time', () => {
      const date = new Date('2024-01-15T14:30:00');
      expect(formatTime(date, 'en')).toContain('2:30');
    });
  });

  describe('formatRelativeTime', () => {
    it('returns "Just now" for current time', () => {
      const now = new Date();
      expect(formatRelativeTime(now, 'en', false)).toBe('Just now');
    });

    it('returns "Yesterday" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(formatRelativeTime(yesterday, 'en', false)).toBe('Yesterday');
    });
  });

  describe('isToday', () => {
    it('returns true for today', () => {
      expect(isToday(new Date())).toBe(true);
    });

    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('isYesterday', () => {
    it('returns true for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isYesterday(yesterday)).toBe(true);
    });

    it('returns false for today', () => {
      expect(isYesterday(new Date())).toBe(false);
    });
  });
});