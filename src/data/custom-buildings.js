/**
 * CUSTOM BUILDINGS
 * Add buildings missing from Wikidata, or override bad data.
 * These merge into the main list on load.
 *
 * status: "completed" | "under_construction" | "planned"
 * imageUrl: optional direct URL (overrides Wikipedia auto-fetch)
 */
export const CUSTOM_BUILDINGS = [
  // ── COMPLETED — missing from Wikidata ──
  {
    id: "custom_uniriese", name: "City-Hochhaus Leipzig", city: "Leipzig", country: "Germany",
    height: 142.5, floors: 34, year: 1972, use: "Office", style: "Modern",
    lat: 51.337867, lng: 12.379081, color: "#7BA0B8", wiki: "City-Hochhaus Leipzig",
    architect: "Hermann Henselmann", status: "completed",
  },

  // ── UNDER CONSTRUCTION ──
  {
    id: "custom_jeddah", name: "Jeddah Tower", city: "Jeddah", country: "Saudi Arabia",
    height: 1000, floors: 167, year: null, use: "Mixed", style: "Neo-futurism",
    lat: 21.4858, lng: 39.2026, color: "#D4C4A8", wiki: "Jeddah_Tower",
    architect: "Adrian Smith + Gordon Gill", status: "under_construction",
  },
  {
    id: "custom_pentominium", name: "Pentominium", city: "Dubai", country: "United Arab Emirates",
    height: 516, floors: 122, year: null, use: "Residential", style: "Modern",
    lat: 25.0879, lng: 55.1478, color: "#6AA0B8", wiki: "Pentominium",
    status: "under_construction",
  },
  {
    id: "custom_greenland", name: "Greenland Jinmao International Financial Center", city: "Nanjing", country: "China",
    height: 499.5, floors: 95, year: null, use: "Mixed", style: "Modern",
    lat: 32.06, lng: 118.78, color: "#88A0B0", status: "under_construction",
  },
  {
    id: "custom_one_brickell", name: "One Brickell City Centre", city: "Miami", country: "United States",
    height: 320, floors: 80, year: null, use: "Mixed", style: "Modern",
    lat: 25.764, lng: -80.193, color: "#70A0C0", status: "under_construction",
  },

  // ── PLANNED ──
  {
    id: "custom_burj_azizi", name: "Burj Azizi", city: "Dubai", country: "United Arab Emirates",
    height: 725, floors: 131, year: null, use: "Mixed", style: "Modern",
    lat: 25.19, lng: 55.27, color: "#C0A880", wiki: "Burj_Azizi",
    status: "planned",
  },

  // Add your own below:
];

/**
 * IMAGE OVERRIDES
 * Fix broken/missing photos by Wikidata QID or custom ID.
 */
export const IMAGE_OVERRIDES = {
  // "Q12495": "https://upload.wikimedia.org/.../Burj_Khalifa.jpg",
};
