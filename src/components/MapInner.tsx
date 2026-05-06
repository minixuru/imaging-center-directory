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

function buildIcon(rank: number, isSelected: boolean): DivIcon {
  const color = isSelected ? "#0f172a" : rank <= 3 ? "#10b981" : "#64748b";
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `
      <div style="
        width:28px;height:28px;border-radius:9999px;
        background:${color};color:white;display:flex;
        align-items:center;justify-content:center;
        font:600 12px/1 system-ui,sans-serif;
        box-shadow:0 1px 2px rgba(0,0,0,.15),0 0 0 2px white;
      ">${rank}</div>
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
            icon={buildIcon(i + 1, selectedId === s.center.id)}
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
