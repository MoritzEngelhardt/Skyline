import { createContext, useContext, useState, useEffect } from "react";

const themes = {
  dark: {
    bg: "linear-gradient(180deg,#060a10 0%,#0c1220 40%,#111b2c 100%)",
    surface: "rgba(255,255,255,.04)",
    surfaceHover: "rgba(255,255,255,.07)",
    border: "rgba(255,255,255,.08)",
    borderHover: "rgba(100,160,255,.2)",
    text: "#d0d8e8",
    textStrong: "#edf1f8",
    textMuted: "#7a90aa",
    textFaint: "#566e8a",
    textGhost: "#3e5472",
    accent: "#a0c4ff",
    accentBg: "rgba(100,160,255,.08)",
    accentBorder: "rgba(100,160,255,.25)",
    fav: "#ff6b8a",
    favBg: "rgba(255,100,140,.08)",
    compare: "#ffcc88",
    compareBg: "rgba(255,180,100,.06)",
    visited: "#66d9a0",
    visitedBg: "rgba(102,217,160,.08)",
    visitedBorder: "rgba(102,217,160,.25)",
    wishlist: "#d4a0ff",
    wishlistBg: "rgba(180,140,255,.08)",
    wishlistBorder: "rgba(180,140,255,.25)",
    pill: "rgba(255,255,255,.04)",
    pillBorder: "rgba(255,255,255,.10)",
    pillText: "#7a90aa",
    pillHover: "rgba(255,255,255,.08)",
    cardBg: "rgba(255,255,255,.04)",
    overlay: "rgba(6,10,16,.85)",
    tooltipBg: "rgba(8,12,20,.96)",
    mapOcean: "#0d1520",
    mapLand: "#111c2a",
    mapGrid: "rgba(80,130,200,.035)",
    mapStroke: "rgba(80,130,200,.08)",
    star: "#fff",
    inputBg: "rgba(255,255,255,.06)",
    inputBorder: "rgba(255,255,255,.10)",
    shadow: "0 2px 12px rgba(0,0,0,.3)",
    mode: "dark",
  },
  light: {
    bg: "linear-gradient(180deg,#f0f3f8 0%,#e8ecf4 40%,#dde3ee 100%)",
    surface: "rgba(0,0,0,.02)",
    surfaceHover: "rgba(0,0,0,.04)",
    border: "rgba(0,0,0,.08)",
    borderHover: "rgba(50,100,180,.25)",
    text: "#3a4a60",
    textStrong: "#1a2030",
    textMuted: "#6a7a90",
    textFaint: "#98a4b4",
    textGhost: "#b8c0cc",
    accent: "#2a6ab5",
    accentBg: "rgba(42,106,181,.08)",
    accentBorder: "rgba(42,106,181,.25)",
    fav: "#e04060",
    favBg: "rgba(224,64,96,.08)",
    compare: "#c08020",
    compareBg: "rgba(192,128,32,.08)",
    visited: "#2a9d5c",
    visitedBg: "rgba(42,157,92,.08)",
    visitedBorder: "rgba(42,157,92,.25)",
    wishlist: "#9050d0",
    wishlistBg: "rgba(144,80,208,.08)",
    wishlistBorder: "rgba(144,80,208,.25)",
    pill: "rgba(0,0,0,.025)",
    pillBorder: "rgba(0,0,0,.1)",
    pillText: "#5a6a80",
    pillHover: "rgba(0,0,0,.05)",
    cardBg: "#fff",
    overlay: "rgba(255,255,255,.9)",
    tooltipBg: "rgba(255,255,255,.97)",
    mapOcean: "#d8e4f0",
    mapLand: "#c8d4e2",
    mapGrid: "rgba(0,0,0,.04)",
    mapStroke: "rgba(0,0,0,.08)",
    star: "transparent",
    inputBg: "rgba(0,0,0,.03)",
    inputBorder: "rgba(0,0,0,.1)",
    shadow: "0 2px 12px rgba(0,0,0,.08)",
    mode: "light",
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem("skyline_theme") || "dark"; } catch { return "dark"; }
  });

  useEffect(() => {
    try { localStorage.setItem("skyline_theme", mode); } catch {}
  }, [mode]);

  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));
  const t = themes[mode];

  return (
    <ThemeContext.Provider value={{ t, mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
