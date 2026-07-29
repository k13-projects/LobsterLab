import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-5 text-center">
      <Image
        src="/brand/wordmark-stacked.png"
        alt="Lobster Lab"
        width={272}
        height={119}
        className="h-auto w-[170px]"
      />

      <p className="mt-10 font-display text-7xl font-black leading-none tracking-tight text-orange sm:text-8xl">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight text-navy sm:text-4xl">
        That one got away.
      </h1>
      <p className="mt-3 max-w-md text-[17px] leading-relaxed text-navy/70">
        The page you were after isn&apos;t here. The menu, locations and catering are all on the
        home page.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-navy px-8 py-3.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-navy-deep"
        >
          Back to home
        </Link>
        <Link
          href="/#menu"
          className="rounded-full bg-orange px-8 py-3.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-orange-dark"
        >
          See the menu
        </Link>
      </div>
    </main>
  );
}
