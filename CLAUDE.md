# CLAUDE.md — Lobster Lab

> House rules for this repo. See `CONVENTIONS.md` for the full K13 conventions and
> `.claude/Lessons.md` for the workflow rules. Review both at session start.

## Identity
- **Author/owner:** Kazim (K13 / Kazimiro). This is Kazim's project.
- Git identity: name `K13`, email `223161079+k13-projects@users.noreply.github.com` (`scripts/setup-identity.sh`).
- Collaborators Halil, Memo (MCS), Volkan are **EDISYN-only** — not involved here.

## Project
- **What:** rebuild of lobsterlab.us for Lobster Lab, a Tiger Hospitality Group concept, after migrating off SpotHopper.
- **For:** client (Tiger Hospitality Group).
- **Shortcode:** `lobster`   ·   **Deploy:** Vercel (planned)   ·   **Repo:** https://github.com/k13-projects/LobsterLab.git
- **Sibling:** `TigerHospitality_Website_01` is the parent group's site. Lobster Lab has its **own** brand (navy/orange, Sofia Pro Narrow) — do **not** inherit Tiger's black/gold, Bebas Neue identity.

## Run locally
- **Assigned dev port: `9151`** (K13 dev-port registry in `CONVENTIONS.md` — one fixed port per project, for life). Pin it so collisions fail loudly:
  - Next `next dev -p 9151` · Vite `vite --port 9151 --strictPort` · static `python3 -m http.server 9151 --bind 127.0.0.1`
- Open: **http://localhost:9151/** · macOS: never use 5000/7000 (AirPlay squats them).
- Nothing runs yet — this repo is still an archive (see below). The port is claimed for when the scaffold lands.

## Git workflow — always branch → PR → merge
**Never commit directly to `main` — no exceptions.** Every change goes on a branch, into a PR, and lands
via a real GitHub merge (`gh pr merge --merge`; no squash/rebase, keep all branches).
- **Branch naming:** `lobster_<monDD>_v<N>` — e.g. `lobster_jul29_v1`. `scripts/new-branch.sh lobster` picks the next `v<N>`.
- **Commits:** Hail Mary grouped-bullet — imperative no-emoji subject ≤ 72 chars → plain-language overview →
  `---` → technical details grouped by area → `Co-Authored-By: Claude <noreply@anthropic.com>`. Tiny fixes may stay one line.
- **Hail Mary:** `hm` → branch + documented commit + `git push -u`. `hm-1` skips the new branch (never on `main`);
  `hm++` also opens and merges the PR. Full spec in `HAIL_MARY.md`, mechanics in `scripts/hm.sh`.

## What this repo is

