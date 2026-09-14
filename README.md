# ASCTE Student World Map

Interactive world map showing ASCTE students attending schools across the globe. Built with React, TypeScript, Vite, Tailwind CSS, and [react-simple-maps](https://www.react-simple-maps.io/).

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  components/
    WorldMap.tsx        # Main choropleth world map
    SchoolMarkers.tsx   # Logo markers on the map
    SchoolList.tsx      # Searchable / filterable sidebar list
    Legend.tsx           # Color-scale legend
    Tooltip.tsx         # Hover tooltip
  data/
    schools.ts          # School data (single source of truth)
    students.ts         # Country totals computed from schools
  types/
    react-simple-maps.d.ts
scripts/
  import-csv.mjs       # Import schools from CSV
data/
  schools-sample.csv    # Sample CSV for import script
public/
  logos/                # School logo images
```

## Adding / Updating Schools

1. **Manually** – edit `src/data/schools.ts` directly.
2. **Via CSV** – update `data/schools-sample.csv` and run:
   ```bash
   node scripts/import-csv.mjs data/schools-sample.csv
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check & build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint with ESLint |

## Deployment

Configured for Vercel (see `vercel.json`). Push to your repo and connect to Vercel for automatic deploys.
