# Lobster Lab — UI/UX Audit & Optimization

**Date:** 2026-07-29 · **Build audited:** `b43f86e` + fixes on `lobster_jul29_v3`
**Method:** live headless-Chromium testing at 8 viewports, DOM measurement via
`getBoundingClientRect`, plus visual review of every captured screenshot.

> **How this was run.** The plan was three parallel agents, one per device tier. The subagent API
> returned `529 Overloaded` on seven consecutive launches, so this audit was performed directly
> instead. Coverage is the same; the three-tier structure is preserved. The multi-agent version can
> be re-run when the API recovers — it would add breadth (more viewports, more adversarial passes),
> not different conclusions on what is recorded here.

**Viewports tested:** 360×800, 375×667, 390×844, 430×932, 844×390 (landscape), 768×1024, 1024×768,
1440×900, 1920×1080.

---

## 1. Headline result

| Tier | Score | Note |
|---|---|---|
| Mobile (360–430) | **88/100** | was 72 before the modal fix below |
| Tablet / small laptop (768–1280) | **85/100** | weakest tier; the 768–1023 band is the soft spot |
| Desktop / wide (1440–1920) | **90/100** | strongest tier, closest to the mockup |
| **Overall** | **88/100** | |

**One launch-blocking defect was found and fixed.** Details in §2.

---

## 2. Critical finding — catering modal was unusable on mobile *(FIXED)*

**Severity: critical. Commercial impact: total loss of the highest-margin conversion path on mobile.**

On a 375×667 phone the ORDER CATERING modal opened showing the *middle* of the form. Measured:

```
dialog height        1238px
viewport height       667px
container scrollHeight 667px   <-- equal to clientHeight
container clientHeight 667px
container scrollTop      0     <-- cannot go negative
modal title top       -543px   <-- above the viewport, permanently
```

Because the scroll container used `align-items: flex-end` directly, everything overflowing the
*start* edge was stranded: `scrollTop` cannot go below zero, so the browser reported nothing to
scroll. The user could not reach:

- the **"Order on ezCater" CTA** — the primary catering conversion path
- the modal title and subtitle
- the **Name, Phone and Email fields** — all three are required

The form was therefore impossible to submit on a phone. It would fail validation on fields the user
had no way to see. This affected every phone viewport, since the form is 1238px tall.

**Fix** (`components/Modal.tsx`): moved centering off the scroll container onto an inner
`min-h-full` flex wrapper, so the wrapper grows past the viewport and the panel top stays scrollable
into view. Also added an explicit `scrollTop = 0` on open and `focus({ preventScroll: true })` so the
panel always opens at its header.

**Verified after fix:**
```
container scrollHeight 1238px  scrollable: true   scrollTop: 0
modal title top          28px  visible: true
ezCater CTA top         146px  visible: true
```

---

## 3. Other defects found and fixed

| # | Defect | Measured | Fix |
|---|---|---|---|
| 2 | Footer nav links below minimum target size — **WCAG 2.5.8 AA failure** | 49×**20**px, 51×20, 55×20, 71×20 (AA floor is 24×24) | `Footer.tsx` — `inline-flex min-h-[24px] px-2 py-1.5` |
| 3 | Email link in contact block same failure | 123×**20**px | same treatment |
| 4 | Hamburger button under the 44×44 touch guideline | 42×42px | `Nav.tsx` — `h-11 w-11` (44×44) |
| 5 | Heading hierarchy inverted at desktop — "Locations" outranked the page's opening statement | Locations **72px** vs Intro **68px** @1440 | `Locations.tsx` — cap at `sm:text-6xl` (60px) |
| 6 | Vertical rhythm ran on three different values | intro 112px / sections 96px / values 80px @1440 | `Intro.tsx` — `lg:py-24` to match the 96px system |

**Post-fix verification, all viewports:** zero targets under 24×24, zero horizontal overflow, H2
scale now reads 68 → 60 → 60 → 36 (correct descending hierarchy), section rhythm uniform at 96/96,
no console errors, Escape and focus-restore still working in both modals.

---

## 4. Section scores

Score per section, per tier. Where a fix from §2–3 applied, the score shown is post-fix.

