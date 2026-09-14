import { useState, useCallback, useRef, memo } from "react";
import { Marker, useMapContext } from "react-simple-maps";
import { schoolData, logoSources, type School } from "../data/schools";

interface SchoolMarkersProps {
  onHover: (content: string, x: number, y: number) => void;
  onLeave: () => void;
  /** Current map zoom — used to keep markers a constant visual size */
  zoom: number;
}

function SchoolMarkers({ onHover, onLeave, zoom }: SchoolMarkersProps) {
  const { projection } = useMapContext();
  const [hovered, setHovered] = useState<string | null>(null);
  // Which logo source (Clearbit → DuckDuckGo → Google) each school is currently
  // trying. Advances on load error; past the end we render a plain dot.
  const [logoIdx, setLogoIdx] = useState<Record<string, number>>({});
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const label = (s: School) => `${s.name} — ${s.state}`;

  const handleMouseEnter = useCallback(
    (school: School, event: React.MouseEvent) => {
      setHovered(school.name);
      onHover(label(school), event.clientX, event.clientY);
    },
    [onHover]
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
    onLeave();
  }, [onLeave]);

  const handleTouch = useCallback(
    (school: School, event: React.TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const touch = event.touches[0] || event.changedTouches[0];
      setHovered(school.name);
      onHover(label(school), touch.clientX, touch.clientY);
      if (touchTimer.current) clearTimeout(touchTimer.current);
      touchTimer.current = setTimeout(() => {
        setHovered(null);
        onLeave();
      }, 2500);
    },
    [onHover, onLeave]
  );

  const handleImageError = useCallback((schoolName: string) => {
    setLogoIdx((prev) => ({
      ...prev,
      [schoolName]: (prev[schoolName] ?? 0) + 1,
    }));
  }, []);

  return (
    <>
      {schoolData.map((school) => {
        // geoAlbersUsa returns null for non-US coordinates — skip those.
        if (!projection(school.coordinates)) return null;

        const isHovered = hovered === school.name;
        const s = 1 / zoom; // keep markers a constant on-screen size
        const sources = logoSources(school.domain);
        const logoUrl = sources[logoIdx[school.name] ?? 0];
        // Show the logo when a source is available; fall back to a dot once
        // every source for this school has failed.
        const showLogo = !!logoUrl;
        const clipId = `clip-${school.name.replace(/[^a-zA-Z0-9]/g, "-")}`;

        // Logo marker size (screen px), enlarged a bit on hover
        const logoPx = (isHovered ? 24 : 18) * s;

        return (
          <Marker key={school.name} coordinates={school.coordinates}>
            <g
              onMouseEnter={(e) => handleMouseEnter(school, e)}
              onMouseMove={(e) => onHover(label(school), e.clientX, e.clientY)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={(e) => handleTouch(school, e)}
              onClick={(e) => e.stopPropagation()}
              style={{ cursor: "pointer" }}
            >
              {/* Larger transparent hit area for easier hovering */}
              <circle r={(showLogo ? logoPx / 2 + 2 : 4) * 1} fill="transparent" />

              {showLogo ? (
                <>
                  {/* White circular backing + border */}
                  <circle
                    r={logoPx / 2 + 1.5 * s}
                    fill="white"
                    stroke={isHovered ? "#BE1E2D" : "#9ca3af"}
                    strokeWidth={(isHovered ? 1.2 : 0.75) * s}
                  />
                  <clipPath id={clipId}>
                    <circle r={logoPx / 2} />
                  </clipPath>
                  <image
                    href={logoUrl}
                    x={-logoPx / 2}
                    y={-logoPx / 2}
                    width={logoPx}
                    height={logoPx}
                    clipPath={`url(#${clipId})`}
                    preserveAspectRatio="xMidYMid slice"
                    onError={() => handleImageError(school.name)}
                  />
                </>
              ) : (
                <circle
                  r={(isHovered ? 3 : 1.6) * s}
                  fill={isHovered ? "#0C2340" : "#BE1E2D"}
                  stroke="#fff"
                  strokeWidth={(isHovered ? 0.8 : 0.4) * s}
                  style={{ transition: "r 120ms ease, fill 120ms ease" }}
                />
              )}
            </g>
          </Marker>
        );
      })}
    </>
  );
}

export default memo(SchoolMarkers);
