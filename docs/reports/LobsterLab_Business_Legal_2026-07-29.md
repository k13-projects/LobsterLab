# Lobster Lab — Business & Legal Assessment

**Date:** 2026-07-29 · **Prepared for:** K13 / Tiger Hospitality Group · **Author:** K13
**Scope:** the rebuilt lobsterlab.us one-pager, the 5-location operating footprint, and the
regulatory surface that applies to a California multi-unit seafood concept.

> **Not legal advice.** This is an operator's risk register written to brief California counsel
> efficiently. Every item marked **[COUNSEL]** should be reviewed by a licensed CA attorney before
> launch. The intent is to make that review cheap and fast, not to replace it.

---

## 1. Executive summary

The site is built and technically sound. The commercial problem is that **three of its four revenue
paths are currently disconnected**, and the highest-margin one is silently dropping leads.

| Revenue path | Status | Business impact |
|---|---|---|
| Pickup ordering (Toast) | Live — **but only for Carlsbad** | 4 of 5 locations cannot be ordered from |
| Delivery (DoorDash, Grubhub) | **Not connected** — client never supplied URLs | Entire delivery demand unserved |
| Catering inquiries | **Not connected** — no Formspree id | Every inquiry is lost at submit |
| Catering checkout (ezCater) | Live | Working |

**The single most urgent commercial fact:** the catering inquiry form is the highest-value asset on
the site — catering has the largest average order value and the best margin in this business — and
right now it validates the user's input and then tells them to send an email instead. Every day it
stays that way is lost pipeline.

**The single most urgent legal fact:** the site republishes six named Google and Yelp reviews as
marketing. That carries exposure under both platform terms and California's right-of-publicity
statute. See §3.1.

**Overall business readiness: 62/100.** The build is good; the commercial wiring and the compliance
layer are not finished. Neither is expensive to fix — most of §2 and §3 is a week of work.

---

## 2. Business assessment

### 2.1 What the site is for

Three jobs, in order of value to Tiger Hospitality Group:

1. **Catering leads** — highest AOV, highest margin, most defensible against delivery-app commission.
2. **Direct pickup orders via Toast** — avoids the 15–30% marketplace commission on DoorDash/Grubhub.
3. **Foot traffic to 5 physical locations** — the food-hall stalls live or die on local discovery.

The current site does job 3 reasonably, job 2 partially, and job 1 not at all.

### 2.2 Findings

**F1 — One Toast link for five locations. [HIGH]**
`lib/content.ts` carries a single Toast URL, pointing at Carlsbad / Windmill Food Hall. A customer
standing in Little Italy or at UCSD who taps ORDER ONLINE is sent to a store they are not at. This
is both lost revenue and a bad-experience event at the exact moment of purchase intent.
*Fix:* per-location ordering. Either a location picker inside the ORDER ONLINE modal, or make the
modal location-aware. Requires the client to supply the other four Toast storefront URLs.

**F2 — Delivery is entirely unconnected. [HIGH]**
The client brief lists DoorDash and Grubhub but left both URLs as the literal word "Link". The build
degrades to a disabled "coming soon" tile rather than a dead link, which is correct behavior, but the
demand is simply unserved. Delivery is typically 20–40% of orders for this format.
*Fix:* obtain both storefront URLs. Confirm signed platform agreements exist first — see §3.6.

**F3 — Catering form drops every lead. [CRITICAL]**
No `NEXT_PUBLIC_FORMSPREE_ID`. The form validates fully, then shows an error directing the user to
email. A meaningful share of users will not re-type their request into an email client.
*Fix:* 15 minutes of work once the client provides a Formspree form id and a destination inbox.
Recommend a shared inbox (`catering@`), not a personal one, so leads survive staff turnover.

