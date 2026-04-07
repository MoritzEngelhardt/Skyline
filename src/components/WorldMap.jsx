import { useState, useMemo } from "react";
import * as d3 from "d3";
import { useTheme } from "../hooks/useTheme";

function clusterByCity(buildings) {
  const groups = {};
  buildings.forEach((b) => {
    if (!b.lat || !b.lng) return;
    const key = b.city || `${b.lat.toFixed(1)},${b.lng.toFixed(1)}`;
    if (!groups[key]) groups[key] = { city: key, buildings: [] };
    groups[key].buildings.push(b);
  });
  return Object.values(groups).map((g) => {
    g.lat = g.buildings.reduce((s, b) => s + b.lat, 0) / g.buildings.length;
    g.lng = g.buildings.reduce((s, b) => s + b.lng, 0) / g.buildings.length;
    g.tallest = Math.max(...g.buildings.map((b) => b.height));
    g.color = g.buildings.sort((a, b) => b.height - a.height)[0].color;
    return g;
  });
}

const CONT = [
  "M120,80 L170,75 L200,90 L210,130 L180,160 L140,155 L110,130 Z",
  "M160,175 L185,190 L195,240 L180,280 L160,290 L145,260 L140,220 L150,195 Z",
  "M320,85 L370,75 L420,80 L430,100 L400,120 L380,135 L350,140 L310,130 L300,105 Z",
  "M330,140 L380,135 L420,150 L430,190 L410,230 L380,260 L350,270 L320,240 L310,200 L315,160 Z",
  "M430,80 L530,65 L600,80 L640,100 L630,130 L580,150 L530,160 L480,150 L440,130 L430,105 Z",
  "M580,250 L620,240 L650,250 L660,270 L630,280 L590,275 Z",
];

export default function WorldMap({ buildings, selected, onSelect, expandedCity, setExpandedCity, images, maxH }) {
  const { t } = useTheme();
  const [tooltip, setTooltip] = useState(null);
  const W = 760, H = 370;
  const proj = useMemo(() => d3.geoNaturalEarth1().fitSize([W, H], { type: "Sphere" }), []);
  const grat = useMemo(() => d3.geoPath(proj)(d3.geoGraticule10()), [proj]);
  const sphere = useMemo(() => d3.geoPath(proj)({ type: "Sphere" }), [proj]);
  const clusters = useMemo(() => clusterByCity(buildings), [buildings]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <path d={sphere} fill={t.mapOcean} stroke={t.mapStroke} strokeWidth={0.5} />
        <path d={grat} fill="none" stroke={t.mapGrid} strokeWidth={0.3} />
        {CONT.map((d, i) => <path key={i} d={d} fill={t.mapLand} stroke={t.mapStroke} strokeWidth={0.5} />)}

        {clusters.map((cl) => {
          const [x, y] = proj([cl.lng, cl.lat]) || [0, 0];
          const n = cl.buildings.length;
          const isExp = expandedCity === cl.city;

          if (isExp) {
            const aStep = (2 * Math.PI) / n;
            const ringR = Math.max(22, n * 9);
            return (
              <g key={cl.city}>
                {cl.buildings.map((b, i) => {
                  const bx = x + Math.cos(aStep * i - Math.PI / 2) * ringR;
                  const by = y + Math.sin(aStep * i - Math.PI / 2) * ringR;
                  return <line key={`l${i}`} x1={x} y1={y} x2={bx} y2={by} stroke={t.accentBorder} strokeWidth={0.4} />;
                })}
                <circle cx={x} cy={y} r={3} fill={cl.color} opacity={0.25} onClick={() => setExpandedCity(null)} style={{ cursor: "pointer" }} />
                {cl.buildings.map((b, i) => {
                  const bx = x + Math.cos(aStep * i - Math.PI / 2) * ringR;
                  const by = y + Math.sin(aStep * i - Math.PI / 2) * ringR;
                  const br = 3 + (b.height / maxH) * 6;
                  return (
                    <g key={b.id} style={{ cursor: "pointer" }} onClick={() => onSelect(b.id)}
                      onMouseEnter={() => setTooltip({ x: bx, y: by, b })} onMouseLeave={() => setTooltip(null)}>
                      <circle cx={bx} cy={by} r={br + 3} fill={b.color} opacity={0.08} />
                      <circle cx={bx} cy={by} r={br} fill={b.color} opacity={selected === b.id ? 1 : 0.6} stroke={selected === b.id ? t.textStrong : "none"} strokeWidth={1.2} />
                    </g>
                  );
                })}
              </g>
            );
          }

          if (n === 1) {
            const b = cl.buildings[0]; const r = 4 + (cl.tallest / maxH) * 7;
            return (
              <g key={cl.city} style={{ cursor: "pointer" }} onClick={() => onSelect(b.id)}
                onMouseEnter={() => setTooltip({ x, y, b })} onMouseLeave={() => setTooltip(null)}>
                <circle cx={x} cy={y} r={r + 3} fill={b.color} opacity={0.07} />
                <circle cx={x} cy={y} r={r} fill={b.color} opacity={selected === b.id ? 1 : 0.5} stroke={selected === b.id ? t.textStrong : "none"} strokeWidth={1.5} />
              </g>
            );
          }

          const r = 8 + n * 2;
          return (
            <g key={cl.city} style={{ cursor: "pointer" }} onClick={() => setExpandedCity(cl.city)}
              onMouseEnter={() => setTooltip({ x, y, cluster: cl })} onMouseLeave={() => setTooltip(null)}>
              <circle cx={x} cy={y} r={r + 4} fill={cl.color} opacity={0.05} />
              <circle cx={x} cy={y} r={r} fill={cl.color} opacity={0.3} stroke={t.border} strokeWidth={0.7} />
              <text x={x} y={y + 1} textAnchor="middle" fontSize={8} fontWeight={700} fill={t.textStrong} opacity={0.8} style={{ pointerEvents: "none" }}>{n}</text>
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div style={{
          position: "absolute", left: `${(tooltip.x / W) * 100}%`, top: `${(tooltip.y / H) * 100}%`,
          transform: "translate(-50%,-130%)", background: t.tooltipBg,
          border: `1px solid ${t.border}`, borderRadius: 9, padding: "7px 10px",
          pointerEvents: "none", zIndex: 10, display: "flex", gap: 8, alignItems: "center",
          boxShadow: t.shadow,
        }}>
          {tooltip.b && images[tooltip.b.id] && <img src={images[tooltip.b.id]} alt="" style={{ width: 32, height: 40, objectFit: "cover", borderRadius: 5 }} />}
          <div>
            {tooltip.b && <><div style={{ fontSize: 12, fontWeight: 600, color: t.textStrong }}>{tooltip.b.name}</div><div style={{ fontSize: 10, color: t.textMuted }}>{tooltip.b.city} · {tooltip.b.height}m</div></>}
            {tooltip.cluster && <><div style={{ fontSize: 12, fontWeight: 600, color: t.textStrong }}>{tooltip.cluster.city}</div><div style={{ fontSize: 10, color: t.textMuted }}>{tooltip.cluster.buildings.length} buildings · tallest {tooltip.cluster.tallest}m</div></>}
          </div>
        </div>
      )}
    </div>
  );
}
