import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('client', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('creates client when env vars are present', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
    
    const { createClient } = await import('./client');
    const client = createClient();
    expect(client).toBeDefined();
  });
});