**F4 — Menus are 10MB and 3.6MB PDFs. [HIGH]**
Two problems. Commercially, a 10MB download on cellular is a conversion killer — many users will
abandon before the menu renders. For SEO it is worse: PDF menu content ranks poorly and effectively
contributes nothing to queries like "lobster roll near me" or "clam chowder Carlsbad", which are
exactly the high-intent searches this business needs to win.
*Fix:* short term, ask the client for web-optimized PDF exports. Medium term, render the menu as
HTML from structured data. `menus/food_menu.json` already exists for this — it just needs price
reconciliation against the current PDFs (the archive notes several stale prices).

**F5 — One page for five markets caps local SEO. [MEDIUM-HIGH]**
The one-pager was the right call for launch speed and matches the client's brief. But five locations
across two counties sharing a single URL means the site cannot rank locally in five markets. Each
location deserves its own indexable page tied to its Google Business Profile.
*Fix:* Phase 2. The archive's `docs/Lobster_Lab_Site_Structure.md` already specifies a `/[location]`
route template. Build it after launch, not before.

**F6 — No analytics. [MEDIUM]**
There is currently no measurement of any kind. We cannot tell how many people open the ORDER ONLINE
modal, how many abandon the catering form, or which location gets the most direction taps.
*Fix:* GA4 plus event tracking on the two modals and the form. **But read §3.7 first** — adding
trackers in California has its own legal exposure and should ship together with a consent banner.

**F7 — No email capture. [MEDIUM]**
The old SpotHopper site had a newsletter list, which is lost on migration. The new site has no
capture mechanism at all. For a restaurant group, owned email is the cheapest repeat-visit driver
and the only marketing channel not taxed by a platform.
*Fix:* add a capture point. Ship it with CAN-SPAM-compliant footer and consent — see §3.5.

**F8 — San Clemente is in Orange County. [LOW, but note it]**
Four locations are in San Diego County; Miramar Food Hall in San Clemente is Orange County. Local
permitting, health inspection, and some county-level rules differ. Relevant for location pages, local
SEO targeting, and any county-specific compliance posting.

### 2.3 What is genuinely working

- The build quality is high: static, fast, accessible-by-construction, no console errors.
- The brand execution is faithful to the client's own mockup, which reduces revision cycles.
- All copy is centralized in `lib/content.ts` with provenance, so content edits do not require a
  developer to touch components.
- Assets regenerate from a script, so the 101MB client library never has to enter git.
- Every unconnected integration degrades to a sensible state instead of a broken control. Nothing on
  the site currently lies to a customer.

---

## 3. Legal & compliance risk register

Jurisdiction: **California** (San Diego and Orange counties) plus federal. California is the most
aggressive US state for both website-accessibility and privacy litigation, and restaurants are a
favored target for both. This section is ordered by my assessment of real exposure.

### 3.1 Republished Google and Yelp reviews — **HIGHEST RISK** [COUNSEL]

