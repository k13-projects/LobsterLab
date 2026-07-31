"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { reviews } from "@/lib/content";

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 20 20" fill="#e8a33d" aria-hidden="true">
          <path d="M10 1.6l2.47 5.2 5.53.77-4 4.03.96 5.8L10 14.7l-4.96 2.7.96-5.8-4-4.03 5.53-.77z" />
        </svg>
      ))}
    </div>
  );
}

/** Repeating "LOBSTER LAB" tile behind the band, as in the mockup. */
function WordmarkWall() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="flex h-full flex-col justify-center gap-1">
        {Array.from({ length: 12 }).map((_, row) => (
          <div
            key={row}
            className="wordmark-wall"
            style={{ marginLeft: row % 2 === 0 ? "-4%" : "-14%" }}
          >
            {"LOBSTER LAB ".repeat(8)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reviews() {
  const rail = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Without an end state, tapping Next past the last card gave no feedback.
  //
  // The resting start position is NOT scrollLeft 0: the rail carries px-5 on
  // mobile and snap-start pulls the first card flush to the port, so it settles
  // at scrollLeft == padding-left (measured 20 at 375px). Compare against the
  // padding or the Prev button never disables on mobile.
  const syncEdges = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    setAtStart(el.scrollLeft <= padLeft + 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="reviews-heading" className="relative overflow-hidden bg-cream py-16 sm:py-20 lg:py-24">
      <WordmarkWall />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-14">
          <header className="reveal self-center">
            <h2
              id="reviews-heading"
              className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-navy sm:text-6xl"
            >
              What Our
              <br />
              Guests Say
            </h2>
            <p className="mt-5 font-display text-2xl font-medium italic leading-tight text-navy sm:text-3xl">
              <span className="text-orange">Every bite</span> tells our story. Every review makes it{" "}
              <span className="text-orange">even better.</span>
            </p>

            <div className="mt-7 flex gap-2">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Previous reviews"
                disabled={atStart}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy shadow-sm transition hover:bg-navy hover:text-white disabled:cursor-default disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-navy"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Next reviews"
                disabled={atEnd}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy shadow-sm transition hover:bg-navy hover:text-white disabled:cursor-default disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-navy"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </header>

          <ul
            ref={rail}
            className="reveal -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
            style={{ scrollbarWidth: "none" }}
          >
            {/* key on the quote, not the author, attributions are deliberately
                non-identifying and therefore repeat (see lib/content.ts) */}
            {reviews.map((r) => (
              <li
                key={r.quote.slice(0, 40)}
                className="flex w-[82vw] shrink-0 snap-start flex-col rounded-2xl bg-white p-6 shadow-sm sm:w-[340px]"
              >
                <Stars />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-navy/85">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <footer className="mt-5 border-t border-navy/10 pt-4">
                  <p className="font-display font-bold leading-tight tracking-tight text-navy">
                    {r.author}
                  </p>
                  <p className="text-sm text-navy/55">{r.source}</p>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
