"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { useModals } from "./ModalProvider";

export default function Nav() {
  const { openOrder } = useModals();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock scroll behind the mobile sheet
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300",
        stuck ? "shadow-[0_1px_20px_rgba(1,58,113,0.10)]" : "",
      ].join(" ")}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <a href="#top" aria-label="Lobster Lab — home" className="shrink-0">
          <Image
            src="/brand/wordmark-horizontal.png"
            alt="Lobster Lab"
            width={406}
            height={49}
            priority
            className="h-[26px] w-auto sm:h-[30px]"
          />
        </a>

        {/* md, not lg — at lg the 768-1023 band (iPad portrait) left the header
            empty between the wordmark and the CTA. gap tightens to fit at 768. */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-4 md:flex lg:gap-7 xl:gap-9"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-[17px] font-semibold text-navy transition-colors hover:text-orange"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openOrder}
            className="hidden bg-orange px-6 py-2.5 font-display text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-orange-dark sm:block"
          >
            Order Online
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
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

      {/* mobile sheet */}
      <div
        className={[
          "overflow-hidden border-t border-navy/10 bg-white transition-[max-height,opacity] duration-300 md:hidden",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav aria-label="Mobile" className="flex flex-col px-5 py-3 sm:px-8">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
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
