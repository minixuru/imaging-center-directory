"use client";

import { ScanSearch } from "lucide-react";
import { useMemo, useState } from "react";
import { ActiveFilterChips } from "@/components/ActiveFilterChips";
import { CenterCard } from "@/components/CenterCard";
import { CenterDetail } from "@/components/CenterDetail";
import { FiltersPopover } from "@/components/FiltersPopover";
import { MapView } from "@/components/MapView";
import { SearchBar } from "@/components/SearchBar";
import { WeightTuner } from "@/components/WeightTuner";
import { CENTERS, geocode } from "@/lib/data";
import {
  EMPTY_FILTERS,
  activeFilterCount,
  applyFilters,
} from "@/lib/filters";
import { DEFAULT_WEIGHTS, rankCenters } from "@/lib/ranking";
import type {
  FilterState,
  RankingWeights,
  ScoredCenter,
  SearchInput,
  SortKey,
} from "@/lib/types";
import { isOpenNow } from "@/lib/visuals";

const QUICK_PICKS: Array<[string, string]> = [
  ["Manhattan", "10016"],
  ["Houston, TX", "77030"],
  ["Chicago, IL", "60611"],
  ["Brooklyn", "11201"],
  ["Hoboken, NJ", "07030"],
];

const SORT_OPTIONS: Array<[SortKey, string]> = [
  ["match", "Best match"],
  ["distance", "Distance"],
  ["rating", "Rating"],
  ["soonest", "Soonest available"],
  ["cost", "Lowest cost"],
];

const AVAILABLE_STATES = Array.from(
  new Set(CENTERS.map((c) => c.address.state)),
).sort();

function applySort(arr: ScoredCenter[], key: SortKey): ScoredCenter[] {
  const sorted = [...arr];
  switch (key) {
    case "distance":
      return sorted.sort((a, b) => a.distanceMiles - b.distanceMiles);
    case "rating":
      return sorted.sort(
        (a, b) => b.center.patientRating - a.center.patientRating,
      );
    case "soonest":
      return sorted.sort(
        (a, b) => a.center.nextAvailableHours - b.center.nextAvailableHours,
      );
    case "cost":
      return sorted.sort(
        (a, b) => a.center.estimatedMriCostUSD - b.center.estimatedMriCostUSD,
      );
    case "match":
    default:
      return sorted;
  }
}

export default function Home() {
  const [search, setSearch] = useState<SearchInput>({
    location: "10016",
    modality: "MRI",
    insurance: "",
  });
  const [weights, setWeights] = useState<RankingWeights>(DEFAULT_WEIGHTS);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { coords: origin, matched } = useMemo(
    () => geocode(search.location),
    [search.location],
  );

  const ranked = useMemo(
    () => rankCenters(CENTERS, origin, search, weights),
    [origin, search, weights],
  );

  const visible = useMemo(() => {
    let arr = applyFilters(ranked, filters);
    if (openNowOnly) arr = arr.filter((s) => isOpenNow(s.center).open);
    return applySort(arr, sortKey);
  }, [ranked, filters, sortKey, openNowOnly]);

  const selected = useMemo(
    () => visible.find((s) => s.center.id === selectedId) ?? null,
    [visible, selectedId],
  );
  const partnerCount = visible.filter(
    (c) => c.center.isExpertRadiologyPartner,
  ).length;
  const filterCount = activeFilterCount(filters);

  return (
    <main className="flex h-dvh flex-col bg-slate-50">
      {/* Top bar */}
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center">
          <div className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
              <ScanSearch className="h-5 w-5" />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-sm font-semibold leading-tight tracking-tight text-slate-900">
                Imaging Center Directory
              </h1>
              <p className="text-[11px] leading-tight text-slate-500">
                Expert Radiology · Provider portal
              </p>
            </div>
          </div>

          <div className="flex-1 lg:px-4">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setOpenNowOnly((v) => !v)}
              className={
                openNowOnly
                  ? "inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white ring-1 ring-emerald-600 hover:bg-emerald-500"
                  : "inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300"
              }
            >
              <span
                className={
                  openNowOnly
                    ? "h-1.5 w-1.5 rounded-full bg-white"
                    : "h-1.5 w-1.5 rounded-full bg-emerald-500"
                }
              />
              Open now
            </button>
            <FiltersPopover
              filters={filters}
              onChange={setFilters}
              availableStates={AVAILABLE_STATES}
            />
            <select
              className="rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 focus:border-indigo-500"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              aria-label="Sort by"
            >
              {SORT_OPTIONS.map(([k, l]) => (
                <option key={k} value={k}>
                  Sort: {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 bg-slate-50/50 px-4 py-1.5 text-xs">
          <span className="text-slate-400">Try:</span>
          {QUICK_PICKS.map(([label, zip]) => (
            <button
              key={zip}
              type="button"
              onClick={() => setSearch({ ...search, location: zip })}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {label}
            </button>
          ))}
          {!matched && search.location && (
            <span className="ml-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200">
              Location not recognized — using NYC
            </span>
          )}
        </div>

        {filterCount > 0 && (
          <div className="border-t border-slate-100 bg-indigo-50/30 px-4 py-1.5">
            <ActiveFilterChips filters={filters} onChange={setFilters} />
          </div>
        )}
      </header>

      {/* Body: left rail + map fills remaining viewport */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="flex shrink-0 flex-col border-slate-200 bg-white lg:w-[420px] lg:border-r">
          {selected ? (
            <CenterDetail
              scored={selected}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <>
              <div className="shrink-0 border-b border-slate-200 p-3">
                <WeightTuner weights={weights} onChange={setWeights} />
              </div>
              <div className="shrink-0 border-b border-slate-100 px-3 py-2 text-xs text-slate-500">
                {visible.length} of {CENTERS.length} centers · {partnerCount}{" "}
                partner ·{" "}
                {sortKey === "match"
                  ? "best match"
                  : SORT_OPTIONS.find(([k]) => k === sortKey)?.[1].toLowerCase()}
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <div className="grid gap-3">
                  {visible.map((scored, i) => (
                    <CenterCard
                      key={scored.center.id}
                      scored={scored}
                      rank={i + 1}
                      selected={selectedId === scored.center.id}
                      onSelect={() =>
                        setSelectedId(
                          selectedId === scored.center.id
                            ? null
                            : scored.center.id,
                        )
                      }
                    />
                  ))}
                  {visible.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                      No centers match the current filters. Try widening the
                      distance, removing a filter, or turning off &ldquo;Open
                      now&rdquo;.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </aside>

        <div className="min-h-[320px] flex-1 lg:min-h-0">
          <MapView
            centers={visible}
            origin={origin}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </div>
    </main>
  );
}
