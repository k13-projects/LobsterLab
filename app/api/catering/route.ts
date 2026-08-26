import { NextResponse } from "next/server";
import { Resend } from "resend";
import { PRODUCTION_URL } from "@/lib/content";

/**
 * Catering inquiry endpoint.
 *
 * The catering form posts here; this server route delivers the enquiry to Tiger Hospitality
 * Group via Resend. The destination address and API key live ONLY server-side (never
 * NEXT_PUBLIC_*), consistent with the house pattern in TLC's /api/contact route this was
 * ported from (/Users/k13/Desktop/PROJECTS/TLC/tlc-web/src/app/api/contact/route.ts).
 *
 * Required env (server-side):
 *   RESEND_API_KEY       - Resend API key, scoped sending_access to this project's domain_id
 *   CATERING_TO_EMAIL    - where enquiries are delivered, a THG inbox
 *   CATERING_FROM_EMAIL  - verified sender, house convention <form-type>@notify.<domain>, e.g.
 *                          "Lobster Lab Catering <catering@notify.lobsterlab.us>"
 *
 * Until those are set, the route FAILS the submission (503 not_configured) so the visitor is
 * never told "sent" while the enquiry was dropped.
 *
 * This is the first serverless function in a repo that was previously 100% static (12
 * prerendered routes). Vercel provisions a Node.js function for it automatically, no config
 * changes needed, but it is worth knowing the deploy is no longer purely static.
 */
export const runtime = "nodejs";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// Loose on purpose, just enough digits to be a real phone number. International formats,
// extensions and separators all still pass; this exists to catch empty or junk input, not to
// validate a specific country's numbering plan.
const PHONE_DIGITS_RE = /\d/g;
const MIN_PHONE_DIGITS = 7;

// The subject is server-built from sanitized fields only, same reasoning as the TLC route: a
// client-supplied "_subject" is spoofable, so nothing from the client body ever reaches a
// header unsanitized. sanitize() strips CR/LF, which keeps the built subject injection-safe.
const MAX_BODY_BYTES = 16384;
const CONTROL_CHARS_RE = /[\r\n\x00-\x1f]/g;
// Description-only variant keeps \n so paragraphs survive into the email body. Description is
// never interpolated into a header, so preserving newlines there is safe.
const CONTROL_CHARS_KEEP_NEWLINE_RE = /[\r\x00-\x09\x0b-\x1f]/g;

function sanitize(value: string, maxLen: number): string {
  return value.replace(CONTROL_CHARS_RE, "").trim().slice(0, maxLen);
}