The site publishes six reviews verbatim, each attributed to a named individual ("Joe Neyes", "Michele
Leocadio", "Rex S.", "Trayce T."), used to market the restaurant. Two distinct problems:

- **Platform terms.** Yelp's Terms of Service restrict copying and republishing review content
  outside Yelp's own official display widgets, and Yelp has historically enforced this. Google
  reviews are user-generated content owned by their authors, not by the business.
- **California Civil Code § 3344 — right of publicity.** Knowingly using another person's name in
  advertising without their prior consent creates statutory exposure, with a statutory floor of
  **$750 per violation** plus actual damages and attorney's fees. Six named reviewers used as
  endorsements is six potential claims.

The client supplied these quotes in their own brief, which explains how they got here, but that does
not transfer the risk.

**Recommended remediation, in order of preference:**
1. Replace with Yelp's and Google's **official embed widgets**, which are licensed for this purpose.
2. Obtain **written consent** from each named reviewer.
3. If neither is possible before launch: strip names to non-identifying form ("Google reviewer,
   Carlsbad") and remove the direct attribution. This materially reduces §3344 exposure, though the
   platform-terms question remains.

I would not launch with the current treatment without counsel signing off.

### 3.2 Website accessibility — ADA Title III + Unruh Act — **HIGH RISK** [COUNSEL]

California plaintiffs routinely bring website accessibility claims against restaurants. The **Unruh
Civil Rights Act** provides statutory damages with a **$4,000 minimum per offense**, and an ADA
violation is treated as an Unruh violation, which is why California sees a disproportionate share of
national filings.

**Current posture — better than most, not certified:**
- Built to WCAG 2.1 AA intent: semantic headings, alt text on every image, keyboard-operable
  controls, focus trapping in modals, visible focus rings, reduced-motion support.
- An accessibility statement page exists at `/accessibility` with a contact route for barriers.
- **But:** no formal third-party audit, no VPAT, and no assistive-technology testing with a real
  screen reader. Our verification was automated plus manual keyboard checks.

**Important:** publishing an accessibility statement is *not* a legal defense on its own. It helps
demonstrate good faith; it does not cure defects.

**Recommendation:** commission a formal WCAG 2.1 AA audit before or shortly after launch, remediate
findings, and keep dated evidence of the audit and remediation. That evidence record is the practical
value — it is what makes a demand letter cheaper to resolve.

**Also note:** the two menu PDFs are almost certainly **not accessible** (untagged, no reading order,
image-based text). Menus are core content. A PDF-only menu is a common and specific accessibility
complaint. This reinforces F4 — an HTML menu solves a legal problem and an SEO problem at once.

### 3.3 Privacy policy — CalOPPA — **HIGH RISK, EASY FIX** [COUNSEL]

The **California Online Privacy Protection Act** (Bus. & Prof. Code § 22575 et seq.) requires any
commercial website that collects personally identifiable information from California residents to
conspicuously post a privacy policy meeting specific content requirements.

**The catering form collects name, phone, email, event date, and party size. There is currently no
privacy policy on the site.** This is a straightforward, presently-existing compliance gap.

**Recommendation:** publish a privacy policy before launch, linked from the footer. It must cover
categories of PII collected, third parties it is shared with (Formspree, and Toast / DoorDash /
Grubhub / ezCater as offsite processors), the review-and-change process, the effective date, and how
the site responds to Do Not Track signals.

### 3.4 CCPA / CPRA — **DEPENDS ON A NUMBER WE DO NOT HAVE** [COUNSEL]

The CCPA as amended by CPRA applies to a for-profit business meeting **any one** of:
- annual gross revenue over **$25 million**; or
- buying, selling, or sharing personal information of **100,000+** consumers or households; or
- deriving **50%+** of annual revenue from selling or sharing personal information.

A five-unit restaurant concept in isolation is very unlikely to meet these. **However, the revenue
threshold is measured at the business-entity level, not per brand.** If Tiger Hospitality Group's
total gross revenue across *all* its concepts exceeds $25M, CCPA obligations attach to the group and
therefore to this site.

**Action required:** get a straight answer on THG's total annual gross revenue. This single number
determines whether the site needs a "Your Privacy Choices" link, consumer request intake, deletion
and access workflows, and a 12-month lookback disclosure. It is a materially different compliance
build. Do not guess.

### 3.5 Marketing communications — TCPA and CAN-SPAM — **MEDIUM** [COUNSEL]

- **Phone numbers.** The catering form collects a phone number as a required field. Using those
  numbers for marketing texts later requires **prior express written consent** under the TCPA, with
  statutory damages typically $500–$1,500 per message. The form currently has no consent language.
  *Fix:* add explicit, unbundled consent language, and keep the consent record. Note that consent
  for *transactional* follow-up about the specific catering request is a different and narrower
  thing than consent for *marketing* — do not conflate them.
- **Email.** Any marketing email needs a functioning unsubscribe and a valid physical postal address
  under CAN-SPAM. Relevant as soon as F7 is implemented.

### 3.6 Third-party delivery platforms — AB 2149 — **MEDIUM**

California's **Fair Food Delivery Act (AB 2149)** prohibits a food delivery platform from listing or
arranging delivery for a restaurant without an express written agreement. This protects the
restaurant, but it cuts both ways operationally: before we publish DoorDash and Grubhub links, confirm
signed agreements are in place and that the listed menus and prices on those platforms are current
and authorized. Publishing a link to an unauthorized or stale listing creates customer-facing pricing
and quality problems the restaurant will be blamed for.

### 3.7 Analytics, pixels and session tracking — CIPA — **EMERGING, TAKE SERIOUSLY** [COUNSEL]

There is currently **no** tracking on the site, which is why this is a future risk rather than a
present one. But F6 recommends adding analytics, so decide this before shipping it.

California has seen a large wave of litigation applying the **California Invasion of Privacy Act**
— including its pen register/trap-and-trace provisions — to ordinary web trackers, session replay
tools, and advertising pixels. Statutory damages are claimed per-violation and plaintiffs' firms are
filing these at volume against consumer-facing businesses.

**Recommendation:** if analytics or any ad pixel is added, ship it **behind a consent mechanism**
from day one, disclose it in the privacy policy, and avoid session-replay tooling entirely. Retro-
fitting consent after a pixel has been running is the expensive path.

### 3.8 Menu labeling — calorie disclosure — **NOT CURRENTLY APPLICABLE**

Federal menu labeling rules require calorie disclosure for restaurant chains with **20 or more**
locations operating under the same name with substantially the same menu. Lobster Lab has 5. **Not
required today.**

Flagging it as a growth trigger: if the concept passes 20 units, calorie disclosure becomes mandatory
on menus, menu boards, and — importantly — online ordering surfaces. Build the menu data model now
so a nutrition field can be added later without a rewrite. This is a cheap decision today and an
expensive one at unit 20.

### 3.9 Proposition 65 — **REVIEW** [COUNSEL]

California's Prop 65 requires warnings for listed chemicals. Two exposures are typical for this menu:
**mercury in seafood** and **acrylamide in fried foods**. For restaurants these warnings are normally
satisfied on-premises at point of sale rather than on a marketing website. Confirm the physical
locations are compliant, and ask counsel whether the online ordering surfaces (Toast/ezCater, which
we link to rather than host) shift any obligation.

### 3.10 Alcohol — ABC rules — **REVIEW** [COUNSEL]

The Sky Deck at Del Mar Highlands location carries a full cocktail, wine and beer list, unlike the
four food-hall stalls. California ABC regulates alcohol advertising, including restrictions on
content that encourages overconsumption. The site does not sell alcohol online, which keeps this
simple. Two points to confirm: that the Sky Deck menu PDF's alcohol content is acceptable as
advertising under ABC rules, and whether the client wants an age-gate on that PDF as a matter of
policy. Also ensure the site never implies alcohol availability at the four stalls that do not serve
it.

### 3.11 Pricing and fee disclosure — SB 478 / AB 1524 — **LOW, MONITOR**

California's "Honest Pricing Law" (SB 478) banned drip pricing; **AB 1524 subsequently exempted
restaurants**, provided mandatory fees are clearly and conspicuously displayed. Our site does not
display prices directly — it links the client's PDFs and hands checkout to Toast and ezCater — so
exposure is low and sits mostly with those platforms. Two hygiene items: keep the linked PDFs current
so advertised prices match what is charged, and ensure any service charge or catering fee is
conspicuously disclosed at the point it applies.

### 3.12 Photo and asset rights — **CONFIRM** [COUNSEL]

The site uses 10 photographs from the client-supplied brand library, shot 2023-05-25 by what appears
to be a commissioned photographer. **Obtain written confirmation that Tiger Hospitality Group holds
copyright or a license covering commercial web use in perpetuity.** Commissioned photography is not
automatically work-for-hire in the US; absent a written agreement transferring rights, the
photographer may retain copyright and the client may hold only a limited license. This is a
five-minute question to the client that prevents a real problem.

Same question applies to the "Lobster Lab" wordmark and any trademark registration status.

### 3.13 Jobs portal — **FUTURE** [COUNSEL]

The SpotHopper-hosted job listings portal is lost in the migration and has not been rebuilt. When it
is: California **SB 1162** requires pay scale disclosure in job postings, and standard EEO language
applies. Build this in from the start rather than retrofitting.

### 3.14 Domain and DNS control — **EXISTENTIAL, DEADLINE-DRIVEN**

Not a legal risk so much as a business-continuity one, but it outranks everything else on timing.
**SpotHopper access ends August 1, 2026 — three days from this report.** If SpotHopper currently
manages `lobsterlab.us` DNS, control must be moved to a registrar Tiger Hospitality Group owns
*before* that date. Losing DNS control means losing the domain, the email, and every inbound link and
local-SEO signal the business has accumulated.

**This is the one item where a missed deadline is not recoverable by working harder afterwards.**

---

## 4. Action plan for K13

### P0 — before August 1 (3 days)

| # | Action | Owner | Blocker |
|---|---|---|---|
| 1 | **Confirm and secure DNS control of lobsterlab.us** | K13 + client | Client registrar access |
| 2 | Deploy to Vercel, point domain, verify 301s on the live host | K13 | P0-1 |
| 3 | Get Formspree id + `catering@` inbox → connect the form | K13 | Client |
| 4 | Get the 4 missing Toast URLs + DoorDash/Grubhub URLs | Client | — |
| 5 | Export any remaining SpotHopper data (subscribers, form submissions) | Client | Hard deadline |

### P1 — launch week

| # | Action | Why |
|---|---|---|
| 6 | **Resolve the reviews issue** (§3.1) — switch to official embeds or genericize | Highest legal exposure |
| 7 | Publish privacy policy + terms of use, linked in footer (§3.3) | Presently non-compliant |
| 8 | Add TCPA consent language to the catering form (§3.5) | Cheap now, expensive later |
| 9 | Confirm photo rights and THG total revenue for CCPA scoping (§3.4, §3.12) | Two questions, both blocking |
| 10 | Per-location ordering in the ORDER ONLINE modal (F1) | Direct revenue |

### P2 — first month

| # | Action | Why |
|---|---|---|
| 11 | Analytics + consent banner, shipped together (F6, §3.7) | Cannot optimize what we cannot measure |
| 12 | Web-optimized menus, then HTML menu from structured data (F4) | Conversion + SEO + accessibility, one fix |
| 13 | Formal WCAG 2.1 AA audit + remediation, keep dated evidence (§3.2) | Litigation posture |
| 14 | Email capture with compliant consent (F7) | Only untaxed marketing channel |

### P3 — quarter

| # | Action | Why |
|---|---|---|
| 15 | Per-location pages on the `/[location]` template (F5) | Five local markets, five ranking surfaces |
| 16 | Google Business Profile linkage per location | Local pack is where this business is found |
| 17 | Headless CMS so the client edits copy without K13 | Reduces K13's maintenance load |
| 18 | Nutrition field in the menu data model (§3.8) | Cheap now, mandatory at 20 units |

---

## 5. Scoring

| Dimension | Score | Note |
|---|---|---|
| Build quality | 88/100 | Static, fast, clean, no errors. Verified. |
| Brand fidelity | 90/100 | Faithful to the client's own mockup |
| Commercial wiring | 35/100 | 3 of 4 revenue paths disconnected |
| SEO foundation | 45/100 | One page, five markets, PDF menus |
| Legal & compliance | 40/100 | No privacy policy; reviews exposure; no formal a11y audit |
| Measurement | 10/100 | None |
| **Overall business readiness** | **62/100** | Good asset, unfinished go-to-market and compliance layer |

The gap between build quality (88) and business readiness (62) is the honest headline. K13 delivered
a good website. It is not yet a working commercial instrument, and most of what is missing is
client-supplied inputs and a compliance layer rather than engineering.

---

## 6. The three questions to ask the client first

Everything else follows from these:

1. **Who controls the DNS for lobsterlab.us right now, and can we prove it before August 1?**
2. **What is Tiger Hospitality Group's total annual gross revenue?** (Determines CCPA scope.)
3. **Do you hold written copyright assignment for the 2023 photography, and did you obtain permission
   from the named reviewers?**
