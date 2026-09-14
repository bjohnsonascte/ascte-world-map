import { describe, it, expect } from "vitest";
import {
  stateData,
  getSchoolCountForState,
  getMaxStateCount,
  getStatesRepresented,
} from "../data/states";
import { schoolData } from "../data/schools";

describe("state data (computed from schools)", () => {
  it("has an entry for every US state with schools", () => {
    const uniqueStates = new Set(
      schoolData.filter((s) => !s.international).map((s) => s.state)
    );
    expect(stateData).toHaveLength(uniqueStates.size);
  });

  it("computes state totals from school data", () => {
    const alSchools = schoolData.filter(
      (s) => s.state === "Alabama" && !s.international
    );
    expect(getSchoolCountForState("Alabama")).toBe(alSchools.length);
  });

  it("returns 0 for states with no schools", () => {
    expect(getSchoolCountForState("Wyoming")).toBe(0);
  });

  it("excludes international schools from state counts", () => {
    // Ireland / Australia should not appear as US states
    expect(getSchoolCountForState("Ireland")).toBe(0);
    expect(getSchoolCountForState("Australia")).toBe(0);
  });

  it("getMaxStateCount returns the highest state total", () => {
    const max = getMaxStateCount();
    expect(max).toBeGreaterThan(0);
    const allCounts = stateData.map((d) => d.schoolCount);
    expect(max).toBe(Math.max(...allCounts));
  });

  it("getStatesRepresented counts non-zero states", () => {
    expect(getStatesRepresented()).toBe(stateData.length);
  });
});
