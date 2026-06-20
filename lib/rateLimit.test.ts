import { afterEach, describe, expect, it } from "vitest";
import {
  clearRateLimitStore,
  formatRetryAfter,
  getRateLimitStatus,
  rateLimit,
} from "./rateLimit";

describe("rateLimit", () => {
  afterEach(() => {
    clearRateLimitStore("test");
  });

  it("allows requests up to the max within the window", () => {
    const config = { max: 3, windowMs: 60_000 };
    expect(rateLimit("1.2.3.4", "test", config)).toMatchObject({ allowed: true, remaining: 2 });
    expect(rateLimit("1.2.3.4", "test", config)).toMatchObject({ allowed: true, remaining: 1 });
    expect(rateLimit("1.2.3.4", "test", config)).toMatchObject({ allowed: true, remaining: 0 });
  });

  it("blocks when max is exceeded", () => {
    const config = { max: 2, windowMs: 60_000 };
    rateLimit("1.2.3.4", "test", config);
    rateLimit("1.2.3.4", "test", config);
    const result = rateLimit("1.2.3.4", "test", config);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.retryAfterSeconds).toBeGreaterThan(0);
      expect(result.remaining).toBe(0);
    }
  });

  it("tracks limits separately per IP", () => {
    const config = { max: 1, windowMs: 60_000 };
    rateLimit("1.1.1.1", "test", config);
    expect(rateLimit("2.2.2.2", "test", config)).toMatchObject({ allowed: true });
  });

  it("reports status without incrementing counters", () => {
    const config = { max: 2, windowMs: 60_000 };
    rateLimit("9.9.9.9", "test", config);
    expect(getRateLimitStatus("9.9.9.9", "test", config)).toMatchObject({
      allowed: true,
      remaining: 1,
      used: 1,
    });
  });
});

describe("formatRetryAfter", () => {
  it("formats short and long durations", () => {
    expect(formatRetryAfter(45)).toBe("about 1 minute");
    expect(formatRetryAfter(3600)).toBe("about 1 hour");
    expect(formatRetryAfter(5400)).toBe("about 1 hour and 30 minutes");
    expect(formatRetryAfter(86_400)).toBe("about 1 day");
  });
});
