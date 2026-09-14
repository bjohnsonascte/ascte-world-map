import { useState } from "react";
import { logoSources } from "../data/schools";

function getInitials(shortName: string): string {
  return shortName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

interface SchoolLogoProps {
  domain?: string;
  shortName: string;
  /** Classes applied to both the <img> and the initials fallback box */
  className?: string;
}

export default function SchoolLogo({
  domain,
  shortName,
  className = "",
}: SchoolLogoProps) {
  const sources = logoSources(domain);
  const [idx, setIdx] = useState(0);

  if (sources.length === 0 || idx >= sources.length) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 text-[10px] font-semibold text-gray-400 ${className}`}
      >
        {getInitials(shortName)}
      </div>
    );
  }

  return (
    <img
      src={sources[idx]}
      alt=""
      loading="lazy"
      className={`bg-white object-contain ${className}`}
      onError={() => setIdx((i) => i + 1)}
    />
  );
}
