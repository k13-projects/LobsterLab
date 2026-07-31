import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Lobster Lab is committed to making lobsterlab.us accessible to everyone, including guests using assistive technology.",
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-navy/10">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center px-5 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Lobster Lab, home">
            <Image
              src="/brand/wordmark-horizontal.png"
              alt="Lobster Lab"
              width={406}
              height={49}
              className="h-[26px] w-auto sm:h-[30px]"
            />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <h1 className="font-display text-5xl font-medium leading-[0.95] tracking-tight text-navy sm:text-6xl">
          Accessibility
        </h1>

        <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-navy/85">
          <p>
            Lobster Lab is committed to making our website usable by as many people as possible,
            including guests who use screen readers, keyboard navigation, magnification, or other
            assistive technology.
          </p>

          <h2 className="pt-4 font-display text-2xl font-semibold tracking-tight text-navy">
            What we do
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>We aim to meet WCAG 2.1 Level AA.</li>
            <li>Every interactive control is reachable and operable by keyboard alone.</li>
            <li>Images that carry meaning have descriptive alternative text.</li>
            <li>
              Motion and smooth scrolling are switched off automatically when your device requests
              reduced motion.
            </li>
            <li>Color combinations are checked for contrast against the brand palette.</li>
          </ul>

          <h2 className="pt-4 font-display text-2xl font-semibold tracking-tight text-navy">
            Third-party services
          </h2>
          <p>
            Ordering and catering checkout are handled by Toast, DoorDash, Grubhub and ezCater on
            their own websites. We do not control their accessibility, but we are happy to take your
            order another way if you hit a barrier there.
          </p>

          <h2 className="pt-4 font-display text-2xl font-semibold tracking-tight text-navy">
            Tell us about a problem
          </h2>
          <p>
            If any part of this site gets in your way, email{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-orange underline">
              {site.email}
            </a>
            . Please tell us the page and what happened, and we will fix it and get you what you
            needed in the meantime.
          </p>
        </div>

        <Link
          href="/"
          className="mt-12 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-navy-deep"
        >
          Back to Lobster Lab
        </Link>
      </main>
    </div>
  );
}
