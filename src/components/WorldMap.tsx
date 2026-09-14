import { useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { getStudentCount, getMaxStudentCount } from "../data/students";
import Tooltip from "./Tooltip";
import Legend from "./Legend";
import SchoolMarkers from "./SchoolMarkers";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const maxCount = getMaxStudentCount();

const colorScale = scaleLinear<string>()
  .domain([0, maxCount])
  .range(["#fde8ea", "#BE1E2D"]);

/**
 * Map from Natural Earth / world-atlas country names to the names
 * used in our school data. The world-atlas TopoJSON uses the `name`
 * property from Natural Earth which can differ from common usage.
 */
const COUNTRY_NAME_MAP: Record<string, string> = {
  "United Kingdom of Great Britain and Northern Ireland": "United Kingdom",
  "Korea, Republic of": "South Korea",
  "United States of America": "United States",
  "Russian Federation": "Russia",
  "Iran (Islamic Republic of)": "Iran",
  "Viet Nam": "Vietnam",
  "Republic of Korea": "South Korea",
  "Dem. Rep. Korea": "North Korea",
  "Rep. Korea": "South Korea",
  "United Arab Emirates": "United Arab Emirates",
};

function normalizeCountryName(geoName: string): string {
  return COUNTRY_NAME_MAP[geoName] || geoName;
}

interface WorldMapProps {
  selectedCountry: string | null;
  onCountryClick: (countryName: string) => void;
}

export default function WorldMap({
  selectedCountry,
  onCountryClick,
}: WorldMapProps) {
  const [tooltip, setTooltip] = useState({
    content: "",
    x: 0,
    y: 0,
    visible: false,
  });
  const [loading, setLoading] = useState(true);

  const showTooltip = useCallback(
    (content: string, x: number, y: number) => {
      setTooltip({ content, x, y, visible: true });
    },
    []
  );

  const hideTooltip = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleMouseEnter = useCallback(
    (geo: { properties: { name: string } }, event: React.MouseEvent) => {
      const countryName = normalizeCountryName(geo.properties.name);
      const count = getStudentCount(countryName);
      showTooltip(
        `${countryName}: ${count} student${count !== 1 ? "s" : ""}`,
        event.clientX,
        event.clientY
      );
    },
    [showTooltip]
  );

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setTooltip((prev) => ({
      ...prev,
      x: event.clientX,
      y: event.clientY,
    }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  const handleTouch = useCallback(
    (geo: { properties: { name: string } }, event: React.TouchEvent) => {
      event.preventDefault();
      const countryName = normalizeCountryName(geo.properties.name);
      const count = getStudentCount(countryName);
      const touch = event.touches[0] || event.changedTouches[0];
      showTooltip(
        `${countryName}: ${count} student${count !== 1 ? "s" : ""}`,
        touch.clientX,
        touch.clientY
      );
      onCountryClick(countryName);
      setTimeout(() => hideTooltip(), 2000);
    },
    [showTooltip, hideTooltip, onCountryClick]
  );

  const handleGeoClick = useCallback(
    (geo: { properties: { name: string } }) => {
      onCountryClick(normalizeCountryName(geo.properties.name));
    },
    [onCountryClick]
  );

  const handleKeyDown = useCallback(
    (geo: { properties: { name: string } }, event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onCountryClick(normalizeCountryName(geo.properties.name));
      }
    },
    [onCountryClick]
  );

  return (
    <div
      className="relative flex h-full w-full flex-col"
      role="img"
      aria-label="Interactive world map showing student distribution by country"
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-ascte-crimson" />
            <span className="text-sm text-gray-400">Loading map…</span>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1">
        <ComposableMap
          projection="geoEqualEarth"
          width={980}
          height={500}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies
            geography={GEO_URL}
            parseGeographies={(geos) => {
              setLoading(false);
              return geos;
            }}
          >
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = normalizeCountryName(
                  geo.properties.name as string
                );
                const count = getStudentCount(countryName);
                const isSelected = selectedCountry === countryName;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={0}
                    role="button"
                    aria-label={`${countryName}: ${count} student${count !== 1 ? "s" : ""}${isSelected ? " (selected)" : ""}`}
                    aria-pressed={isSelected}
                    fill={
                      isSelected
                        ? "#0C2340"
                        : count > 0
                          ? colorScale(count)
                          : "#f3f4f6"
                    }
                    stroke={isSelected ? "#BE1E2D" : "#fff"}
                    strokeWidth={isSelected ? 1.5 : 0.5}
                    style={{
                      default: { outline: "none", cursor: "pointer" },
                      hover: {
                        outline: "none",
                        fill: isSelected ? "#0C2340" : "#1a3a5c",
                        cursor: "pointer",
                      },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={(event) => handleMouseEnter(geo, event)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleGeoClick(geo)}
                    onTouchStart={(event) => handleTouch(geo, event)}
                    onKeyDown={(event) => handleKeyDown(geo, event)}
                    onFocus={() => {
                      const count = getStudentCount(countryName);
                      setTooltip({
                        content: `${countryName}: ${count} student${count !== 1 ? "s" : ""}`,
                        x: window.innerWidth / 2,
                        y: 120,
                        visible: true,
                      });
                    }}
                    onBlur={hideTooltip}
                  />
                );
              })
            }
          </Geographies>
          <SchoolMarkers onHover={showTooltip} onLeave={hideTooltip} />
        </ComposableMap>
      </div>

      <div className="shrink-0 px-3 pb-2 pt-1" aria-hidden="true">
        <div className="flex justify-end">
          <Legend maxValue={maxCount} />
        </div>
      </div>

      <Tooltip {...tooltip} />
    </div>
  );
}
