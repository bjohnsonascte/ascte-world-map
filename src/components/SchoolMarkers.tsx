import { useState, useCallback, useRef } from "react";
import { Marker } from "react-simple-maps";
import { schoolData, type School } from "../data/schools";

const LOGO_SIZE = 18;

interface SchoolMarkersProps {
  onHover: (content: string, x: number, y: number) => void;
  onLeave: () => void;
}

function getInitials(shortName: string): string {
  return shortName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export default function SchoolMarkers({
  onHover,
  onLeave,
}: SchoolMarkersProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(
    (school: School, event: React.MouseEvent) => {
      setHovered(school.name);
      onHover(
        `${school.name} — ${school.studentCount} students`,
        event.clientX,
        event.clientY
      );
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
      onHover(
        `${school.name} — ${school.studentCount} students`,
        touch.clientX,
        touch.clientY
      );
      if (touchTimer.current) clearTimeout(touchTimer.current);
      touchTimer.current = setTimeout(() => {
        setHovered(null);
        onLeave();
      }, 2500);
    },
    [onHover, onLeave]
  );

  const handleImageError = useCallback((schoolName: string) => {
    setFailedLogos((prev) => new Set(prev).add(schoolName));
  }, []);

  return (
    <>
      {schoolData.map((school) => {
        const isHovered = hovered === school.name;
        const size = isHovered ? LOGO_SIZE * 1.5 : LOGO_SIZE;
        const logoFailed = failedLogos.has(school.name);
        const clipId = `clip-${school.shortName.replace(/\s+/g, "-")}`;

        return (
          <Marker key={school.name} coordinates={school.coordinates}>
            <g
              onMouseEnter={(e) => handleMouseEnter(school, e)}
              onMouseMove={(e) =>
                onHover(
                  `${school.name} — ${school.studentCount} students`,
                  e.clientX,
                  e.clientY
                )
              }
              onMouseLeave={handleMouseLeave}
              onTouchStart={(e) => handleTouch(school, e)}
              style={{ cursor: "pointer" }}
            >
              <circle
                r={size / 2 + 2}
                fill="white"
                stroke={isHovered ? "#BE1E2D" : "#9ca3af"}
                strokeWidth={isHovered ? 1.5 : 0.75}
                filter={isHovered ? "url(#marker-shadow)" : undefined}
                style={{ transition: "all 150ms ease" }}
              />

              {logoFailed ? (
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={size * 0.35}
                  fontWeight="bold"
                  fill="#374151"
                  style={{ pointerEvents: "none" }}
                >
                  {getInitials(school.shortName)}
                </text>
              ) : (
                <>
                  <clipPath id={clipId}>
                    <circle r={size / 2} />
                  </clipPath>
                  <image
                    href={school.logoUrl}
                    x={-size / 2}
                    y={-size / 2}
                    width={size}
                    height={size}
                    clipPath={`url(#${clipId})`}
                    preserveAspectRatio="xMidYMid slice"
                    onError={() => handleImageError(school.name)}
                    style={{ transition: "all 150ms ease" }}
                  />
                </>
              )}
            </g>
          </Marker>
        );
      })}

      <defs>
        <filter id="marker-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.2" />
        </filter>
      </defs>
    </>
  );
}
