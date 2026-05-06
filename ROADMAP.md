# Imaging Center Directory — One-Year Product Roadmap

## North star

Make this the default tool a referring provider reaches for when choosing where
to send a patient for imaging — and use that flow to compound volume into
Expert Radiology's interpretation network and PrecisionPlus reports.

## Strategic frame

The directory is a **wedge**, not a destination product. Every search is a
referral signal that creates leverage for ER's core teleradiology business.
Three loops we're optimizing simultaneously:

1. **Provider** finds the right match faster, with confidence.
2. **Patient** gets a faster, in-network, lower-cost scan.
3. **Network** captures referral volume, which routes downstream
   interpretation work (and PrecisionPlus reports) into ER's pipeline.

If we treat the directory as a search box, we lose. If we treat it as a
two-sided marketplace whose pricing signal is _trust_, we win.

---

## 0–30 days — Foundation & data trust

**Goal:** real data, real users. One design partner using it daily.

- Seed real center data for one metro (suggest TX or NYC pilot — depends on
  where the strongest referral relationships already are).
- Swap mock geocoding for Mapbox or Google Geocoding behind an interface.
- Real-time availability ingest from RamSoft for partner centers (the PACS
  integration already exists — reuse it).
- Auth: referring provider accounts with NPI verification.
- Ship to one PI law firm or chiropractor practice as a design partner. Two
  weekly working sessions.

_Why first:_ without trusted data the rest is theater. Geo accuracy and live
availability are deal-breakers for a clinical user.

## 31–90 days — Ranking quality & closing the loop

**Goal:** prove the directory drives measurable referral lift to partner
centers.

- "Send referral" wired up — auto-fax, secure messaging, or SMART-on-FHIR push
  to the receiving center.
- Personalized weights — learn per-provider preferences from history (some
  doctors care about turnaround, others about price for self-pay patients).
- Subspecialty fit (neuro MRI → neuro-fellowship-trained reader) factored
  into ranking.
- Insurance + cost transparency UI — real plan match via payer eligibility
  APIs where available.
- Provider attribution: source → choice → attendance. Without this we can't
  optimize anything.
- Lightweight imaging-center admin: self-serve to update hours, modalities,
  accepted insurance.

_Gate to ship past day 90:_

- Time-to-choice (search → selection): under 90s on median.
- Referral completion rate: ≥ 30%.
- Partner-network share of selections: ≥ 55%.

## 91–180 days — Two-sided value

**Goal:** imaging centers themselves see the directory as a customer
acquisition channel.

- Imaging center dashboard: incoming referrals, win/loss vs competitors,
  conversion funnel, time-to-acceptance.
- Patient-side companion: self-serve second opinion intake (extends the
  existing portal), DICOM upload, status tracking.
- SMART-on-FHIR launch from Epic / Cerner so referrals start inside the EHR
  visit, not after it.
- No Surprises Act / payer-transparency-rule out-of-pocket estimates.

## 181–365 days — AI-native referral intelligence

**Goal:** this becomes the recommendation engine of record for the network.

- LLM-assisted referral interpretation: convert a free-text physician note
  ("low back pain, can't lie flat, pacemaker") into modality + subspecialty +
  capacity constraints, automatically.
- Outcomes-based ranking: feedback loop from PrecisionPlus reports back into
  quality score (turnaround SLA, finding agreement rate, patient comprehension
  signals).
- Pre-auth assistance: auto-draft prior-auth forms from the referring note.
- National geographic expansion, multi-region tenancy.
- HIPAA / HITRUST formalization, SOC 2 readiness.

---

## Prioritization principles

1. **Trust beats features.** One wrong rank kills credibility for months.
   Stale data is a worse bug than a missing feature.
2. **Two-sided liquidity.** Every release improves either provider experience
   or center attractiveness — ideally both. Otherwise it's not earning shelf
   space.
3. **Close the loop before adding signals.** Knowing whether the patient
   actually attended is worth more than another quality factor.
4. **Compliance is product.** HIPAA, payer transparency, and audit trails
   ship inside the feature, not after.

## Metrics (in priority order)

| Layer            | Primary metric                            | Why                                  |
| ---------------- | ----------------------------------------- | ------------------------------------ |
| Adoption         | Weekly active referring providers         | The growth ceiling                   |
| Stickiness       | Returning-provider rate, week 4           | Habit, not novelty                   |
| Match quality    | Patient-attended rate per referral        | Did the rank actually predict fit?   |
| Network value    | Partner-network share of selections       | Direct line to ER revenue            |
| Downstream       | PrecisionPlus reports per 100 referrals   | Connects directory to core business  |
| Operational      | p95 search latency, geocode accuracy      | The "is the kitchen on fire" signals |

## Risks & dependencies

- **Data freshness on non-partner centers.** Capacity, insurance, and hours
  change weekly. Stale data poisons trust. Mitigation: surface `last-updated`
  prominently; combine scrape + payer feeds + center self-serve; degrade
  gracefully when freshness drops.
- **RamSoft / PACS dependency.** Live availability for partner centers
  depends on their cooperation. Mitigation: build a queue + cache fallback,
  don't block product behind their roadmap.
- **HIPAA scope creep.** Once we ingest patient names into referrals, every
  system the data touches is regulated. Decide the compliance posture
  _before_ the feature, not after.
- **Provider attribution leakage.** Referrers will pick up the phone instead
  of clicking. Mitigation: SMS-back-to-patient confirmation gives us a
  separate attendance signal even if the click attribution misses.
- **Geocoding vendor lock-in.** Mapbox / Google billing scales nonlinearly.
  Cache aggressively and keep the interface vendor-agnostic from day one.
- **Distribution.** A directory nobody knows about is a search box. Tie
  launches to existing PI-attorney and pain-management channels — those are
  ER's hottest wedges today.