An **archive + rebuild blueprint**, not an application. There is no build system, no package manager, no tests — just data, docs, and one shell script. It captures lobsterlab.us (Tiger Hospitality Group's Lobster Lab) as it existed on SpotHopper (website ID `244728`) before SpotHopper access ended **Aug 1, 2026**, so the site can be rebuilt from scratch.

The Next.js front-end scaffold described in the README does not exist yet. If asked to "build the site," you are creating it — read [docs/Lobster_Lab_Site_Structure.md](docs/Lobster_Lab_Site_Structure.md) §6 first, which specifies the intended architecture (Next.js App Router + Tailwind, Vercel, JSON content now → headless CMS later, `/[location]` route template for the other 4 locations).

## Commands

```bash
cd images && chmod +x download_images.sh && ./download_images.sh   # pull assets from the SpotHopper CDN → images/downloaded_assets/ (gitignored)
open docs/sitemap_diagram.html                                     # visual site map
```

The download script is **time-sensitive and likely already dead** — the SpotHopper CDN (`static.spotapps.co` / `cdn.spotapps.co`) was expected to stop serving after Aug 1, 2026. `dl()` swallows failures with an echo rather than exiting, so a "successful" run can still produce zero usable files. Check `downloaded_assets/` before assuming assets are available.

## Data files are the source of truth for content

Everything a rebuild renders comes from these four files. They are hand-captured snapshots, each stamped `captured_on: 2026-07-28`.

- [menus/food_menu.json](menus/food_menu.json) — `sections[].items[].variants[{label, price}]`. The variant shape matters: most items have no single price, they have size/protein variants (Normal/XL/XXL, Lobster/Shrimp/Crab). Any menu component must render a variant list, not one price.
- [data/business_info.json](data/business_info.json) — brand, contact, and the Carlsbad primary location.
- [data/locations.json](data/locations.json) — all 5 locations. Only Carlsbad has `has_dedicated_pages: true`; the rest are food-hall stalls with address-only entries on the homepage.
- [data/external_services.json](data/external_services.json) — every third-party integration with a `lost_on_migration` boolean. **This flag drives rebuild work:** `false` (Toast ordering, EZCater catering) means just re-link the URL; `true` (catering inquiry form, private-parties form, jobs portal — all `tmt.spotapps.co` embeds) means build a replacement.

[pages/content_archive.md](pages/content_archive.md) holds verbatim page text for all 8 routes. Drink Menu, Specials, and Events were live placeholders ("we are updating") — that is the real captured state, not missing data.

## Brand asset library (local only, gitignored)

`docs/LOBSTER LAB Assets/` holds ~101MB of client-supplied design source: logos (EPS/PNG), 25 food photos, order-platform logos, menu PDFs, and the website design. It is **gitignored** — if it is missing from a fresh clone, that is expected; ask the owner for it. Its documents are the authority on the *new* site and override the SpotHopper archive wherever they conflict.

Key facts extracted from it:

- **Brand** (`IDENTITY/LOBLAB GUIDE .pdf`) — navy `#013a71` (PMS 654C) + orange `#fe6700` (PMS 1505C); typeface **Sofia Pro Narrow** (Regular / Semi Bold / Black), an Adobe Font. Tagline: "Seafood. Lobster Rolls. Fresh Ingredients. Everyday. Catch the Vibe."
- **The new site is a one-pager**, not the old 8-route tree. `LOBSTER LAB WEBSITE.pdf` is a single 1024×4766 scroll mockup; nav = About us · Our Menu · Locations · Catering · Contact + an ORDER ONLINE button. Sections: hero → intro + 3 values (Freshness First / Flavor in Every Detail / Consistency & Quality) → Menu → Catering → Locations → Reviews → Contact.
- **Ordering is a pop-up, not a link.** Per `Lobster Lab website structure.docx`: ORDER ONLINE opens a modal with Pickup (Toast) vs Delivery (DoorDash + Grubhub logos, in `ORDER LOGOS/`). ORDER CATERING opens a modal with EZCater plus an inquiry form: name, phone, email, party size, date, time, occasion, pickup-or-delivery, description.
- **Menus are PDFs, split by location group**, not per-item web pages: `MENU/Menu_Miramar, Windmill, Global Fork , Station 8.pdf` (the 4 food-hall stalls) and `MENU/Menu Sky Deck at Del Mar Highlands Town Center_.pdf` (a much larger full-service menu — entrees, shareables, kids, desserts, and a whole cocktail/wine/beer page the food halls don't have).
- **Reviews and hours** — the docx carries ready-to-use Google/Yelp review quotes with attribution, and per-location hours that `data/locations.json` lacks: Sky Deck 11:00–22:00, all others 11:00–21:00.

## Known inconsistencies in the archive

- The menu item count is stated as **24** in `docs/Lobster_Lab_Site_Structure.md` (§1, §2, §4, §8) and **20** in the README. `food_menu.json` actually contains **20** (Meals 10, Salad 4, Grilled Cheese 4, Sides 2) — trust the JSON.
- `docs/Lobster_Lab_Site_Structure.md` §8 refers to a `deliverables/` directory; those files live in `docs/`.
- **Prices in `food_menu.json` are stale in places.** The client menu PDF prices Feeling Truffly at Lobster $33 / Crab $25 (JSON says $32 / $25… JSON's crab matches, lobster does not) and Grilled Cheese add-protein at Lobster $35 / Shrimp $22 / Crab $26. The PDFs also carry items absent from the JSON entirely (Caviar $30, Smoked Salmon sandwich, the whole Sky Deck entree and drink list). Treat `MENU/*.pdf` as current and the JSON as the July 2026 web capture.

## Building the site (when the scaffold lands)
- Phases **P0→P5** per `CONVENTIONS.md`; run the P5 done-checklist before calling it done.
- House stack default for a premium animated site: **Next.js (App Router)** + `motion`/GSAP + Lenis, Tailwind,
  deploy Vercel, forms via Formspree. That matches `docs/Lobster_Lab_Site_Structure.md` §6.
- Once the brand is settled in code, run **`dna Lobster`** from the War Room to produce `public/styleguide.html`
  (titled `Lobster Lab DNA`) plus the Soul profile — the brand guide facts below are the raw material.
- Mobile-first; honour `prefers-reduced-motion`. Client-facing reports get archived under
  `docs/reports/` and must pass the two-agent Chrome QA gate (see `CONVENTIONS.md`).

## Content conventions

- Old slugs are long and location-prefixed (`/carlsbad-windmill-food-hall-lobster-lab-food-menu`). The rebuild uses short slugs (`/menu`, `/drinks`, `/specials`, `/events`, `/parties`, `/catering`, `/accessibility`) with 301 redirects from the old ones — the mapping table is in §2 of the structure doc. Do not reuse old slugs in new code.
- When adding captured data, keep the `captured_on` / `source_url` provenance fields; they distinguish archived fact from rebuild invention.
