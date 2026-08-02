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

        <div className="reveal relative order-1 aspect-[4/3] w-full overflow-hidden lg:order-2 lg:aspect-[4/3.1]">
          <Image
            src="/photos/catering.webp"
            alt="An overhead spread of eleven Lobster Lab rolls and sandwiches plated on individual steel trays, laid out for a group"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
