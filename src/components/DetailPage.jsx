import { useTheme } from "../hooks/useTheme";
import { getStatusLabel } from "../data/buildings";

export default function DetailPage({ building: b, allBuildings, image, extract, isFav, onToggleFav, onClose, isTallestRecord, maxH }) {
  const { t } = useTheme();
  const rank = [...allBuildings].filter(x => x.status === "completed").sort((a, c) => c.height - a.height).findIndex((s) => s.id === b.id) + 1;
  const shortExtract = extract ? extract.split(". ").slice(0, 4).join(". ").replace(/\n/g, " ") + "." : null;
  const location = [b.city, b.country].filter(Boolean).join(", ");
  const sl = getStatusLabel(b.status);

  const stats = [
    { i: "↕", l: "Height", v: `${b.height}m` },
    { i: "▤", l: "Floors", v: b.floors || "—" },
    { i: "◷", l: "Completed", v: b.year || (sl !== "Completed" ? sl : "Unknown") },
    { i: "◆", l: "Use", v: b.use || "Mixed" },
    { i: "✦", l: "Style", v: b.style || "—" },
    { i: "⚑", l: "Location", v: location || "Unknown" },
  ];
  if (b.architect) stats.push({ i: "✎", l: "Architect", v: b.architect });
  if (b.cost) stats.push({ i: "$", l: "Cost", v: b.cost });

  return (
    <div style={{ animation: "fi .25s ease" }}>
      <div style={{
        position: "relative", width: "100%", height: image ? 280 : 120,
        borderRadius: "14px 14px 0 0", overflow: "hidden",
        background: `linear-gradient(135deg, ${b.color}33, ${b.color}11)`,
      }}>
        {image && <img src={image} alt={b.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />}
        <div style={{ position: "absolute", inset: 0, background: image ? `linear-gradient(180deg, transparent 20%, ${t.mode === "dark" ? "rgba(6,10,16,.88)" : "rgba(255,255,255,.88)"} 100%)` : "none" }} />

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "10px 14px" }}>
          <button onClick={onClose} style={{ background: t.mode === "dark" ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.7)", backdropFilter: "blur(8px)", border: "none", borderRadius: 8, padding: "6px 12px", color: t.text, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>← Back <span style={{ fontSize: 9, opacity: .5 }}>(Esc)</span></button>
          <button onClick={onToggleFav} style={{ background: t.mode === "dark" ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.7)", backdropFilter: "blur(8px)", border: "none", borderRadius: 8, padding: "6px 12px", color: isFav ? t.fav : t.text, cursor: "pointer", fontSize: 16 }}>{isFav ? "♥" : "♡"}</button>
        </div>

        <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
            {rank > 0 && <span style={{ background: t.accentBg, borderRadius: 6, padding: "3px 8px", fontSize: 10, color: t.accent }}>#{rank} tallest</span>}
            {isTallestRecord && <span style={{ background: "rgba(255,200,50,.12)", border: "1px solid rgba(255,200,50,.25)", borderRadius: 6, padding: "3px 8px", fontSize: 10, color: "#ffd044", fontWeight: 600 }}>🏆 World record holder</span>}
            {b.status === "under_construction" && <span style={{ background: "rgba(255,180,100,.12)", border: "1px solid rgba(255,180,100,.25)", borderRadius: 6, padding: "3px 8px", fontSize: 10, color: "#ffcc88" }}>⚒ Under construction</span>}
            {b.status === "planned" && <span style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, color: t.textMuted }}>📐 Planned</span>}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 900, color: t.mode === "dark" ? "#fff" : t.textStrong, textShadow: t.mode === "dark" ? "0 2px 12px rgba(0,0,0,.5)" : "none", lineHeight: 1.15, margin: 0 }}>{b.name}</h1>
          <p style={{ fontSize: 13, color: t.textMuted, marginTop: 3 }}>{location}</p>
        </div>
      </div>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "16px 14px 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length <= 6 ? 3 : 4}, 1fr)`, gap: 3, marginBottom: 16 }}>
          {stats.map(({ i, l, v }) => (
            <div key={l} style={{ background: t.surfaceHover, borderRadius: 8, padding: "8px 9px", border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 8.5, color: t.textFaint, textTransform: "uppercase", letterSpacing: .8, marginBottom: 2 }}>{i} {l}</div>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 600, wordBreak: "break-word" }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, color: t.textFaint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Height comparison</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 80 }}>
            {[
              { n: "Statue of\nLiberty", h: 93, c: "#4a7a5a" },
              { n: "Eiffel\nTower", h: 330, c: "#8a7a5a" },
              { n: b.name.length > 12 ? b.name.slice(0, 11) + "…" : b.name, h: b.height, c: b.color, self: true },
              { n: "Burj\nKhalifa", h: 828, c: "#D4A574" },
            ].map((ref, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ width: "100%", maxWidth: 32, height: `${(ref.h / 830) * 65}px`, background: ref.self ? `linear-gradient(180deg, ${ref.c}, ${ref.c}66)` : `${ref.c}33`, borderRadius: "3px 3px 0 0", border: ref.self ? `1px solid ${ref.c}` : "1px solid transparent" }} />
                <div style={{ fontSize: 8.5, color: ref.self ? t.accent : t.textFaint, textAlign: "center", marginTop: 3, lineHeight: 1.2, whiteSpace: "pre-line", fontWeight: ref.self ? 600 : 400 }}>{ref.n}</div>
                <div style={{ fontSize: 8, color: t.textGhost, marginTop: 1 }}>{ref.h}m</div>
              </div>
            ))}
          </div>
        </div>

        {shortExtract && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: t.textFaint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>About</div>
            <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.65, margin: 0 }}>{shortExtract}</p>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {b.wiki && <a href={`https://en.wikipedia.org/wiki/${b.wiki}`} target="_blank" rel="noopener noreferrer" style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, borderRadius: 8, padding: "7px 14px", color: t.accent, fontSize: 11.5, textDecoration: "none", fontFamily: "inherit" }}>Wikipedia →</a>}
          {b.lat && b.lng && <a href={`https://www.google.com/maps/@${b.lat},${b.lng},17z`} target="_blank" rel="noopener noreferrer" style={{ background: t.surfaceHover, border: `1px solid ${t.border}`, borderRadius: 8, padding: "7px 14px", color: t.textMuted, fontSize: 11.5, textDecoration: "none", fontFamily: "inherit" }}>Google Maps →</a>}
        </div>
      </div>
    </div>
  );
}
