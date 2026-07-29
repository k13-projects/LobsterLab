import { values } from "@/lib/content";
import { valueIcons } from "./ValueIcons";

export default function Values() {
  return (
    <section aria-label="What we stand for" className="bg-sand py-14 sm:py-20">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-5 sm:grid-cols-3 sm:gap-8 sm:px-8">
        {values.map((v, i) => {
          const Icon = valueIcons[v.icon];
          return (
            <div
              key={v.label}
              className="reveal flex flex-col items-center text-center"
              style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
            >
              <Icon className="h-[88px] w-[88px] text-orange" />
              <p className="mt-4 font-display text-xl font-semibold tracking-tight text-navy">
                {v.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
