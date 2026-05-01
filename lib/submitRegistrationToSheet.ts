export type RegistrationPayload = {
  name: string;
  phone: string;
  email: string;
  address: string;
  studentClass: string;
  school?: string;
};

export function isGoogleSheetConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL?.trim());
}

/**
 * POSTs registration data to the local API route, which forwards it to Google Sheets.
 * This avoids CORS issues by making the request server-side.
 */
export async function submitRegistrationToSheet(data: RegistrationPayload): Promise<void> {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let body: { ok?: boolean; error?: string } | null = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok || body?.ok === false) {
    throw new Error(body?.error || "Failed to submit registration");
  }
}
