import Image from "next/image";
import { catering } from "@/lib/content";
import { OrderCateringButton } from "./Buttons";

export default function CateringSection() {
  return (
    <section id="catering" className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
        <div className="reveal order-2 text-center lg:order-1">
          <h2 className="sr-only">Catering</h2>
          <p className="mx-auto max-w-lg text-[17px] leading-relaxed text-navy sm:text-lg">
            {catering.body}
          </p>
          <OrderCateringButton className="mt-8 w-full sm:w-auto sm:min-w-[280px]" />
        </div>

        {/*
          Near-square rather than the landscape 4/3 this used to be. The photo is
          portrait and composed top-to-bottom, chefs plating at the top and the
          finished trays at the bottom, so a wide box keeps only half its height
          and has to sacrifice one end or the other. Tiger Hospitality Group runs
          the same shot on their own site in a 560x600 box for exactly this
          reason. 4/5 on mobile, where the image is full width and has room, then
          slightly wider at lg so it still balances the text column beside it.
        */}
        <div className="reveal relative order-1 aspect-[4/5] w-full overflow-hidden sm:aspect-[1/1] lg:order-2 lg:aspect-[10/11]">
          <Image
            src="/photos/catering.webp"
            alt="Two Lobster Lab chefs plating lobster rolls and grilled cheese onto steel trays lined up along a wooden table"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
