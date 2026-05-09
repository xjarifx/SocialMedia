type CacheValue = string | number | boolean | object | null;

interface CacheEntry {
  value: CacheValue;
  expiry: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry>();
  private readonly defaultTTL = 60_000;

  async get<T = CacheValue>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set(key: string, value: CacheValue, ttlMs?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiry: Date.now() + (ttlMs ?? this.defaultTTL),
    });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace("*", ".*"));
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }
}

export const cache = new MemoryCache();

export function buildCacheKey(...parts: unknown[]): string {
  return parts.map(p => String(p ?? "").trim()).filter(Boolean).join(":");
}
