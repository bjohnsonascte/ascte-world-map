/**
 * Import school data from a CSV file and generate src/data/schools.ts
 *
 * CSV format (with header row):
 *   name,shortName,country,longitude,latitude,studentCount,logoFile
 *
 * Usage:
 *   node scripts/import-csv.mjs data/schools.csv
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, join } from "path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/import-csv.mjs <path-to-csv>");
  console.error(
    "\nCSV columns: name,shortName,country,longitude,latitude,studentCount,logoFile"
  );
  process.exit(1);
}

const csvPath = resolve(args[0]);
const raw = readFileSync(csvPath, "utf-8");
const lines = raw.trim().split(/\r?\n/);
const header = lines[0].split(",").map((h) => h.trim());

const required = [
  "name",
  "shortName",
  "country",
  "longitude",
  "latitude",
  "studentCount",
  "logoFile",
];
for (const col of required) {
  if (!header.includes(col)) {
    console.error(`Missing required column: ${col}`);
    console.error(`Found columns: ${header.join(", ")}`);
    process.exit(1);
  }
}

const schools = [];
for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(",").map((v) => v.trim());
  if (values.length < header.length) continue;

  const row = {};
  header.forEach((col, idx) => {
    row[col] = values[idx];
  });

  schools.push({
    name: row.name,
    shortName: row.shortName,
    country: row.country,
    coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)],
    studentCount: parseInt(row.studentCount, 10),
    logoUrl: `/logos/${row.logoFile}`,
  });
}

const tsContent = `export interface School {
  name: string;
  shortName: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  studentCount: number;
  logoUrl: string;
}

export const schoolData: School[] = ${JSON.stringify(schools, null, 2)};

export function getTotalSchoolCount(): number {
  return schoolData.length;
}
`;

const outPath = join(import.meta.dirname, "..", "src", "data", "schools.ts");
writeFileSync(outPath, tsContent, "utf-8");

console.log(`Imported ${schools.length} schools from ${csvPath}`);
console.log(`Written to ${outPath}`);
