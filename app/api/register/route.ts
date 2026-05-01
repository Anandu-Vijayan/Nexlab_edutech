import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webAppUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL?.trim();

  if (!webAppUrl) {
    return NextResponse.json(
      { ok: false, error: "Google Sheet URL not configured" },
      { status: 500 }
    );
  }

  try {
    const data = await request.json();

    const response = await fetch(webAppUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        submittedAtIso: new Date().toISOString(),
      }),
    });

    const result = await response.text();
    
    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = { ok: true };
    }

    if (parsed.ok === false) {
      return NextResponse.json(
        { ok: false, error: parsed.error || "Failed to save data" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to submit registration" },
      { status: 500 }
    );
  }
}
