import Image from "next/image";

/** Full-bleed band of four lobster rolls, between Locations and Reviews. */
export default function RollStrip() {
  return (
    // taller crop on phones — the native 16:9 renders only ~211px tall at 375px
    <div className="relative aspect-[4/3] w-full sm:aspect-[2048/1152]">
      <Image
        src="/photos/roll-strip.webp"
        alt="Four Lobster Lab rolls on steel trays — lobster with drawn butter, crab, shrimp and Connecticut style"
        fill
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
