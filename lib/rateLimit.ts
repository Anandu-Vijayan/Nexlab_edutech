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
  | { allowed: true; remaining: number; used: number; max: number }
  | { allowed: false; retryAfterSeconds: number; remaining: 0; used: number; max: number };

export type RateLimitStatus = {
  allowed: boolean;
  remaining: number;
  used: number;
  max: number;
  retryAfterSeconds?: number;
};

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export function getRegisterRateLimitConfig(): RateLimitConfig {
  const max = Number(process.env.RATE_LIMIT_REGISTER_MAX ?? "5");
  const windowMs = Number(process.env.RATE_LIMIT_REGISTER_WINDOW_MS ?? String(TWENTY_FOUR_HOURS_MS));
  return {
    max: Number.isFinite(max) && max > 0 ? max : 5,
    windowMs: Number.isFinite(windowMs) && windowMs > 0 ? windowMs : TWENTY_FOUR_HOURS_MS,
  };
}

function pruneTimestamps(timestamps: number[], windowMs: number, now = Date.now()): number[] {
  const windowStart = now - windowMs;
  return timestamps.filter((t) => t > windowStart);
}

export function getRateLimitStatus(
  key: string,
  namespace: string,
  config: RateLimitConfig
): RateLimitStatus {
  const now = Date.now();
  const store = getStore(namespace);
  const entry = store.get(key) ?? { timestamps: [] };
  const timestamps = pruneTimestamps(entry.timestamps, config.windowMs, now);
  const used = timestamps.length;
  const max = config.max;

  if (used >= max) {
    const oldest = timestamps[0] ?? now;
    const retryAfterMs = oldest + config.windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      used,
      max,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  return {
    allowed: true,
    remaining: max - used,
    used,
    max,
  };
}

export function rateLimit(
  key: string,
  namespace: string,
  config: RateLimitConfig
): RateLimitResult {
  const status = getRateLimitStatus(key, namespace, config);
  if (!status.allowed) {
    return {
      allowed: false,
      retryAfterSeconds: status.retryAfterSeconds!,
      remaining: 0,
      used: status.used,
      max: status.max,
    };
  }

  const now = Date.now();
  const store = getStore(namespace);
  const entry = store.get(key) ?? { timestamps: [] };
  entry.timestamps = pruneTimestamps(entry.timestamps, config.windowMs, now);
  entry.timestamps.push(now);
  store.set(key, entry);

  const usedAfter = entry.timestamps.length;
  return {
    allowed: true,
    remaining: Math.max(0, config.max - usedAfter),
    used: usedAfter,
    max: config.max,
  };
}

export function formatRetryAfter(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.ceil((seconds % 3600) / 60);

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    if (remHours > 0) {
      return `about ${days} day${days === 1 ? "" : "s"} and ${remHours} hour${remHours === 1 ? "" : "s"}`;
    }
    return `about ${days} day${days === 1 ? "" : "s"}`;
  }

  if (hours >= 1) {
    if (minutes > 0) {
      return `about ${hours} hour${hours === 1 ? "" : "s"} and ${minutes} minute${minutes === 1 ? "" : "s"}`;
    }
    return `about ${hours} hour${hours === 1 ? "" : "s"}`;
  }

  const safeMinutes = Math.max(1, minutes);
  return `about ${safeMinutes} minute${safeMinutes === 1 ? "" : "s"}`;
}

/** Clears in-memory state — for tests only. */
export function clearRateLimitStore(namespace?: string): void {
  if (namespace) {
    stores.delete(namespace);
  } else {
    stores.clear();
  }
}
