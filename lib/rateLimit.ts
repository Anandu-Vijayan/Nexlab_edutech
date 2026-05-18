type RateLimitEntry = {
  timestamps: number[];
};

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(namespace: string): Map<string, RateLimitEntry> {
  let store = stores.get(namespace);
  if (!store) {
    store = new Map();
    stores.set(namespace, store);
  }
  return store;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export type RateLimitConfig = {
  max: number;
  windowMs: number;
};

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export function getRegisterRateLimitConfig(): RateLimitConfig {
  const max = Number(process.env.RATE_LIMIT_REGISTER_MAX ?? "5");
  const windowMs = Number(process.env.RATE_LIMIT_REGISTER_WINDOW_MS ?? "900000");
  return {
    max: Number.isFinite(max) && max > 0 ? max : 5,
    windowMs: Number.isFinite(windowMs) && windowMs > 0 ? windowMs : 900_000,
  };
}

export function rateLimit(
  key: string,
  namespace: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const store = getStore(namespace);
  const entry = store.get(key) ?? { timestamps: [] };

  const windowStart = now - config.windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= config.max) {
    const oldest = entry.timestamps[0] ?? now;
    const retryAfterMs = oldest + config.windowMs - now;
    store.set(key, entry);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  entry.timestamps.push(now);
  store.set(key, entry);
  return { allowed: true };
}

/** Clears in-memory state — for tests only. */
export function clearRateLimitStore(namespace?: string): void {
  if (namespace) {
    stores.delete(namespace);
  } else {
    stores.clear();
  }
}