function sanitizeMultiline(value: string, maxLen: number): string {
  return value.replace(CONTROL_CHARS_KEEP_NEWLINE_RE, "").trim().slice(0, maxLen);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Hosted absolute URL because Gmail strips data: URIs, and email clients can't reach a
// localhost or preview build. Points at the production domain regardless of which host this
// route is currently running on, so the logo only resolves once lobsterlab.us is actually
// live. Flagged in the handoff, harmless before then (a missing image, not a broken send).
const LOGO_URL = `${PRODUCTION_URL}/brand/wordmark-horizontal-white.png`;

type CateringFields = {
  name: string;
  phone: string;
  email: string;
  partySize: string;
  date: string;
  time: string;
  occasion: string;
  serviceType: string;
  description: string;
  smsConsent: boolean;
};

/**
 * Branded notification email, table-based, inline-CSS, Gmail-safe. Palette mirrors the site
 * tokens in globals.css (navy #013a71, orange #fe6700). All user values arrive pre-sanitized
 * AND are HTML-escaped here, never interpolate a raw field into this markup.
 */
function inquiryHtml(f: CateringFields & { receivedAt: string }): string {
  const name = escapeHtml(f.name);
  const phone = escapeHtml(f.phone);
  const email = escapeHtml(f.email);
  const partySize = escapeHtml(f.partySize || "Not provided");
  const date = escapeHtml(f.date || "Not provided");
  const time = escapeHtml(f.time || "Not provided");
  const occasion = escapeHtml(f.occasion || "Not provided");
  const serviceType = escapeHtml(f.serviceType || "Not specified");
  const description = escapeHtml(f.description || "Not provided").replace(/\n/g, "<br>");
  const smsConsent = f.smsConsent ? "Yes, opted in" : "No";

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:0 0 4px;font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#4d6b91;">${label}</td>
    </tr>
    <tr>
      <td style="padding:0 0 18px;font:400 15px/1.5 Georgia,'Times New Roman',serif;color:#013a71;">${value}</td>
    </tr>`;

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr>
        <td style="background:#013a71;padding:28px 36px 24px;border-radius:6px 6px 0 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:middle;">
                <img src="${LOGO_URL}" height="28" alt="Lobster Lab" style="display:block;">
                <div style="height:2px;width:44px;background:#fe6700;margin:14px 0 12px;"></div>
                <div style="font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#ffb27a;">Catering inquiry</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#ffffff;border:1px solid #e2e8f2;border-top:0;border-radius:0 0 6px 6px;padding:32px 36px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Name", name)}
            ${row("Phone", `<a href="tel:${phone}" style="color:#e25a00;text-decoration:none;">${phone}</a>`)}
            ${row("Email", `<a href="mailto:${email}" style="color:#e25a00;text-decoration:none;">${email}</a>`)}
            ${row("Party size", partySize)}
            ${row("Date", date)}
            ${row("Time", time)}
            ${row("Occasion", occasion)}
            ${row("Pickup or delivery", serviceType)}
            ${row("SMS marketing opt-in", smsConsent)}
            <tr>
              <td style="padding:0 0 6px;font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#4d6b91;">Description / requests</td>
            </tr>
            <tr>
              <td style="padding:0 0 26px;">
                <div style="border-left:3px solid #fe6700;background:#f7f9fc;padding:16px 20px;font:400 15px/1.65 Georgia,'Times New Roman',serif;color:#013a71;">${description}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 0 0;border-top:1px solid #e9edf5;font:400 12px/1.7 Helvetica,Arial,sans-serif;color:#7b8bab;">
                Received ${escapeHtml(f.receivedAt)} &middot; Sent from the catering form at lobsterlab.us<br>
                Reply to this email to respond directly to ${name}.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>
</table>`;
}

/**
 * Rate limiting, module-scope Map keyed by IP, sliding one-hour window, 5 requests/hour/IP.
 *
 * This is best-effort per warm serverless instance only, same caveat as the TLC route: each
 * Vercel instance has its own memory and a cold start resets the map. It raises the bar for
 * casual abuse on the instance handling a given request, not a hard guarantee. For that, put
 * Vercel WAF (or another edge-level rate limiter backed by shared storage) in front of this
 * route.
 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const rateLimitHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  // Prune every entry (not just this IP's) on each request so the map never grows unbounded
  // from a stream of distinct IPs, even though only one key is being checked.
  for (const [key, hits] of rateLimitHits) {
    const fresh = hits.filter((t) => t > cutoff);
    if (fresh.length === 0) {
      rateLimitHits.delete(key);
    } else {
      rateLimitHits.set(key, fresh);
    }
  }

  const hits = rateLimitHits.get(ip) || [];
  if (hits.length >= RATE_LIMIT_MAX) return true;

  hits.push(now);
  rateLimitHits.set(ip, hits);
  return false;
}

/**
 * Retry with exponential backoff, sized to fit a serverless execution ceiling.
 *
 * 3 attempts total, ~5s overall budget so a visitor is never stranded on a spinner past that.
 * Every attempt (including the retries) sends the SAME Resend idempotency key, so if Resend
 * actually received and sent attempt 1 but the response was lost before we saw it, attempt 2
 * cannot deliver the enquiry a second time, Resend recognizes the key and returns the original
 * result instead of sending again. Idempotency keys are Resend-side, kept for 24 hours, see
 * https://resend.com/docs/dashboard/emails/idempotency-keys.
 *
 * Errors Resend labels as non-retryable (bad api key, rejected sender, malformed request) are
 * not retried, retrying those just burns the budget on a failure that will not change.
 */
const MAX_ATTEMPTS = 3;
const TOTAL_BUDGET_MS = 5000;
const ATTEMPT_TIMEOUT_MS = 3000;
// Wait before attempt 2 and attempt 3, respectively.
const BACKOFF_MS = [400, 900];

const NON_RETRYABLE_ERROR_NAMES = new Set([
  "validation_error",
  "missing_api_key",
  "restricted_api_key",
  "invalid_api_key",
  "invalid_parameter",
  "missing_required_field",
  "invalid_from_address",
  "invalid_access",
  "invalid_region",
  "security_error",
  "invalid_idempotency_key",
]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// The Resend SDK does not expose a per-request timeout/signal option (its PostOptions type is
// just query + headers), so a stuck attempt is bounded here instead of inside the SDK call.
// A timeout here only stops us from waiting on that attempt, the underlying request may still
// land at Resend, which is exactly the case the shared idempotency key protects against.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

async function sendWithRetry(
  resend: Resend,
  payload: Parameters<Resend["emails"]["send"]>[0],
  idempotencyKey: string,
) {
  const startedAt = Date.now();
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const remaining = TOTAL_BUDGET_MS - (Date.now() - startedAt);
    if (remaining <= 0) break;

    try {
      const result = await withTimeout(
        resend.emails.send(payload, { idempotencyKey }),
        Math.min(ATTEMPT_TIMEOUT_MS, remaining),
      );
      if (!result.error) return result;
      if (NON_RETRYABLE_ERROR_NAMES.has(result.error.name)) return result;
      lastError = result.error;
    } catch (err) {
      lastError = err;
    }

    if (attempt === MAX_ATTEMPTS) break;
    const backoff = BACKOFF_MS[attempt - 1];
    const remainingAfterAttempt = TOTAL_BUDGET_MS - (Date.now() - startedAt);
    if (backoff >= remainingAfterAttempt) break;
    await sleep(backoff);
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError ?? "send failed"));
}

