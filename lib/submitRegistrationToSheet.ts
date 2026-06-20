import type { RegistrationFields } from "@/lib/registrationSchema";

export type RegistrationPayload = RegistrationFields & {
  website?: string;
  formOpenedAt?: number;
};

export type RegistrationRateLimitInfo = {
  max: number;
  remaining: number;
  used: number;
  blocked: boolean;
  retryAfterSeconds?: number;
  windowHours: number;
};

export type RegistrationStatus = {
  configured: boolean;
  rateLimit?: RegistrationRateLimitInfo;
};

export type SubmitRegistrationResult = {
  ok: boolean;
  error?: string;
  retryAfterSeconds?: number;
  rateLimit?: RegistrationRateLimitInfo;
};

export async function getRegistrationStatus(): Promise<RegistrationStatus> {
  try {
    const res = await fetch("/api/register", { method: "GET" });
    if (!res.ok) return { configured: false };
    const body = (await res.json()) as RegistrationStatus;
    return {
      configured: body.configured === true,
      rateLimit: body.rateLimit,
    };
  } catch {
    return { configured: false };
  }
}

export async function isRegistrationConfigured(): Promise<boolean> {
  const status = await getRegistrationStatus();
  return status.configured;
}

/**
 * POSTs registration data to the local API route, which forwards it to Google Sheets.
 * This avoids CORS issues by making the request server-side.
 */
export async function submitRegistrationToSheet(
  data: RegistrationPayload
): Promise<SubmitRegistrationResult> {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let body: {
    ok?: boolean;
    error?: string;
    retryAfterSeconds?: number;
    rateLimit?: SubmitRegistrationResult["rateLimit"];
  } | null = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (res.status === 429) {
    return {
      ok: false,
      error: body?.error || "Too many registration attempts. Please try again later.",
      retryAfterSeconds: body?.retryAfterSeconds,
      rateLimit: body?.rateLimit,
    };
  }

  if (!res.ok || body?.ok === false) {
    return {
      ok: false,
      error: body?.error || "Failed to submit registration",
    };
  }

  return {
    ok: true,
    rateLimit: body?.rateLimit,
  };
}
