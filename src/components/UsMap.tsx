import { useState, useCallback, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { getSchoolCountForState, getMaxStateCount } from "../data/states";
import Tooltip from "./Tooltip";
import Legend from "./Legend";
import SchoolMarkers from "./SchoolMarkers";
import ConnectionLines from "./ConnectionLines";
import InternationalInset from "./InternationalInset";

// Bundled locally (see public/maps) so the map works fully offline.
const GEO_URL = "/maps/states-10m.json";

const MAP_WIDTH = 980;
const MAP_HEIGHT = 500;
const DEFAULT_CENTER: [number, number] = [-97, 38];
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

const maxCount = getMaxStateCount();

const colorScale = scaleLinear<string>()
  .domain([0, maxCount])
  .range(["#fde8ea", "#BE1E2D"]);

interface UsMapProps {
  selectedState: string | null;
  onStateClick: (stateName: string) => void;
  onClearSelection: () => void;
}

export default function UsMap({
  selectedState,
  onStateClick,
  onClearSelection,
}: UsMapProps) {
  const [tooltip, setTooltip] = useState({
    content: "",
    x: 0,
    y: 0,
    visible: false,
  });
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState<{
    coordinates: [number, number];
    zoom: number;
  }>({ coordinates: DEFAULT_CENTER, zoom: 1 });

  const showTooltip = useCallback((content: string, x: number, y: number) => {
    setTooltip({ content, x, y, visible: true });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const zoomIn = useCallback(() => {
    setPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.5, MAX_ZOOM) }));
  }, []);

  const zoomOut = useCallback(() => {
    setPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.5, MIN_ZOOM) }));
  }, []);

  const resetView = useCallback(() => {
    setPosition({ coordinates: DEFAULT_CENTER, zoom: 1 });
  }, []);

  const handleMouseEnter = useCallback(
    (stateName: string, event: React.MouseEvent) => {
      const count = getSchoolCountForState(stateName);
      showTooltip(
        `${stateName}: ${count} school${count !== 1 ? "s" : ""}`,
        event.clientX,
        event.clientY
      );
    },
    [showTooltip]
  );

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setTooltip((prev) => ({ ...prev, x: event.clientX, y: event.clientY }));
  }, []);

  const handleTouch = useCallback(
    (stateName: string, event: React.TouchEvent) => {
      event.preventDefault();
      const count = getSchoolCountForState(stateName);
      const touch = event.touches[0] || event.changedTouches[0];
      showTooltip(
        `${stateName}: ${count} school${count !== 1 ? "s" : ""}`,
        touch.clientX,
        touch.clientY
      );
      onStateClick(stateName);
      setTimeout(() => hideTooltip(), 2000);
    },
    [showTooltip, hideTooltip, onStateClick]
  );

  const handleFocus = useCallback((stateName: string) => {
    const count = getSchoolCountForState(stateName);
    setTooltip({
      content: `${stateName}: ${count} school${count !== 1 ? "s" : ""}`,
      x: window.innerWidth / 2,
      y: 120,
      visible: true,
    });
  }, []);

  const handleLoaded = useCallback(() => setLoading(false), []);

  const { zoom } = position;

  return (
    <div
      className="relative flex h-full w-full flex-col"
      role="img"
      aria-label="Interactive US map showing university acceptances by state"
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-ascte-crimson" />
            <span className="text-sm text-gray-400">Loading map…</span>
          </div>
        </div>
      )}

      {/* Clicking empty space (anywhere not a state) clears the selection.
          Right padding reserves room for the international inset so it never
          overlaps the US map. */}
      <div className="min-h-0 flex-1 md:pr-60" onClick={onClearSelection}>
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1150 }}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup
            center={position.coordinates}
            zoom={position.zoom}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            onMoveEnd={setPosition}
          >
            <StatesLayer
              selectedState={selectedState}
              zoom={zoom}
              onLoaded={handleLoaded}
              onEnter={handleMouseEnter}
              onMove={handleMouseMove}
              onLeave={hideTooltip}
              onSelect={onStateClick}
              onTouch={handleTouch}
              onFocusState={handleFocus}
            />

            {/* Animated arcs from ASCTE to each school */}
            <ConnectionLines selectedState={selectedState} zoom={zoom} />

            <SchoolMarkers
              onHover={showTooltip}
              onLeave={hideTooltip}
              zoom={zoom}
            />
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Small world inset for schools outside the US */}
      <InternationalInset />

      {/* Zoom controls — bottom-left of the map container */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Zoom in"
          className="flex h-9 w-9 items-center justify-center text-xl leading-none text-gray-700 transition-colors hover:bg-gray-100"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomOut}
          aria-label="Zoom out"
          className="flex h-9 w-9 items-center justify-center border-t border-gray-200 text-xl leading-none text-gray-700 transition-colors hover:bg-gray-100"
        >
          −
        </button>
        <button
          type="button"
          onClick={resetView}
          aria-label="Reset view"
          title="Reset view"
          className="flex h-9 w-9 items-center justify-center border-t border-gray-200 text-xs text-gray-500 transition-colors hover:bg-gray-100"
        >
          ⤢
        </button>
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

interface StatesLayerProps {
  selectedState: string | null;
  zoom: number;
  onLoaded: () => void;
  onEnter: (stateName: string, event: React.MouseEvent) => void;
  onMove: (event: React.MouseEvent) => void;
  onLeave: () => void;
  onSelect: (stateName: string) => void;
  onTouch: (stateName: string, event: React.TouchEvent) => void;
  onFocusState: (stateName: string) => void;
}

/**
 * The choropleth state layer, memoized so that cursor movement (which only
 * updates the floating tooltip's position in the parent) doesn't force all
 * 50 state paths to re-render. It re-renders only when the selection or zoom
 * actually changes.
 */
const StatesLayer = memo(function StatesLayer({
  selectedState,
  zoom,
  onLoaded,
  onEnter,
  onMove,
  onLeave,
  onSelect,
  onTouch,
  onFocusState,
}: StatesLayerProps) {
  return (
    <Geographies
      geography={GEO_URL}
      parseGeographies={(geos) => {
        onLoaded();
        return geos;
      }}
    >
      {({ geographies }) =>
        geographies.map((geo) => {
          const stateName = geo.properties.name as string;
          const count = getSchoolCountForState(stateName);
          const isSelected = selectedState === stateName;

          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              tabIndex={0}
              role="button"
              aria-label={`${stateName}: ${count} school${count !== 1 ? "s" : ""}${isSelected ? " (selected)" : ""}`}
              aria-pressed={isSelected}
              fill={
                isSelected
                  ? "#0C2340"
                  : count > 0
                    ? colorScale(count)
                    : "#f3f4f6"
              }
              stroke={isSelected ? "#BE1E2D" : "#fff"}
              strokeWidth={(isSelected ? 1.5 : 0.5) / zoom}
              style={{
                default: { outline: "none", cursor: "pointer" },
                hover: {
                  outline: "none",
                  fill: isSelected ? "#0C2340" : "#1a3a5c",
                  cursor: "pointer",
                },
                pressed: { outline: "none" },
              }}
              onMouseEnter={(event) => onEnter(stateName, event)}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              onClick={(event) => {
                // Don't let the click bubble to the clear-on-empty handler
                event.stopPropagation();
                onSelect(stateName);
              }}
              onTouchStart={(event) => onTouch(stateName, event)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(stateName);
                }
              }}
              onFocus={() => onFocusState(stateName)}
              onBlur={onLeave}
            />
          );
        })
      }
    </Geographies>
  );
});
