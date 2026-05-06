"use client";

import dynamic from "next/dynamic";
import type { Coords, ScoredCenter } from "@/lib/types";

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-50 text-xs text-slate-400">
      Loading map…
    </div>
  ),
});

type Props = {
  centers: ScoredCenter[];
  origin: Coords;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function MapView(props: Props) {
  return <MapInner {...props} />;
}
