"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { ordering, occasions, serviceTypes, site } from "@/lib/content";

/**
 * Field list is exactly the client spec (Lobster Lab website structure.docx):
 * name, phone, email, number of people, date, time, occasion, service type
 * (pickup/delivery), description.
 *
 * Submits to Formspree. Set NEXT_PUBLIC_FORMSPREE_ID to the form id. Without
 * it the form still validates but tells the user to email instead, rather than
 * silently swallowing an enquiry.
 */
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "";

const field =
  "w-full rounded-xl border-2 border-navy/12 bg-white px-3.5 py-2.5 text-navy placeholder:text-navy/35 transition focus:border-orange focus:outline-none";
const label = "mb-1.5 block text-sm font-semibold text-navy/80";

type State = "idle" | "sending" | "sent" | "error";

export default function CateringPanel({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<State>("idle");
  const startedRef = useRef(false);
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!FORMSPREE_ID) {
      setState("error");
      setError(
        `This form isn't connected yet. Please email us at ${site.email} and we'll get straight back to you.`,
      );
      return;
    }

    setState("sending");
    setError("");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      setState("sent");
      track("catering_inquiry_sent");
      form.reset();
    } catch {
      setState("error");
      setError(`Something went wrong sending that. Please email us at ${site.email}.`);
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
        <input type="hidden" name="_subject" value="Lobster Lab, catering inquiry" />
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
          <p role="alert" className="rounded-xl bg-orange/10 px-4 py-3 text-sm text-navy">
            {error}
          </p>
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
