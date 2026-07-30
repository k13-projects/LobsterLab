# Lobster Lab — Phased Delivery Plan

**Owner:** K13 · **Started:** 2026-07-29 · **Client:** Tiger Hospitality Group
**Source material:** `docs/reports/LobsterLab_UIUX_Audit_2026-07-29.md` and
`docs/reports/LobsterLab_Business_Legal_2026-07-29.md`

**How to use this file.** Every finding from both reports appears here exactly once, in the phase
where it gets solved. Nothing is dropped because it is currently blocked — blocked items sit in
their phase with a `BLOCKED ON` line naming who owns the unblock. When an opportunity comes up,
open this file and pick up the next unchecked item in the lowest open phase.

Status key: `[x]` done · `[ ]` open · `[~]` harness built, waiting on an external input

---

## P0 — Build & critical fixes · **DONE**

- [x] Next.js 15 + Tailwind v4 one-pager built to the client mockup
- [x] Two ordering modals per the client brief
- [x] Assets pipeline (`scripts/build-assets.sh`), 27 photos → 1.7MB WebP
- [x] 301 redirects from every old SpotHopper slug
- [x] Security headers, sitemap, robots, JSON-LD per location
- [x] Chrome QA gate — desktop + mobile
- [x] **Critical:** mobile catering modal was unreachable above the scroll origin — fixed
- [x] WCAG 2.5.8 AA tap-target failures in footer — fixed
- [x] Heading hierarchy inversion + inconsistent vertical rhythm — fixed
- [x] **DNS control confirmed held by client** — the Aug 1 existential risk is closed

---

## P1 — Integration wiring · **HARNESS DONE, AWAITING CLIENT VALUES**

Everything third-party, consolidated into one phase so it can be connected in a single sitting.
The code is finished and placeholder-driven: when the values land, this is a **one-file edit** to
`lib/content.ts` plus two env vars. No component changes required.

- [x] Per-location ordering data model — every location carries its own `ordering` block
- [x] ORDER ONLINE modal rebuilt as a per-location picker; locations without links degrade to an
      honest "coming soon" instead of a dead control
- [x] `.env.example` documents every external value with where it plugs in
- [~] **Formspree form id** → `NEXT_PUBLIC_FORMSPREE_ID`
      *BLOCKED ON: client.* Recommend a shared `catering@` inbox, not a personal one, so leads
      survive staff turnover. Until set, the form validates then directs the user to email.
- [~] **Toast URLs for the 4 non-Carlsbad locations** → `locations[].ordering.toast`
      *BLOCKED ON: client.* Carlsbad is live. This is the single biggest revenue gap — four of five
      locations currently cannot be ordered from.
- [~] **DoorDash + Grubhub storefront URLs** → `locations[].ordering.doordash` / `.grubhub`
      *BLOCKED ON: client.* The brief left both as the literal word "Link".
      Confirm signed platform agreements exist first — CA AB 2149 (Fair Food Delivery Act).
- [ ] Verify each supplied URL resolves to the correct store before launch

### Restore the private-parties path — **REGRESSION, buildable now**

- [ ] **Rebuild the private parties / group booking enquiry.** Not a new idea: the old SpotHopper
      site had a "Group Reservations and Private Parties" page,
      `data/external_services.json` marks that form `lost_on_migration: true`, and
      `docs/Lobster_Lab_Site_Structure.md` says of it verbatim **"replace with a form in the
      rebuild"** — the same instruction that produced the catering form we did build. The client's
      own ideas deck asks for it too ("private parties, corporate events, weddings").
      A guest wanting a group booking has no path on the new site and had one on the old.
      *Not blocked.* The modal shell, the form and the occasion vocabulary (Corporate Lunch,
      Celebration, Family Event, Wedding) all already exist — only the entry point is missing.
      Plan: widen ORDER CATERING into **Catering & Events** with two intents; the party form needs
      a location field and drops pickup-or-delivery.
      See `docs/reports/LobsterLab_AssetGapAnalysis_2026-07-30.md`.

**Definition of done:** every location's ORDER ONLINE opens to a working storefront for that
location, and a submitted catering inquiry lands in the shared inbox.

---

## P2 — UI/UX polish · **DONE**

The six open recommendations from the UI/UX audit, plus the mobile-agent findings below.

- [x] **F-A** nav links appeared only at 1024px, leaving the header empty across 768–1023 (iPad
      portrait is real restaurant-browsing traffic) → dropped to `md`
- [x] **F-B** intro body ran 78 characters per line at 768px (comfortable is 45–75) → capped
- [x] **F-E** roll strip locked to a 2048×1152 crop rendered ~211px tall at 375px → taller mobile crop
- [x] **F-F** MENU heading sat 12px off the section grid below `lg` — too small to read as the
      deliberate bleed it is at desktop → negative margin now applies only at `lg`
- [x] **F-C** Locations trailing row was pinned left by the grid and read unfinished → flex-wrap
      with `justify-center`; both rows now share a 720px centre at 1440
- [~] **F-D** value icons were redrawn as SVG because the client supplied them only as raster
      inside a PDF. The citrus and seal read well; the "hand seasoning a bowl" is the weakest.
      *BLOCKED ON: client designer.* Ask for the three icons as SVG — a five-minute request for
      exact brand fidelity.

