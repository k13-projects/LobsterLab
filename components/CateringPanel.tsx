"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { ordering, occasions, serviceTypes, site } from "@/lib/content";

/**
 * Field list is exactly the client spec (Lobster Lab website structure.docx):
 * name, phone, email, number of people, date, time, occasion, service type
 * (pickup/delivery), description.
 *
 * Two delivery modes, decided by asking GET /api/catering whether Resend is
 * configured (Kazim, 2026-08-26):
 * - Direct: the form POSTs to /api/catering and Resend delivers server-side.
 *   A pre-filled mailto: stays as the safety net for genuine failures.
 * - Mailto-first (until the Resend env is set): submitting opens the
 *   visitor's own mail app with the whole inquiry pre-filled, presented as
 *   the designed flow with a "press Send there" confirmation, never as an
 *   error. Their mail lands in the same inbox either way; nothing typed is
 *   ever lost in either mode. When in doubt (probe unreachable), mailto wins,
 *   because it cannot fail closed.
 */
type CateringFormValues = {
  name: string;
  phone: string;
  email: string;
  party_size: string;
  date: string;
  time: string;
  occasion: string;
  service_type: string;
  description: string;
};

// Keeps parity with the fields the emailed inquiry itself lists, in the same order, so a
// visitor who falls through to the mailto fallback sees the same shape THG would have received.
function buildMailtoFallback(to: string, data: CateringFormValues): string {
  const subject = `Catering inquiry${data.name ? `: ${data.name}` : ""}`;
  const body = [
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Number of people: ${data.party_size}`,
    `Date: ${data.date}`,
    `Time: ${data.time}`,
    `Occasion: ${data.occasion}`,
    `Pickup or delivery: ${data.service_type}`,
    "",
    "Description / requests:",
    data.description || "(none)",
  ].join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const field =
  "w-full rounded-xl border-2 border-navy/12 bg-white px-3.5 py-2.5 text-navy placeholder:text-navy/35 transition focus:border-orange focus:outline-none";
const label = "mb-1.5 block text-sm font-semibold text-navy/80";

type State = "idle" | "sending" | "sent" | "mailed" | "error";

export default function CateringPanel({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<State>("idle");
  const startedRef = useRef(false);
  const [error, setError] = useState<string>("");
  // Snapshot of what the visitor typed, kept only so the mailto: draft can be (re)built from
  // exactly what they entered, never sent anywhere else.
  const [lastAttempt, setLastAttempt] = useState<CateringFormValues | null>(null);
  // null = probe still in flight; treated as mailto-first so a slow probe can never make a
  // submission fail closed. Flips to true only when the server confirms Resend is configured.
  const [direct, setDirect] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/catering", { method: "GET" })
      .then((r) => r.json())
      .then((j) => {
        if (alive) setDirect(j?.configured === true);
      })
      .catch(() => {
        if (alive) setDirect(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const values: CateringFormValues = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      party_size: String(fd.get("party_size") || ""),
      date: String(fd.get("date") || ""),
      time: String(fd.get("time") || ""),
      occasion: String(fd.get("occasion") || ""),
      service_type: String(fd.get("service_type") || ""),
      description: String(fd.get("description") || ""),
    };

    // Honeypot holds in both modes: a bot that filled the hidden field gets the fake success
    // screen and no mailto: side effects.
    if (fd.get("_gotcha")) {
      setState("sent");
      form.reset();
      return;
    }

    setError("");
    setLastAttempt(values);

    if (direct !== true) {
      // Mailto-first: the designed flow until Resend is live, not a failure path. Opens the
      // visitor's mail app with the full inquiry pre-filled; the confirmation screen tells
      // them to press Send there. The draft link stays available on that screen in case the
      // handoff to the mail app was missed (popup policy, no default mail client).
      window.location.href = buildMailtoFallback(site.email, values);
      setState("mailed");
      track("catering_inquiry_mailto");
      return;
    }

    setState("sending");
    try {
      const res = await fetch("/api/catering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          sms_marketing_consent: fd.get("sms_marketing_consent") ? "yes" : "",
          _gotcha: "",
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `status ${res.status}`);
      }
      setState("sent");
      track("catering_inquiry_sent");
      form.reset();
      setLastAttempt(null);
    } catch {
      setState("error");
      setError(
        "Something went wrong sending that. Use the button below to email us your details directly instead, nothing you typed is lost.",
      );
    }
  }

  if (state === "sent") {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange/12">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 12.5l5 5L20 6.5"
              stroke="#fe6700"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-black uppercase tracking-tight text-navy">
          Request sent
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-navy/70">
          Thanks, we&apos;ve got your details and we&apos;ll be in touch shortly to lock in the menu.
        </p>
        <button
          type="button"
          onClick={onDone}
          className="mt-6 rounded-full bg-navy px-7 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-navy-deep"
        >
          Close
        </button>
      </div>
    );
  }

  if (state === "mailed") {
    // Mailto-first confirmation: same celebratory register as "sent", plus the one instruction
    // that actually matters (press Send in the mail app). The draft link is offered again in
    // case the handoff to the mail client was missed; it rebuilds from the same snapshot, so
    // nothing the visitor typed is ever lost.
    return (
      <div className="py-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange/12">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 7l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
              stroke="#fe6700"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-black uppercase tracking-tight text-navy">
          Your inquiry is ready
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-navy/70">
          We opened your email app with everything filled in. Just press{" "}
          <span className="font-semibold text-navy">Send</span> there and it lands straight in our
          inbox; we&apos;ll be in touch shortly to lock in the menu.
        </p>
        {lastAttempt && (
          <p className="mx-auto mt-3 max-w-sm text-[13px] text-navy/55">
            Didn&apos;t see it open?{" "}
            <a
              href={buildMailtoFallback(site.email, lastAttempt)}
              className="font-semibold text-navy/75 underline"
            >
              Reopen the email draft
            </a>{" "}
            or write to us at{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-navy/75 underline">
              {site.email}
            </a>
            .
          </p>
        )}
        <button
          type="button"
          onClick={onDone}
          className="mt-6 rounded-full bg-navy px-7 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-navy-deep"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1, order straight through ezCater */}
      <a
        href={ordering.catering.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-4 rounded-2xl bg-orange px-5 py-4 text-white transition hover:-translate-y-0.5 hover:bg-orange-dark"
      >
        <span>
          <span className="block font-display text-lg font-bold leading-tight tracking-tight">
            Order on {ordering.catering.provider}
          </span>
          <span className="block text-sm leading-tight text-white/85">
            Browse the catering menu and check out online
          </span>
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-navy/12" />
        <span className="font-display text-xs font-bold uppercase tracking-[0.18em] text-navy/45">
          or send an inquiry
        </span>
        <span className="h-px flex-1 bg-navy/12" />
      </div>

      {/* 2, inquiry form */}
      <form
        onSubmit={handleSubmit}
        onFocusCapture={() => {
          if (!startedRef.current) {
            startedRef.current = true;
            track("catering_form_start");
          }
        }}
        className="space-y-4"
        noValidate={false}
      >
        {/* honeypot */}
        <input
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="c-name">
              Name <span className="text-orange">*</span>
            </label>
            <input id="c-name" name="name" required autoComplete="name" className={field} />
          </div>
          <div>
            <label className={label} htmlFor="c-phone">
              Phone <span className="text-orange">*</span>
            </label>
            <input
              id="c-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              className={field}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="c-email">
              Email <span className="text-orange">*</span>
            </label>
            <input
              id="c-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="c-people">
              Number of people <span className="text-orange">*</span>
            </label>
            <input
              id="c-people"
              name="party_size"
              type="number"
              min={1}
              required
              className={field}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="c-date">
              Date <span className="text-orange">*</span>
            </label>
            <input id="c-date" name="date" type="date" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="c-time">
              Time <span className="text-orange">*</span>
            </label>
            <input id="c-time" name="time" type="time" required className={field} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="c-occasion">
              Occasion
            </label>
            <select id="c-occasion" name="occasion" defaultValue="" className={field}>
              <option value="" disabled>
                Select an occasion
              </option>
              {occasions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="c-service">
              Catering service
            </label>
            <select id="c-service" name="service_type" defaultValue="" className={field}>
              <option value="" disabled>
                Pickup or delivery
              </option>
              {serviceTypes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={label} htmlFor="c-notes">
            Description / requests
          </label>
          <textarea
            id="c-notes"
            name="description"
            rows={3}
            className={`${field} resize-y`}
            placeholder="Tell us about the event, any dietary needs, favorite dishes…"
          />
        </div>

        {/*
          TCPA: the form takes a phone number. Consent to be contacted ABOUT
          this request is narrow and implied by submitting it; consent to
          MARKETING texts is a separate, express, unbundled opt-in and must
          stay opt-out-by-default. Do not pre-check this box.
        */}
        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-navy/[0.03] px-4 py-3">
          <input
            type="checkbox"
            name="sms_marketing_consent"
            value="yes"
            className="mt-0.5 h-6 w-6 shrink-0 accent-[#fe6700]"
          />
          <span className="text-[13px] leading-snug text-navy/70">
            Optional, text me about Lobster Lab offers and updates. Message and data rates may
            apply; reply STOP to opt out. You do not need to agree to this to send your inquiry.
          </span>
        </label>

        <p className="text-[13px] leading-snug text-navy/55">
          By sending this inquiry you agree we may contact you about your catering request. See our{" "}
          <a href="/privacy" className="font-semibold text-navy/75 underline">
            Privacy Policy
          </a>
          .
        </p>

        {state === "error" && (
          <div role="alert" className="space-y-3 rounded-xl bg-orange/10 px-4 py-3 text-sm text-navy">
            <p>{error}</p>
            {lastAttempt && (
              <a
                href={buildMailtoFallback(site.email, lastAttempt)}
                className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-navy-deep"
              >
                Email us your details instead
              </a>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={state === "sending"}
          className="w-full rounded-full bg-navy px-8 py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send inquiry"}
        </button>
      </form>
    </div>
  );
}
