# Lessons & Workflow Rules — K13

> How Claude/Cursor should operate on Kazim's (K13) projects. Review at session start.
> Author/owner of this project: **Kazim** (aka K13, Kazimiro, Kazim Anil Korkmaz).
> Halil, Memo (MCS) and Volkan are EDISYN-only collaborators — do not attribute this project's work to them.

## Workflow orchestration
1. **Plan mode default** — enter plan mode for any non-trivial task (3+ steps or architecture). If it goes sideways, STOP and re-plan. Write detailed specs upfront.
2. **Subagent strategy** — use subagents liberally to keep the main context clean. Offload research, exploration, parallel analysis. One task per subagent. Throw more compute at hard problems.
3. **Self-improvement loop** — after ANY correction from Kazim, add the pattern to this file. Write rules that prevent the same mistake. Review at session start.
4. **Verify before done** — never mark complete without proving it works (tests, logs, diffs). Ask: "Would a staff engineer approve this?"
5. **Demand elegance (balanced)** — for non-trivial changes, pause: "is there a more elegant way?" If a fix feels hacky, redo it properly. Skip for obvious fixes — don't over-engineer.
6. **Autonomous bug fixing** — given a bug, just fix it. Point at logs/errors/failing tests, then resolve. No hand-holding.

## Task management
1. Plan first → write to `tasks/todo.md` with checkable items.
2. Verify the plan before implementing.
3. Track progress — check items off as you go.
4. Explain changes — high-level summary at each step.
5. Document results — add a review section to `tasks/todo.md`.
6. Capture lessons — update this file after corrections.

## Core principles
- **Simplicity first** — every change as simple as possible; minimal code impact.
- **No laziness** — find root causes; no temporary fixes; senior-developer standard.
- **Minimal impact** — only touch what's necessary; don't introduce bugs.

## UX rule #1
> Never assume the user knows what to do. Always guide them — but stay minimal.
Every screen/form/modal answers "what do I do next?" Helper text, clear empty states, actionable errors. Minimal ≠ silent.

## The Hail Mary
On `hail mary` / `hm` (or `hail mary that shit` / `hm pls`): new branch → commit the whole session as a documented grouped-bullet record → `git push -u`. `hm-1` = skip the branch; `hm++` = also `gh pr create` + `gh pr merge <n> --merge` (real merge, no squash/rebase, no `--delete-branch`, keep every branch). Plain hail mary stops after push. Full spec in `HAIL_MARY.md`.

## Learned patterns
> Add entries here after corrections from Kazim.

### Shipping — corrected by Kazim 2026-07-30
0. **Never run `hm` / `hm-1` / `hm++` on your own initiative.** Branch → PR → merge is always the
   *mechanism* — that part was never in question and no commit has ever landed on `main` outside a
   PR. What is not yours to decide is *when to pull the trigger*. Build the work, push a branch if
   useful, then stop and report. Kazim says `hm` / `hm++`. Merging to `main` is his call, every time,
   including for changes that look obviously safe.

### Verification
1. **"Fixed" needs a before/after pair.** Paste both numbers. An adjective is a claim, not a result.
   Example: `scrollHeight 667 == clientHeight 667, title at -543px` → `scrollHeight 1238 > 667,
   title at 28px`.
2. **A dead server measures as flawlessly clean.** Every check returns zero because there is
   nothing to check, and that reads as a pass. Assert the page actually loaded before trusting any
   sweep — `curl` the URL, and check the DOM has content.
3. **`next start` renames its process to `next-server`.** `pkill -f "next start"` misses it and the
   stale server keeps serving the previous build, so fixes look like they did nothing. Cost two
   cycles. Use `pkill -f next-server`, then verify the new markup is actually served with `curl`.
4. **Say what you could not test.** An untested area reported as passing is worse than no report.

### Measurement
5. **Measure AND look — both, every time.** Numbers miss "this is ugly" (an icon reading as a
   folded fan). Eyes miss "1px under the AA floor". Read every screenshot you take; a screenshot
   you did not open is a file, not a test.
6. **Fix the cause, not the number.** A 23px tap target is not fixed with a magic minimum — find
   the font step-down that caused it. Then comment the constant with the measurement that produced
   it, so nobody "cleans it up".
7. **Never retype measurement code.** Both measurement errors in the Lobster Lab pass came from
   re-typing assertions per sweep. Shared harness: `~/.claude/skills/fitcheck/measure.js`.

### Agents
8. **Agents audit; one hand edits.** Parallel agents editing the same files clobber each other.
   They return measurements, screenshots and exact diffs.
9. **Split agents by device tier AND by lens** (QA / designer / front-end) so the same page gets
   several independent readings.
10. **Verify every agent finding before acting.** They self-correct, but they are wrong exactly
    where they did not double-check. Reproduce it yourself first.
11. **The browse daemon is shared between parallel agents and is NOT isolated.** Viewports and tabs
    bleed across sessions — this produced five phantom failures in one sweep. Assert
    `window.innerWidth` in-band inside every measurement.
12. **When the subagent API fails repeatedly (529), stop retrying and do the work directly.** Seven
    consecutive failures cost real time. Re-run the agent version later; never stall, never imply
    agent output exists when it does not.
13. **Prove the toolchain before spending agent budget on it.** Playwright's Chromium was not
    installed and the first browser call failed.

### Build
14. **Open the client's actual design files.** A described design is a different design. Render the
    PDF, extract the docx, look at every slice before writing layout.
15. **Missing third-party values get a harness, not a lying placeholder.** Unset renders an honest
    "coming soon"; connecting later is one edit to one file.
16. **Scroll-reveal content must not depend on JS to be visible.** Hide only under a `.js` class set
    by an inline head script, or a JS failure blanks the page.
17. **Ask for vector assets on day one.** Icons were redrawn three times because the source was
    raster-only inside a PDF.