### Mobile agent findings (2026-07-29 responsive sweep)

- [x] **Blocking:** mobile nav sheet had no focus trap and no Escape. `max-h-0` only hides it
      visually, so its 6 links kept a layout box and stayed tabbable while invisible (WCAG 2.4.7),
      and tabbing past the last item threw focus ~2000px down the page behind the open sheet.
      Fixed with `inert` when closed, Escape-to-close, focus trap and focus restore to the toggle.
- [x] Primary nav labels wrapped to two lines at 768 and 844 — added `whitespace-nowrap` and
      stepped type/gaps/CTA down at md so the row fits
- [x] Nav labels then measured 23px tall at md, 1px under the WCAG 2.5.8 AA floor — `min-h-[24px]`
- [x] Order modal channel sub-label was 11px, under the mobile legibility floor → 12px
- [x] TCPA consent checkbox was 20x20, under the AA floor → 24x24
- [x] Reviews carousel had no end state; Next past the last card gave no feedback → both arrows
      now disable at their edge. Note the resting start is `scrollLeft == padding-left` (20 on
      mobile), not 0, because snap-start pulls the first card flush
- [x] Duplicate React keys in the reviews list, introduced when attributions were genericized and
      stopped being unique → keyed on the quote
### Landscape agent findings (2026-07-29)

- [x] **High:** at 844x390 (phone landscape) the hero's flat `min-h-[320px]` plus the 72px header
      came to 392px in a 390px viewport — the next section was not below the fold, it was **0px
      visible**, with nothing signalling the page continued. Now `min-h-[min(320px,58vh)]`:
      92px of the next section shows at 844x390, and tall viewports are unchanged
- [x] Primary nav renders from 768px up, which includes phone landscape — a touchscreen. Links
      were a 24-26px hit box; now `min-h-[44px]` inside the 72px row, no visual change
- [x] `text-[19vw]` MENU wordmark ran ~160px tall on a 390px landscape screen and pushed the menu
      CTAs out of reach → capped at `min(19vw,22vh)`, now 86px there, portrait unchanged
- [x] Modal close button was 38x38 → 44x44
- [ ] Optional perf nit: the "hero.webp preloaded but not used" console warning fires on every
      load. Benign, but it masks real errors during QA. Worth tightening the `sizes` hint.

**Agent process note:** the browse daemon is shared between parallel agents and is not isolated —
both agents caught another agent's viewport bleeding into their session, and so did I (one sweep
reported five phantom failures). Every measurement should assert `window.innerWidth` in-band
before it is trusted. Worth solving before the next parallel run.

---

## P3 — Legal & compliance baseline · **DONE (pending counsel review)**

The items that were presently non-compliant or carried real exposure. Everything here is marked
**[COUNSEL]** in the business report and should still be reviewed by California counsel — this
phase makes that review cheap, it does not replace it.

- [x] **Privacy policy** published and linked in the footer.
      Required by **CalOPPA** (Bus. & Prof. Code § 22575) because the catering form collects name,
      phone and email from California residents. This was a live compliance gap.
- [x] **Terms of use** published and linked.
- [x] **TCPA consent** language added to the catering form. The form collects a phone number;
      using it for marketing texts later needs prior express written consent, and transactional
      follow-up is a narrower thing than marketing consent. Kept unbundled and explicit.
- [x] **Review attribution reduced** pending permission. The site published six reviews with full
      names, creating exposure under platform terms and **Civil Code § 3344** (unauthorized use of
      name in advertising, $750 statutory floor per violation). Attribution is now non-identifying
      until one of the two proper fixes lands.
- [ ] **Proper review fix** — switch to official Yelp/Google embed widgets (licensed for this), or
      obtain written consent from each named reviewer.
      *BLOCKED ON: client decision + counsel.*
- [ ] **Confirm photo rights** — written copyright assignment or licence for the 2023-05-25 shoot.
      Commissioned photography is not automatically work-for-hire in the US.
      *BLOCKED ON: client.* Five-minute question that prevents a real problem.
- [ ] **CCPA scoping** — get Tiger Hospitality Group's total annual gross revenue. The $25M
      threshold is measured at entity level, not per brand, so THG's group total decides whether
      this site needs consumer request intake, deletion/access workflows and a "Your Privacy
      Choices" link. **Do not guess this one.**
      *BLOCKED ON: client.*
- [ ] Formal **WCAG 2.1 AA audit** with dated evidence of audit + remediation. California's Unruh
      Act carries a $4,000 statutory minimum per offense and restaurants are a favored target. The
      evidence record is the practical value — it makes a demand letter cheaper to resolve.
      *Recommend: commission shortly after launch.*
- [ ] **Prop 65** — confirm on-premise warnings are correct for seafood (mercury) and fried items
      (acrylamide); ask counsel whether the linked ordering surfaces shift any obligation.
- [ ] **ABC review** — Sky Deck carries a full cocktail/wine/beer list the four stalls do not.
      Confirm the menu PDF is acceptable as advertising, and that the site never implies alcohol
      at the stalls that do not serve it.

