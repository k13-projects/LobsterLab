# CLAUDE.md, Lobster Lab

> House rules for this repo. See `CONVENTIONS.md` for the full K13 conventions and
> `.claude/Lessons.md` for the workflow rules. Review both at session start.

## Identity
- **Author/owner:** Kazim (K13 / Kazimiro). This is Kazim's project.
- Git identity: name `K13`, email `223161079+k13-projects@users.noreply.github.com` (`scripts/setup-identity.sh`).
- Collaborators Halil, Memo (MCS), Volkan are **EDISYN-only**, not involved here.

## Project
- **What:** rebuild of lobsterlab.us for Lobster Lab, a Tiger Hospitality Group concept, after migrating off SpotHopper.
- **For:** client (Tiger Hospitality Group).
- **Shortcode:** `lobster`   ·   **Deploy:** Vercel, **live at https://lobsterlab.us**   ·   **Repo:** https://github.com/k13-projects/LobsterLab.git

## Deploy (Vercel, wired and live)
- **Vercel project `lobster-lab`** on team `katalizor-kazims-projects`, GitHub-linked, production
  branch `main`. **A merge to `main` is a production deploy**, nothing to run by hand; every PR
  also gets a preview build. Domains on it: `lobsterlab.us`, `www.lobsterlab.us`, and the studio's
  preview address `lobster.k13projects.com` (same deployment, same content).
- The project name is `lobster-lab`, not the shortcode `lobster`. `Deploy Preview lobster` adopts
  it by the GitHub link (engine fixed 2026-09-02 after it created a duplicate `lobster` project).
- `NEXT_PUBLIC_SITE_URL` in Production is `https://lobsterlab.us` and **must stay that**:
  `lib/content.ts` compares it to `PRODUCTION_URL` to decide `isProduction`, and anything else
  flips robots.txt to `Disallow: /` and the canonical to the wrong host (it happened for ten minutes
  on 2026-09-02 when the deploy engine wrote the preview origin there). Preview builds carry the
  preview origin on purpose, so they stay `noindex`.
- `.vercel/` (the local link) is gitignored; `vercel env pull` writes `.env.local`, also ignored.
- **Sibling:** `TigerHospitality_Website_01` is the parent group's site. Lobster Lab has its **own** brand (navy/orange, Sofia Pro Narrow), do **not** inherit Tiger's black/gold, Bebas Neue identity.

## Run locally
- **Assigned dev port: `9154`** (K13 dev-port registry in `CONVENTIONS.md`, one fixed port per project, for life). Pinned in `package.json` as `next dev -p 9154`.
  - Was **9151** until 2026-07-30. That row belongs to HoK_Website by first claim (2026-06-25); this project, CarlosAlmaraz and HoK had all self-assigned 9151 because the registry table stopped at 9150. Reassigned to 9154, do not move it back.
- Open: **http://localhost:9154/** · macOS: never use 5000/7000 (AirPlay squats them).
- `npm install` → `./scripts/build-assets.sh` (once) → `npm run dev`.
- **Killing the dev/prod server:** the process renames itself, so `pkill -f "next start"` does **not**
  match it. Use `pkill -f next-server` (or kill the PID from `lsof -nP -iTCP:9154 -sTCP:LISTEN`).
  A stale server silently serves the previous build and makes fixes look like they did nothing.

## Git workflow, always branch → PR → merge
**Never commit directly to `main`, no exceptions.** Every change goes on a branch, into a PR, and lands
via a real GitHub merge (`gh pr merge --merge`; no squash/rebase, keep all branches).
- **Branch naming:** `lobster_<monDD>_v<N>`, e.g. `lobster_jul29_v1`. `scripts/new-branch.sh lobster` picks the next `v<N>`.
- **Commits:** Hail Mary grouped-bullet, imperative no-emoji subject ≤ 72 chars → plain-language overview →
  `---` → technical details grouped by area → `Co-Authored-By: Claude <noreply@anthropic.com>`. Tiny fixes may stay one line.
- **Hail Mary:** `hm` → branch + documented commit + `git push -u`. `hm-1` skips the new branch (never on `main`);
  `hm++` also opens and merges the PR. Full spec in `HAIL_MARY.md`, mechanics in `scripts/hm.sh`.

## What this repo is

Two things at once:

1. **The live site**, a Next.js (App Router) + Tailwind v4 one-pager in [app/](app/), [components/](components/), [lib/](lib/). Built July 29, 2026.
2. **The archive** it was rebuilt from, `menus/`, `data/`, `pages/`, `images/`, `docs/`: lobsterlab.us as it existed on SpotHopper (website ID `244728`) before access ended **Aug 1, 2026**.

The site is a **one-pager**, not the old 8-route tree, that follows the client's own brief, which
overrides `docs/Lobster_Lab_Site_Structure.md` §6 (that doc predates the client design files and
still describes a multi-route build with a `/[location]` template). Old slugs 301 to anchors.

