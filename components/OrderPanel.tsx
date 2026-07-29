"use client";

import Image from "next/image";
import { ordering } from "@/lib/content";

function Platform({ name, logo, url }: { name: string; logo: string; url: string }) {
  const disabled = !url;

  const inner = (
    <>
      <Image src={logo} alt="" width={48} height={48} className="h-12 w-12 object-contain" />
      <span className="font-display text-lg font-bold tracking-tight">{name}</span>
    </>
  );

  const base =
    "flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border-2 px-4 py-6 text-navy transition";

  if (disabled) {
    return (
      <div
        className={`${base} cursor-not-allowed border-navy/10 bg-navy/[0.03] opacity-55`}
        title={`${name} ordering link coming soon`}
        aria-disabled="true"
      >
        {inner}
        <span className="text-xs font-medium uppercase tracking-wide text-navy/50">
          Coming soon
        </span>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} border-navy/12 hover:-translate-y-0.5 hover:border-orange hover:shadow-lg hover:shadow-navy/5`}
    >
      {inner}
    </a>
  );
}

export default function OrderPanel() {
  const live = ordering.delivery.filter((d) => d.url);

  return (
    <div className="space-y-7">
      <section>
        <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-[0.18em] text-orange">
          Order Pickup
        </h3>
        <a
          href={ordering.pickup.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border-2 border-navy/12 px-5 py-4 text-navy transition hover:-translate-y-0.5 hover:border-orange hover:shadow-lg hover:shadow-navy/5"
        >
          <Image
            src={ordering.pickup.logo}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 object-contain"
          />
          <span className="flex-1">
            <span className="block font-display text-lg font-bold leading-tight tracking-tight">
              Order on {ordering.pickup.provider}
            </span>
            <span className="block text-sm leading-tight text-navy/60">
              Carlsbad · Windmill Food Hall
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
      </section>

      <section>
        <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-[0.18em] text-orange">
          Order Delivery
        </h3>
        <div className="flex gap-3">
          {ordering.delivery.map((d) => (
            <Platform key={d.provider} name={d.provider} logo={d.logo} url={d.url} />
          ))}
        </div>
        {live.length === 0 && (
          <p className="mt-3 text-center text-sm text-navy/55">
            Delivery links are being set up — pickup on Toast is live now.
          </p>
        )}
      </section>
    </div>
  );
}
