import { useState, useMemo } from "react";
import { schoolData } from "../data/schools";
import SchoolLogo from "./SchoolLogo";

interface SchoolListProps {
  selectedState: string | null;
}

export default function SchoolList({ selectedState }: SchoolListProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let results = [...schoolData];

    if (selectedState) {
      results = results.filter((s) => s.state === selectedState);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortName.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q)
      );
    }

    return results.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedState, search]);

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b-2 border-ascte-crimson bg-ascte-navy px-5 py-4">
        <h2 className="text-lg font-semibold text-white">Schools Attended</h2>
        <p className="mt-0.5 text-xs text-blue-200/80">
          {selectedState
            ? `Filtered: ${selectedState} (${filtered.length})`
            : `${filtered.length} universities — sorted A–Z`}
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search schools..."
          className="mt-2 w-full rounded-lg border border-white/20 bg-white/95 px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-ascte-crimson focus:ring-1 focus:ring-ascte-crimson/30"
        />
      </div>

      <ul
        className="flex-1 divide-y divide-gray-50 overflow-y-auto"
        role="list"
        aria-label="Universities attended by ASCTE students"
      >
        {filtered.length === 0 ? (
          <li className="px-5 py-8 text-center text-sm text-gray-400">
            No schools found
          </li>
        ) : (
          filtered.map((school, i) => (
            <li
              key={school.name}
              className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-ascte-navy/5"
            >
              <span className="w-6 shrink-0 text-xs font-semibold text-ascte-navy/40">
                {i + 1}
              </span>

              <SchoolLogo
                domain={school.domain}
                shortName={school.shortName}
                className="h-8 w-8 shrink-0 rounded-full border border-gray-200 p-0.5"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ascte-navy">
                  {school.name}
                </p>
                <p className="truncate text-xs text-gray-400">
                  {school.state}
                  {school.international ? " (International)" : ""}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
