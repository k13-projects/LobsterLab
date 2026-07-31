"use client";

import { track } from "@/lib/analytics";
import { locations } from "@/lib/content";

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
              <a
                href={mapsHref(l.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("directions_click", { location: l.name })}
                className="group flex h-full flex-col rounded-2xl bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10"
              >
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

                <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-[0.1em] text-orange">
                  {l.status ? "See the location" : "Get directions"}
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
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
