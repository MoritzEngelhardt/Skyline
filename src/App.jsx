import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { FALLBACK_BUILDINGS, DECADES, USES, REGIONS, getRegion, getDecade, getStatusLabel, computeTallestBadges, assignColor } from "./data/buildings";
import { CUSTOM_BUILDINGS } from "./data/custom-buildings";
import { useWikidata } from "./hooks/useWikidata";
import { useWikiData } from "./hooks/useWikiImages";
import { useTheme } from "./hooks/useTheme";
import Tower from "./components/Tower";
import Thumb from "./components/Thumb";
import WorldMap from "./components/WorldMap";
import CompareView from "./components/CompareView";
import DetailPage from "./components/DetailPage";

function loadFavs() { try { return JSON.parse(localStorage.getItem("skyline_favs") || "[]"); } catch { return []; } }

// ── Country flag emoji helper ──
const COUNTRY_FLAGS = {
  "uae":"🇦🇪","united arab emirates":"🇦🇪","saudi arabia":"🇸🇦","qatar":"🇶🇦","bahrain":"🇧🇭","kuwait":"🇰🇼","oman":"🇴🇲",
  "china":"🇨🇳","taiwan":"🇹🇼","south korea":"🇰🇷","malaysia":"🇲🇾","japan":"🇯🇵","vietnam":"🇻🇳","indonesia":"🇮🇩","philippines":"🇵🇭","singapore":"🇸🇬","hong kong":"🇭🇰","india":"🇮🇳","thailand":"🇹🇭",
  "usa":"🇺🇸","united states":"🇺🇸","canada":"🇨🇦","mexico":"🇲🇽","panama":"🇵🇦",
  "uk":"🇬🇧","united kingdom":"🇬🇧","germany":"🇩🇪","france":"🇫🇷","spain":"🇪🇸","italy":"🇮🇹","poland":"🇵🇱","russia":"🇷🇺","turkey":"🇹🇷","netherlands":"🇳🇱","sweden":"🇸🇪","norway":"🇳🇴","denmark":"🇩🇰","finland":"🇫🇮","austria":"🇦🇹","switzerland":"🇨🇭","belgium":"🇧🇪","ireland":"🇮🇪","portugal":"🇵🇹","czech republic":"🇨🇿","romania":"🇷🇴","hungary":"🇭🇺","greece":"🇬🇷",
  "australia":"🇦🇺","new zealand":"🇳🇿","brazil":"🇧🇷","argentina":"🇦🇷","chile":"🇨🇱","colombia":"🇨🇴","egypt":"🇪🇬","south africa":"🇿🇦","nigeria":"🇳🇬","kenya":"🇰🇪","israel":"🇮🇱",
};
function getFlag(country) {
  if (!country) return "";
  const f = COUNTRY_FLAGS[country.toLowerCase()];
  return f || "";
}

// ── Animated number component ──
function AnimNum({ value, duration = 500 }) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef(null);
  const startRef = useRef({ val: value, time: 0 });
  useEffect(() => {
    const from = display;
    const to = value;
    if (from === to) return;
    const startTime = performance.now();
    startRef.current = { val: from, time: startTime };
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);
  return display;
}

function mergeCustom(wdBuildings) {
  const base = wdBuildings.length > 0 ? wdBuildings : FALLBACK_BUILDINGS;
  const ids = new Set(base.map((b) => b.id));
  const extras = CUSTOM_BUILDINGS
    .filter((c) => !ids.has(c.id))
    .map((c, i) => ({ ...c, color: c.color || assignColor(base.length + i), status: c.status || "completed", architect: c.architect || c.arch || null }));
  const overrideMap = {};
  CUSTOM_BUILDINGS.forEach((c) => { if (ids.has(c.id)) overrideMap[c.id] = c; });
  const merged = base.map((b) => overrideMap[b.id] ? { ...b, ...overrideMap[b.id] } : b);
  return [...merged, ...extras].sort((a, b) => b.height - a.height);
}

function loc(b) { return [b.city, b.country].filter(Boolean).join(", ") || "Unknown"; }
function locWithFlag(b) { const flag = getFlag(b.country); return (flag ? flag + " " : "") + loc(b); }

