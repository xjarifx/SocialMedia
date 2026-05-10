import Redis from "ioredis";

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

class RedisCache {
  private client: Redis;

  constructor(url: string) {
    this.client = new Redis(url);
  }

  async get<T = CacheValue>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() > entry.expiry) {
      await this.client.del(key);
      return null;
    }
    return entry.value as T;
  }

  async set(key: string, value: CacheValue, ttlMs?: number): Promise<void> {
    const entry: CacheEntry = {
      value,
      expiry: Date.now() + (ttlMs ?? 60_000),
    };
    await this.client.set(key, JSON.stringify(entry));
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const redisPattern = pattern.replace("*", "*");
    let cursor = "0";
    do {
      const [nextCursor, keys] = await this.client.scan(
        cursor,
        "MATCH",
        redisPattern,
        "COUNT",
        100
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } while (cursor !== "0");
  }
}

const redisUrl = process.env.REDIS_URL;

export const cache: MemoryCache | RedisCache = redisUrl
  ? new RedisCache(redisUrl)
  : new MemoryCache();

export function buildCacheKey(...parts: unknown[]): string {
  return parts.map(p => String(p ?? "").trim()).filter(Boolean).join(":");
}
