import Link from "next/link";
import Image from "next/image";

/** Shared shell + typography for the legal pages (privacy, terms). */
export default function LegalPage({
  title,
  effective,
  children,
}: {
  title: string;
  effective: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-navy/10">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center px-5 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Lobster Lab, home">
            <Image
              src="/brand/wordmark-horizontal.png"
              alt="Lobster Lab"
              width={406}
              height={49}
              className="h-[26px] w-auto sm:h-[30px]"
            />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <h1 className="font-display text-5xl font-medium leading-[0.95] tracking-tight text-navy sm:text-6xl">
          {title}
        </h1>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-orange">
          Effective {effective}
        </p>

        <div className="mt-8 text-[17px] leading-relaxed text-navy/85">{children}</div>

        <Link
          href="/"
          className="mt-12 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-navy-deep"
        >
          Back to Lobster Lab
        </Link>
      </main>
    </div>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-9 font-display text-2xl font-semibold tracking-tight text-navy">{children}</h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4">{children}</p>;
}

export function UL({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
