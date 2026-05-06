"use client";

type Props = {
  value: number;
  /** px */
  size?: number;
  className?: string;
};

/** 0..5 star rating with quarter-step precision via a clipped overlay. */
export function Stars({ value, size = 14, className }: Props) {
  const clamped = Math.max(0, Math.min(5, value));
  const pct = (clamped / 5) * 100;
  return (
    <span
      className={`relative inline-flex items-center ${className ?? ""}`}
      style={{ height: size }}
      aria-label={`${clamped.toFixed(1)} of 5 stars`}
    >
      <span className="text-slate-300" aria-hidden style={{ fontSize: size }}>
        ★★★★★
      </span>
      <span
        className="absolute inset-0 overflow-hidden text-amber-400"
        style={{ width: `${pct}%`, fontSize: size }}
        aria-hidden
      >
        ★★★★★
      </span>
    </span>
  );
}
