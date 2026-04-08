import { useState, useEffect } from "react";
import { assignColor } from "../data/buildings";

// Query 1: the original proven skyscraper query (wd:Q11303)
// Height >= 150m — this always worked and returns ~100-200 results reliably.
const SPARQL_SKYSCRAPERS = `
SELECT DISTINCT ?building ?buildingLabel ?height ?floors ?inception
  ?lat ?lng ?countryLabel ?cityLabel ?architectLabel ?article
WHERE {
  ?building wdt:P31/wdt:P279* wd:Q11303 .
  ?building p:P2048 ?heightStmt .
  ?heightStmt psv:P2048 ?heightValue .
  ?heightValue wikibase:quantityAmount ?height .
  ?heightValue wikibase:quantityUnit wd:Q11573 .
  FILTER(?height >= 150 && ?height <= 1100)
  FILTER NOT EXISTS { ?building wdt:P576 ?dissolved }
  OPTIONAL { ?building wdt:P571 ?inception }
  OPTIONAL { ?building wdt:P1101 ?floors }
  OPTIONAL { ?building p:P625/ps:P625 ?coord . BIND(geof:latitude(?coord) AS ?lat) BIND(geof:longitude(?coord) AS ?lng) }
  OPTIONAL { ?building wdt:P17 ?country }
  OPTIONAL { ?building wdt:P131 ?city }
  OPTIONAL { ?building wdt:P84 ?architect }
  OPTIONAL { ?article schema:about ?building ; schema:isPartOf <https://en.wikipedia.org/> }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
} ORDER BY DESC(?height) LIMIT 300
`;

// Query 2: broader building types that Wikidata doesn't tag as "skyscraper"
// Direct P31 only — no transitive subclass walk — fast
// Catches European buildings tagged as high-rise, residential skyscraper,
// tower block, supertall, or even just "building"
const SPARQL_HIGHRISE = `
SELECT DISTINCT ?building ?buildingLabel ?height ?floors ?inception
  ?lat ?lng ?countryLabel ?cityLabel ?architectLabel ?article
WHERE {
  { ?building wdt:P31 wd:Q641226 }
  UNION { ?building wdt:P31 wd:Q856584 }
  UNION { ?building wdt:P31 wd:Q1021645 }
  UNION { ?building wdt:P31 wd:Q56842926 }
  UNION { ?building wdt:P31 wd:Q18142 }
  ?building p:P2048 ?heightStmt .
  ?heightStmt psv:P2048 ?heightValue .
  ?heightValue wikibase:quantityAmount ?height .
  ?heightValue wikibase:quantityUnit wd:Q11573 .
  FILTER(?height >= 100 && ?height <= 1100)
  FILTER NOT EXISTS { ?building wdt:P576 ?dissolved }
  OPTIONAL { ?building wdt:P571 ?inception }
  OPTIONAL { ?building wdt:P1101 ?floors }
  OPTIONAL { ?building p:P625/ps:P625 ?coord . BIND(geof:latitude(?coord) AS ?lat) BIND(geof:longitude(?coord) AS ?lng) }
  OPTIONAL { ?building wdt:P17 ?country }
  OPTIONAL { ?building wdt:P131 ?city }
  OPTIONAL { ?building wdt:P84 ?architect }
  OPTIONAL { ?article schema:about ?building ; schema:isPartOf <https://en.wikipedia.org/> }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
} ORDER BY DESC(?height) LIMIT 300
`;

const HEIGHT_FIX = { Q9188:443.2, Q131013:442.1, Q36524:318.9, Q12495:828, Q836602:508, Q158477:541.3 };

function parseYear(v) { if (!v) return null; const m = String(v).match(/(\d{4})/); return m ? parseInt(m[1]) : null; }
function wikiSlug(url) { if (!url) return null; const m = url.match(/wikipedia\.org\/wiki\/(.+)$/); return m ? decodeURIComponent(m[1]) : null; }
function inferStatus(year) {
  if (!year) return "planned";
  const now = new Date().getFullYear();
  if (year > now) return "construction";
  return "completed";
}

