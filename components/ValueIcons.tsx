/**
 * The three value icons from the mockup, redrawn as stroked SVG so they stay
 * crisp at any size and inherit the brand orange from `currentColor`.
 */

const common = {
  viewBox: "0 0 96 96",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Citrus wedge — "Freshness First" */
export function CitrusIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <g transform="rotate(-22 48 52)">
        {/* rind — half disc sitting on its flat edge */}
        <path d="M18 66A30 30 0 0 1 78 66Z" />
        {/* pith */}
        <path d="M23.5 66A24.5 24.5 0 0 1 72.5 66" />
        {/* segments, radiating from the centre of the flat edge */}
        <path d="M48 66 69.2 53.75" />
        <path d="M48 66 60.25 44.75" />
        <path d="M48 66V41.5" />
        <path d="M48 66 35.75 44.75" />
        <path d="M48 66 26.8 53.75" />
        {/* seeds */}
        <circle cx="41" cy="59" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="55" cy="59" r="1.5" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/** Hand seasoning a bowl — "Flavor in Every Detail" */
export function SeasonIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      {/* bowl */}
      <path d="M26 62h44a22 22 0 0 1-44 0Z" />
      {/* hand: rounded back, index and thumb meeting in a pinch over the bowl */}
      <path d="M63 14c6 1.4 9.8 7 8.6 12.8-1.1 5.3-6.2 8.8-11.7 8" />
      <path d="M63 14 51 35" />
      <path d="M59.9 34.8 51 35" />
      <path d="M63 14c-2.2 5-3.6 10.3-4.2 15.6" />
      {/* falling seasoning */}
      <circle cx="47" cy="47" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="53.5" cy="51" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="41.5" cy="52" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Scalloped seal with a check — "Consistency & Quality" */
export function SealIcon({ className = "" }: { className?: string }) {
  // 16-point scalloped rosette generated on a circle
  const points = 16;
  const cx = 48;
  const cy = 48;
  const outer = 33;
  const inner = 28.5;
  let d = "";
  for (let i = 0; i < points; i++) {
    const a1 = (i / points) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 0.5) / points) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + outer * Math.cos(a1);
    const y1 = cy + outer * Math.sin(a1);
    const x2 = cx + inner * Math.cos(a2);
    const y2 = cy + inner * Math.sin(a2);
    d += i === 0 ? `M${x1.toFixed(2)} ${y1.toFixed(2)}` : "";
    d += ` Q${x2.toFixed(2)} ${y2.toFixed(2)} ${(cx + outer * Math.cos(((i + 1) / points) * Math.PI * 2 - Math.PI / 2)).toFixed(2)} ${(cy + outer * Math.sin(((i + 1) / points) * Math.PI * 2 - Math.PI / 2)).toFixed(2)}`;
  }
  d += "Z";

  return (
    <svg {...common} className={className}>
      <path d={d} />
      <circle cx="48" cy="48" r="20" />
      <path d="M39 48.5 45.5 55 58 42.5" />
    </svg>
  );
}

export const valueIcons = {
  citrus: CitrusIcon,
  season: SeasonIcon,
  seal: SealIcon,
} as const;
