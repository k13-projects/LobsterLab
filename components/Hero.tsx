import Image from "next/image";
import { site } from "@/lib/content";

export default function Hero() {
  return (
    <section id="top" className="relative pt-[72px]">
      <div className="relative h-[52vh] min-h-[320px] w-full sm:h-[58vh] lg:h-[64vh] lg:min-h-[440px]">
        <Image
          src="/photos/hero.webp"
          alt="An overhead spread of Lobster Lab lobster rolls, seafood sandwiches and grilled cheese on steel trays"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>
    </section>
  );
}
