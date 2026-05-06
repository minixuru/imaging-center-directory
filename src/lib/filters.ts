import type { FilterState, ScoredCenter } from "./types";

export const EMPTY_FILTERS: FilterState = {
  maxDistanceMiles: null,
  states: [],
  accreditations: [],
  subspecialties: [],
  walkInsOnly: false,
  onsiteRadiologistOnly: false,
};

/** True if the filter state has any active constraint. */
export function isAnyFilterActive(f: FilterState): boolean {
  return (
    f.maxDistanceMiles !== null ||
    f.states.length > 0 ||
    f.accreditations.length > 0 ||
    f.subspecialties.length > 0 ||
    f.walkInsOnly ||
    f.onsiteRadiologistOnly
  );
}

/** Count of active filter facets (used for the badge on the Filters button). */
export function activeFilterCount(f: FilterState): number {
  let n = 0;
  if (f.maxDistanceMiles !== null) n++;
  if (f.states.length > 0) n++;
  if (f.accreditations.length > 0) n++;
  if (f.subspecialties.length > 0) n++;
  if (f.walkInsOnly) n++;
  if (f.onsiteRadiologistOnly) n++;
  return n;
}

/** Apply filters to a ranked list. Filters narrow; ranking ordering is preserved. */
export function applyFilters(
  arr: ScoredCenter[],
  f: FilterState,
): ScoredCenter[] {
  return arr.filter((s) => {
    if (
      f.maxDistanceMiles !== null &&
      s.distanceMiles > f.maxDistanceMiles
    ) {
      return false;
    }
    if (f.states.length > 0 && !f.states.includes(s.center.address.state)) {
      return false;
    }
    if (f.accreditations.length > 0) {
      const has = f.accreditations.every((a) =>
        s.center.accreditations.includes(a),
      );
      if (!has) return false;
    }
    if (f.subspecialties.length > 0) {
      const has = f.subspecialties.every((sp) =>
        s.center.subspecialties.includes(sp),
      );
      if (!has) return false;
    }
    if (f.walkInsOnly && !s.center.acceptsWalkIns) return false;
    if (f.onsiteRadiologistOnly && !s.center.hasOnsiteRadiologist) return false;
    return true;
  });
}
