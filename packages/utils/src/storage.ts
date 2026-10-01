const PREFIX = 'senik_';

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(PREFIX + key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  clear(): void {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
    keys.forEach((k) => localStorage.removeItem(k));
  },

  getSession(): { token: string; expiresAt: number } | null {
    return this.get('session');
  },

  setSession(session: { token: string; expiresAt: number }): void {
    this.set('session', session);
  },

  clearSession(): void {
    this.remove('session');
  }
};