import Image from "next/image";

/** Full-bleed band of four lobster rolls, between Locations and Reviews. */
export default function RollStrip() {
  return (
    <div className="relative aspect-[2048/1152] w-full">
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
