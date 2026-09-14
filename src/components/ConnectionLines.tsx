import { memo } from "react";
import { Marker, useMapContext } from "react-simple-maps";
import { schoolData } from "../data/schools";

/**
 * ASCTE — Huntsville, Alabama. All arcs originate from this point.
 */
const ASCTE_COORDS: [number, number] = [-86.5861, 34.7304];

interface ConnectionLinesProps {
  selectedState: string | null;
  /** Current map zoom — used to keep stroke/markers a constant visual size */
  zoom: number;
}

/**
 * Quadratic-bezier path between two screen-space points.
 * Drawn in projected (flat) coordinates so arcs always stay between the
 * two markers rather than swinging off the map like great-circle lines.
 */
function buildArc(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const curvature = 0.2;
  const nx = dist === 0 ? 0 : -dy / dist;
  const ny = dist === 0 ? 0 : dx / dist;
  const offset = dist * curvature;
  return `M ${x1} ${y1} Q ${mx + nx * offset} ${my + ny * offset} ${x2} ${y2}`;
}

function ConnectionLines({ selectedState, zoom }: ConnectionLinesProps) {
  const { projection } = useMapContext();
  const s = 1 / zoom; // scale factor to keep visuals constant across zoom

  const origin = projection(ASCTE_COORDS);
  if (!origin) return null;

  const visible = selectedState
    ? schoolData.filter((s) => s.state === selectedState)
    : schoolData;

  return (
    <>
      {visible.map((school, i) => {
        // geoAlbersUsa returns null for coordinates outside the US
        // (e.g. Dublin, Sydney) — skip those here.
        const dest = projection(school.coordinates);
        if (!dest) return null;
        const d = buildArc(origin, dest);

        return (
          <g key={school.name}>
            {/* Base arc — always visible */}
            <path
              d={d}
              stroke="#BE1E2D"
              strokeWidth={0.65 * s}
              strokeLinecap="round"
              fill="transparent"
              opacity={0.35}
              className="connection-base"
            />

            {/* Animated travelling dash on top — a small pulse of light
                that races from ASCTE to each school */}
            <path
              d={d}
              pathLength={100}
              stroke="url(#arc-gradient)"
              strokeWidth={1.2 * s}
              strokeLinecap="round"
              fill="transparent"
              className="connection-arc"
              style={{ animationDelay: `${((i % 12) * 0.25).toFixed(2)}s` }}
            />
          </g>
        );
      })}

      {/* Pulsing origin marker at ASCTE */}
      <Marker coordinates={ASCTE_COORDS}>
        <g transform={`scale(${s})`}>
          <circle r={4} className="ascte-origin-dot" />
          <circle r={4} className="ascte-origin-ring" />
          <text
            textAnchor="middle"
            y={-9}
            fontSize={9}
            fontWeight="bold"
            fill="#BE1E2D"
            stroke="#fff"
            strokeWidth={0.6}
            paintOrder="stroke"
            style={{ pointerEvents: "none" }}
          >
            ASCTE
          </text>
        </g>
      </Marker>

      {/* SVG defs */}
      <defs>
        <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#BE1E2D" stopOpacity={0.9} />
          <stop offset="60%" stopColor="#f87171" stopOpacity={0.6} />
          <stop offset="100%" stopColor="#fca5a5" stopOpacity={0.15} />
        </linearGradient>
      </defs>
    </>
  );
}

export default memo(ConnectionLines);
