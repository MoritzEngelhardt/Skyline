import { useState, useEffect } from "react";
import { assignColor } from "../data/buildings";

const SPARQL = `
SELECT DISTINCT ?building ?buildingLabel ?height ?floors ?inception
  ?lat ?lng ?countryLabel ?cityLabel ?architectLabel ?article
WHERE {
  ?building wdt:P31/wdt:P279* wd:Q11303 .
  ?building p:P2048 ?heightStmt .
  ?heightStmt psv:P2048 ?heightValue .
  ?heightValue wikibase:quantityAmount ?height .
  ?heightValue wikibase:quantityUnit wd:Q11573 .
  FILTER(?height >= 150 && ?height <= 1000)
  FILTER NOT EXISTS { ?building wdt:P31 wd:Q18142 }
  FILTER NOT EXISTS { ?building wdt:P31 wd:Q1459902 }
  FILTER NOT EXISTS { ?building wdt:P576 ?dissolved }
  OPTIONAL { ?building wdt:P571 ?inception }
  OPTIONAL { ?building wdt:P1101 ?floors }
  OPTIONAL { ?building p:P625/ps:P625 ?coord . BIND(geof:latitude(?coord) AS ?lat) BIND(geof:longitude(?coord) AS ?lng) }
  OPTIONAL { ?building wdt:P17 ?country }
  OPTIONAL { ?building wdt:P131 ?city }
  OPTIONAL { ?building wdt:P84 ?architect }
  OPTIONAL { ?article schema:about ?building ; schema:isPartOf <https://en.wikipedia.org/> }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
} ORDER BY DESC(?height) LIMIT 500
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

export function useWikidata() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);

    (async () => {
      try {
        const res = await fetch(
          `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(SPARQL)}`,
          { headers: { Accept: "application/sparql-results+json" }, signal: ctrl.signal }
        );
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const rows = data?.results?.bindings || [];

        const seen = new Map();
        rows.forEach(r => {
          const q = r.building?.value?.replace("http://www.wikidata.org/entity/", "");
          if (!q) return;
          const sc = r2 => (r2.floors?1:0)+(r2.architectLabel?1:0)+(r2.lat?1:0)+(r2.article?1:0)+(r2.inception?1:0);
          if (!seen.has(q) || sc(r) > sc(seen.get(q))) seen.set(q, r);
        });

        const res2 = [];
        let i = 0;
        seen.forEach((r, q) => {
          let h = parseFloat(r.height?.value);
          if (!h) return;
          if (HEIGHT_FIX[q]) h = HEIGHT_FIX[q];
          if (h > 830 && q !== "Q12495") return;
          const name = r.buildingLabel?.value || "";
          if (!name || /^Q\d+$/.test(name)) return;
          const year = parseYear(r.inception?.value);
          res2.push({
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
        res2.sort((a, b) => b.height - a.height);
        setBuildings(res2);
      } catch (e) {
        setError(e.name === "AbortError" ? "Wikidata timed out (20s)" : e.message);
      } finally { setLoading(false); }
    })();
    return () => { clearTimeout(timer); ctrl.abort(); };
  }, []);

  return { buildings, loading, error };
}
