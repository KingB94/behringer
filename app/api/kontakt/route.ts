import { NextRequest, NextResponse } from "next/server";
import { sendContactMail } from "@/lib/mailer";
import { isRateLimited } from "@/lib/rateLimit";

export const runtime = "nodejs";

// Kein CSRF-Token nötig: Die Seite setzt keinerlei Cookies (Flask brauchte CSRF
// nur wegen des Session-Cookies von Flask-WTF). Schutz erfolgt über
// Same-Origin-Prüfung, Honeypot und Rate-Limit.
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin) return true; // manche Clients senden kein Origin bei same-origin POST
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  if (isRateLimited(clientIp(req), 3, 60_000)) {
    return NextResponse.json(
      { ok: false, errors: ["Zu viele Anfragen."] },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: ["Ungültige Anfrage."] },
      { status: 400 }
    );
  }

  // Honeypot: Bots füllen das versteckte Feld aus. Wie in Flask still bestätigen,
  // ohne eine Mail zu senden.
  if (typeof body.fax === "string" && body.fax.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const privacyConsent = body.privacy_consent === true;

  const errors: string[] = [];
  if (!name) errors.push("Bitte geben Sie Ihren Namen an.");
  if (!email || !isValidEmail(email))
    errors.push("Ungültige E-Mail-Adresse.");
  if (!message || message.length < 10)
    errors.push("Die Nachricht ist zu kurz.");
  if (!privacyConsent)
    errors.push("Bitte akzeptieren Sie die Datenschutzerklärung.");

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  try {
    await sendContactMail({ name, email, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Mail Error:", error);
    return NextResponse.json(
      { ok: false, errors: ["Fehler beim Senden. Bitte versuchen Sie es später."] },
      { status: 500 }
    );
  }
}