export default function App() {
  const { t, mode, toggle: toggleTheme } = useTheme();
  const wd = useWikidata();
  const allBuildings = useMemo(() => mergeCustom(wd.buildings), [wd.buildings]);
  const maxH = useMemo(() => Math.max(...allBuildings.map((b) => b.height), 830), [allBuildings]);
  const tallestBadges = useMemo(() => computeTallestBadges(allBuildings), [allBuildings]);
  const { images, extracts } = useWikiData(allBuildings);

  const [sortBy, setSortBy] = useState("height");
  const [decade, setDecade] = useState("All");
  const [use, setUse] = useState("All");
  const [region, setRegion] = useState("All");
  // Status: additive toggles (completed always shown, toggle U/C and planned)
  const [showUC, setShowUC] = useState(false);
  const [showPlanned, setShowPlanned] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("skyline");
  const [compareIds, setCompareIds] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [expandedCity, setExpandedCity] = useState(null);
  const [favs, setFavs] = useState(loadFavs);
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hoveredTower, setHoveredTower] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => { setTimeout(() => setReady(true), 60); }, []);
  useEffect(() => { localStorage.setItem("skyline_favs", JSON.stringify(favs)); }, [favs]);

  const toggleFav = useCallback((id) => setFavs((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]), []);

  // Count unfinished buildings for the toggles
  const unfinishedCounts = useMemo(() => {
    let uc = 0, pl = 0;
    allBuildings.forEach((b) => {
      if (b.status === "under_construction") uc++;
      else if (b.status === "planned" || (!b.year && b.status !== "completed")) pl++;
    });
    return { uc, pl };
  }, [allBuildings]);

  const filtered = useMemo(() => {
    let list = allBuildings.filter((s) => {
      if (showFavsOnly && !favs.includes(s.id)) return false;
      if (decade !== "All" && getDecade(s.year) !== decade) return false;
      if (use !== "All" && !(s.use || "").toLowerCase().includes(use.toLowerCase())) return false;
      if (region !== "All" && getRegion(s.country) !== region) return false;
      // Status filtering: completed always shown, others are opt-in
      const st = s.status || "completed";
      if (st === "under_construction" && !showUC) return false;
      if (st === "planned" && !showPlanned) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!(s.name || "").toLowerCase().includes(q) &&
            !(s.city || "").toLowerCase().includes(q) &&
            !(s.country || "").toLowerCase().includes(q) &&
            !(s.architect || "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
    list.sort((a, b) => {
      if (sortBy === "height") return b.height - a.height;
      if (sortBy === "floors") return (b.floors || 0) - (a.floors || 0);
      if (sortBy === "year") return (a.year || 9999) - (b.year || 9999);
      return (a.name || "").localeCompare(b.name || "");
    });
    return list;
  }, [allBuildings, sortBy, decade, use, region, showUC, showPlanned, search, showFavsOnly, favs]);

  const detail = selected && !compareMode ? allBuildings.find((s) => s.id === selected) : null;
  const detailBuilding = detailId ? allBuildings.find((s) => s.id === detailId) : null;

  const handleSelect = (id) => {
    if (compareMode) setCompareIds((p) => p.includes(id) ? p.filter((x) => x !== id) : p.length < 5 ? [...p, id] : p);
    else setSelected(selected === id ? null : id);
  };
  const openDetail = (id) => { setDetailId(id); };

  // ── KEYBOARD NAVIGATION ──
  const handleKey = useCallback((e) => {
    if (e.key === "Escape") {
      if (detailId) { setDetailId(null); return; }
      if (selected) { setSelected(null); return; }
    }
    if (e.key === "Enter" && selected && !detailId) { e.preventDefault(); openDetail(selected); return; }
    if ((e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") && !detailId) {
      e.preventDefault();
      const dir = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : -1;
      if (!filtered.length) return;
      if (!selected) { setSelected(filtered[0].id); return; }
      const idx = filtered.findIndex((b) => b.id === selected);
      const next = Math.max(0, Math.min(filtered.length - 1, idx + dir));
      setSelected(filtered[next].id);
    }
    if (e.key === "f" && selected && !detailId && !e.metaKey && !e.ctrlKey) {
      if (document.activeElement?.tagName === "INPUT") return;
      toggleFav(selected);
    }
    if (e.key === "/" && !detailId) {
      if (document.activeElement?.tagName === "INPUT") return;
      e.preventDefault();
      document.querySelector(".si")?.focus();
    }
  }, [selected, detailId, filtered, toggleFav]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const stats = useMemo(() => ({
    avg: Math.round(filtered.reduce((s, b) => s + b.height, 0) / (filtered.length || 1)),
    cities: new Set(filtered.map((b) => b.city).filter(Boolean)).size,
    countries: new Set(filtered.map((b) => b.country).filter(Boolean)).size,
    total: filtered.length,
  }), [filtered]);

  const imgCount = Object.keys(images).length;
  const activeFilterCount = (decade !== "All" ? 1 : 0) + (use !== "All" ? 1 : 0) + (region !== "All" ? 1 : 0) + (showUC ? 1 : 0) + (showPlanned ? 1 : 0) + (showFavsOnly ? 1 : 0);

  // ── DETAIL PAGE (full screen) ──
  if (detailBuilding) {
    return (
      <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif", color: t.text }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
        <style>{`@keyframes fi{from{opacity:0}to{opacity:1}}`}</style>
        <div style={{ maxWidth: 580, margin: "0 auto", padding: "32px 20px 48px" }}>
          <DetailPage building={detailBuilding} allBuildings={allBuildings} image={images[detailBuilding.id]}
            extract={extracts[detailBuilding.id]} isFav={favs.includes(detailBuilding.id)}
            onToggleFav={() => toggleFav(detailBuilding.id)} onClose={() => setDetailId(null)}
            isTallestRecord={tallestBadges.has(detailBuilding.id)} maxH={maxH} />
        </div>
      </div>
    );
  }

  // ── MAIN ──
  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif", color: t.text, position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />

      {mode === "dark" && <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {Array.from({ length: 45 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", width: Math.random() > .85 ? 1.5 : 1, height: Math.random() > .85 ? 1.5 : 1, borderRadius: "50%", background: "#fff", opacity: .04 + Math.random() * .14, left: `${Math.random() * 100}%`, top: `${Math.random() * 40}%`, animation: `tw ${2 + Math.random() * 5}s ease-in-out infinite`, animationDelay: `${Math.random() * 4}s` }} />
        ))}
      </div>}

      <style>{`
        @keyframes tw{0%,100%{opacity:.04}50%{opacity:.25}}
        @keyframes su{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}
        @keyframes tipIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .p{padding:4px 10px;border-radius:16px;border:1px solid ${t.pillBorder};background:${t.pill};color:${t.pillText};font-size:10.5px;cursor:pointer;transition:all .15s;white-space:nowrap;font-family:inherit}
        .p:hover{background:${t.pillHover};color:${t.text}}.p.a{background:${t.accentBg};border-color:${t.accentBorder};color:${t.accent}}
        .tc{cursor:pointer;transition:transform .15s;display:flex;flex-direction:column;align-items:center}.tc:hover{transform:translateY(-3px)}
        .si{background:${t.inputBg};border:1px solid ${t.inputBorder};border-radius:7px;padding:7px 10px 7px 26px;color:${t.text};font-size:12px;outline:none;width:100%;max-width:210px;font-family:inherit}
        .si::placeholder{color:${t.textFaint}}.si:focus{border-color:${t.accentBorder};background:${t.surfaceHover}}
        .vb{padding:5px 9px;border-radius:6px;border:1px solid ${t.pillBorder};background:transparent;color:${t.textMuted};font-size:10px;cursor:pointer;font-family:inherit;transition:all .15s}
        .vb:hover{background:${t.surfaceHover};color:${t.text}}.vb.a{background:${t.accentBg};border-color:${t.accentBorder};color:${t.accent}}
        .lr{display:grid;grid-template-columns:36px 2fr 1.2fr 56px 30px 30px 22px;gap:2px;padding:6px 8px;border-bottom:1px solid ${t.border};align-items:center;cursor:pointer;transition:background .1s;font-size:11px}.lr:hover{background:${t.surfaceHover}}
        .cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:14px}
        .float-panel{position:fixed;top:10px;right:10px;width:320px;max-height:calc(100vh - 20px);overflow-y:auto;z-index:50;border-radius:14px;animation:slideIn .25s ease}
        @media(max-width:700px){.float-panel{position:fixed;bottom:0;right:0;left:0;top:auto;width:100%;max-height:55vh;border-radius:14px 14px 0 0}}
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "32px 24px 48px" }}>
        {/* Header */}
        <div style={{ animation: ready ? "su .4s ease" : "none", opacity: ready ? 1 : 0, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 900, color: t.textStrong, letterSpacing: "-.3px" }}>SKYLINE</h1>
            <span style={{ fontSize: 9, color: t.textFaint, letterSpacing: 4, textTransform: "uppercase", fontWeight: 300 }}>explorer</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
              <button onClick={toggleTheme} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20, padding: "4px 10px", cursor: "pointer", fontSize: 13, color: t.text, fontFamily: "inherit" }}>{mode === "dark" ? "☀" : "🌙"}</button>
              <span style={{ fontSize: 8, color: t.textGhost }}>{wd.loading ? "loading wikidata…" : `${allBuildings.length} buildings`}{imgCount > 0 && ` · ${imgCount}📷`}</span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: t.textMuted, marginTop: 4, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <span><span style={{ fontWeight: 600, color: t.text, fontSize: 13 }}><AnimNum value={stats.total} /></span> buildings</span>
            <span><span style={{ fontWeight: 600, color: t.text, fontSize: 13 }}><AnimNum value={stats.cities} /></span> cities</span>
            <span><span style={{ fontWeight: 600, color: t.text, fontSize: 13 }}><AnimNum value={stats.countries} /></span> countries</span>
            <span>avg <span style={{ fontWeight: 600, color: t.accent, fontSize: 13 }}><AnimNum value={stats.avg} /></span>m</span>
            {favs.length > 0 && <span style={{ color: t.fav }}>{favs.length} ♥</span>}
          </p>
        </div>

        {/* Controls */}
        <div style={{ animation: ready ? "su .4s ease .04s both" : "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          {/* Primary bar: Search + Sort + More Filters + Views */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", opacity: 0.35 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2.5"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input className="si" placeholder='Search (or press "/")' value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              <span style={{ fontSize: 9, color: t.textMuted, marginRight: 2 }}>Sort:</span>
              {[["height", "Tallest"], ["floors", "Floors"], ["year", "Oldest"], ["name", "A–Z"]].map(([k, l]) => (
                <button key={k} className={`p ${sortBy === k ? "a" : ""}`} onClick={() => setSortBy(k)}>{l}</button>
              ))}
            </div>
            <button className="p" onClick={() => setFiltersOpen(!filtersOpen)}
              style={{ display: "flex", alignItems: "center", gap: 4, borderColor: filtersOpen || activeFilterCount > 0 ? t.accentBorder : undefined, color: filtersOpen || activeFilterCount > 0 ? t.accent : undefined, background: filtersOpen || activeFilterCount > 0 ? t.accentBg : undefined }}>
              <span style={{ fontSize: 11 }}>▾</span> Filters {activeFilterCount > 0 && <span style={{ background: t.accent, color: mode === "dark" ? "#0c1220" : "#fff", fontSize: 8, fontWeight: 700, borderRadius: 8, padding: "0 5px", lineHeight: "15px" }}>{activeFilterCount}</span>}
            </button>
            <button className={`p ${showFavsOnly ? "a" : ""}`}
              style={{ borderColor: showFavsOnly ? `${t.fav}55` : undefined, color: showFavsOnly ? t.fav : undefined, background: showFavsOnly ? t.favBg : undefined }}
              onClick={() => setShowFavsOnly(!showFavsOnly)}>♥ {showFavsOnly ? `Fav (${favs.length})` : favs.length || "Favs"}</button>
            <button className={`p ${compareMode ? "a" : ""}`}
              style={{ borderColor: compareMode ? `${t.compare}55` : undefined, color: compareMode ? t.compare : undefined, background: compareMode ? t.compareBg : undefined }}
              onClick={() => { setCompareMode(!compareMode); if (compareMode) setCompareIds([]); }}>
              {compareMode ? `⚖ ${compareIds.length}` : "⚖ Compare"}</button>
            <div style={{ display: "flex", gap: 3, marginLeft: "auto" }}>
              {[["skyline", "▌▐▌"], ["cards", "▦"], ["map", "◎"], ["list", "≡"]].map(([v, ic]) => (
                <button key={v} className={`vb ${view === v ? "a" : ""}`} onClick={() => setView(v)}>{ic} {v[0].toUpperCase() + v.slice(1)}</button>
              ))}
            </div>
          </div>

          {/* Collapsible filters panel */}
          {filtersOpen && (
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 7, animation: "fi .15s ease" }}>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 9, color: t.textMuted, width: 50, flexShrink: 0 }}>Era</span>
                {DECADES.map((d) => <button key={d} className={`p ${decade === d ? "a" : ""}`} onClick={() => setDecade(d)}>{d}</button>)}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 9, color: t.textMuted, width: 50, flexShrink: 0 }}>Use</span>
                {USES.map((u) => <button key={u} className={`p ${use === u ? "a" : ""}`} onClick={() => setUse(u)}>{u}</button>)}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 9, color: t.textMuted, width: 50, flexShrink: 0 }}>Region</span>
                {REGIONS.map((r) => <button key={r} className={`p ${region === r ? "a" : ""}`} onClick={() => setRegion(r)}>{r}</button>)}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 9, color: t.textMuted, width: 50, flexShrink: 0 }}>Include</span>
                <button className={`p ${showUC ? "a" : ""}`}
                  style={{ borderColor: showUC ? "rgba(255,180,100,.3)" : undefined, color: showUC ? "#ffcc88" : undefined, background: showUC ? "rgba(255,180,100,.08)" : undefined }}
                  onClick={() => setShowUC(!showUC)}>⚒ Under Construction {unfinishedCounts.uc > 0 && `(${unfinishedCounts.uc})`}</button>
                <button className={`p ${showPlanned ? "a" : ""}`}
                  style={{ borderColor: showPlanned ? "rgba(160,160,255,.3)" : undefined, color: showPlanned ? "#aab0ff" : undefined, background: showPlanned ? "rgba(160,160,255,.08)" : undefined }}
                  onClick={() => setShowPlanned(!showPlanned)}>📐 Planned {unfinishedCounts.pl > 0 && `(${unfinishedCounts.pl})`}</button>
              </div>
              {activeFilterCount > 0 && (
                <button onClick={() => { setDecade("All"); setUse("All"); setRegion("All"); setShowUC(false); setShowPlanned(false); setShowFavsOnly(false); }}
                  style={{ alignSelf: "flex-start", background: "none", border: "none", color: t.accent, fontSize: 10, cursor: "pointer", fontFamily: "inherit", padding: "2px 0" }}>
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <div style={{ fontSize: 8.5, color: t.textGhost, marginBottom: 14 }}>
          ← → navigate · Enter open · Esc back · F favorite · / search
        </div>

        {/* Compare */}
        {compareMode && compareIds.length > 0 && (
          <CompareView items={compareIds.map((id) => allBuildings.find((b) => b.id === id)).filter(Boolean)}
            images={images} maxH={maxH}
            onRemove={(id) => setCompareIds((p) => p.filter((x) => x !== id))}
            onClose={() => { setCompareIds([]); setCompareMode(false); }} />
        )}

        {/* ── FLOATING DETAIL PANEL ── */}
        {detail && (
          <div className="float-panel" style={{ background: t.mode === "dark" ? "rgba(12,18,32,.97)" : "rgba(255,255,255,.98)", border: `1px solid ${t.border}`, boxShadow: `0 8px 32px ${t.mode === "dark" ? "rgba(0,0,0,.5)" : "rgba(0,0,0,.12)"}`, backdropFilter: "blur(12px)" }}>
            {/* Image header */}
            {images[detail.id] && (
              <div style={{ position: "relative", height: 160, overflow: "hidden", borderRadius: "14px 14px 0 0", cursor: "pointer" }} onClick={() => openDetail(detail.id)}>
                <img src={images[detail.id]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, ${t.mode === "dark" ? "rgba(12,18,32,.9)" : "rgba(255,255,255,.85)"} 100%)` }} />
                <div style={{ position: "absolute", bottom: 8, left: 12, fontSize: 11, color: t.accent, fontWeight: 500 }}>View full details →</div>
              </div>
            )}
            <div style={{ padding: "12px 14px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                    <h2 onClick={() => openDetail(detail.id)} style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: t.textStrong, fontWeight: 700, cursor: "pointer", margin: 0 }}>{detail.name}</h2>
                    {tallestBadges.has(detail.id) && <span style={{ fontSize: 10 }}>🏆</span>}
                    {detail.status === "under_construction" && <span style={{ fontSize: 8, color: "#ffcc88", background: "rgba(255,180,100,.1)", padding: "1px 5px", borderRadius: 4 }}>⚒ U/C</span>}
                    {detail.status === "planned" && <span style={{ fontSize: 8, color: t.textFaint, background: t.surface, padding: "1px 5px", borderRadius: 4 }}>📐 Planned</span>}
                  </div>
                  <p style={{ fontSize: 10.5, color: t.textMuted, marginTop: 2 }}>{locWithFlag(detail)}</p>
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button onClick={() => toggleFav(detail.id)} style={{ background: "none", border: "none", color: favs.includes(detail.id) ? t.fav : t.textFaint, cursor: "pointer", fontSize: 15 }}>{favs.includes(detail.id) ? "♥" : "♡"}</button>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: t.textFaint, cursor: "pointer", fontSize: 13 }}>✕</button>
                </div>
              </div>

              {/* Mini stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 8px", marginBottom: 8 }}>
                {[
                  ["Height", `${detail.height}m`],
                  ["Floors", detail.floors || "—"],
                  ["Year", detail.year || "—"],
                  ...(detail.architect ? [["Architect", detail.architect]] : []),
                  ...(detail.cost ? [["Cost", detail.cost]] : []),
                ].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 7.5, color: t.textGhost, textTransform: "uppercase", letterSpacing: .8, marginBottom: 1 }}>{l}</div>
                    <div style={{ fontSize: 11.5, color: t.text, fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Height bar */}
              <div style={{ height: 3, background: t.surface, borderRadius: 2, marginBottom: 10 }}>
                <div style={{ height: "100%", width: `${(detail.height / maxH) * 100}%`, background: detail.color, borderRadius: 2, transition: "width .3s" }} />
              </div>

              <button onClick={() => openDetail(detail.id)} style={{ width: "100%", background: t.accentBg, border: `1px solid ${t.accentBorder}`, borderRadius: 8, padding: "7px 0", color: t.accent, fontSize: 11, cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>Open full details →</button>
            </div>
          </div>
        )}

        {/* SKYLINE */}
        {view === "skyline" && (
          <div style={{ animation: ready ? "su .4s ease .08s both" : "none", position: "relative", minHeight: 300 }}>
            {/* Horizon haze */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: mode === "dark"
              ? "linear-gradient(180deg, transparent 0%, rgba(100,160,255,.03) 40%, rgba(100,160,255,.06) 100%)"
              : "linear-gradient(180deg, transparent 0%, rgba(42,106,181,.03) 40%, rgba(42,106,181,.06) 100%)", pointerEvents: "none", zIndex: 0 }} />
            {/* Ground line */}
            <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, height: 1, background: mode === "dark"
              ? "linear-gradient(90deg, transparent, rgba(100,160,255,.15) 20%, rgba(100,160,255,.15) 80%, transparent)"
              : "linear-gradient(90deg, transparent, rgba(42,106,181,.12) 20%, rgba(42,106,181,.12) 80%, transparent)", zIndex: 1 }} />
            {/* Ground glow */}
            <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, height: 6, background: mode === "dark"
              ? "linear-gradient(90deg, transparent, rgba(100,160,255,.04) 20%, rgba(100,160,255,.04) 80%, transparent)"
              : "linear-gradient(90deg, transparent, rgba(42,106,181,.03) 20%, rgba(42,106,181,.03) 80%, transparent)", filter: "blur(4px)", pointerEvents: "none", zIndex: 1 }} />

            {/* Skeleton loading */}
            {wd.loading && !filtered.length && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, paddingBottom: 24, minHeight: 280, justifyContent: "center" }}>
                {Array.from({ length: 20 }).map((_, i) => {
                  const h = 60 + Math.random() * 160;
                  return <div key={i} style={{ width: 8 + Math.random() * 6, height: h, borderRadius: 1, background: `linear-gradient(90deg, ${t.surface} 0%, ${t.surfaceHover} 50%, ${t.surface} 100%)`, backgroundSize: "400px 100%", animation: "shimmer 1.5s ease-in-out infinite", animationDelay: `${i * 0.05}s` }} />;
                })}
              </div>
            )}

            {/* Towers */}
            {(!wd.loading || filtered.length > 0) && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, overflowX: "auto", paddingBottom: 24, minHeight: 280, position: "relative", zIndex: 2 }}>
                {filtered.map((s, idx) => {
                  const rank = idx + 1;
                  const showRank = rank <= 3 && sortBy === "height";
                  const isHovered = hoveredTower === s.id;
                  return (
                    <div key={s.id} className="tc" onClick={() => handleSelect(s.id)} onDoubleClick={() => openDetail(s.id)}
                      onMouseEnter={(e) => { setHoveredTower(s.id); const rect = e.currentTarget.getBoundingClientRect(); setHoverPos({ x: rect.left + rect.width / 2, y: rect.top - 8 }); }}
                      onMouseLeave={() => setHoveredTower(null)}
                      style={{ opacity: compareMode && !compareIds.includes(s.id) ? .3 : s.status !== "completed" ? .5 : 1, position: "relative" }}>
                      {/* Rank badge */}
                      {showRank && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", fontSize: 7, fontWeight: 700, color: rank === 1 ? "#ffd700" : rank === 2 ? "#c0c0c0" : "#cd7f32", background: mode === "dark" ? "rgba(0,0,0,.6)" : "rgba(255,255,255,.8)", borderRadius: 6, padding: "1px 4px", zIndex: 3, lineHeight: 1.3, border: `1px solid ${rank === 1 ? "rgba(255,215,0,.3)" : rank === 2 ? "rgba(192,192,192,.3)" : "rgba(205,127,50,.3)"}` }}>#{rank}</div>}
                      {tallestBadges.has(s.id) && !showRank && <div style={{ fontSize: 5, position: "absolute", top: -2, right: -2, zIndex: 1 }}>🏆</div>}
                      {favs.includes(s.id) && <div style={{ fontSize: 5, color: t.fav, position: "absolute", top: -2, left: -1 }}>♥</div>}
                      {/* Building glow */}
                      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 20, height: 8, background: s.color, opacity: isHovered ? 0.15 : 0.05, filter: "blur(6px)", borderRadius: "50%", transition: "opacity .2s" }} />
                      <Tower height={s.height} maxH={maxH} color={s.color} sel={selected === s.id || compareIds.includes(s.id)} floors={s.floors} />
                      <div style={{ fontSize: 6, color: selected === s.id ? t.accent : t.textGhost, textAlign: "center", maxWidth: 26, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>{s.height}m</div>
                    </div>
                  );
                })}
                {!filtered.length && <div style={{ padding: 28, color: t.textFaint, fontSize: 12, width: "100%", textAlign: "center" }}>No results</div>}
              </div>
            )}

            {/* Hover tooltip */}
            {hoveredTower && (() => {
              const hb = allBuildings.find((b) => b.id === hoveredTower);
              if (!hb) return null;
              return (
                <div style={{ position: "fixed", left: hoverPos.x, top: hoverPos.y, transform: "translate(-50%, -100%)", background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 10px", boxShadow: `0 4px 16px ${mode === "dark" ? "rgba(0,0,0,.5)" : "rgba(0,0,0,.1)"}`, zIndex: 100, pointerEvents: "none", animation: "tipIn .12s ease", maxWidth: 200, backdropFilter: "blur(8px)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.textStrong, lineHeight: 1.3 }}>{hb.name}</div>
                  <div style={{ fontSize: 9, color: t.textMuted, marginTop: 1 }}>{locWithFlag(hb)}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                    <span style={{ fontSize: 10, color: t.accent, fontWeight: 600 }}>{hb.height}m</span>
                    {hb.floors && <span style={{ fontSize: 9, color: t.textMuted }}>{hb.floors}fl</span>}
                    {hb.year && <span style={{ fontSize: 9, color: t.textMuted }}>{hb.year}</span>}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* CARDS */}
        {view === "cards" && (
          <div className="cg" style={{ animation: "fi .2s" }}>
            {/* Skeleton cards while loading */}
            {wd.loading && !filtered.length && Array.from({ length: 8 }).map((_, i) => (
              <div key={`sk-${i}`} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: 150, background: `linear-gradient(90deg, ${t.surface} 0%, ${t.surfaceHover} 50%, ${t.surface} 100%)`, backgroundSize: "400px 100%", animation: "shimmer 1.5s ease-in-out infinite", animationDelay: `${i * 0.08}s` }} />
                <div style={{ padding: "10px 10px 12px" }}>
                  <div style={{ height: 10, width: "70%", borderRadius: 4, background: t.surface, marginBottom: 6 }} />
                  <div style={{ height: 8, width: "50%", borderRadius: 4, background: t.surface }} />
                </div>
              </div>
            ))}
            {filtered.map((s, idx) => {
              const rank = idx + 1;
              const showRank = rank <= 3 && sortBy === "height";
              return (
                <div key={s.id} onClick={() => openDetail(s.id)} style={{
                  background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 10,
                  overflow: "hidden", cursor: "pointer", transition: "transform .15s, box-shadow .15s", boxShadow: t.shadow,
                  opacity: s.status !== "completed" ? 0.75 : 1,
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${mode === "dark" ? "rgba(0,0,0,.4)" : "rgba(0,0,0,.12)"}`;}}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = t.shadow; }}>
                  <div style={{ height: 150, background: `linear-gradient(135deg, ${s.color}22, ${s.color}08)`, position: "relative", overflow: "hidden" }}>
                    {images[s.id] ? <img src={images[s.id]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", height: "100%", paddingBottom: 8 }}><Tower height={s.height} maxH={maxH} color={s.color} floors={s.floors} scale={.4} /></div>}
                    {favs.includes(s.id) && <div style={{ position: "absolute", top: 6, right: 7, fontSize: 11, color: t.fav, textShadow: "0 1px 3px rgba(0,0,0,.4)" }}>♥</div>}
                    {showRank && <div style={{ position: "absolute", top: 6, left: 7, fontSize: 9, fontWeight: 700, color: rank === 1 ? "#ffd700" : rank === 2 ? "#c0c0c0" : "#cd7f32", background: "rgba(0,0,0,.55)", borderRadius: 6, padding: "1px 5px", backdropFilter: "blur(4px)" }}>#{rank}</div>}
                    {!showRank && tallestBadges.has(s.id) && <div style={{ position: "absolute", top: 6, left: 7, fontSize: 10 }}>🏆</div>}
                    {s.status !== "completed" && <div style={{ position: "absolute", top: 6, right: favs.includes(s.id) ? 24 : 7, fontSize: 8, color: "#ffcc88", background: "rgba(0,0,0,.5)", padding: "1px 5px", borderRadius: 4 }}>{s.status === "under_construction" ? "⚒" : "📐"}</div>}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 48, background: `linear-gradient(transparent, ${mode === "dark" ? "rgba(6,10,16,.8)" : "rgba(255,255,255,.8)"})` }} />
                    <div style={{ position: "absolute", bottom: 6, left: 9, right: 9 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: t.textStrong, textShadow: mode === "dark" ? "0 1px 4px rgba(0,0,0,.6)" : "none" }}>{s.height}m</div>
                    </div>
                  </div>
                  <div style={{ padding: "8px 10px 10px" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{s.name}</div>
                    <div style={{ fontSize: 9.5, color: t.textMuted, marginTop: 3 }}>{locWithFlag(s)} · {s.year || "—"}</div>
                    {s.architect && <div style={{ fontSize: 8.5, color: t.textFaint, marginTop: 2 }}>✎ {s.architect}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MAP */}
        {view === "map" && (
          <div style={{ animation: "fi .2s", borderRadius: 11, overflow: "hidden", border: `1px solid ${t.border}` }}>
            <WorldMap buildings={filtered} selected={selected} onSelect={handleSelect}
              expandedCity={expandedCity} setExpandedCity={setExpandedCity} images={images} maxH={maxH} />
          </div>
        )}

        {/* LIST */}
        {view === "list" && (
          <div style={{ animation: "fi .18s", borderRadius: 9, overflow: "hidden", border: `1px solid ${t.border}` }}>
            <div className="lr" style={{ fontSize: 7.5, color: t.textGhost, textTransform: "uppercase", letterSpacing: 1.2, cursor: "default" }}>
              <span /><span>Building</span><span>Location</span><span>Height</span><span>Fl</span><span>Year</span><span />
            </div>
            {/* Skeleton rows */}
            {wd.loading && !filtered.length && Array.from({ length: 10 }).map((_, i) => (
              <div key={`sk-${i}`} className="lr" style={{ cursor: "default" }}>
                <div style={{ width: 30, height: 30, borderRadius: 5, background: `linear-gradient(90deg, ${t.surface} 0%, ${t.surfaceHover} 50%, ${t.surface} 100%)`, backgroundSize: "400px 100%", animation: "shimmer 1.5s ease-in-out infinite", animationDelay: `${i * 0.06}s` }} />
                <div style={{ height: 9, width: "60%", borderRadius: 4, background: t.surface }} />
                <div style={{ height: 8, width: "40%", borderRadius: 4, background: t.surface }} />
                <div style={{ height: 8, width: 30, borderRadius: 4, background: t.surface }} />
                <div style={{ height: 8, width: 16, borderRadius: 4, background: t.surface }} />
                <div style={{ height: 8, width: 24, borderRadius: 4, background: t.surface }} />
                <span />
              </div>
            ))}
            {filtered.map((s, idx) => {
              const rank = idx + 1;
              const showRank = rank <= 3 && sortBy === "height";
              return (
              <div key={s.id} className="lr" onClick={() => handleSelect(s.id)} onDoubleClick={() => openDetail(s.id)}
                style={{ background: (selected === s.id || compareIds.includes(s.id)) ? t.accentBg : "transparent" }}>
                <Thumb src={images[s.id]} color={s.color} height={s.height} maxH={maxH} size={30} radius={5} />
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {compareMode && <div style={{ width: 11, height: 11, borderRadius: 3, border: `1.5px solid ${compareIds.includes(s.id) ? t.compare : t.border}`, background: compareIds.includes(s.id) ? t.compareBg : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: t.compare, flexShrink: 0 }}>{compareIds.includes(s.id) ? "✓" : ""}</div>}
                  <div>
                    <div style={{ fontSize: 11, color: t.text, fontWeight: 500, display: "flex", gap: 3, alignItems: "center" }}>
                      {showRank && <span style={{ fontSize: 8, fontWeight: 700, color: rank === 1 ? "#ffd700" : rank === 2 ? "#c0c0c0" : "#cd7f32" }}>#{rank}</span>}
                      {s.name} {tallestBadges.has(s.id) && !showRank && <span style={{ fontSize: 8 }}>🏆</span>}
                      {s.status !== "completed" && <span style={{ fontSize: 7, color: "#ffcc88" }}>{s.status === "under_construction" ? "⚒" : "📐"}</span>}
                    </div>
                    <div style={{ fontSize: 8.5, color: t.textFaint }}>{s.architect || s.style || ""}</div>
                  </div>
                </div>
                <div style={{ color: t.textMuted, fontSize: 10 }}>{locWithFlag(s)}</div>
                <div style={{ color: t.accent, fontWeight: 500, fontSize: 10.5 }}>{s.height}m</div>
                <div style={{ color: t.textMuted, fontSize: 10 }}>{s.floors || "—"}</div>
                <div style={{ color: t.textMuted, fontSize: 10 }}>{s.year || "—"}</div>
                <button onClick={(e) => { e.stopPropagation(); toggleFav(s.id); }} style={{ background: "none", border: "none", color: favs.includes(s.id) ? t.fav : t.textGhost, cursor: "pointer", fontSize: 11, padding: 0 }}>{favs.includes(s.id) ? "♥" : "♡"}</button>
              </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 28, fontSize: 8.5, color: t.textGhost, textAlign: "center", lineHeight: 1.7 }}>
          {wd.error && <span>Wikidata unavailable — showing fallback · </span>}
          Data: Wikidata ({allBuildings.length}) + custom · Images: Wikipedia · 🏆 = tallest when completed · v0.7
        </div>
      </div>
    </div>
  );
}
