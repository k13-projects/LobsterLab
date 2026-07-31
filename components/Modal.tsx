"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Optional line under the title. */
  subtitle?: string;
  children: React.ReactNode;
  /** Wider shell for the catering form. */
  size?: "md" | "lg";
};

/**
 * Accessible dialog: Escape to close, click-outside to close, focus trapped
 * inside while open, focus restored to the trigger on close, background
 * scroll locked without the layout shifting.
 */
export default function Modal({ open, onClose, title, subtitle, children, size = "md" }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;

    // lock scroll, compensating for the scrollbar so the page doesn't jump
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    document.addEventListener("keydown", onKeyDown);

    // always open at the top of the panel, then move focus into it
    const t = window.setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      const target = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (target ?? panelRef.current)?.focus({ preventScroll: true });
    }, 20);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      restoreTo.current?.focus?.();
    };
  }, [open, onKeyDown]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={scrollRef}
      className="fixed inset-0 z-[90] overflow-y-auto overscroll-contain"
      role="presentation"
    >
      <div className="fixed inset-0 bg-navy-deep/70 backdrop-blur-[2px]" aria-hidden="true" />

      {/*
        `min-h-full` on this flex wrapper is load-bearing. Centering (or
        end-aligning) directly on the scroll container strands any overflow
        above the scroll origin, scrollTop cannot go negative, so on a short
        viewport the panel's header and its primary CTA become permanently
        unreachable. Letting the wrapper grow past the viewport keeps the top
        scrollable into view.
      */}
      <div
        className="relative flex min-h-full items-end justify-center p-0 sm:items-center sm:p-6"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
          className={[
            "relative z-10 my-0 w-full rounded-t-3xl bg-white shadow-2xl outline-none sm:my-auto sm:rounded-3xl",
            size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-4 border-b border-navy/10 px-6 pb-5 pt-7 sm:px-8">
            <div>
              <h2
                id="modal-title"
                className="font-display text-2xl font-black uppercase leading-none tracking-tight text-navy sm:text-3xl"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="mt-2 text-[15px] leading-snug text-navy/70">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-navy/50 transition hover:bg-navy/5 hover:text-navy"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="px-6 pb-8 pt-6 sm:px-8">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
