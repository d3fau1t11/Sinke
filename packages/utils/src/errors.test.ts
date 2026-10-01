import { describe, it, expect } from 'vitest';
import { parseErrorMessage, getErrorCode, isNetworkError, isAuthError, AppError } from './errors';

describe('errors', () => {
  describe('parseErrorMessage', () => {
    it('parses Error object', () => {
      expect(parseErrorMessage(new Error('Test error'))).toBe('Test error');
    });

    it('parses string', () => {
      expect(parseErrorMessage('String error')).toBe('String error');
    });

    it('parses object with message', () => {
      expect(parseErrorMessage({ message: 'Object error' })).toBe('Object error');
    });

    it('returns default message for unknown', () => {
      expect(parseErrorMessage(null)).toBe('An unexpected error occurred');
    });
  });

  describe('getErrorCode', () => {
    it('gets code from object', () => {
      expect(getErrorCode({ code: 'ERR_001' })).toBe('ERR_001');
    });

    it('returns null for missing code', () => {
      expect(getErrorCode({})).toBeNull();
    });
  });

  describe('isNetworkError', () => {
    it('detects network errors', () => {
      expect(isNetworkError(new Error('Network request failed'))).toBe(true);
      expect(isNetworkError(new Error('Fetch timeout'))).toBe(true);
    });

    it('returns false for non-network errors', () => {
      expect(isNetworkError(new Error('Validation failed'))).toBe(false);
    });
  });

  describe('isAuthError', () => {
    it('detects auth errors', () => {
      expect(isAuthError({ code: '401' })).toBe(true);
      expect(isAuthError({ code: '403' })).toBe(true);
    });

    it('returns false for non-auth errors', () => {
      expect(isAuthError({ code: '500' })).toBe(false);
    });
  });

  describe('AppError', () => {
    it('creates error with default values', () => {
      const error = new AppError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('UNKNOWN');
      expect(error.statusCode).toBe(500);
    });

    it('creates error with custom values', () => {
      const error = new AppError('Custom error', 'CUSTOM', 400);
      expect(error.code).toBe('CUSTOM');
      expect(error.statusCode).toBe(400);
    });
  });
});