---

## P4 — Measurement & consent · **HARNESS DONE, AWAITING STACK DECISION**

Deliberately after P3, because in California the tracker and the consent mechanism must ship
**together**. Retrofitting consent onto a pixel that has already been running is the expensive path.

- [x] Consent banner built and gate proven: with an id configured, `gtag` is `undefined` before
      consent, a `function` after Allow, and stays `undefined` after Decline. Choice persisted.
- [x] Event tracking wired: `order_modal_open`, `catering_modal_open`, `storefront_click`
      (with channel + location), `catering_form_start`, `catering_inquiry_sent`, `menu_pdf_open`,
      `directions_click`
- [x] Privacy policy renders its tracking section from the live config, so it cannot drift out of
      date — with no id set it truthfully says the site loads no tracker
- [x] Ships inert: `NEXT_PUBLIC_GA_ID` unset means no banner, no script, no cookie
- [ ] **Decide the analytics stack.** Harness is wired for GA4. A cookieless tool
      (Plausible/Fathom) would materially reduce the CIPA exposure below and likely remove the
      banner entirely — swap `loadVendor()` in `lib/analytics.ts` and set `REQUIRES_CONSENT` false.
      *BLOCKED ON: K13 + client decision.*
- [ ] Set `NEXT_PUBLIC_GA_ID` (or the chosen equivalent) in Vercel once decided

**Why this matters legally:** California has a large and active wave of litigation applying the
**California Invasion of Privacy Act** — including its pen register/trap-and-trace provisions — to
ordinary web trackers, pixels and session replay. **Avoid session-replay tooling entirely.**

**Why it matters commercially:** right now we cannot tell how many people open the ordering modal,
which location gets the most direction taps, or where the catering form is abandoned. We are
optimizing blind.

---

## P5 — Content & SEO

The growth ceiling. None of this is urgent; all of it compounds.

- [ ] **Web-optimized menu PDFs.** The food-halls PDF is **10MB** as supplied — a conversion killer
      on cellular. *BLOCKED ON: client export, or we re-compress.*
- [ ] **HTML menu rendered from structured data.** Solves three problems at once: mobile
      conversion, SEO (PDF menu content ranks poorly for "lobster roll near me"), and accessibility
      (the PDFs are almost certainly untagged, and a PDF-only menu is a common ADA complaint).
      `menus/food_menu.json` already exists — needs price reconciliation against the current PDFs,
      which the archive notes are stale in places.
      **Corroborated by the client's ideas deck** (slide 4), which lists the categories to show and
      references Poke House's category-tabs-plus-item-cards treatment. This was the client's
      original intent, not just our SEO argument.
- [ ] **Surface the tagline.** "Seafood. Lobster Rolls. Fresh Ingredients. Everyday. Catch the
      Vibe." is in the brand guide and on the ideas deck's homepage slide, but on our site it exists
      only as `sr-only` and in page metadata. The brand's own line is invisible. Small fix.
- [ ] **Per-location pages** on the `/[location]` template from `docs/Lobster_Lab_Site_Structure.md`
      §6. Five locations across two counties currently share one URL, so the site cannot rank
      locally in five markets. This is the largest single growth lever.
- [ ] Link each location page to its Google Business Profile — the local pack is where this
      business gets found
- [ ] Note for targeting: **San Clemente is Orange County**, the other four are San Diego County

---

## P6 — Growth & handover

- [ ] **Email capture.** The SpotHopper newsletter list is lost and nothing replaced it. Owned
      email is the cheapest repeat-visit driver and the only channel not taxed by a platform.
      Ship with CAN-SPAM compliant footer and consent.
- [ ] Headless CMS so the client edits copy without K13 in the loop
- [ ] **Nutrition field in the menu data model.** Federal calorie disclosure kicks in at **20+
      locations**; at 5 you are exempt. Building the field now is cheap; retrofitting at unit 20 is
      not.
- [ ] Rebuild the jobs portal lost in migration — needs CA **SB 1162** pay-scale disclosure in
      postings and standard EEO language
- [ ] `dna Lobster` from the War Room → `public/styleguide.html` + Soul profile

---

## Standing questions for the client

Carried forward until answered. Raise these whenever there is contact.

1. Toast URLs for the four non-Carlsbad locations, plus DoorDash and Grubhub storefronts *(P1)*
2. Formspree form id and the destination inbox *(P1)*
3. Total annual gross revenue for Tiger Hospitality Group *(P3 — decides CCPA scope)*
4. Written copyright assignment for the 2023 photography *(P3)*
5. Permission position on the named Google/Yelp reviews *(P3)*
6. The three value icons as SVG *(P2)*
7. Web-optimized menu PDF exports *(P5)*
8. **Our Story copy, and a decision on a team/founder photo** *(new — from the ideas deck)*. The
   deck asks for "Our story" and "Team intro (chef / founders / team)". Neither reached the final
   mockup, so this needs a client decision as well as a build. Origin story is the one content type
   that must come from the operator — do not invent it. The 2023 shoot has chef-at-work frames that
   could carry it if they want the fuller treatment.
