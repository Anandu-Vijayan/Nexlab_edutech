import { afterEach, describe, expect, it } from "vitest";
import { clearRateLimitStore, rateLimit } from "./rateLimit";

describe("rateLimit", () => {
  afterEach(() => {
    clearRateLimitStore("test");
  });

  it("allows requests up to the max within the window", () => {
    const config = { max: 3, windowMs: 60_000 };
    expect(rateLimit("1.2.3.4", "test", config)).toEqual({ allowed: true });
    expect(rateLimit("1.2.3.4", "test", config)).toEqual({ allowed: true });
    expect(rateLimit("1.2.3.4", "test", config)).toEqual({ allowed: true });
  });

  it("blocks when max is exceeded", () => {
    const config = { max: 2, windowMs: 60_000 };
    rateLimit("1.2.3.4", "test", config);
    rateLimit("1.2.3.4", "test", config);
    const result = rateLimit("1.2.3.4", "test", config);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.retryAfterSeconds).toBeGreaterThan(0);
    }
  });

  it("tracks limits separately per IP", () => {
    const config = { max: 1, windowMs: 60_000 };
    rateLimit("1.1.1.1", "test", config);
    expect(rateLimit("2.2.2.2", "test", config)).toEqual({ allowed: true });
  });
});
