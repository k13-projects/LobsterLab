# Lobster Lab — Website Rebuild

Rebuild of **lobsterlab.us** (Tiger Hospitality Group) after migrating off SpotHopper.
This repo contains a complete archive of the old SpotHopper site (website ID `244728`), captured **July 28, 2026**, plus the plan and data to rebuild it from scratch.

> ⚠️ **SpotHopper access ends August 1, 2026.** See the "Do before Aug 1" checklist below.

---

## What's in this repo

```
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

The `main` branch currently holds the **archive + plan**. Front-end scaffold (Next.js pages + components wired to `menus/food_menu.json`) is the next commit — start there in Cursor.
