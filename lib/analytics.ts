/**
 * Consent-gated analytics (plan P4).
 *
 * Two rules this module exists to enforce:
 *
 * 1. NOTHING loads without an explicit opt-in. California has an active wave of
 *    litigation applying the Invasion of Privacy Act (CIPA), including its pen
 *    register provisions, to ordinary web trackers and pixels. Retro-fitting
 *    consent onto a tracker that has already been running is the expensive path.
 *    Never load a vendor script at import time or in a layout, always behind
 *    `grantConsent()`.
 *
 * 2. NOTHING loads unless an id is configured. With `NEXT_PUBLIC_GA_ID` unset
 *    this whole module is inert and the banner never renders, so the site ships
 *    tracker-free by default and the privacy policy stays truthful.
 *
 * If the project picks a cookieless tool (Plausible, Fathom) instead of GA4,
 * the banner can likely be dropped entirely, swap `loadVendor()` and set
 * `REQUIRES_CONSENT` to false. Keep the gate for anything cookie-based.
 *
 * Never add session-replay tooling. It is the highest-risk category in this
 * space and there is no version of it that is worth the exposure here.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** True when a tracker is actually configured. Everything keys off this. */
export const ANALYTICS_ENABLED = Boolean(GA_ID);

/** Cookie-based vendors need opt-in. Flip to false only for cookieless tools. */
export const REQUIRES_CONSENT = true;

const STORAGE_KEY = "ll-consent";

export type ConsentState = "granted" | "denied" | "unset";

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    // private mode / storage blocked, treat as no decision, never as consent
    return "unset";
  }
}

function writeConsent(state: Exclude<ConsentState, "unset">) {
  try {
    window.localStorage.setItem(STORAGE_KEY, state);
  } catch {
    /* non-fatal: the visitor just gets asked again next time */
  }
}

let loaded = false;

function loadVendor() {
  if (loaded || !ANALYTICS_ENABLED || typeof document === "undefined") return;
  loaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer!.push(args);
  };
  w.gtag("js", new Date());
  // no cross-site ad signals; keep the footprint as small as the tool allows
  w.gtag("config", GA_ID, { anonymize_ip: true, allow_google_signals: false });
}

export function grantConsent() {
  writeConsent("granted");
  loadVendor();
}

export function denyConsent() {
  writeConsent("denied");
}

/** Call on mount so a returning visitor who already opted in is measured. */
export function initAnalytics() {
  if (!ANALYTICS_ENABLED) return;
  if (!REQUIRES_CONSENT || readConsent() === "granted") loadVendor();
}

/**
 * Track a conversion event. Silently does nothing without consent or config,
 * so call sites never need to guard.
 *
 * The events worth having here, per the business report: ordering modal opens,
 * per-location storefront clicks, catering form starts vs submits, menu PDF
 * opens, and get-directions taps, that last set is how we learn which
 * locations the site actually drives traffic to.
 */
export function track(event: string, params: Record<string, string | number> = {}) {
  if (!ANALYTICS_ENABLED) return;
  if (REQUIRES_CONSENT && readConsent() !== "granted") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  w.gtag?.("event", event, params);
}