**[lib/content.ts](lib/content.ts) is where all copy and links live.** Every string on the site is
there with a provenance comment. Change copy there, not in components.

**[tasks/todo.md](tasks/todo.md) is the phased delivery plan.** Every finding from both reports in
`docs/reports/` lives there in the phase that solves it, including the ones blocked on the client.
Start there when picking up work.

**[docs/WORKING_METHOD.md](docs/WORKING_METHOD.md) is how this project is built and tested.** Read
it before a substantial change, it records the loop, the verification standard, how agents are
used, and an honest list of what cost time. Durable rules are in
[.claude/Lessons.md](.claude/Lessons.md); re-read both at session start.

Client-supplied values that are still blank: the Formspree form id (`.env.example`) and the per-
location ordering URLs (`locations[].ordering` in `lib/content.ts`). Both degrade to an honest
"coming soon" state rather than rendering dead controls, keep that property.

Reviews are attributed non-identifyingly on purpose. See the block comment above `reviews` in
`lib/content.ts` before touching them.

## Commands

```bash
npm install && ./scripts/build-assets.sh && npm run dev            # the site, on :9154
npm run build                                                      # 5 prerendered static routes
./scripts/build-assets.sh                                          # regenerate public/ from the brand library
cd images && chmod +x download_images.sh && ./download_images.sh   # pull assets from the SpotHopper CDN → images/downloaded_assets/ (gitignored)
open docs/sitemap_diagram.html                                     # visual site map
```

The download script is **time-sensitive and likely already dead**, the SpotHopper CDN (`static.spotapps.co` / `cdn.spotapps.co`) was expected to stop serving after Aug 1, 2026. `dl()` swallows failures with an echo rather than exiting, so a "successful" run can still produce zero usable files. Check `downloaded_assets/` before assuming assets are available.

## Data files are the source of truth for content

Everything a rebuild renders comes from these four files. They are hand-captured snapshots, each stamped `captured_on: 2026-07-28`.

- [menus/food_menu.json](menus/food_menu.json), `sections[].items[].variants[{label, price}]`. The variant shape matters: most items have no single price, they have size/protein variants (Normal/XL/XXL, Lobster/Shrimp/Crab). Any menu component must render a variant list, not one price.
- [data/business_info.json](data/business_info.json), brand, contact, and the Carlsbad primary location.
- [data/locations.json](data/locations.json), all 5 locations. Only Carlsbad has `has_dedicated_pages: true`; the rest are food-hall stalls with address-only entries on the homepage.
- [data/external_services.json](data/external_services.json), every third-party integration with a `lost_on_migration` boolean. **This flag drives rebuild work:** `false` (Toast ordering, EZCater catering) means just re-link the URL; `true` (catering inquiry form, private-parties form, jobs portal, all `tmt.spotapps.co` embeds) means build a replacement.

[pages/content_archive.md](pages/content_archive.md) holds verbatim page text for all 8 routes. Drink Menu, Specials, and Events were live placeholders ("we are updating"), that is the real captured state, not missing data.

## Brand asset library (local only, gitignored)

`docs/LOBSTER LAB Assets/` holds ~101MB of client-supplied design source: logos (EPS/PNG), 25 food photos, order-platform logos, menu PDFs, and the website design. It is **gitignored**, if it is missing from a fresh clone, that is expected; ask the owner for it. Its documents are the authority on the *new* site and override the SpotHopper archive wherever they conflict.

Key facts extracted from it:

