"use client";

import { useEffect, useState } from "react";
import {
  ANALYTICS_ENABLED,
  REQUIRES_CONSENT,
  denyConsent,
  grantConsent,
  initAnalytics,
  readConsent,
} from "@/lib/analytics";

/**
 * Consent gate for analytics (plan P4).
 *
 * Renders nothing at all unless a tracker is actually configured, so the site
 * ships with no banner and no tracker by default. Decline is a real, equal
 * choice, not a dark pattern, and it is remembered.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ANALYTICS_ENABLED) return;
    initAnalytics(); // returning visitor who already opted in
    if (REQUIRES_CONSENT && readConsent() === "unset") setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-navy/10 bg-white p-5 shadow-[0_-4px_24px_rgba(1,58,113,0.10)] sm:p-6"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] leading-snug text-navy/80">
          We&apos;d like to measure how this site is used so we can improve it. No advertising
          trackers, and nothing that follows you to other sites.{" "}
          <a href="/privacy" className="font-semibold text-orange underline">
            Privacy Policy
          </a>
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => {
              denyConsent();
              setVisible(false);
            }}
            className="flex-1 rounded-full border-2 border-navy/15 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-[0.1em] text-navy transition hover:border-navy/40 sm:flex-none"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => {
              grantConsent();
              setVisible(false);
            }}
            className="flex-1 rounded-full bg-navy px-6 py-2.5 font-display text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-navy-deep sm:flex-none"
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
