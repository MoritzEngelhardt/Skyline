import { createContext, useContext, useState, useEffect } from "react";

const themes = {
  dark: {
    bg: "linear-gradient(180deg,#060a10 0%,#0c1220 40%,#111b2c 100%)",
    surface: "rgba(255,255,255,.02)",
    surfaceHover: "rgba(255,255,255,.04)",
    border: "rgba(255,255,255,.05)",
    borderHover: "rgba(100,160,255,.2)",
    text: "#c8d0e0",
    textStrong: "#e8edf6",
    textMuted: "#405470",
    textFaint: "#202e44",
    textGhost: "#141e2e",
    accent: "#a0c4ff",
    accentBg: "rgba(100,160,255,.08)",
    accentBorder: "rgba(100,160,255,.25)",
    fav: "#ff6b8a",
    favBg: "rgba(255,100,140,.08)",
    compare: "#ffcc88",
    compareBg: "rgba(255,180,100,.06)",
    pill: "rgba(255,255,255,.015)",
    pillBorder: "rgba(255,255,255,.06)",
    pillText: "#405470",
    pillHover: "rgba(255,255,255,.04)",
    cardBg: "rgba(255,255,255,.02)",
    overlay: "rgba(6,10,16,.85)",
    tooltipBg: "rgba(8,12,20,.96)",
    mapOcean: "#0d1520",
    mapLand: "#111c2a",
    mapGrid: "rgba(80,130,200,.035)",
    mapStroke: "rgba(80,130,200,.08)",
    star: "#fff",
    inputBg: "rgba(255,255,255,.035)",
    inputBorder: "rgba(255,255,255,.05)",
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
