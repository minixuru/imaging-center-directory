"use client";

import "leaflet/dist/leaflet.css";
import L, { type DivIcon } from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { Coords, ScoredCenter } from "@/lib/types";

type Props = {
  centers: ScoredCenter[];
  origin: Coords;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function buildIcon(rank: number, score: number, isSelected: boolean): DivIcon {
  const palette = isSelected
    ? { bg: "#4f46e5", fg: "white", border: "white" } // indigo
    : rank <= 3
      ? { bg: "#059669", fg: "white", border: "white" } // emerald
      : rank <= 6
        ? { bg: "white", fg: "#0f172a", border: "white" }
        : { bg: "#f1f5f9", fg: "#475569", border: "white" };

  const w = isSelected ? 44 : 36;
  const h = isSelected ? 32 : 26;
  const totalH = h + 8 + (isSelected ? 2 : 0);

  return L.divIcon({
    className: "",
    iconSize: [w + 4, totalH],
    iconAnchor: [(w + 4) / 2, totalH],
    html: `
      <div style="position:relative;width:${w + 4}px;height:${totalH}px;">
        <div style="
          position:absolute;left:2px;top:0;
          width:${w}px;height:${h}px;
          display:flex;align-items:center;justify-content:center;
          background:${palette.bg};color:${palette.fg};
          border:2px solid ${palette.border};border-radius:${h / 2}px;
          font:700 ${isSelected ? 13 : 12}px/1 system-ui,-apple-system,sans-serif;
          box-shadow:0 4px 10px rgba(15,23,42,.18),0 1px 2px rgba(15,23,42,.08);
          letter-spacing:.01em;
          ${isSelected ? "transform:scale(1.02);" : ""}
        ">
          <span style="font-size:9px;opacity:.7;margin-right:3px;font-weight:600;">#${rank}</span>
          <span>${score}</span>
        </div>
        <div style="
          position:absolute;left:50%;bottom:0;
          width:0;height:0;margin-left:-5px;
          border-left:5px solid transparent;
          border-right:5px solid transparent;
          border-top:8px solid ${palette.bg};
          filter:drop-shadow(0 1px 1px rgba(15,23,42,.18));
        "></div>
      </div>
    `,
  });
}

function FitBounds({
  origin,
  centers,
}: {
  origin: Coords;
  centers: ScoredCenter[];
}) {
  const map = useMap();
  useEffect(() => {
    if (centers.length === 0) {
      map.setView([origin.lat, origin.lng], 11);
      return;
    }
    const points: [number, number][] = [
      [origin.lat, origin.lng],
      ...centers.map<[number, number]>((c) => [
        c.center.coords.lat,
        c.center.coords.lng,
      ]),
    ];
    map.fitBounds(points, { padding: [40, 40] });
  }, [map, origin, centers]);
  return null;
}

function PanToSelected({
  centers,
  selectedId,
}: {
  centers: ScoredCenter[];
  selectedId: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const found = centers.find((c) => c.center.id === selectedId);
    if (found) {
      map.flyTo([found.center.coords.lat, found.center.coords.lng], 13, {
        duration: 0.6,
      });
    }
  }, [map, centers, selectedId]);
  return null;
}

export default function MapInner({
  centers,
  origin,
  selectedId,
  onSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialCenter = useMemo<[number, number]>(
    () => [origin.lat, origin.lng],
    [origin],
  );

  return (
    <div ref={containerRef} className="h-full w-full">
      <MapContainer
        center={initialCenter}
        zoom={11}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds origin={origin} centers={centers} />
        <PanToSelected centers={centers} selectedId={selectedId} />
        <CircleMarker
          center={[origin.lat, origin.lng]}
          radius={8}
          pathOptions={{
            color: "#0ea5e9",
            fillColor: "#0ea5e9",
            fillOpacity: 0.4,
            weight: 2,
          }}
        >
          <Popup>Patient origin</Popup>
        </CircleMarker>
        {centers.map((s, i) => (
          <Marker
            key={s.center.id}
            position={[s.center.coords.lat, s.center.coords.lng]}
            icon={buildIcon(i + 1, s.score, selectedId === s.center.id)}
            eventHandlers={{ click: () => onSelect(s.center.id) }}
          >
            <Popup>
              <div className="text-xs">
                <div className="font-semibold">{s.center.name}</div>
                <div className="text-slate-500">
                  {s.distanceMiles.toFixed(1)} mi · score {s.score}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
