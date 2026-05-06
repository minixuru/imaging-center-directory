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

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Imaging Center Directory
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Find the right center for your patient — ranked by distance, quality,
          and value to the patient and the network.
        </p>
      </header>

      <SearchBar value={search} onChange={setSearch} />

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400">Try:</span>
        {[
          ["Manhattan", "10016"],
          ["Brooklyn", "11201"],
          ["Harlem", "10027"],
          ["Hoboken, NJ", "07030"],
          ["Westchester", "10595"],
        ].map(([label, zip]) => (
          <button
            key={zip}
            type="button"
            onClick={() => setSearch({ ...search, location: zip })}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <WeightTuner weights={weights} onChange={setWeights} />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          {ranked.length} centers · {ranked.filter((c) => c.center.isExpertRadiologyPartner).length} partner ·{" "}
          sorted by composite score
          {!matched && search.location && (
            <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200">
              Location not recognized — using NYC as origin
            </span>
          )}
        </span>
      </div>

      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <section className="grid gap-3">
          {ranked.map((scored, i) => (
            <CenterCard
              key={scored.center.id}
              scored={scored}
              rank={i + 1}
              selected={selectedId === scored.center.id}
              onSelect={() =>
                setSelectedId(
                  selectedId === scored.center.id ? null : scored.center.id,
                )
              }
            />
          ))}
          {ranked.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No centers match those filters. Try widening your search.
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {selected ? (
              <CenterDetail
                scored={selected}
                onClose={() => setSelectedId(null)}
              />
            ) : (
              <MapView
                centers={ranked}
                origin={origin}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
