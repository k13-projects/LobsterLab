import Image from "next/image";
import { site, nav } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-white pb-10 pt-16 sm:pt-20 lg:pt-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="reveal flex items-center justify-center lg:justify-start">
            <Image
              src="/brand/wordmark-stacked.png"
              alt="Lobster Lab"
              width={272}
              height={119}
              className="h-auto w-[200px] sm:w-[240px]"
            />
          </div>

          <div className="reveal" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
            <h2 className="font-display text-3xl font-black uppercase tracking-tight text-navy sm:text-4xl">
              Contact Info
            </h2>

            <dl className="mt-6 space-y-4 text-[17px]">
              <div>
                <dt className="font-display text-xs font-bold uppercase tracking-[0.18em] text-orange">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex min-h-[24px] items-center py-1 text-navy transition-colors hover:text-orange"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="font-display text-xs font-bold uppercase tracking-[0.18em] text-orange">
                  Follow us
                </dt>
                <dd className="mt-1">
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-navy transition-colors hover:text-orange"
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                    </svg>
                    @lobsterlab.us
                  </a>
                </dd>
              </div>

              <div>
                <dt className="font-display text-xs font-bold uppercase tracking-[0.18em] text-orange">
                  Operated by
                </dt>
                <dd className="mt-1 text-navy">{site.operator}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-6 border-t border-navy/10 pt-7 sm:flex-row">
          <p className="text-sm text-navy/55">
            © {year} {site.name}. All rights reserved.
          </p>
          {/* py-1.5 keeps every target at least 24x24 CSS px (WCAG 2.5.8 AA) */}
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[24px] items-center px-2 py-1.5 text-sm font-semibold text-navy/70 transition-colors hover:text-orange"
              >
                {item.label}
              </a>
            ))}
            {[
              { href: "/accessibility", label: "Accessibility" },
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[24px] items-center px-2 py-1.5 text-sm font-semibold text-navy/70 transition-colors hover:text-orange"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
