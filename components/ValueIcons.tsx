/**
 * The three value icons, as supplied by the client (Lorena, 3 Aug 2026).
 *
 * These were hand-redrawn SVG until now, because the only version available was
 * a raster image inside a PDF. That was finding F-D in the UI/UX audit. The real
 * vectors are in the brand library at ICONS/VECTORS/ and are cleaned into
 * public/icons/ by scripts/build-assets.sh, which strips the white background
 * rects, normalises the artwork to the brand orange and crops the padded portrait
 * canvas to a square. See the comments there before touching the files.
 *
 * Rendered as <img> rather than inlined: the three files total ~45KB (~16KB
 * gzipped) and inlining them would put that in the HTML of a one-page site for no
 * benefit, since the artwork is a fixed brand orange and never needs to inherit
 * colour. Sized explicitly so they reserve their space and cannot shift layout.
 *
 * Decorative on purpose. Each icon sits directly above its own text label, so
 * alt text would be read out twice by a screen reader.
 */

type IconProps = { className?: string };

function icon(src: string) {
  return function ValueIcon({ className = "" }: IconProps) {
    return <img src={src} alt="" aria-hidden="true" width={88} height={88} className={className} />;
  };
}

export const CitrusIcon = icon("/icons/citrus.svg");
export const SeasonIcon = icon("/icons/season.svg");
export const SealIcon = icon("/icons/seal.svg");

export const valueIcons = {
  citrus: CitrusIcon,
  season: SeasonIcon,
  seal: SealIcon,
} as const;
