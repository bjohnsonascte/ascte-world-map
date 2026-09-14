import { schoolData } from "./schools";

export interface CountryStudents {
  country: string;
  studentCount: number;
}

const countryTotals: Record<string, number> = {};
for (const school of schoolData) {
  countryTotals[school.country] =
    (countryTotals[school.country] || 0) + school.studentCount;
}

export const studentData: CountryStudents[] = Object.entries(countryTotals).map(
  ([country, studentCount]) => ({ country, studentCount })
);

export function getStudentCount(countryName: string): number {
  return countryTotals[countryName] || 0;
}

export function getMaxStudentCount(): number {
  return Math.max(...Object.values(countryTotals), 0);
}

export function getTotalStudentCount(): number {
  return Object.values(countryTotals).reduce((sum, n) => sum + n, 0);
}

export function getCountriesWithStudents(): number {
  return Object.values(countryTotals).filter((n) => n > 0).length;
}