| # | Section | Mobile | Tablet | Desktop | Notes |
|---|---|---|---|---|---|
| 1 | Nav / header | 88 | 78 | 90 | tablet is the weak point — see F-A |
| 2 | Hero | 92 | 88 | 90 | correct mockup image, `priority` loaded, no CLS |
| 3 | Intro | 90 | 80 | 92 | tablet line length runs long — see F-B |
| 4 | Values | 85 | 90 | 88 | icons are redrawn SVG, not the client's raster set — see F-D |
| 5 | Menu section | 82 | 85 | 92 | desktop vertical wordmark matches the mockup exactly |
| 6 | Menu photo strip | 90 | 88 | 92 | clean 2×2 → 4-across |
| 7 | Catering | 90 | 90 | 90 | consistent across tiers |
| 8 | Locations | 92 | 88 | 88 | 5 cards into a 3-col grid leaves an orphan row — see F-C |
| 9 | Roll strip | 85 | 85 | 88 | fixed 2048×1152 aspect gets thin on narrow screens |
| 10 | Reviews | 84 | 82 | 88 | carousel works; watermark is tasteful |
| 11 | Footer / Contact | 88 | 86 | 88 | post tap-target fix |
| 12 | ORDER ONLINE modal | 92 | 90 | 92 | clear pickup/delivery split |
| 13 | ORDER CATERING modal | 90 | 90 | 92 | post critical fix; was 45 on mobile |

---

## 5. Open recommendations (not yet applied)

**F-A — the 768–1023px nav gap. [MEDIUM]**
Desktop nav links appear only at `lg` (1024px). Between 768 and 1023 the header carries only the
wordmark, an ORDER ONLINE button and a hamburger, leaving a wide empty middle. iPad portrait is a
real traffic segment for restaurant browsing.
*Recommendation:* drop the nav-link breakpoint to `md` (768px), or tighten link spacing so five links
fit. Low risk, visible gain.

**F-B — line length at tablet. [LOW-MEDIUM]**
Intro body copy measures **78 characters** per line at 768px (comfortable range is 45–75), spanning
the full 704px column. Mobile is 39 and desktop 68, both fine.
*Recommendation:* add `max-w-prose` or a `md:max-w-[62ch]` cap to the intro body.

**F-C — Locations orphan row. [LOW]**
Five cards in a three-column grid leave two cards alone on the last row at desktop, and one alone at
tablet. Not wrong, but it reads unfinished.
*Recommendation:* either a 2-3 split with the first row wider, or center the trailing row. Cosmetic.

**F-D — value icons are approximations. [LOW, but tell the client]**
The client's mockup shows three specific orange line icons. Those were supplied only as raster inside
a PDF, so they were redrawn as SVG. The citrus wedge and seal read well; the "hand seasoning a bowl"
is the weakest of the three and reads more like a pinch than a hand at 88px.
*Recommendation:* ask the client's designer for the three icons as SVG. Five-minute request, exact
brand fidelity.

**F-E — roll strip aspect on narrow screens. [LOW]**
The band is locked to the source 2048×1152 ratio, so at 375px wide it renders roughly 211px tall and
the four rolls become small.
*Recommendation:* allow a taller crop on mobile via `aspect-[4/3] sm:aspect-[2048/1152]`.

**F-F — menu section left edge at small widths. [LOW]**
The MENU heading sits 12px left of the section grid (`-ml-3`) at mobile and tablet. At desktop the
`-ml-14` bleed is a deliberate, legible design gesture. At 375–768 a 12px offset is too small to read
as intentional and instead looks like a misalignment.
*Recommendation:* drop the negative margin below `lg`.

---

## 6. What is genuinely strong

- **Zero horizontal overflow at every viewport tested**, including 360px. Rarer than it should be.
- **Body copy is 17px mobile / 18px desktop**, and every form input is 16px — so iOS never zooms on
  field focus, which is a common and jarring mobile-form defect.
- **The hero is the exact shot from the client's mockup**, and the four menu-strip photos are the
  exact four from the mockup, in order.
- **Modals are properly accessible**: focus trapped, Escape closes, focus restores to the trigger,
  background scroll locked without layout shift.
- **The desktop menu section reproduces the mockup's vertical MENU wordmark faithfully** — this was
  the highest-risk piece of the design to rebuild and it landed.
- **No console errors** at any viewport. The only warning is a known-benign Next.js hero preload
  notice.

---

## 7. Priority order for the remaining work

1. **F-A** nav gap at 768–1023 — most visible, affects a real traffic segment
2. **F-D** request SVG icons from the client — free brand fidelity
3. **F-B** cap intro line length at tablet
4. **F-E** roll strip mobile aspect
5. **F-F** menu left edge below `lg`
6. **F-C** locations orphan row — purely cosmetic, do last

None of these are launch blockers. The one that was, is fixed.
