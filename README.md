# Imaging Center Directory

A working prototype of a directory app that helps a referring provider find
the best imaging center for their patient. Built for the Expert Radiology
Product Engineer take-home.

**Live demo:** _will be added after Vercel deploy_

**Deliverables:**

- `src/` — the working prototype (Next.js + TypeScript + Tailwind v4)
- [`ROADMAP.md`](./ROADMAP.md) — one-year product roadmap

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
```

Requires Node 18+.

## What it does

A provider lands on the page, types a patient location (zip, neighborhood, or
city), optionally filters by modality and insurance plan, and sees a ranked
list of imaging centers with a composite score, distance, quality, and a
breakdown of why each one ranked where it did.

Selecting a center opens a detail panel with full info — modalities,
subspecialties, in-network insurance, hours, contact, score breakdown by
factor, and a referral CTA.

A map shows all candidate centers around the patient's origin; markers are
ranked-numbered and selecting one syncs with the list.

## How the ranking works

A center's composite score is a weighted average of six 0–100 sub-scores:

| Factor       | Signal                                          | Why it matters                                  |
| ------------ | ----------------------------------------------- | ----------------------------------------------- |
| Distance     | Great-circle miles from patient                 | Adherence drops fast with travel time           |
| Quality      | Patient rating × confidence (review volume)     | Stars alone are noisy with low N                |
| Turnaround   | Median scan-to-final-report hours               | Drives provider satisfaction & re-referral      |
| Cost         | Estimated patient out-of-pocket for an MRI      | Affordability + value-based-care signals        |
| Availability | Hours until next open appointment               | Same-week beats high-quality-but-3-weeks-out    |
| Network      | Expert Radiology partner uplift                 | Routes interpretation work into the ER network  |

Hard filter: a requested modality the center doesn't offer drops it out.
Soft signals: out-of-network insurance and modality mismatch are surfaced as
warnings rather than excluding the center.

The "Ranking weights" panel exposes the weights as live sliders so the
reviewer can see the ranking respond — the product point is that the model
is **transparent and tunable**, not a black box.

See [`src/lib/ranking.ts`](./src/lib/ranking.ts) for the implementation.

## Key decisions & trade-offs

**Stack: Next.js 16 + Tailwind v4 + Leaflet/OpenStreetMap.** Fastest path to
a polished, deployable demo. Leaflet over Mapbox/Google to skip API keys for
the reviewer.

**Mock geocoder over real one.** A small lookup of NYC-metro zips and
neighborhoods so the demo works offline. Unknown inputs fall back to NYC and
flag the warning state — this is closer to how a real product should fail
than silently snapping to (0,0).

**12 seeded centers, deliberately diverse.** Each center has a different
profile (premium-but-distant, cheap-but-low-quality, walk-in-friendly, etc.)
so the ranking visibly re-orders when you tune the weights. If they all
clustered, the demo would look static.

**"Network value" as a ranking factor.** This is the answer to the brief's
hint about thinking beyond clinical factors. Centers that are Expert
Radiology partners (use PrecisionPlus reports) get a meaningful uplift,
because routing volume to them serves the business loop, the patient (better
report), and the referrer (faster turnaround). It's a real product
philosophy, not a thumb on the scale — and it's the kind of decision a
product engineer should be able to defend in a roadmap conversation.

**Score breakdown surfaced in the detail panel.** A single number invites
distrust; a breakdown invites adoption. Clinicians will tune out a
recommendation engine they can't audit.

**No DB, no API.** State is in-memory React. The product surface is what
matters here, not the persistence layer. A real implementation would have a
centers service backed by Postgres + a search/ranking pipeline.

## What I would do next (top of the 90-day plan)

- Replace the mock geocoder with Mapbox.
- Wire real-time availability from RamSoft for partner centers (the PACS
  integration already exists — reuse it).
- Add provider auth + NPI verification.
- Wire the "Send referral" CTA to a real handoff (fax / SMART-on-FHIR push).
- Add referral attribution so we can measure whether the rank actually
  predicted attendance.

Full plan in [`ROADMAP.md`](./ROADMAP.md).
