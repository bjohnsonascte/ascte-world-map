import { describe, it, expect } from "vitest";
import {
  studentData,
  getStudentCount,
  getMaxStudentCount,
  getTotalStudentCount,
  getCountriesWithStudents,
} from "../data/students";
import { schoolData } from "../data/schools";

describe("student data (computed from schools)", () => {
  it("has entries for every country with schools", () => {
    const uniqueCountries = new Set(schoolData.map((s) => s.country));
    expect(studentData).toHaveLength(uniqueCountries.size);
  });

  it("computes country totals from school data", () => {
    const ukSchools = schoolData.filter((s) => s.country === "United Kingdom");
    const expected = ukSchools.reduce((sum, s) => sum + s.studentCount, 0);
    expect(getStudentCount("United Kingdom")).toBe(expected);
  });

  it("returns 0 for countries with no schools", () => {
    expect(getStudentCount("Antarctica")).toBe(0);
  });

  it("getMaxStudentCount returns the highest country total", () => {
    const max = getMaxStudentCount();
    expect(max).toBeGreaterThan(0);
    const allCounts = studentData.map((d) => d.studentCount);
    expect(max).toBe(Math.max(...allCounts));
  });

  it("getTotalStudentCount sums all school students", () => {
    const fromSchools = schoolData.reduce((sum, s) => sum + s.studentCount, 0);
    expect(getTotalStudentCount()).toBe(fromSchools);
  });

  it("getCountriesWithStudents counts non-zero countries", () => {
    const count = getCountriesWithStudents();
    expect(count).toBeGreaterThan(0);
  });
});
