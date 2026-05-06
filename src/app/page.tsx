"use client";

import { useMemo, useState } from "react";
import { CenterCard } from "@/components/CenterCard";
import { SearchBar } from "@/components/SearchBar";
import { CENTERS, geocode } from "@/lib/data";
import { DEFAULT_WEIGHTS, rankCenters } from "@/lib/ranking";
import type { SearchInput } from "@/lib/types";

export default function Home() {
  const [search, setSearch] = useState<SearchInput>({
    location: "10016",
    modality: "MRI",
    insurance: "",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { coords: origin, matched } = useMemo(
    () => geocode(search.location),
    [search.location],
  );

  const ranked = useMemo(
    () => rankCenters(CENTERS, origin, search, DEFAULT_WEIGHTS),
    [origin, search],
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

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          {ranked.length} centers · sorted by composite score
          {!matched && search.location && (
            <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200">
              Location not recognized — using NYC as origin
            </span>
          )}
        </span>
      </div>

      <section className="mt-3 grid gap-3">
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
    </main>
  );
}
