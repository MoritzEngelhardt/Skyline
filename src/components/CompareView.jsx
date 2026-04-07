import Thumb from "./Thumb";
import { useTheme } from "../hooks/useTheme";

export default function CompareView({ items, images, maxH, onRemove, onClose }) {
  const { t } = useTheme();
  if (!items.length) return null;
  const localMax = Math.max(...items.map((b) => b.height));

  return (
    <div style={{ animation: "fi .2s", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: t.textStrong }}>Comparing {items.length}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: t.textFaint, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>Clear ✕</button>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
        {items.map((b) => (
          <div key={b.id} style={{ minWidth: 95, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <Thumb src={images[b.id]} color={b.color} height={b.height} maxH={maxH} size={56} radius={8} />
            <div style={{ height: 90, display: "flex", alignItems: "flex-end", marginTop: 4, marginBottom: 4 }}>
              <div style={{ width: 20, borderRadius: "3px 3px 0 0", background: `linear-gradient(180deg,${b.color},${b.color}44)`, height: `${(b.height / localMax) * 80}px`, transition: "height .3s", position: "relative" }}>
                <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", fontSize: 9.5, color: t.accent, fontWeight: 600, whiteSpace: "nowrap" }}>{b.height}m</div>
              </div>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: t.text, textAlign: "center", lineHeight: 1.25 }}>{b.name}</div>
            <div style={{ fontSize: 9, color: t.textFaint, textAlign: "center", marginTop: 1 }}>{b.city} · {b.floors || "?"}fl · {b.year || "?"}</div>
            <button onClick={() => onRemove(b.id)} style={{ marginTop: 3, background: "none", border: `1px solid ${t.border}`, borderRadius: 4, color: t.textFaint, fontSize: 8.5, padding: "2px 6px", cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
