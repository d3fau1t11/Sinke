import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@senik/types';

declare global {
  interface ImportMeta {
    env: {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
      VITE_SUPABASE_SERVICE_ROLE_KEY?: string;
    };
  }
}

let clientInstance: SupabaseClient<Database> | null = null;

export function createClient(): SupabaseClient<Database> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  }

  return createSupabaseClient<Database>(url, anonKey, {
    auth: {
      storageKey: 'senik-auth',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

export function getClient(): SupabaseClient<Database> {
  if (!clientInstance) {
    clientInstance = createClient();
  }
  return clientInstance;
}

export const supabase = getClient();

/**
 * Narrows a PostgREST result to the row shape the caller expects.
 *
 * `Database` (see `@senik/types`) does not yet carry per-table `Relationships`, so supabase-js
 * cannot infer query results: list queries come back as `never[]` and `.single()` as `any`.
 * Instead of letting that leak into the apps, each read function declares its real return type
 * and narrows here — the one boundary where the generated types are known to be incomplete.
 * Running `pnpm gen:types` against a live project would generate the relations and remove the
 * need for this.
 */
export function asRows<T>(data: unknown): T[] {
  return (data ?? []) as T[];
}

/** Single-row variant of {@link asRows}. */
export function asRow<T>(data: unknown): T | null {
  return (data ?? null) as T | null;
}
