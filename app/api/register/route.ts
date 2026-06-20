import { NextResponse } from "next/server";
import {
  formatRetryAfter,
  getClientIp,
  getRateLimitStatus,
  getRegisterRateLimitConfig,
  rateLimit,
} from "@/lib/rateLimit";
import { parseRegistrationSubmit, toSheetPayload } from "@/lib/registrationSchema";

const MAX_BODY_BYTES = 8 * 1024;

function isSheetConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SHEETS_WEB_APP_URL?.trim());
}

function buildRateLimitPayload(ip: string) {
  const limitConfig = getRegisterRateLimitConfig();
  const status = getRateLimitStatus(ip, "register", limitConfig);
  const windowHours = Math.round(limitConfig.windowMs / 3_600_000);

  return {
    max: status.max,
    remaining: status.remaining,
    used: status.used,
    blocked: !status.allowed,
    retryAfterSeconds: status.retryAfterSeconds,
    windowHours,
  };
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  return NextResponse.json({
    configured: isSheetConfigured(),
    rateLimit: buildRateLimitPayload(ip),
  });
}

export async function POST(request: Request) {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL?.trim();

  if (!webAppUrl) {
    return NextResponse.json(
      { ok: false, error: "Google Sheet URL not configured" },
      { status: 500 }
    );
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Request body too large" },
      { status: 413 }
    );
  }

  const ip = getClientIp(request);
  const limitConfig = getRegisterRateLimitConfig();
  const limitResult = rateLimit(ip, "register", limitConfig);

  if (limitResult.allowed === false) {
    const retryAfterSeconds = limitResult.retryAfterSeconds;
    const retryLabel = formatRetryAfter(retryAfterSeconds);
    return NextResponse.json(
      {
        ok: false,
        error: `Registration limit reached. Only ${limitResult.max} submissions are allowed per 24 hours from your network. Try again in ${retryLabel}.`,
        retryAfterSeconds,
        rateLimit: {
          max: limitResult.max,
          remaining: 0,
          used: limitResult.used,
          blocked: true,
          retryAfterSeconds,
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
        },
      }
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Request body too large" },
      { status: 413 }
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const validation = parseRegistrationSubmit(parsedJson);
  if (!validation.success) {
    const honeypotFilled = validation.error.issues.some((i) => i.path[0] === "website");
    if (honeypotFilled) {
      return NextResponse.json({ ok: true });
    }
    const firstMessage = validation.error.issues[0]?.message ?? "Invalid registration data";
    return NextResponse.json(
      { ok: false, error: firstMessage },
      { status: 400 }
    );
  }

  const sheetPayload = toSheetPayload(validation.data);
  const apiSecret = process.env.REGISTRATION_API_SECRET?.trim();

  try {
    const response = await fetch(webAppUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...sheetPayload,
        submittedAtIso: new Date().toISOString(),
        ...(apiSecret ? { secret: apiSecret } : {}),
      }),
    });

    const result = await response.text();

    let parsed: { ok?: boolean; error?: string };
    try {
      parsed = JSON.parse(result) as { ok?: boolean; error?: string };
    } catch {
      parsed = { ok: true };
    }

    if (parsed.ok === false) {
      return NextResponse.json(
        { ok: false, error: parsed.error || "Failed to save data" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      rateLimit: buildRateLimitPayload(ip),
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to submit registration" },
      { status: 500 }
    );
  }
}
