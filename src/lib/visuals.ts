import type {
  Accreditation,
  DayCode,
  ImagingCenter,
  Modality,
} from "./types";

/** Stable string hash for deterministic per-center visual variation. */
function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const GRADIENTS: ReadonlyArray<readonly [string, string]> = [
  ["#6366f1", "#8b5cf6"], // indigo→violet
  ["#0ea5e9", "#22d3ee"], // sky→cyan
  ["#10b981", "#22c55e"], // emerald→green
  ["#f59e0b", "#f97316"], // amber→orange
  ["#ec4899", "#f43f5e"], // pink→rose
  ["#14b8a6", "#0ea5e9"], // teal→sky
  ["#8b5cf6", "#ec4899"], // violet→pink
  ["#3b82f6", "#6366f1"], // blue→indigo
];

/** Pick a stable gradient pair for a center's hero block. */
export function gradientFor(id: string): { from: string; to: string } {
  const [from, to] = GRADIENTS[djb2(id) % GRADIENTS.length];
  return { from, to };
}

/** "Manhattan Imaging Group" -> "MI" */
export function initialsFor(name: string): string {
  const parts = name
    .replace(/&/g, "")
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w));
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Color tokens for modality chips (Tailwind classes). */
export const MODALITY_STYLE: Record<Modality, string> = {
  MRI: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  CT: "bg-sky-50 text-sky-700 ring-sky-200",
  "X-Ray": "bg-slate-100 text-slate-700 ring-slate-200",
  Ultrasound: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Mammography: "bg-rose-50 text-rose-700 ring-rose-200",
  "PET-CT": "bg-amber-50 text-amber-800 ring-amber-200",
  Fluoroscopy: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  DEXA: "bg-violet-50 text-violet-700 ring-violet-200",
};

const ACR_LABEL: Record<Accreditation, string> = {
  "ACR-MRI": "ACR · MRI",
  "ACR-CT": "ACR · CT",
  "ACR-Mammography": "ACR · Mammography",
  "ACR-Breast-MRI": "ACR · Breast MRI",
  "ACR-Ultrasound": "ACR · Ultrasound",
  "ACR-Nuclear": "ACR · Nuclear",
  "ACR-Stereotactic-Breast": "ACR · Stereotactic Breast",
};

export function accreditationLabel(a: Accreditation): string {
  return ACR_LABEL[a];
}

const DAY_INDEX: Record<number, DayCode> = {
  0: "sun",
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
};

/** Is the center currently open at `now` (defaults to current time)? */
export function isOpenNow(center: ImagingCenter, now: Date = new Date()): {
  open: boolean;
  closesAt?: number;
  opensAt?: number;
} {
  const day = DAY_INDEX[now.getDay()];
  const range = center.weeklyHours[day];
  if (!range) return { open: false };
  const hour = now.getHours() + now.getMinutes() / 60;
  if (hour >= range.open && hour < range.close) {
    return { open: true, closesAt: range.close };
  }
  return { open: false, opensAt: range.open };
}

export function formatHour(decimal: number): string {
  const hour = Math.floor(decimal);
  const minute = Math.round((decimal - hour) * 60);
  const period = hour >= 12 ? "pm" : "am";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${h12}${period}` : `${h12}:${String(minute).padStart(2, "0")}${period}`;
}

export function formatNextAvailable(hours: number): string {
  if (hours <= 4) return "Today";
  if (hours <= 24) return "Tomorrow";
  const days = Math.round(hours / 24);
  return `${days} days`;
}
