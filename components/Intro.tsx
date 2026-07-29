import { intro } from "@/lib/content";

export default function Intro() {
  // py matches the other sections (16/20/24) so the vertical rhythm is uniform
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
        <h2 className="reveal font-display text-[13vw] font-medium leading-[0.95] tracking-tight text-navy sm:text-6xl lg:text-[68px]">
          {intro.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="block italic text-orange">{intro.headlineAccent}</span>
        </h2>

        <div className="reveal space-y-4 self-center text-[17px] leading-relaxed text-navy sm:text-lg" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          {intro.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