function parseRows(rows) {
  const seen = new Map();
  rows.forEach(r => {
    const q = r.building?.value?.replace("http://www.wikidata.org/entity/", "");
    if (!q) return;
    const sc = r2 => (r2.floors?1:0)+(r2.architectLabel?1:0)+(r2.lat?1:0)+(r2.article?1:0)+(r2.inception?1:0);
    if (!seen.has(q) || sc(r) > sc(seen.get(q))) seen.set(q, r);
  });
  return seen;
}

function buildingsFromRows(seen, startIndex) {
  const res = [];
  let i = startIndex;
  seen.forEach((r, q) => {
    let h = parseFloat(r.height?.value);
    if (!h) return;
    if (HEIGHT_FIX[q]) h = HEIGHT_FIX[q];
    if (h > 1100 && q !== "Q12495") return;
    const name = r.buildingLabel?.value || "";
    if (!name || /^Q\d+$/.test(name)) return;
    const year = parseYear(r.inception?.value);
    res.push({
      id: q, name,
      city: r.cityLabel?.value || "",
      country: r.countryLabel?.value || "",
      height: h,
      floors: r.floors?.value ? parseInt(r.floors.value) : null,
      year, status: inferStatus(year),
      use: "Mixed", style: "Modern",
      lat: r.lat?.value ? parseFloat(r.lat.value) : null,
      lng: r.lng?.value ? parseFloat(r.lng.value) : null,
      color: assignColor(i++),
      wiki: wikiSlug(r.article?.value),
      architect: r.architectLabel?.value || null,
      cost: null,
    });
  });
  return res;
}

async function runQuery(sparql, signal) {
  const res = await fetch(
    `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`,
    { headers: { Accept: "application/sparql-results+json" }, signal }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data?.results?.bindings || [];
}

export function useWikidata() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      let allResults = [];
      let hadError = null;

      // ── Query 1: skyscrapers (proven, must-succeed) ──
      try {
        console.log("[Skyline] Query 1: fetching skyscrapers (Q11303, ≥150m)...");
        const timer1 = setTimeout(() => ctrl.abort(), 25000);
        const rows1 = await runQuery(SPARQL_SKYSCRAPERS, ctrl.signal);
        clearTimeout(timer1);
        console.log("[Skyline] Query 1: got", rows1.length, "raw rows");
        const seen1 = parseRows(rows1);
        allResults = buildingsFromRows(seen1, 0);
        console.log("[Skyline] Query 1: parsed into", allResults.length, "unique buildings");
        allResults.sort((a, b) => b.height - a.height);
        setBuildings([...allResults]);
      } catch (e) {
        hadError = e.name === "AbortError" ? "Wikidata timed out" : e.message;
        console.error("[Skyline] Query 1 FAILED:", hadError);
      }

      // ── Query 2: broader building types (bonus, can fail gracefully) ──
      if (!ctrl.signal.aborted) {
        try {
          console.log("[Skyline] Query 2: fetching high-rise/tower-block/supertall...");
          const ctrl2 = new AbortController();
          const timer2 = setTimeout(() => ctrl2.abort(), 20000);
          const rows2 = await runQuery(SPARQL_HIGHRISE, ctrl2.signal);
          clearTimeout(timer2);
          console.log("[Skyline] Query 2: got", rows2.length, "raw rows");
          const seen2 = parseRows(rows2);
          const extra = buildingsFromRows(seen2, allResults.length);
          console.log("[Skyline] Query 2: parsed into", extra.length, "buildings");

          // Merge: add buildings not already in the set
          const existingIds = new Set(allResults.map(b => b.id));
          const newOnes = extra.filter(b => !existingIds.has(b.id));
          console.log("[Skyline] Query 2: merging", newOnes.length, "new buildings (", extra.length - newOnes.length, "duplicates skipped)");
          if (newOnes.length > 0) {
            allResults = [...allResults, ...newOnes];
            allResults.sort((a, b) => b.height - a.height);
            setBuildings([...allResults]);
          }
          console.log("[Skyline] Total:", allResults.length, "buildings");
        } catch (e2) {
          console.warn("[Skyline] Query 2 failed (non-critical):", e2.message);
        }
      } else {
        console.warn("[Skyline] Query 2 skipped — Query 1 aborted the controller");
      }

      if (hadError && allResults.length === 0) setError(hadError);
      setLoading(false);
    })();

    return () => ctrl.abort();
  }, []);

  return { buildings, loading, error };
}
