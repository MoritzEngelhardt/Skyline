export default function Tower({ height, maxH = 830, color, sel, floors, scale = 1 }) {
  const h = (height / maxH) * 200 * scale;
  const w = (10 + Math.min((floors || 80) / 12, 7)) * scale;
  const t = 220 * scale;
  const n = Math.min(Math.floor(h / (7 * scale)), 22);
  return (
    <svg width={w + 6 * scale} height={t} style={{ overflow: "visible", display: "block" }}>
      <line x1={(w + 6 * scale) / 2} y1={t - h - 8 * scale} x2={(w + 6 * scale) / 2} y2={t - h} stroke={color} strokeWidth={1 * scale} />
      <rect x={3 * scale} y={t - h} width={w} height={h} rx={0.8} fill={color} opacity={sel ? 1 : 0.6} stroke={sel ? "#fff" : "none"} strokeWidth={sel ? 1.5 : 0} />
      {Array.from({ length: n }).map((_, i) => (
        <rect key={i} x={4.5 * scale} y={t - h + 3 * scale + i * (h / n)} width={w - 3 * scale} height={0.6 * scale} fill="rgba(255,255,255,.13)" rx={0.2} />
      ))}
    </svg>
  );
}
