import type { RegistrationFields } from "@/lib/registrationSchema";

export type RegistrationPayload = RegistrationFields & {
  website?: string;
  formOpenedAt?: number;
};

export type SubmitRegistrationResult = {
  ok: boolean;
  error?: string;
  retryAfterSeconds?: number;
};

export async function isRegistrationConfigured(): Promise<boolean> {
  try {
    const res = await fetch("/api/register", { method: "GET" });
    if (!res.ok) return false;
    const body = (await res.json()) as { configured?: boolean };
    return body.configured === true;
  } catch {
    return false;
  }
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

  let body: { ok?: boolean; error?: string; retryAfterSeconds?: number } | null = null;
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
    };
  }

  if (!res.ok || body?.ok === false) {
    return {
      ok: false,
      error: body?.error || "Failed to submit registration",
    };
  }

  return { ok: true };
}
