import { schoolData } from "./schools";

export interface StateSchools {
  state: string;
  schoolCount: number;
}

/**
 * Number of universities per US state, computed from the school list.
 * International schools are excluded from the state choropleth.
 */
const stateTotals: Record<string, number> = {};
for (const school of schoolData) {
  if (school.international) continue;
  stateTotals[school.state] = (stateTotals[school.state] || 0) + 1;
}

export const stateData: StateSchools[] = Object.entries(stateTotals).map(
  ([state, schoolCount]) => ({ state, schoolCount })
);

/** Number of universities in a given state (0 if none). */
export function getSchoolCountForState(stateName: string): number {
  return stateTotals[stateName] || 0;
}

/** Highest per-state university count (for the color scale domain). */
export function getMaxStateCount(): number {
  return Math.max(...Object.values(stateTotals), 0);
}

/** How many states have at least one university. */
export function getStatesRepresented(): number {
  return Object.values(stateTotals).filter((n) => n > 0).length;
}
