import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from './logger';

describe('logger', () => {
  beforeEach(() => {
    logger.clear();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('logs debug messages', () => {
    logger.debug('Debug message');
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('debug');
  });

  it('logs info messages', () => {
    logger.info('Info message');
    const logs = logger.getLogs();
    expect(logs[0].level).toBe('info');
  });

  it('logs warnings', () => {
    logger.warn('Warning message');
    const logs = logger.getLogs();
    expect(logs[0].level).toBe('warn');
  });

  it('logs errors', () => {
    logger.error('Error message');
    const logs = logger.getLogs();
    expect(logs[0].level).toBe('error');
  });

  it('includes context in logs', () => {
    logger.info('Message', { userId: '123' });
    const logs = logger.getLogs();
    expect(logs[0].context).toEqual({ userId: '123' });
  });

  it('limits log history', () => {
    for (let i = 0; i < 150; i++) {
      logger.info(`Message ${i}`);
    }
    const logs = logger.getLogs();
    expect(logs.length).toBeLessThanOrEqual(100);
  });

  it('clears logs', () => {
    logger.info('Message');
    logger.clear();
    expect(logger.getLogs()).toHaveLength(0);
  });
});