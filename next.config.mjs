/** @type {import('next').NextConfig} */

// The rebuild is a one-pager. Every old SpotHopper slug 301s to the matching
// section anchor. Mapping follows docs/Lobster_Lab_Site_Structure.md §2.
const LEGACY_REDIRECTS = [
  ["/carlsbad-windmill-food-hall-lobster-lab-food-menu", "/#menu"],
  ["/carlsbad-windmill-food-hall-lobster-lab-drink-menu", "/#menu"],
  ["/carlsbad-windmill-food-hall-lobster-lab-menu", "/#menu"],
  ["/carlsbad-windmill-food-hall-lobster-lab-specials", "/#menu"],
  ["/carlsbad-windmill-food-hall-lobster-lab-events", "/#locations"],
  ["/carlsbad-windmill-food-hall-lobster-lab-private-parties", "/#catering"],
  ["/carlsbad-windmill-food-hall-lobster-lab-catering", "/#catering"],
  ["/carlsbad-windmill-food-hall-lobster-lab-accessibility", "/accessibility"],
  // short forms that also existed / are likely inbound
  ["/menu", "/#menu"],
  ["/drinks", "/#menu"],
  ["/specials", "/#menu"],
  ["/events", "/#locations"],
  ["/parties", "/#catering"],
  ["/catering", "/#catering"],
  ["/locations", "/#locations"],
  ["/contact", "/#contact"],
  ["/about", "/#about"],
];

// One Vercel deployment answers on two hostnames: the client's live domain,
// lobsterlab.us, and K13's stakeholder preview. This regex is how the preview is
// singled out below. Anchored, so `lobster.k13projects.com.evil.com` cannot
// match it. There was a matching LIVE_HOST here until the soundcheck page was
// retired; it is gone rather than left unused.
const PREVIEW_HOST = "lobster\\.k13projects\\.com";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    // There used to be a host-conditional rule here hiding /soundcheck.html from
    // the live domain while leaving it reachable on the preview one. Both the
    // page and the rule are gone: Lorena returned her answers on 10 Aug 2026, so
    // the questionnaire had done its job, and a redirect guarding a file that no
    // longer exists is just a trap for the next person reading this file.
    // It was deliberately a temporary redirect, so nothing is cached to unpick.
    return LEGACY_REDIRECTS.map(([source, destination]) => ({
      // Explicit 301 rather than `permanent: true` (which emits 308) — the
      // rebuild spec calls for 301s and every old slug is GET-only anyway.
      source,
      destination,
      statusCode: 301,
    }));
  },

  async headers() {
    return [
      // Keep the preview domain out of search, whatever robots.txt says.
      //
      // robots.txt is a statically generated file, so it cannot vary by hostname:
      // both domains get the same one. It reads `Disallow: /` only while
      // NEXT_PUBLIC_SITE_URL is set, and that variable is deleted at cutover — at
      // which point the preview domain would become crawlable and compete with
      // the real site for the same content. This header does vary by host, so it
      // survives that. Belt and braces with the canonical tags, which already
      // point every page at the live domain.
      {
        source: "/:path*",
        has: [{ type: "host", value: PREVIEW_HOST }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
