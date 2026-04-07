import { useState } from "react";

export default function Thumb({ src, color, height, maxH = 830, size = 36, radius = 6 }) {
  const [err, setErr] = useState(false);
  if (src && !err) return <img src={src} alt="" loading="lazy" style={{ width: size, height: size, objectFit: "cover", borderRadius: radius, border: "1px solid rgba(128,128,128,.12)" }} onError={() => setErr(true)} />;
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: "rgba(128,128,128,.06)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 2 }}>
      <div style={{ width: size * 0.22, height: `${(height / maxH) * size * 0.75}px`, background: color, borderRadius: "2px 2px 0 0", opacity: 0.5 }} />
    </div>
  );
}
