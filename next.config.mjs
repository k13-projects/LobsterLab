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

// One Vercel deployment answers on two hostnames: the client's live domain and
// K13's stakeholder preview. These regexes are how the two are told apart in the
// routing rules below. Anchored, so `lobsterlab.us.evil.com` cannot match.
const LIVE_HOST = "(www\\.)?lobsterlab\\.us";
const PREVIEW_HOST = "lobster\\.k13projects\\.com";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      // The soundcheck page asks the client about revenue and operations. It is
      // for Lorena and Eren on the preview domain only, never on the restaurant's
      // public domain. Cannot be solved by deleting the file: both hostnames are
      // served by the same deployment, and Lorena still has to fill it in.
      //
      // A redirect (not a rewrite) because redirects run BEFORE the filesystem
      // check, so this fires ahead of the static file in public/. Temporary, not
      // permanent, because the file gets deleted outright once her answers land
      // and a cached 301 would then outlive its reason.
      {
        source: "/soundcheck.html",
        has: [{ type: "host", value: LIVE_HOST }],
        destination: "/",
        permanent: false,
      },

      // Explicit 301 rather than `permanent: true` (which emits 308) — the
      // rebuild spec calls for 301s and every old slug is GET-only anyway.
      ...LEGACY_REDIRECTS.map(([source, destination]) => ({
        source,
        destination,
        statusCode: 301,
      })),
    ];
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
