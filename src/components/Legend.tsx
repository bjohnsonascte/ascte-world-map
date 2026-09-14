import { scaleLinear } from "d3-scale";

interface LegendProps {
  maxValue: number;
}

const LEGEND_WIDTH = 200;
const LEGEND_HEIGHT = 12;
const STEPS = 10;

export default function Legend({ maxValue }: LegendProps) {
  const colorScale = scaleLinear<string>()
    .domain([0, maxValue])
    .range(["#fde8ea", "#BE1E2D"]);

  const stepWidth = LEGEND_WIDTH / STEPS;
  const stops = Array.from({ length: STEPS }, (_, i) => ({
    value: (i / (STEPS - 1)) * maxValue,
    x: i * stepWidth,
  }));

  return (
    <div
      className="flex flex-col items-end gap-1"
      role="img"
      aria-label={`Color legend: 0 to ${maxValue}+ universities per state`}
    >
      <span className="text-xs font-medium text-gray-500">
        Universities per state
      </span>
      <svg
        width={LEGEND_WIDTH}
        height={LEGEND_HEIGHT + 20}
        aria-hidden="true"
      >
        {stops.map((stop, i) => (
          <rect
            key={i}
            x={stop.x}
            y={0}
            width={stepWidth}
            height={LEGEND_HEIGHT}
            fill={colorScale(stop.value)}
            rx={i === 0 ? 3 : i === STEPS - 1 ? 3 : 0}
          />
        ))}
        <text x={0} y={LEGEND_HEIGHT + 14} fontSize={10} fill="#6b7280">
          0
        </text>
        <text
          x={LEGEND_WIDTH}
          y={LEGEND_HEIGHT + 14}
          fontSize={10}
          fill="#6b7280"
          textAnchor="end"
        >
          {maxValue}+
        </text>
      </svg>
    </div>
  );
}
