# Lobster Lab — client asset gap analysis

**Date:** 2026-07-30 · **Author:** K13
**Question asked:** re-read `LOBSTER LAB Assets/` against the site plan in it — what did we miss,
how do we include it, and why did we miss it?

---

## Summary

One file in the client library was **never opened**: `LOBSTER LAB - WEBSITE IDEAS.pptx` — 7 slides,
12 competitor reference screenshots. It is the client's original content brief, and it is broader
than the site we built.

Most of the delta is legitimate scope narrowing between a brainstorm and a final design. **One item
is a genuine functional regression**, and it is corroborated three independent ways.

---

## What the deck is, and when it is from

`LOBSTER LAB - WEBSITE IDEAS.pptx` — titled "WEBSITE / LOBSTER LAB / IDEAS". Each slide pairs a
content category with "See reference" screenshots of competitor sites: Cousins Maine Lobster,
Pacific Catch, Poke House, Avocalia.

**Dating it matters.** The browser clocks visible in those screenshots read **25/08/2025** (one
reads 29/07/2025). So the deck is from **August 2025** — roughly eleven months before
`LOBSTER LAB WEBSITE.pdf`, the finished visual mockup we actually built from.

That makes the chain: **ideas deck (Aug 2025) → visual mockup + structure docx (2026) → our build.**
The deck is upstream, and mostly superseded. But "mostly" is doing real work in that sentence.

### Deck contents, slide by slide

| Slide | Category | Asks for | References |
|---|---|---|---|
| 2 | Content map | About us · Order · **Events & Catering** · Menu · Locations | — |
| 3 | Homepage | Tagline · quick links (Order Online / Menu / Locations) · banner of items · locations + hours | Cousins Maine Lobster |
| 4 | Menu | Category list: Rolls, Feeling Truffly, Tuna Melt, Lobster Bisque, Clam Chowder, Smoked Salmon, Salad, Grilled Cheese, Caviar, Sides | Poke House (category tabs + item cards with ingredients), Cousins (single-item showcase with copy + CTA) |
| 5 | About us | Values · **Our story** · **Team intro (chef / founders / team)** | Cousins ("Learn more about our lobster's origins" — interactive sourcing map), Pacific Catch about-us |
| 6 | Order | Delivery-app integration **or in-house ordering system** · locations, address & hours | Avocalia (in-house cart), Pacific Catch (locations grid, photo per location, "READ MORE") |
| 7 | **Events & Catering** | **"Book Lobster Lab for private parties, corporate events, weddings"** · showcase trays, bulk orders, customised bites | Pacific Catch "catering-and-parties — YOUR PLACE OR OURS?", Cousins catering inquiry form |

---

## The delta against what we shipped

| Deck asks for | Shipped | Verdict |
|---|---|---|
| Values (3) | ✅ exactly as specified | built |
| Locations + hours | ✅ 5 cards, hours, directions | built |
| Order via delivery apps | ✅ per-location modal | built |
| Menu | ⚠️ two PDF links only | **narrowed** |
| Tagline on the homepage | ⚠️ present only as `sr-only` + meta | **narrowed** |
| Quick links row | ⚠️ folded into the nav | narrowed, fine |
| **Our story** | ❌ nothing | **missing** |
| **Team intro (chef / founders)** | ❌ nothing | **missing** |
| **Events / private parties** | ❌ nothing | **REGRESSION — see below** |
| In-house ordering system | ❌ nothing | correctly dropped |
| Per-location detail pages | ❌ address cards only | already on the roadmap (P5) |

---

## The one that actually matters: private parties

This is not "an idea from a brainstorm that didn't make the cut". Three independent sources in this
repository say it should exist, and it does not:

1. **The ideas deck, slide 7** — "Book Lobster Lab for private parties, corporate events, weddings."
2. **The old site had it.** `pages/content_archive.md` records a live page headed *"Group
   Reservations and Private Parties"* with a SpotHopper booking embed.
3. **`data/external_services.json`** marks *"Private parties / group reservations form"* as
   `lost_on_migration: true`.

And most damningly, **the repo's own rebuild blueprint already instructed us to do it.**
`docs/Lobster_Lab_Site_Structure.md` says, verbatim:

> This embed is SpotHopper-hosted and will be lost — **replace with a form in the rebuild.**

We rebuilt the catering inquiry form, which was flagged the same way in the same file. We did not
rebuild the private-parties form. So a guest who wants to book a group booking or a private event —
the highest-value single transaction a restaurant takes — has no path on the new site, and had one
on the old.

