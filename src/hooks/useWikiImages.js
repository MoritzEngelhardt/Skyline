import { useState, useEffect, useRef } from "react";
import { IMAGE_OVERRIDES } from "../data/custom-buildings";

export function useWikiData(buildings) {
  const [images, setImages] = useState({ ...IMAGE_OVERRIDES });
  const [extracts, setExtracts] = useState({});
  const fetched = useRef(new Set());

  useEffect(() => {
    const toF = buildings.filter(b => b.wiki && !fetched.current.has(b.wiki));
    if (!toF.length) return;
    const sm = {};
    toF.forEach(b => { if (!sm[b.wiki]) sm[b.wiki] = []; sm[b.wiki].push(b.id); fetched.current.add(b.wiki); });
    const slugs = Object.keys(sm);

    (async () => {
      const ni = {}, ne = {};
      for (let i = 0; i < slugs.length; i += 8) {
        const batch = slugs.slice(i, i + 8);
        try {
          const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(batch.join("|"))}&prop=pageimages|extracts&pithumbsize=500&exintro=1&explaintext=1&format=json&origin=*`);
          const d = await r.json();
          Object.values(d?.query?.pages || {}).forEach(p => {
            const sl = p.title.replace(/ /g, "_");
            Object.entries(sm).forEach(([os, ids]) => {
              if (sl === os || sl.replace(/_/g, " ").toLowerCase() === os.replace(/_/g, " ").toLowerCase()) {
                ids.forEach(id => {
                  if (p.thumbnail?.source && !IMAGE_OVERRIDES[id]) ni[id] = p.thumbnail.source;
                  if (p.extract) ne[id] = p.extract;
                });
              }
            });
          });
        } catch {}
      }
      setImages(p => ({ ...p, ...ni }));
      setExtracts(p => ({ ...p, ...ne }));

      // Also apply custom img fields from buildings
      const fromBuildings = {};
      buildings.forEach(b => { if (b.img && !IMAGE_OVERRIDES[b.id]) fromBuildings[b.id] = b.img; });
      if (Object.keys(fromBuildings).length) setImages(p => ({ ...p, ...fromBuildings }));
    })();
  }, [buildings]);

  return { images, extracts };
}
