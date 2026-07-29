# Lobster Lab — Website Rebuild

Rebuild of **lobsterlab.us** (Tiger Hospitality Group) after migrating off SpotHopper.
This repo holds the **live Next.js site**, plus a complete archive of the old SpotHopper site (website ID `244728`) captured **July 28, 2026**.

> ⚠️ **SpotHopper access ends August 1, 2026.** See the "Do before Aug 1" checklist below.

---

## Run it

```bash
npm install
./scripts/build-assets.sh   # once — generates public/ from the client brand library
npm run dev                 # http://localhost:9151
```

`scripts/build-assets.sh` reads `docs/LOBSTER LAB Assets/` (gitignored, ~101MB, client-supplied)
and writes optimized photos, logos and menu PDFs into `public/`. If that folder is missing from a
fresh clone that is expected — ask the owner for it. `public/` is committed, so the site builds
without it.

Copy `.env.example` → `.env.local` and fill in the Formspree id and delivery URLs (see below).

---

## What's in this repo

```
/app       Next.js App Router — one-pager, /accessibility, 404, sitemap, robots
/components  page sections + the two ordering modals
/lib       content.ts ................ every string and link on the site, with provenance
/scripts   build-assets.sh ........... brand library -> public/
/public    photos, brand marks, order logos, menu PDFs (generated, committed)

--- archive of the old SpotHopper site ---
/menus     food_menu.json ............ structured food menu (4 sections, 20 items, with prices)
/data      business_info.json ........ brand, contact, primary location
           locations.json ............ all 5 locations
           external_services.json .... third-party integrations + what's lost on migration
/pages     content_archive.md ........ every page's text captured verbatim
/images    image_manifest.csv ........ every image/video URL on the old site
           download_images.sh ........ downloader — RUN THIS BEFORE AUG 1
/docs      Lobster_Lab_Site_Structure.md .. full site map + rebuild blueprint
           sitemap_diagram.html ....... visual site map (open in a browser)
```

---

## The new site

A **one-pager**, per the client's `LOBSTER LAB WEBSITE.pdf` mockup and `Lobster Lab website structure.docx` —
not the old 8-route tree. Sections: hero → intro + 3 values → Menu → Catering → Locations → Reviews → Contact.
Every old slug 301s to the matching anchor (`next.config.mjs`).

- **Brand** — navy `#013a71` / orange `#fe6700`. Sofia Pro Narrow is an Adobe Font, so the site
  self-hosts **Barlow Semi Condensed** as a stand-in via `next/font`. Swap `--font-brand` in
  `app/globals.css` + `app/layout.tsx` to change it; nothing else references a font name.
- **Ordering is modal, not a link.** ORDER ONLINE opens Pickup (Toast) vs Delivery (DoorDash /
  Grubhub). ORDER CATERING opens ezCater plus the 9-field inquiry form.
- **Menus are the client's two PDFs**, split food-halls vs Sky Deck.
- Motion (Lenis + scroll reveals) is fully gated behind `prefers-reduced-motion`. Reveals only
  hide once an inline head script confirms JS, so a no-JS visitor still gets the whole page.

### Still needed from the client

| What | Where it plugs in | Until then |
|---|---|---|
| Formspree form id | `NEXT_PUBLIC_FORMSPREE_ID` | form validates, then tells the user to email `info@lobsterlab.us` |
| DoorDash + Grubhub storefront URLs | `NEXT_PUBLIC_DOORDASH_URL` / `_GRUBHUB_URL` | delivery tiles render a disabled "coming soon" state |
| Vector (SVG/EPS-as-PDF) wordmark | `public/brand/` | supplied PNGs are used; crisp at nav size, soft on retina in the footer |

---

## The old site at a glance

Single-location marketing site for the Carlsbad / Windmill Food Hall location. 8 routes:

| Page | Old slug | State |
|---|---|---|
| Home | `/` | hero video, gallery, locations, CTAs |
| Food Menu | `/carlsbad-windmill-food-hall-lobster-lab-food-menu` | **real content — 20 items** |
| Drink Menu | `/carlsbad-windmill-food-hall-lobster-lab-drink-menu` | placeholder ("updating") |
| Specials | `/carlsbad-windmill-food-hall-lobster-lab-happy-hours-specials` | placeholder |
| Events | `/carlsbad-windmill-food-hall-lobster-lab-events` | placeholder |
| Parties | `/carlsbad-windmill-food-hall-lobster-lab-party` | SpotHopper form embed |
| Catering | `/carlsbad-windmill-food-hall-lobster-lab-catering` | SpotHopper form embed |
| Accessibility | `/accessibility-page-01` | static statement |

External (keep working after migration): **Toast** (online ordering), **EZCater** (catering checkout), Instagram, Google Business.
Lost on Aug 1: SpotHopper form embeds (catering inquiry, private parties, jobs), the newsletter list, and all images/video on the SpotHopper CDN.

---

## Do before Aug 1 (you lose these)

1. `cd images && ./download_images.sh` — saves all images + the promo video from the SpotHopper CDN.
2. Export newsletter subscribers and any form submissions from the SpotHopper dashboard.
3. **Confirm you control `lobsterlab.us` DNS at your own registrar.** If SpotHopper manages DNS, move it out now — this is the highest-risk item.
4. Save the Toast + EZCater admin logins and public URLs (URLs are in `data/external_services.json`).

---

## Suggested rebuild stack

Recommended: **Next.js (App Router) + Tailwind CSS**, hosted on **Vercel**. Content starts from the JSON files in this repo and can graduate to a headless CMS (Sanity/Payload) later. A `/[location]` route template lets all 5 locations share one codebase.

Proposed clean URLs (set 301 redirects from the old slugs): `/menu`, `/drinks`, `/specials`, `/events`, `/parties`, `/catering`, `/accessibility`.

Full architecture, content model, and data flow are in [`docs/Lobster_Lab_Site_Structure.md`](docs/Lobster_Lab_Site_Structure.md).

---

## Next step

The site is built and passes a desktop + mobile Chrome QA pass. To ship:

1. Fill in the three client-supplied values in the table above.
2. Deploy to Vercel (project is static — `next build` emits 5 prerendered routes).
3. Point `lobsterlab.us` DNS at Vercel and confirm the 301s resolve on the real domain.

One known content issue: `public/menus/lobster-lab-menu-food-halls.pdf` is **10MB** as supplied by
the client. Worth asking for a web-optimized export before launch — it is a heavy download on
mobile data.
