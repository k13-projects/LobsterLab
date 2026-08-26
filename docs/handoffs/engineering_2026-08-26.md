# Engineering handoff, Lobster Lab catering: mailto-first mode + ship

**Agent:** Mariana (backend-integrations-engineer), continuation of `backend_2026-08-19.md`
**Date:** 2026-08-26
**Branch:** `lobster_aug26_v1`

## Status
PASS

## Summary
Kazim's call, executed today: until the Resend key exists, the catering form's mailto path is
the DESIGNED flow, not an apology. Submitting now opens the visitor's mail app with the whole
inquiry pre-filled and shows a confident "Your inquiry is ready, just press Send there"
confirmation; zero error language. The panel decides its mode by asking a new `GET
/api/catering` probe (answers from the same env vars POST checks, boolean only, no secrets),
so setting the three Vercel env vars + redeploy flips the form to direct Resend sending with
no code change; the mailto stays as the failure net forever. This ships together with the
2026-08-19 Resend endpoint work that had been left uncommitted for Kazim's decision.

## Files
- app/api/catering/route.ts (GET mode probe added; POST unchanged)
- components/CateringPanel.tsx (mode probe, mailto-first submit, "mailed" confirmation
  screen with a Reopen-the-draft link; honeypot now short-circuits both modes)
- plus everything from backend_2026-08-19.md (route, env docs, privacy disclosure, resend dep)

## Verification
- `npx tsc --noEmit` clean; `npm run build` clean (12 static + 1 dynamic route).
- Chrome gate on the built server (:9154, killed after): `GET /api/catering` →
  `{"configured":false}`; full form fill → submit → "YOUR INQUIRY IS READY" screen renders
  on-brand, Reopen link carries every typed field (subject "Catering inquiry: K13 Test",
  body with name/phone/email/party/date/time/description), plain `info@lobsterlab.us`
  fallback present, zero console errors. Screenshot in the War Room session log.
- Em-dash sweep on touched files: zero.

## Risks
- Mailto depends on the visitor having a mail client wired to their browser; the confirmation
  screen's "Reopen the draft" and plain-address fallback cover the miss case, and the phone
  number in the header remains the human backstop.
- Everything from backend_2026-08-19.md's Risks section still applies (logo 404 until the
  domain is live; rate limiter per warm instance; no DNS work done).

## Next
release-engineer (Kate): PR → merge. Then the Resend chain (War Room p24/p25 → env vars →
redeploy) flips the form to direct mode whenever Kazim completes it; no code work remains.

## Human gate
none (Kazim ordered this ship directly)

## Evolution
Mailto-first taught me to treat "not configured yet" as a product state to design, not an
error to apologize for; the probe-driven dual mode is now my default pattern for any
integration awaiting client-side credentials.