That is a real loss of function, not a deferred nice-to-have.

---

## Why we missed it

Honestly, and specifically, because there are lessons in it:

1. **I built from the mockup and the structure docx because they agreed with each other and were
   precise.** The docx specifies exact copy, exact form fields, exact modal behaviour. Two
   authoritative sources in agreement felt like sufficient ground truth. It was not — it was
   sufficient to know *what the site should look like*, not *what the client had asked for*.

2. **A finished visual design answers a different question than a brief.** The mockup answers "what
   does it look like". The deck answers "what should it do". Requirements quietly fall out during
   design, and nobody notices, because the artefact that lost them looks complete.

3. **The pptx was listed in my own asset inventory and I still never opened it.** `CLAUDE.md`
   enumerates the library including `LOBSTER LAB - WEBSITE IDEAS.pptx`. I inventoried it and then
   treated it as context rather than as a source. Cataloguing a file is not reading it.

4. **The private-parties instruction was sitting in the repo's own blueprint.** I read
   `docs/Lobster_Lab_Site_Structure.md` §6 for architecture and treated the rest of that document as
   superseded by the client's newer one-pager brief. In doing so I discarded a *functional*
   requirement along with the *structural* one. Those are separable, and I did not separate them.

The generalisable rule: **when a newer brief narrows an older one, enumerate what was dropped and
confirm the drop is intentional.** Silence in a newer document is not a decision.

---

## How to include what is missing

Ordered by value.

### 1. Private parties — restore the lost function

The cheapest correct fix reuses what already exists. The catering modal is already a two-option
pattern (order via ezCater / send an inquiry). Private parties is the same shape:

- Add a third path to the existing **ORDER CATERING** modal, or split it into a
  **"Catering & Events"** modal with two intents: *Catering order* and *Private party / group booking*
- The inquiry form already collects name, phone, email, party size, date, time, occasion and
  service type. A private-party enquiry needs the same fields plus **location** (which of the five)
  and drops "pickup or delivery"
- Occasion already offers Corporate Lunch / Celebration / Family Event / Wedding — the deck's exact
  language. The vocabulary is already there; only the entry point is missing
- Copy can come straight from the deck: *"Book Lobster Lab for private parties, corporate events
  and weddings."*

Estimated effort: small, because the form, the modal shell and the occasion vocabulary all exist.

### 2. Our story + team

Genuinely absent, and genuinely missing from the mockup too — so this needs a client decision, not
just a build. Two options:

- **Minimal:** extend the existing `#about` section with 2–3 paragraphs of origin story. No new
  photography needed, no layout invention.
- **As the deck imagined it:** a sourcing/story block in the spirit of the Cousins reference. Needs
  copy from the client and ideally a founder or kitchen photo. The 2023 shoot has chef-at-work
  frames (the plating and pouring shots) that would carry it.

**Ask the client which, and for the copy.** Do not invent an origin story — it is the one kind of
content that must come from the operator.

### 3. Menu categories on the page

The deck's Poke House reference wants a browsable menu with categories and item cards. This is
already recommended in the business report and sits at plan P5 for SEO and accessibility reasons —
the deck independently corroborates it as the client's original intent, which strengthens the case.

`menus/food_menu.json` already holds the four sections and 20 items. The deck's category list
(Rolls, Feeling Truffly, Tuna Melt, Bisque, Chowder, Smoked Salmon, Salad, Grilled Cheese, Caviar,
Sides) maps onto it almost exactly. Prices need reconciling against the current PDFs first.

### 4. Visible tagline

*"Seafood. Lobster Rolls. Fresh Ingredients. Everyday. Catch the Vibe."* is in the brand guide and
in the deck's homepage slide, but on our site it exists only for screen readers and in the page
metadata. It is the brand's own line and it is invisible. Small fix, real brand value: surface it in
the hero or directly beneath it.

### 5. Not recommended

- **In-house ordering system** (Avocalia reference) — Toast already does this and the client pays for
  it. Building a parallel cart would be a serious mistake.
- **Per-location detail pages** — already planned at P5; no change needed.

---

## What this changes in the plan

`tasks/todo.md` lives on the unmerged `lobster_jul29_v3` branch. When that lands, add:

- **P1/P2 — private parties path** (small, restores lost function, corroborated three ways)
- **P5 — visible tagline** (small)
- **Client questions — our story copy + team photo decision** (blocked on client)
- The menu-as-HTML item at P5 already covers item 3; annotate it with this corroboration

Two items have been parked in the machine-level `pending` ledger so they survive regardless of which
branch is checked out.