- **Brand** (`IDENTITY/LOBLAB GUIDE .pdf`), navy `#013a71` (PMS 654C) + orange `#fe6700` (PMS 1505C); typeface **Sofia Pro Narrow** (Regular / Semi Bold / Black), an Adobe Font. Tagline: "Seafood. Lobster Rolls. Fresh Ingredients. Everyday. Catch the Vibe."
- **The new site is a one-pager**, not the old 8-route tree. `LOBSTER LAB WEBSITE.pdf` is a single 1024×4766 scroll mockup; nav = About us · Our Menu · Locations · Catering · Contact + an ORDER ONLINE button. Sections: hero → intro + 3 values (Freshness First / Flavor in Every Detail / Consistency & Quality) → Menu → Catering → Locations → Reviews → Contact.
- **Ordering is a pop-up, not a link.** Per `Lobster Lab website structure.docx`: ORDER ONLINE opens a modal with Pickup (Toast) vs Delivery (DoorDash + Grubhub logos, in `ORDER LOGOS/`). ORDER CATERING opens a modal with EZCater plus an inquiry form: name, phone, email, party size, date, time, occasion, pickup-or-delivery, description.
- **Menus are PDFs, split by location group**, not per-item web pages: `MENU/Menu_Miramar, Windmill, Global Fork, Station 8.pdf` (the 4 food-hall stalls) and `MENU/Menu Sky Deck at Del Mar Highlands Town Center_.pdf` (a much larger full-service menu, entrees, shareables, kids, desserts, and a whole cocktail/wine/beer page the food halls don't have). **The Sky Deck menu was re-issued on 2026-09-02** as `MENU/A4 Lobster Lab Menu (Sky Deck, 2026-09-02).pdf`; that is the one `build-assets.sh` ships, the older files beside it are previous editions.
- **Reviews and hours**, the docx carries ready-to-use Google/Yelp review quotes with attribution, and per-location hours that `data/locations.json` lacks: Sky Deck 11:00–22:00, all others 11:00–21:00.

## Known inconsistencies in the archive

- The menu item count is stated as **24** in `docs/Lobster_Lab_Site_Structure.md` (§1, §2, §4, §8) and **20** in the README. `food_menu.json` actually contains **20** (Meals 10, Salad 4, Grilled Cheese 4, Sides 2), trust the JSON.
- `docs/Lobster_Lab_Site_Structure.md` §8 refers to a `deliverables/` directory; those files live in `docs/`.
- **Prices in `food_menu.json` are stale in places.** The client menu PDF prices Feeling Truffly at Lobster $33 / Crab $25 (JSON says $32 / $25… JSON's crab matches, lobster does not) and Grilled Cheese add-protein at Lobster $35 / Shrimp $22 / Crab $26. The PDFs also carry items absent from the JSON entirely (Caviar $30, Smoked Salmon sandwich, the whole Sky Deck entree and drink list). Treat `MENU/*.pdf` as current and the JSON as the July 2026 web capture.

## Working on the site
- Phases **P0→P5** per `CONVENTIONS.md`; run the P5 done-checklist before calling it done.
- Stack in place: **Next.js 15 (App Router)** + Tailwind v4 + Lenis, deploy Vercel, catering form via Formspree.
- **Copy and links → [lib/content.ts](lib/content.ts).** Components read from it; don't hardcode strings.
- **Assets → `scripts/build-assets.sh`.** Don't hand-copy files into `public/`; add them to the script
  so a fresh clone can regenerate. Photo picks are commented with which mockup slot they fill.
- Motion is gated behind `prefers-reduced-motion`, and `.reveal` only hides under the `.js` class set
  by an inline head script, **keep that guard**, or a JS failure blanks the whole page.
- Not yet run: **`dna Lobster`** from the War Room, to produce `public/styleguide.html`
  (titled `Lobster Lab DNA`) plus the Soul profile. The brand facts below are the raw material.
- Mobile-first. Client-facing reports get archived under `docs/reports/` and must pass the
  two-agent Chrome QA gate (see `CONVENTIONS.md`).
- **Run `fitcheck` after any layout, breakpoint or nav change**, those are exactly the edits that
  regress one screen size while fixing another. Nine viewports, shared measurement harness, trust
  gate. Skill: `~/.claude/skills/fitcheck/`. Every responsive defect in this repo was found by it
  or by the pass that became it.

## Content conventions

- Old slugs are long and location-prefixed (`/carlsbad-windmill-food-hall-lobster-lab-food-menu`). Because the rebuild is a one-pager, they 301 to **anchors** (`/#menu`, `/#catering`, `/#locations`, `/#contact`), not to standalone pages. The short slugs the structure doc proposes (`/menu`, `/drinks`, …) also 301 to those anchors, so inbound links from either era land correctly. The full map is `LEGACY_REDIRECTS` in [next.config.mjs](next.config.mjs). Do not reuse old slugs in new code.
- `/accessibility` is the one real second route.
- When adding captured data, keep the `captured_on` / `source_url` provenance fields; they distinguish archived fact from rebuild invention.


---

<!--K13_BROADCAST_START · managed by War Room — do not hand-edit-->
## 📡 War Room Broadcasts (org-wide rules)
> Synced from the K13 War Room. Each entry is a house rule that applies to every K13 project. Managed automatically — edit the rule in the War Room, not here.

<!--bc:2026-06-29-agent-agency-org-->
### 2026-08-13 · Team K13: named departments, the handoff contract & the autonomy contract
**K13 runs as team K13 — a controlled delivery pipeline, not a swarm.** Each AI specialist owns one repeatable stage, emits a predictable artifact, and hands off cleanly to the next. The **main Claude session is the GM (James)** — the only layer that sequences work (the hierarchy is flat: subagents don't spawn subagents, so agents never hand off to each other directly). **Jessica** runs Kazim's desk.

- **Roster + status legend:** `starter-kit/ORG.md` (War Room). Lean 7 to build first: Selma (`solutions-architect`) → Valentina (`brand-dna-designer`) → Natalia (`frontend-engineer`) → Olga (`qa-test-engineer`) → Irina (`security-auditor`) → Kate (`release-engineer`) → Gabi (`report-writer`). Human names are display labels; the functional `name:` is the routing key.
- **Handoff contract + Definition of Done:** `starter-kit/AGENT_HANDOFF_PROTOCOL.md`. Every delivery agent ends with the handoff block (Status / Summary / Files / Risks / Next / Human gate) and writes its artifact to `docs/handoffs/<stage>_<YYYY-MM-DD>.md` (same-day re-run → `_v2`, never overwrite).
- **Delegation is not optional.** James does not do a pipeline stage's work himself and call it done — every stage gets its named agent actually invoked (Task tool, `subagent_type` matching the agent file), even on a small project. **No artifact = the work never happened**: the War Room Org tab reads only `docs/handoffs/`, so skipping the artifact makes team K13 invisible on the board.
- **Autonomy contract — don't drip questions at Kazim.** Agents proceed by default. Only `Human gate` items come back to him: irreversible/destructive steps, money, real scope changes, anything that leaves for a client. Every other decision gets made, then **recorded in the handoff** instead of asked. Questions that genuinely survive are batched at the end of a run — never one at a time.
- **Parallel work:** sequential by default; James may fan out several agents **concurrently for independent work** (QA dimensions, security + a11y, research) and relay findings between them — each still writes its own handoff.
- **Agent vs skill:** token-heavy + isolatable → agent; in-context checklist/workflow → skill (compliance-checklist, media-generation).

<!--bc:2026-08-25-fitcheck-house-word-->
### 2026-08-25 · fitcheck: run the responsive-readiness pass after any layout, breakpoint or nav change
**Run `fitcheck` after any layout, breakpoint or nav change** — those are exactly the edits that regress one screen size while fixing another. `fitcheck` (alias `fit`) is the K13 responsive-readiness house pass: nine viewports (320 → 1920, including the two landscape sizes everyone forgets), a shared measurement harness with a trust gate, and the bug classes that only appear at one size — horizontal leaks, tap targets under the WCAG 2.5.8 AA floor, panels that are invisible but still in the tab order, scroll containers that strand their own header, and heroes that exactly fill a short viewport so nothing signals the page continues. It measures, looks, fixes at the source, and re-measures. It is also part of the P5 "done" checklist (`starter-kit/CONVENTIONS.md`). Skill: `~/.claude/skills/fitcheck/SKILL.md`.

<!--bc:2026-08-28-cc-commit-check-->
### 2026-08-28 · CC? — the pre-close commit check
**Ask `CC?` before closing a tab.** It means: "is anything lost if I close right now?" The session audits itself, read-only, and answers in one of two shapes: `✅ CC: safe to close` (one line of why), or `⚠️ CC: save these first` listing each unsaved item with a proposed save action, then waits for your pick. The sweep, in order: (1) git — uncommitted session work, unpushed commits, feature branches without a PR, open unmerged PRs (a repo's own known auto-refresh churn is excluded, not every dirty tree); (2) unwritten rules — corrections, decisions, or coined commands from the conversation not yet in this repo's `CLAUDE.md`/`Lessons.md`/memory; (3) deferrals not parked in a tracking ledger if this repo has one; (4) deliverables stranded in scratchpad/temp or outside any repo; (5) end of a working day — offer a journal/changelog entry if this repo keeps one, never auto-write it. `CC?` itself never saves anything — saving only happens after you choose.

<!--bc:2026-08-28-gstack-berths-->
### 2026-08-28 · GStack Berths: one browser slot per project
**Claim a `berth` for GStack Browser, do not share it blind.** GStack Browser is one shared Chromium instance for the whole machine by default (one profile directory, one fixed port 34567), not per project. Two Claude Code sessions in two different projects that both touch it (`/qa`, `/design-review`, `/browse`, `connect-chrome`, sidebar chat) end up driving the exact same window, stealing each other's active tab. The fix uses gstack's own supported per-workspace knobs: pin `CHROMIUM_PROFILE` and `BROWSE_PORT` in this project's `.claude/settings.json` under "env", derived from the dev port already claimed in `CONVENTIONS.md` so there is never a second table to drift: `BROWSE_PORT = <dev port> + 30000` (e.g. 9137 to 39137), `CHROMIUM_PROFILE = ~/.gstack/berths/<shortcode>`. Claim it once, the next time you are actively working in this project with GStack Browser alongside another active session; until claimed, nothing changes (opt-in, additive, no breakage). Never reach for `browse --force-restart` as a shortcut instead: it destroys the other session's tabs, cookies, and logins. Full spec + root cause: `K13-WarRoom/starter-kit/GSTACK_BERTHS.md`.

<!--K13_BROADCAST_END-->
