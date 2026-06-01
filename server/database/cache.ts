interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private store: Map<string, CacheEntry<any>> = new Map();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidatePrefix(prefix: string): void {
    const keys = Array.from(this.store.keys());
    for (const key of keys) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }
}

export const dbCache = new MemoryCache();

export const CACHE_KEYS = {
  subscription: (userId: string) => `sub:${userId}`,
  resumeHistory: (userId: string) => `history:${userId}`,
  resumeById: (id: number, userId: string) => `resume:${userId}:${id}`,
};

export const CACHE_TTL = {
  subscription: 600_000,   // 10 min — only changes on payment webhook
  resumeHistory: 300_000,  // 5 min — list only changes on insert/delete
  resumeById: 900_000,     // 15 min — individual resumes never change
};
