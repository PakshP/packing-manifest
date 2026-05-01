type TopoPatternProps = {
  opacity?: number;
  color?: string;
  density?: "sparse" | "medium" | "dense";
  className?: string;
};

const RING_COUNT: Record<NonNullable<TopoPatternProps["density"]>, number> = {
  sparse: 6,
  medium: 9,
  dense: 13,
};

function buildClosedSmooth(points: ReadonlyArray<readonly [number, number]>): string {
  const n = points.length;
  if (n === 0) return "";
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d + " Z";
}

function ringPath(cx: number, cy: number, r: number, seed: number, segments = 14): string {
  const pts: Array<readonly [number, number]> = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const j =
      Math.sin(seed * 1.7 + i * 1.3) * 0.13 +
      Math.cos(seed * 0.9 + i * 2.7) * 0.08 +
      Math.sin(seed * 3.1 + i * 0.7) * 0.04;
    const radius = r * (1 + j);
    pts.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }
  return buildClosedSmooth(pts);
}

const CLUSTERS = [
  { cx: 380, cy: 360, baseR: 38, seed: 0.13, step: 26 },
  { cx: 820, cy: 470, baseR: 48, seed: 0.61, step: 32 },
  { cx: 1080, cy: 200, baseR: 30, seed: 0.92, step: 22 },
] as const;

export default function TopoPattern({
  opacity = 0.12,
  color = "currentColor",
  density = "medium",
  className = "",
}: TopoPatternProps) {
  const ringCount = RING_COUNT[density];
  const W = 1200;
  const H = 700;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ opacity, color }}
      aria-hidden="true"
    >
      <g stroke={color} fill="none" strokeWidth="0.7" strokeLinejoin="round">
        {CLUSTERS.flatMap((c, ci) =>
          Array.from({ length: ringCount }).map((_, ri) => {
            const r = c.baseR + ri * c.step + ri * ri * 0.6;
            return (
              <path
                key={`${ci}-${ri}`}
                d={ringPath(c.cx, c.cy, r, c.seed + ri * 0.21)}
              />
            );
          })
        )}
      </g>
    </svg>
  );
}
