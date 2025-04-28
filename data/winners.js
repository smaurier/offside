// european_cup_winners_fetch.js
// Node.js script to fetch all unique club winners across major UEFA competitions
// Competitions considered:
//  - UEFA Champions League (wd:Q18756)
//  - UEFA Europa League (wd:Q8471)
//  - UEFA Cup Winners’ Cup (wd:Q15756003)
//  - UEFA Super Cup (wd:Q553977)
//  - Inter‑Cities Fairs Cup (wd:Q245375)
//  - UEFA Europa Conference League (wd:Q113904331)
//
// The script queries Wikidata SPARQL endpoint, extracts basic metadata for each club and
// outputs a JSON array following the structure hinted by the user.
// -----------------------------------------------------------------------------
// Usage (Node ≥18):
//   $ node european_cup_winners_fetch.js > european_cup_winners.json
// -----------------------------------------------------------------------------

import fetch from "node-fetch";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/** Convert a club label (e.g. "Real Madrid CF") to a URL‑safe snake_case id */
function labelToId(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

/** Extract latitude / longitude from a GeoSPARQL "Point(lon lat)" literal */
function getLatLon(point) {
  if (!point) return [null, null];
  const match = /Point\(([-0-9.]+) ([-0-9.]+)\)/.exec(point.value);
  return match ? [parseFloat(match[2]), parseFloat(match[1])] : [null, null];
}

async function fetchWinners() {
  const endpoint = "https://query.wikidata.org/sparql";

  const comps = [
    "wd:Q18756", // UCL
    "wd:Q8471", // UEL
    "wd:Q15756003", // CWC
    "wd:Q553977", // Super Cup
    "wd:Q245375", // Fairs Cup
    "wd:Q113904331", // Conference League
  ].join(" ");

  const query = `
    SELECT DISTINCT ?club ?clubLabel ?countryLabel ?founded ?coord ?logo WHERE {
      VALUES ?comp { ${comps} }
      ?event wdt:P3450 ?comp .
      ?event wdt:P1346 ?club .                # winner
      OPTIONAL { ?club wdt:P571 ?founded . }
      OPTIONAL { ?club wdt:P17 ?country . }
      OPTIONAL { ?club wdt:P625 ?coord . }
      OPTIONAL { ?club wdt:P154 ?logo . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }`;

  const url = `${endpoint}?format=json&query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "european-cup-winners/1.0 (https://chat.openai.com)" },
  });
  if (!res.ok) throw new Error(`Wikidata request failed: ${res.status}`);

  const data = await res.json();
  const rows = data.results.bindings;

  const clubs = rows.map((r) => {
    const [lat, lon] = getLatLon(r.coord);
    return {
      id: labelToId(r.clubLabel.value),
      name: r.clubLabel.value,
      country: r.countryLabel ? r.countryLabel.value : null,
      founded: r.founded ? new Date(r.founded.value).getUTCFullYear() : null,
      lat,
      long: lon,
      logo: r.logo ? r.logo.value : null,
    };
  });

  // Deduplicate by id (some clubs appear multiple times across competitions)
  const unique = Object.values(
    clubs.reduce((acc, c) => {
      acc[c.id] = acc[c.id] || c;
      return acc;
    }, {})
  ).sort((a, b) => a.name.localeCompare(b.name));

  return unique;
}

(async () => {
  try {
    const winners = await fetchWinners();
    const json = JSON.stringify(winners, null, 2);

    // Write to a file next to the script for convenience
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    fs.writeFileSync(`${__dirname}/european_cup_winners.json`, json);

    console.log(json);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
