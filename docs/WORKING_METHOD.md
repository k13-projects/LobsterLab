# How we worked on Lobster Lab

> Written 2026-07-29, at the end of the build, while the detail was still fresh.
> This is the loop that produced the site — recorded so it can be repeated, not
> re-derived. Portable pieces have been lifted into the `fitcheck` house skill;
> what stays here is the shape of the collaboration.

---

## The short version

**Read the real source → build → measure → look → fix at the source → re-measure
→ say what you did not test.**

Every defect that mattered was found by *measuring something*, not by reading
the code and reasoning about it. Every one of them was invisible in the diff.

---

## 1. Start from the client's own artefacts, not the summary

The repo already contained a structure doc describing an 8-route site. The
client's actual design files described a one-pager. Building from the summary
would have produced the wrong site — correctly, and on time.

What we did instead:

- Rendered the client's design PDF to PNG and **looked at every slice** before
  writing a line of layout
- Extracted the raw text from their `.docx` rather than trusting a paraphrase
- Established an explicit precedence rule: **the client's design files beat the
  archive**, because the archive describes the old site
- Recorded that rule in `CLAUDE.md` so the next session does not re-litigate it

Result: the hero photo, the four menu-strip photos and the vertical MENU
wordmark are the client's exact choices, because we could see them.

**Rule: when a design exists, open it. A described design is a different design.**

---

## 2. Content gets a provenance field, always

Every string on the site lives in `lib/content.ts` with a comment saying where
it came from and which source wins on conflict. Prices, hours and addresses
disagreed between the archive JSON and the client docx — without provenance,
each session would re-guess.

**Rule: captured data carries `captured_on` / `source_url`. Rebuilt content
carries a note on which source it beat.**

---

## 3. Missing inputs get a harness, never a placeholder that lies

Three integrations were blocked on the client (Formspree id, four Toast URLs,
DoorDash/Grubhub). None of them blocked the build:

- The data model was built for the real shape — **per-location** ordering, not
  one global link, because five locations sharing one storefront link was a
  business bug regardless of whether the URLs had arrived
- An unset value renders an honest "coming soon", never a dead control
- Connecting them later is one edit to one file, no component changes
- `.env.example` and `tasks/todo.md` name who owns each unblock

**Rule: a half-wired site must never lie to a customer. Degrade visibly.**

---

## 4. Measure, then look. Both, every time.

This is the core of the method and it is not optional.

| Found by measuring | Would never have been noticed by eye |
|---|---|
| Footer links 20px tall — 4px under the WCAG 2.5.8 AA floor | yes |
| Nav labels 23px — **1px** under the floor | yes |
| Intro copy at 78 characters per line at 768px | yes |
| "Locations" at 72px outranking the 68px page headline | yes |
| Carousel resting at `scrollLeft: 20`, not 0 | yes |

| Found by looking | Would never have been caught by a number |
|---|---|
| The citrus icon reading as a folded fan | yes |
| The "hand seasoning a bowl" reading as a leaf | yes |
| The catering modal opening mid-form | measurable, but only once *looking* said "why is this wrong" |

The two together caught things neither would alone. **Read every screenshot you
take.** A screenshot you did not open is a file, not a test.

---

## 5. Fix the cause, not the number

When nav labels measured 23px, the lazy fix is `min-h-[24px]` and move on. The
real question is *why 23* — a font step-down at `md` that we had introduced one
commit earlier. Both got fixed, and the comment in the code says why the
minimum exists so nobody "cleans it up" later.

Same for the carousel: the symptom was a button that never disabled. The cause
was that `snap-start` rests the rail at `padding-left`, not 0. A magic number
would have worked at one breakpoint and broken at the other.

**Rule: every non-obvious constant in the codebase carries a comment explaining
the measurement that produced it.**

---

## 6. Verification is a before/after pair, not an adjective

Nothing here was reported as fixed without the two numbers:

```
catering modal, 375x667
  before: scrollHeight 667 == clientHeight 667, title top -543px  (unreachable)
  after:  scrollHeight 1238 >  clientHeight 667, title top 28px   (visible)

landscape hero, 844x390
  before: next section visible 0px
  after:  next section visible 92px
```

The consent gate was proven the same way — `gtag` `undefined` before consent,
`function` after Allow, `undefined` after Decline — rather than described as
"consent-gated".

**Rule: "fixed" without a before/after pair is a claim. Paste the pair.**

---

## 7. Say what you could not test

Two things could not be verified in this environment and both are written down
rather than glossed:

- The `prefers-reduced-motion` **runtime** branch — the browser harness blocks
  `Emulation.setEmulatedMedia`. The CSS was confirmed to ship; the JS path that
  skips Lenis is inspection-only.
- The vector wordmark — the supplied EPS is binary with only a TIFF preview and
  no PDF stream, and no renderer was available. The PNGs are used instead and
  the gap is on the client list.

**Rule: an untested area reported as passing is worse than no report.**

---

## 8. Agents: split by lens, audit only, verify their findings

What worked:

- **Split by device tier and by lens simultaneously** — QA engineer on small
  phones, designer on tablet with the mockup open, front-end on desktop. Same
  page, three different readings.
- **Agents audit; they do not edit.** Three agents editing the same components
  in parallel clobber each other. They return measurements, screenshots and
  exact diffs; one hand applies them.
- **Tell them what is already known and being fixed**, so their budget goes on
  new ground.
- **Verify every finding before acting on it.** The agents self-corrected two
  false positives — a mismeasured section gap, and a "focus restore is broken"
  report that was really an artifact of `element.click()` not focusing the way a
  real pointer event does. They were right wherever they had double-checked and
  wrong exactly where they had not. So the standard is: reproduce it yourself,
  then fix it.

What bit us:

- **The browse daemon is shared between parallel agents and is not isolated.**
  Both agents and the main session independently caught another session's
  viewport bleeding in. One sweep produced five phantom failures.
  Every measurement now asserts `window.innerWidth` in-band before it is
  trusted. This is baked into `fitcheck`'s harness as a `TRUST` gate.
- **The subagent API returned `529 Overloaded` seven times in a row** at one
  point. The correct response was to stop retrying and do the work directly,
  then re-run the agent version later — not to stall, and not to pretend the
  agent output existed.

---

## 9. Ship in reviewable slices

Branch → documented commit → PR → merge, never straight to `main`. Commits carry
the measurement in the body, so the reason for a one-line class change survives
in `git log` — where the next person actually looks.

Every phase of work ended with the plan file updated, so `tasks/todo.md` is
always the current truth and blocked items sit visibly in their phase with the
owner of the unblock named.

---

## 10. What took longer than it should have

Honest post-mortem, because the point is to be faster next time:

- **Two rebuild cycles were lost to a stale server.** `next start` renames its
  process to `next-server`, so `pkill -f "next start"` silently misses it and
  keeps serving the previous build. Fixes looked like they did nothing. Now
  documented in `CLAUDE.md`; the check is "does the new markup appear in
  `curl`", not "did the build succeed".
- **Icons were redrawn three times** because the source was raster-only. Asking
  the client for SVG on day one would have cost one email.
- **The measurement JS was retyped for each sweep**, and that is where both
  measurement errors came from. It is now one shared file in `fitcheck`.
- **Agents were launched before the environment was proven.** Playwright's
  Chromium was not installed; the first browser call failed. Check the tool
  chain before spending agent budget on it.

---

## The named house command

The responsive work in section 4 recurs in every project, so it is now a skill:

**`fitcheck`** (short: `fit`) — `~/.claude/skills/fitcheck/`

Nine viewports, a shared measurement harness with a trust gate, and the specific
bug classes that only appear at one size. See the skill for the full spec.
