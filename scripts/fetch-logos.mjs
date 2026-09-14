/**
 * Downloads a logo for every school domain in src/data/schools.ts into
 * public/logos/<domain>.png so the app can run fully offline.
 *
 * Sources, tried in order (both return PNG):
 *   1. Clearbit  — real, high-res logos
 *   2. Google favicons — near-universal fallback
 *
 * Re-run any time with:  npm run fetch-logos
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const schoolsPath = path.join(here, "../src/data/schools.ts");
const outDir = path.join(here, "../public/logos");
mkdirSync(outDir, { recursive: true });

const src = readFileSync(schoolsPath, "utf8");
const domains = [...src.matchAll(/domain:\s*"([^"]+)"/g)].map((m) => m[1]);
const unique = [...new Set(domains)];

function sourcesFor(domain) {
  return [
    `https://logo.clearbit.com/${domain}?size=128`,
    `https://unavatar.io/${domain}?fallback=false`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://${domain}/favicon.ico`,
    `https://www.${domain}/favicon.ico`,
    `https://www.google.com/s2/favicons?domain=www.${domain}&sz=128`,
    `https://logo.clearbit.com/${domain}`,
    `https://unavatar.io/${domain}`,
  ];
}

// Validate by magic bytes rather than headers (some servers mislabel type).
function looksLikeImage(buf) {
  if (buf.length < 70) return false;
  const b = buf;
  const png = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
  const jpg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const gif = b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38;
  const ico = b[0] === 0x00 && b[1] === 0x00 && b[2] === 0x01 && b[3] === 0x00;
  const webp =
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46; // RIFF
  const svg = b[0] === 0x3c; // '<'
  return png || jpg || gif || ico || webp || svg;
}

async function tryFetch(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (!looksLikeImage(buf)) return null;
    return buf;
  } catch {
    return null;
  }
}

let ok = 0;
const failed = [];

for (const domain of unique) {
  const outFile = path.join(outDir, `${domain}.png`);
  // Skip ones we already have so re-runs only fetch what's missing.
  if (existsSync(outFile)) {
    ok++;
    continue;
  }
  let saved = false;
  for (const url of sourcesFor(domain)) {
    const buf = await tryFetch(url);
    if (buf) {
      writeFileSync(outFile, buf);
      ok++;
      saved = true;
      break;
    }
  }
  if (!saved) failed.push(domain);
  process.stdout.write(`${saved ? "✓" : "✗"} ${domain}\n`);
}

console.log(`\nSaved ${ok}/${unique.length} logos to public/logos/`);
if (failed.length) {
  console.log(`Failed (${failed.length}): ${failed.join(", ")}`);
}
