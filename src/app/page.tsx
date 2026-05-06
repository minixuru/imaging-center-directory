"use client";

import { useMemo, useState } from "react";
import { CenterCard } from "@/components/CenterCard";
import { CenterDetail } from "@/components/CenterDetail";
import { MapView } from "@/components/MapView";
import { SearchBar } from "@/components/SearchBar";
import { WeightTuner } from "@/components/WeightTuner";
import { CENTERS, geocode } from "@/lib/data";
import { DEFAULT_WEIGHTS, rankCenters } from "@/lib/ranking";
import type { RankingWeights, SearchInput } from "@/lib/types";

const QUICK_PICKS: Array<[string, string]> = [
  ["Manhattan", "10016"],
  ["Brooklyn", "11201"],
  ["Harlem", "10027"],
  ["Hoboken, NJ", "07030"],
  ["Westchester", "10595"],
];

export default function Home() {
  const [search, setSearch] = useState<SearchInput>({
    location: "10016",
    modality: "MRI",
    insurance: "",
  });
  const [weights, setWeights] = useState<RankingWeights>(DEFAULT_WEIGHTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { coords: origin, matched } = useMemo(
    () => geocode(search.location),
    [search.location],
  );

  const ranked = useMemo(
    () => rankCenters(CENTERS, origin, search, weights),
    [origin, search, weights],
  );

  const selected = useMemo(
    () => ranked.find((s) => s.center.id === selectedId) ?? null,
    [ranked, selectedId],
  );
  const partnerCount = ranked.filter(
    (c) => c.center.isExpertRadiologyPartner,
  ).length;

  return (
    <main className="flex h-dvh flex-col bg-slate-50">
      {/* Top bar: brand + search + filters + quick picks */}
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:gap-6">
          <div className="shrink-0">
            <h1 className="text-base font-semibold tracking-tight text-slate-900">
              Imaging Center Directory
            </h1>
            <p className="text-xs text-slate-500">
              Ranked by distance, quality, and network value
            </p>
          </div>
          <div className="flex-1 lg:max-w-3xl">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 px-4 py-2 text-xs">
          <span className="text-slate-400">Try:</span>
          {QUICK_PICKS.map(([label, zip]) => (
            <button
              key={zip}
              type="button"
              onClick={() => setSearch({ ...search, location: zip })}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
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
                {ranked.length} centers · {partnerCount} partner · sorted by
                composite score
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <div className="grid gap-3">
                  {ranked.map((scored, i) => (
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
                  {ranked.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                      No centers match those filters. Try widening your search.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </aside>

        <div className="min-h-[320px] flex-1 lg:min-h-0">
          <MapView
            centers={ranked}
            origin={origin}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </div>
    </main>
  );
}
