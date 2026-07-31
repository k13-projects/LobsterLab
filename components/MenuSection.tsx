"use client";

import Image from "next/image";
import { track } from "@/lib/analytics";
import { menu } from "@/lib/content";
import { OrderOnlineButton } from "./Buttons";

export default function MenuSection() {
  return (
    <section id="menu" className="overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,180px)_minmax(0,1fr)_minmax(0,420px)] lg:gap-12">
          {/* Oversized vertical wordmark, bleeds off the left edge, as in the
              mockup. The negative margin only applies at lg: below that a 12px
              offset is too small to read as intentional and looks misaligned. */}
          <h2
            aria-label="Menu"
            // 22vh cap: at 19vw alone the wordmark ran ~160px tall on a 390px
            // landscape screen and pushed the menu CTAs off before any could be tapped
            className="reveal font-display text-[min(19vw,22vh)] font-medium leading-[0.82] tracking-tight text-navy lg:-ml-14 lg:text-[168px]"
          >
            <span aria-hidden="true" className="lg:[writing-mode:vertical-rl]">
              MENU
            </span>
          </h2>

          <div
            className="reveal max-w-xl text-[17px] leading-relaxed text-navy sm:text-lg"
            style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
          >
            <p>{menu.body}</p>
            <p className="mt-4 font-semibold">See menu:</p>
          </div>

          <div
            className="reveal flex flex-col gap-3"
            style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
          >
            {menu.pdfs.map((pdf) => (
              <a
                key={pdf.href}
                href={pdf.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("menu_pdf_open", { menu: pdf.label })}
                className="inline-flex items-center justify-center rounded-full bg-orange px-6 py-3.5 text-center font-display text-[15px] font-bold leading-tight tracking-tight text-white transition hover:-translate-y-0.5 hover:bg-orange-dark"
              >
                {pdf.label}
              </a>
            ))}
            <OrderOnlineButton className="w-full" />
          </div>
        </div>
      </div>

      {/* four-across food strip */}
      <div className="reveal mt-12 grid grid-cols-2 gap-1 sm:mt-16 lg:grid-cols-4">
        {menu.photos.map((p) => (
          <div key={p.src} className="relative aspect-[3/4] lg:aspect-[3/3.6]">
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
