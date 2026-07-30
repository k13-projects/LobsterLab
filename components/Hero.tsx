import Image from "next/image";
import { site } from "@/lib/content";

export default function Hero() {
  return (
    <section id="top" className="relative pt-[72px]">
      {/*
        The 320px floor must itself yield on short viewports. At 844x390
        (phone landscape) a flat min-h-[320px] plus the 72px header came to
        392px in a 390px viewport — the next section was not merely below the
        fold, it was zero pixels visible, so nothing signalled the page
        continued. min() keeps the floor on tall screens and relaxes it on short.
      */}
      <div className="relative h-[52vh] min-h-[min(320px,58vh)] w-full sm:h-[58vh] lg:h-[64vh] lg:min-h-[440px]">
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
