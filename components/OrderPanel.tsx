"use client";

import Image from "next/image";
import { track } from "@/lib/analytics";
import { locations, orderChannels, type OrderChannel, type Location } from "@/lib/content";

/**
 * Per-location ordering (plan P1).
 *
 * Five locations share one brand but each has its own storefront, so a single
 * global "order" link sent a customer standing in Little Italy to the Carlsbad
 * store. This lists every location and shows only the channels that are
 * actually wired for it. Locations with nothing connected say so plainly
 * rather than rendering a control that goes nowhere.
 *
 * To connect one, fill its `ordering` block in lib/content.ts. No change here.
 */

const CHANNEL_ORDER: OrderChannel[] = ["toast", "doordash", "grubhub"];

function liveChannels(l: Location) {
  return CHANNEL_ORDER.filter((c) => Boolean(l.ordering[c]));
}

function ChannelButton({
  channel,
  url,
  location,
}: {
  channel: OrderChannel;
  url: string;
  location: string;
}) {
  const meta = orderChannels[channel];
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("storefront_click", { channel, location })}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-navy/12 px-3 py-2.5 text-navy transition hover:-translate-y-0.5 hover:border-orange hover:shadow-md hover:shadow-navy/5"
    >
      <Image src={meta.logo} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
      <span className="text-left leading-tight">
        <span className="block font-display text-sm font-bold tracking-tight">{meta.provider}</span>
        <span className="block text-[11px] uppercase tracking-wide text-navy/50">{meta.label}</span>
      </span>
    </a>
  );
}

function LocationRow({ location }: { location: Location }) {
  const live = liveChannels(location);

  return (
    <li className="rounded-2xl border-2 border-navy/10 p-4">
      <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-orange">
        {location.area}
      </p>
      <h3 className="mt-0.5 font-display text-lg font-semibold leading-tight tracking-tight text-navy">
        {location.name}
      </h3>

      {live.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {live.map((c) => (
            <ChannelButton key={c} channel={c} url={location.ordering[c]!} location={location.name} />
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-navy/55">
          Online ordering coming soon — order at the counter.
        </p>
      )}
    </li>
  );
}

export default function OrderPanel() {
  const anyLive = locations.some((l) => liveChannels(l).length > 0);

  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-snug text-navy/70">
        Choose your Lobster Lab and we&apos;ll take you straight to its ordering page.
      </p>

      <ul className="space-y-3">
        {locations.map((l) => (
          <LocationRow key={l.name} location={l} />
        ))}
      </ul>

      {!anyLive && (
        <p className="text-center text-sm text-navy/55">
          Online ordering is being set up. Come see us at the counter in the meantime.
        </p>
      )}
    </div>
  );
}
