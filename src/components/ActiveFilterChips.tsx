"use client";

import { X } from "lucide-react";
import { EMPTY_FILTERS, activeFilterCount } from "@/lib/filters";
import type { FilterState } from "@/lib/types";
import { accreditationLabel } from "@/lib/visuals";

type Props = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
};

export function ActiveFilterChips({ filters, onChange }: Props) {
  if (activeFilterCount(filters) === 0) return null;

  const chips: Array<{ key: string; label: string; remove: () => void }> = [];

  if (filters.maxDistanceMiles !== null) {
    chips.push({
      key: "dist",
      label: `Within ${filters.maxDistanceMiles} mi`,
      remove: () => onChange({ ...filters, maxDistanceMiles: null }),
    });
  }
  filters.states.forEach((s) =>
    chips.push({
      key: `state-${s}`,
      label: s,
      remove: () =>
        onChange({ ...filters, states: filters.states.filter((x) => x !== s) }),
    }),
  );
  filters.accreditations.forEach((a) =>
    chips.push({
      key: `acr-${a}`,
      label: accreditationLabel(a),
      remove: () =>
        onChange({
          ...filters,
          accreditations: filters.accreditations.filter((x) => x !== a),
        }),
    }),
  );
  filters.subspecialties.forEach((sp) =>
    chips.push({
      key: `sub-${sp}`,
      label: sp,
      remove: () =>
        onChange({
          ...filters,
          subspecialties: filters.subspecialties.filter((x) => x !== sp),
        }),
    }),
  );
  if (filters.walkInsOnly) {
    chips.push({
      key: "walkins",
      label: "Walk-ins",
      remove: () => onChange({ ...filters, walkInsOnly: false }),
    });
  }
  if (filters.onsiteRadiologistOnly) {
    chips.push({
      key: "onsite",
      label: "On-site radiologist",
      remove: () => onChange({ ...filters, onsiteRadiologistOnly: false }),
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] text-slate-400">Active:</span>
      {chips.map((c) => (
        <span
          key={c.key}
          className="inline-flex items-center gap-1 rounded-full bg-indigo-50 py-0.5 pl-2 pr-1 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-200"
        >
          {c.label}
          <button
            type="button"
            onClick={c.remove}
            className="rounded-full p-0.5 hover:bg-indigo-100"
            aria-label={`Remove ${c.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={() => onChange(EMPTY_FILTERS)}
        className="text-[11px] text-slate-500 hover:text-slate-900 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