/**
 * Mode probe for the catering panel (2026-08-26, Kazim's call). Until the Resend env is set,
 * the form runs mailto-first as the DESIGNED flow (visitor's own mail app opens with the
 * inquiry pre-filled), not as an apology. The panel asks this endpoint which mode to run;
 * it answers from the same three env vars POST checks, so the two can never disagree.
 * No secrets leave the server, only a boolean.
 */
export async function GET() {
  const configured = Boolean(
    process.env.RESEND_API_KEY && process.env.CATERING_TO_EMAIL && process.env.CATERING_FROM_EMAIL,
  );
  return NextResponse.json({ configured });
}

export async function POST(req: Request) {
  // Reject oversized bodies before parsing, a forged/absent content-length can't bypass this
  // check to smuggle a huge payload, since we simply refuse to read further below either way.
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let data: Record<string, string> = {};
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      data = await req.json();
    } else {
      const fd = await req.formData();
      fd.forEach((v, k) => {
        data[k] = typeof v === "string" ? v : "";
      });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot, bots fill hidden fields. Checked before rate limiting on purpose, so bot traffic
  // gets its fake-success fast path without spending a real visitor's rate limit budget.
  if (data._gotcha) return NextResponse.json({ ok: true });

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const name = sanitize(data.name || "", 200);
  const phone = sanitize(data.phone || "", 40);
  const email = sanitize(data.email || "", 320);
  const partySize = sanitize(data.party_size || "", 10);
  const date = sanitize(data.date || "", 20);
  const time = sanitize(data.time || "", 20);
  const occasion = sanitize(data.occasion || "", 100);
  const serviceType = sanitize(data.service_type || "", 40);
  const description = sanitizeMultiline(data.description || "", 5000);
  const smsConsent = sanitize(data.sms_marketing_consent || "", 10) === "yes";

  const phoneDigitCount = (phone.match(PHONE_DIGITS_RE) || []).length;
  const partySizeNum = Number(partySize);

  if (
    !name ||
    phoneDigitCount < MIN_PHONE_DIGITS ||
    !EMAIL_RE.test(email) ||
    !partySize ||
    !Number.isFinite(partySizeNum) ||
    partySizeNum < 1 ||
    !date ||
    !time
  ) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CATERING_TO_EMAIL;
  const from = process.env.CATERING_FROM_EMAIL;

  // Unconfigured delivery must fail loudly, a silent drop would lose a real catering enquiry
  // while showing the visitor a success state.
  if (!apiKey || !to || !from) {
    console.error(
      "[catering] Resend not configured (RESEND_API_KEY/CATERING_TO_EMAIL/CATERING_FROM_EMAIL) - enquiry REJECTED, not delivered.",
    );
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  // Sender in the subject so the inbox scans at a glance, sanitize() already stripped CR/LF.
  const subject = `Catering inquiry: ${name}${occasion ? `, ${occasion}` : ""}`;

  try {
    const receivedAt =
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()) + " PT";

    const resend = new Resend(apiKey);
    // Single recipient only, THG's own inbox. No K13 archive copy, submissions from different
    // clients stay in that client's own inbox, not concentrated anywhere on K13's side.
    const { error } = await sendWithRetry(
      resend,
      {
        from,
        to: [to],
        replyTo: email,
        subject,
        html: inquiryHtml({
          name,
          phone,
          email,
          partySize,
          date,
          time,
          occasion,
          serviceType,
          description,
          smsConsent,
          receivedAt,
        }),
        // Plain-text fallback for clients that don't render HTML.
        text: [
          "New catering inquiry from the Lobster Lab website",
          "",
          `Name:            ${name}`,
          `Phone:           ${phone}`,
          `Email:           ${email}`,
          `Party size:      ${partySize}`,
          `Date:            ${date}`,
          `Time:            ${time}`,
          `Occasion:        ${occasion || "Not provided"}`,
          `Pickup/delivery: ${serviceType || "Not specified"}`,
          `SMS opt-in:      ${smsConsent ? "Yes" : "No"}`,
          `Received:        ${receivedAt}`,
          "",
          "Description / requests:",
          description || "Not provided",
        ].join("\n"),
      },
      `catering/${crypto.randomUUID()}`,
    );
    if (error) {
      console.error("[catering] Resend send error:", error);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[catering] send threw:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
