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

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    // Explicit 301 rather than `permanent: true` (which emits 308) — the
    // rebuild spec calls for 301s and every old slug is GET-only anyway.
    return LEGACY_REDIRECTS.map(([source, destination]) => ({
      source,
      destination,
      statusCode: 301,
    }));
  },

  async headers() {
    return [
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
