import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { schoolData } from "../data/schools";

// Bundled locally (see public/maps) so the inset works fully offline.
const WORLD_GEO_URL = "/maps/countries-110m.json";

const internationalSchools = schoolData.filter((s) => s.international);

/**
 * A small world-map inset showing schools outside the US.
 * Keeps the main US map focused while still surfacing the abroad schools.
 */
export default function InternationalInset() {
  if (internationalSchools.length === 0) return null;

  return (
    <div className="absolute right-3 top-3 z-20 w-55 overflow-hidden rounded-lg border border-gray-200 bg-white/95 shadow-md backdrop-blur">
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-1.5">
        <span className="text-xs font-semibold text-gray-700">
          International
        </span>
        <span className="rounded-full bg-ascte-crimson/10 px-1.5 py-0.5 text-[10px] font-medium text-ascte-crimson">
          {internationalSchools.length}
        </span>
      </div>

      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 40 }}
        width={220}
        height={120}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={WORLD_GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#e5e7eb"
                stroke="#fff"
                strokeWidth={0.3}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#e5e7eb" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {internationalSchools.map((school) => (
          <Marker key={school.name} coordinates={school.coordinates}>
            <title>{`${school.name} — ${school.state}`}</title>
            <circle r={3} fill="#BE1E2D" stroke="#fff" strokeWidth={0.8} />
            <text
              x={5}
              y={2.5}
              fontSize={7}
              fontWeight="bold"
              fill="#0C2340"
              stroke="#fff"
              strokeWidth={0.5}
              paintOrder="stroke"
            >
              {school.shortName}
            </text>
          </Marker>
        ))}
      </ComposableMap>

      <ul className="max-h-24 overflow-y-auto px-3 py-1.5">
        {internationalSchools.map((school) => (
          <li
            key={school.name}
            className="flex items-baseline justify-between gap-2 py-0.5 text-[11px]"
          >
            <span className="truncate font-medium text-gray-700">
              {school.shortName}
            </span>
            <span className="shrink-0 text-gray-400">{school.state}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
