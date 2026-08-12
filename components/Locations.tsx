"use client";

import { track } from "@/lib/analytics";
import { locations, telHref } from "@/lib/content";

function mapsHref(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function Locations() {
  return (
    <section id="locations" className="bg-sand py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <header className="reveal mb-10 lg:mb-14">
          {/* Caps at 6xl so it stays below the intro headline (68px), a section
              heading outranking the page's opening statement inverts hierarchy. */}
          <h2 className="font-display text-5xl font-medium leading-[0.95] tracking-tight text-navy sm:text-6xl">
            Locations
          </h2>
          <p className="mt-1 font-display text-3xl font-medium italic leading-none text-orange sm:text-4xl lg:text-5xl">
            Find us
          </p>
        </header>

        {/* flex-wrap rather than grid: 5 cards into 3 columns leaves a trailing
            row that a grid pins left and reads unfinished. justify-center lets
            the last row settle in the middle. */}
        <ul className="flex flex-wrap justify-center gap-4">
          {locations.map((l, i) => (
            <li
              key={l.name}
              className="reveal basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.667rem)]"
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            >
              {/*
                The card used to be one big <a> to Google Maps. It cannot stay
                that way now that it also carries a tel: link, because nesting an
                anchor inside an anchor is invalid HTML and browsers recover from
                it unpredictably.

                So: the card is a plain element, the directions link is a real
                anchor whose ::after is stretched over the whole card, and the
                phone sits above it on the z axis. Tapping anywhere still gets
                you directions, tapping the number still dials, and both remain
                genuine links with their own text for a screen reader.
              */}
              <div className="group relative flex h-full flex-col rounded-2xl bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-orange">
                    {l.area}
                  </p>
                  {l.status && (
                    /* Not decoration: a guest who reads only the card would
                       otherwise drive to a location that has not opened. */
                    <span className="shrink-0 rounded-full border border-navy/20 bg-navy/5 px-2.5 py-1 font-display text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-navy/70">
                      {l.status}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-navy">
                  {l.name}
                  {l.status && <span className="sr-only"> ({l.status})</span>}
                </h3>
                <p className="mt-3 text-[15px] leading-snug text-navy/75">{l.address}</p>

                <p className="mt-4 flex items-center gap-2 text-[15px] font-semibold text-navy">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M12 7v5.2l3.2 1.9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Bare opening times beside a Coming Soon badge read as
                      "open now". Qualify them so nobody drives out early. */}
                  {l.status ? `Opening soon, ${l.hours}` : l.hours}
                </p>

                {l.phone && (
                  /* Above the stretched directions link, or tapping the number
                     would open Google Maps instead of dialling. min-h-11 keeps
                     it a 44px target on a phone, which is the whole point. */
                  <a
                    href={telHref(l.phone)}
                    onClick={() => track("phone_click", { location: l.name })}
                    className="relative z-10 -ml-1 mt-1 inline-flex min-h-11 items-center gap-2 self-start rounded-lg px-1 text-[15px] font-semibold text-navy underline decoration-navy/25 underline-offset-4 transition hover:decoration-orange"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="sr-only">Call {l.name}, </span>
                    {l.phone}
                  </a>
                )}

                <a
                  href={mapsHref(l.mapsQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("directions_click", { location: l.name })}
                  /* min-h-6 is not cosmetic. The ::after makes the real target
                     the whole card, verified by hit-testing all four corners,
                     but getBoundingClientRect only ever sees this inline box,
                     so an automated pass measures 20px and reports a WCAG 2.5.8
                     failure on every run. A permanently red check is a check
                     people stop reading, so the box is given the floor it is
                     measured against. */
                  className="mt-5 inline-flex min-h-6 items-center gap-1.5 self-start font-display text-sm font-bold uppercase tracking-[0.1em] text-orange after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                >
                  {l.status ? "See the location" : "Get directions"}
                  <span className="sr-only"> for {l.name}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
