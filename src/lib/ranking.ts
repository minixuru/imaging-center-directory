import type {
  Coords,
  ImagingCenter,
  RankingWeights,
  ScoredCenter,
  SearchInput,
} from "./types";

export const DEFAULT_WEIGHTS: RankingWeights = {
  distance: 0.25,
  quality: 0.25,
  turnaround: 0.15,
  cost: 0.1,
  availability: 0.1,
  partner: 0.15,
};

/** Great-circle distance in miles. */
export function haversineMiles(a: Coords, b: Coords): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

/** Linear interp clipped to [0, 100], with `best` mapped to 100. */
function score(value: number, best: number, worst: number): number {
  if (best === worst) return 100;
  const t = (value - worst) / (best - worst);
  return Math.max(0, Math.min(100, t * 100));
}

function distanceScore(miles: number) {
  // Sharp falloff under 5mi, gentler beyond. 100 at 0mi, 0 at 30mi.
  return score(miles, 0, 30);
}

function qualityScore(c: ImagingCenter) {
  // Rating 3.5..5.0 -> 0..100, with a small confidence bump for review volume.
  const ratingComp = score(c.patientRating, 5.0, 3.5);
  const volumeBoost = Math.min(10, Math.log10(Math.max(1, c.reviewCount)) * 4);
  return Math.min(100, ratingComp + volumeBoost);
}

function turnaroundScore(hours: number) {
  // 12h or less is excellent. 72h+ is poor.
  return score(hours, 12, 72);
}

function costScore(usd: number) {
  // $700 or less is excellent. $2200+ is poor.
  return score(usd, 700, 2200);
}

function availabilityScore(hours: number) {
  // 4h or sooner is "today". 96h+ (4 days) is poor.
  return score(hours, 4, 96);
}

function partnerScore(isPartner: boolean) {
  return isPartner ? 100 : 50;
}

/**
 * Score and rank centers for a search request.
 *
 * Hard filter: when a modality is requested, centers without it are dropped.
 * Soft signal: in-network mismatch is exposed to the UI but does not exclude.
 */
export function rankCenters(
  centers: ImagingCenter[],
  origin: Coords,
  search: SearchInput,
  weights: RankingWeights = DEFAULT_WEIGHTS,
): ScoredCenter[] {
  const wSum =
    weights.distance +
    weights.quality +
    weights.turnaround +
    weights.cost +
    weights.availability +
    weights.partner || 1;

  const filtered = search.modality
    ? centers.filter((c) => c.modalities.includes(search.modality as never))
    : centers;

  const scored: ScoredCenter[] = filtered.map((center) => {
    const distanceMiles = haversineMiles(origin, center.coords);
    const breakdown = {
      distance: distanceScore(distanceMiles),
      quality: qualityScore(center),
      turnaround: turnaroundScore(center.avgTurnaroundHours),
      cost: costScore(center.estimatedMriCostUSD),
      availability: availabilityScore(center.nextAvailableHours),
      partner: partnerScore(center.isExpertRadiologyPartner),
    };
    const composite =
      (weights.distance * breakdown.distance +
        weights.quality * breakdown.quality +
        weights.turnaround * breakdown.turnaround +
        weights.cost * breakdown.cost +
        weights.availability * breakdown.availability +
        weights.partner * breakdown.partner) /
      wSum;

    const inNetwork = search.insurance
      ? center.inNetworkInsurance.includes(search.insurance)
      : true;
    const modalityMatch = search.modality
      ? center.modalities.includes(search.modality as never)
      : true;

    return {
      center,
      distanceMiles,
      score: Math.round(composite),
      breakdown,
      inNetwork,
      modalityMatch,
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}

export const FACTOR_LABELS: Record<keyof RankingWeights, string> = {
  distance: "Distance",
  quality: "Quality",
  turnaround: "Turnaround",
  cost: "Cost",
  availability: "Availability",
  partner: "Network value",
};
