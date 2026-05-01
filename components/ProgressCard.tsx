"use client";

import { useId } from "react";
import type { Bag } from "@/types";
import { ICON_MAP } from "@/lib/data";
import { ACCENT_HEX_VAR } from "@/lib/styles";

type PerBagStat = {
  bag: Bag;
  packed: number;
  total: number;
};

type Props = {
  totalItems: number;
  packedItems: number;
  perBagStats: PerBagStat[];
};

// Pre-shaped ridgeline used by both the big chart and the mini charts.
// Coords in a 200x60 viewBox. Lower y = higher elevation.
const RIDGE_POINTS: ReadonlyArray<readonly [number, number]> = [
  [0, 52],
  [18, 38],
  [34, 46],
  [52, 22],
  [68, 32],
  [86, 14],
  [108, 30],
  [128, 20],
  [148, 36],
  [168, 12],
  [186, 28],
  [200, 18],
];

function buildOpenSmooth(points: ReadonlyArray<readonly [number, number]>): string {
  const n = points.length;
  if (n === 0) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < n ? i + 2 : i + 1];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const RIDGE_PATH = buildOpenSmooth(RIDGE_POINTS);
const FILL_PATH = `${RIDGE_PATH} L 200 60 L 0 60 Z`;

function ElevationChart({
  percent,
  color,
  height = 80,
  showAxis = false,
}: {
  percent: number;
  color: string;
  height?: number;
  showAxis?: boolean;
}) {
  const clipId = useId();
  const clamped = Math.max(0, Math.min(100, percent));
  const clipWidth = (clamped / 100) * 200;

  return (
    <svg
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
      className="block w-full"
      style={{ height, color }}
      role="img"
      aria-label={`Elevation profile, ${Math.round(clamped)} percent packed`}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={clipWidth} height="60" />
        </clipPath>
        <linearGradient id={`${clipId}-grad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {showAxis && (
        <g stroke="currentColor" strokeOpacity="0.12" strokeDasharray="2 3">
          <line x1="0" y1="20" x2="200" y2="20" />
          <line x1="0" y1="40" x2="200" y2="40" />
        </g>
      )}

      {/* Faint base ridgeline */}
      <path
        d={RIDGE_PATH}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      {/* Filled "packed" area, clipped to percentage */}
      <g clipPath={`url(#${clipId})`}>
        <path d={FILL_PATH} fill={`url(#${clipId}-grad)`} />
        <path
          d={RIDGE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
      </g>
      {/* Summit marker at the leading edge */}
      {clamped > 0 && clamped < 100 && (
        <g
          transform={`translate(${clipWidth} 0)`}
          stroke="currentColor"
          strokeOpacity="0.7"
        >
          <line x1="0" y1="0" x2="0" y2="60" strokeDasharray="2 3" />
        </g>
      )}
    </svg>
  );
}

export default function ProgressCard({
  totalItems,
  packedItems,
  perBagStats,
}: Props) {
  const percent = totalItems > 0 ? (packedItems / totalItems) * 100 : 0;
  const percentDisplay = totalItems > 0 ? Math.round(percent) : 0;

  return (
    <section className="rounded-xl border border-border-soft bg-bg-paper grain-overlay shadow-sm">
      <div className="px-6 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="field-label">Manifest progress</p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold leading-tight text-ink-primary">
              <span className="font-mono tabular-nums">{packedItems}</span>
              <span className="text-ink-tertiary"> / </span>
              <span className="font-mono tabular-nums">{totalItems}</span>
              <span className="ml-2 text-ink-secondary text-base sm:text-lg uppercase tracking-widest font-mono font-medium">
                items packed
              </span>
            </p>
          </div>
          <p className="font-mono text-4xl sm:text-5xl font-semibold tabular-nums text-accent-moss">
            {percentDisplay}
            <span className="text-2xl text-ink-tertiary">%</span>
          </p>
        </div>

        <div className="mt-6 text-accent-moss">
          <ElevationChart percent={percent} color="currentColor" height={96} showAxis />
        </div>

        <div className="mt-3 flex justify-between font-mono text-[0.65rem] uppercase tracking-widest text-ink-tertiary">
          <span>Departure</span>
          <span>Trail&apos;s end</span>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4">
          {perBagStats.map(({ bag, packed, total }) => {
            const Icon = ICON_MAP[bag.iconKey];
            const bagPct = total > 0 ? (packed / total) * 100 : 0;
            const color = ACCENT_HEX_VAR[bag.accent];
            return (
              <div
                key={bag.id}
                className="rounded-lg border border-border-soft bg-bg-elevated px-3 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {Icon && (
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: color, color: "white" }}
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </span>
                    )}
                    <p className="truncate font-mono text-[0.65rem] uppercase tracking-widest text-ink-secondary">
                      {bag.shortName}
                    </p>
                  </div>
                  <p className="font-mono text-xs tabular-nums text-ink-primary">
                    {packed}
                    <span className="text-ink-tertiary">/{total}</span>
                  </p>
                </div>
                <div className="mt-2" style={{ color }}>
                  <ElevationChart percent={bagPct} color="currentColor" height={28} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
