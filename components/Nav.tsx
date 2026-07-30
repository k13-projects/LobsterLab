"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav } from "@/lib/content";
import { useModals } from "./ModalProvider";

export default function Nav() {
  const { openOrder } = useModals();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  /**
   * The sheet visually covers the page while open, so it needs the same
   * keyboard contract as a dialog: Escape closes it, Tab stays inside, and
   * focus returns to the button that opened it. Without the trap, tabbing past
   * the last item dropped focus thousands of pixels down the page while the
   * sheet still covered the screen — with no visible focus ring anywhere.
   */
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current) return;

      const items = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || active === toggleRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const t = window.setTimeout(() => {
      sheetRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 60);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300",
        stuck ? "shadow-[0_1px_20px_rgba(1,58,113,0.10)]" : "",
      ].join(" ")}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8 lg:gap-6 lg:px-12">
        <a href="#top" aria-label="Lobster Lab — home" className="shrink-0">
          <Image
            src="/brand/wordmark-horizontal.png"
            alt="Lobster Lab"
            width={406}
            height={49}
            priority
            className="h-[26px] w-auto md:h-[24px] lg:h-[30px]"
          />
        </a>

        {/*
          Links appear at md so the 768-1023 band is not an empty header. At 768
          the row is tight, so type, gaps and the CTA all step down a size and
          only relax at lg. whitespace-nowrap is required: without it "About us"
          and "Our Menu" wrapped to two lines at 768 and 844.
        */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-3 md:flex lg:gap-7 xl:gap-9"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              // min-h-[44px]: this nav renders from 768px up, which includes
              // phone landscape — a touchscreen. Line-height alone gave a 23-26px
              // hit box. The row is 72px tall so 44px fits without moving anything.
              className="inline-flex min-h-[44px] items-center whitespace-nowrap font-display text-[15px] font-semibold text-navy transition-colors hover:text-orange lg:text-[17px]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          <button
            type="button"
            onClick={openOrder}
            className="hidden whitespace-nowrap bg-orange px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-orange-dark sm:block lg:px-6 lg:py-2.5 lg:text-sm lg:tracking-[0.1em]"
          >
            Order Online
          </button>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-navy md:hidden"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/*
        `inert` while closed. max-h-0 + overflow-hidden only hides the sheet
        visually — its links keep a layout box and stay in the tab order, so a
        keyboard user landed on invisible controls with no focus ring.
      */}
      <div
        id="mobile-nav"
        ref={sheetRef}
        inert={!open}
        className={[
          "overflow-hidden border-t border-navy/10 bg-white transition-[max-height,opacity] duration-300 md:hidden",
          open ? "max-h-[80vh] overflow-y-auto opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav aria-label="Mobile" className="flex flex-col px-5 py-3 sm:px-8">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={close}
              className="border-b border-navy/8 py-3.5 font-display text-lg font-semibold text-navy last:border-0"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openOrder();
            }}
            className="mb-4 mt-4 bg-orange px-6 py-3.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-white"
          >
            Order Online
          </button>
        </nav>
      </div>
    </header>
  );
}
