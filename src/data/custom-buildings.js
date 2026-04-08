/**
 * CUSTOM BUILDINGS
 * Add buildings missing from Wikidata, or override bad data.
 * These merge into the main list on load.
 *
 * status: "completed" | "under_construction" | "planned"
 * imageUrl: optional direct URL (overrides Wikipedia auto-fetch)
 */
export const CUSTOM_BUILDINGS = [
  // ── COMPLETED — missing or unreliable on Wikidata ──
  {
    id: "custom_uniriese", name: "City-Hochhaus Leipzig", city: "Leipzig", country: "Germany",
    height: 142.5, floors: 34, year: 1972, use: "Office", style: "Modern",
    lat: 51.337867, lng: 12.379081, color: "#7BA0B8", wiki: "City-Hochhaus Leipzig",
    architect: "Hermann Henselmann", status: "completed",
  },
  {
    id: "custom_zalmhaven", name: "De Zalmhaven", city: "Rotterdam", country: "Netherlands",
    height: 215, floors: 60, year: 2022, use: "Residential", style: "Modern",
    lat: 51.9050, lng: 4.4779, color: "#6A9EB8", wiki: "Zalmhaventoren",
    architect: "Dam & Partners", status: "completed",
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

  // ── EUROPEAN TALL BUILDINGS (often mis-classified on Wikidata) ──
  {
    id: "Q17154027", name: "Karlatornet", city: "Gothenburg", country: "Sweden",
    height: 246, floors: 73, year: 2024, use: "Mixed", style: "Modern",
    lat: 57.7196, lng: 11.9375, color: "#6A8EB8", wiki: "Karlatornet",
    architect: "SOM", status: "completed",
  },
  {
    id: "custom_varso", name: "Varso Tower", city: "Warsaw", country: "Poland",
    height: 310, floors: 53, year: 2022, use: "Office", style: "Modern",
    lat: 52.2292, lng: 21.0017, color: "#7A90B0", wiki: "Varso_Tower",
    architect: "Foster + Partners", status: "completed",
  },
  {
    id: "custom_skyvillage", name: "Skyliner", city: "Warsaw", country: "Poland",
    height: 195, floors: 44, year: 2021, use: "Residential", style: "Modern",
    lat: 52.2275, lng: 21.0005, color: "#7090A8", status: "completed",
  },
  {
    id: "custom_turning_torso", name: "Turning Torso", city: "Malmö", country: "Sweden",
    height: 190, floors: 54, year: 2005, use: "Residential", style: "Deconstructivism",
    lat: 55.6131, lng: 12.9757, color: "#8090A8", wiki: "Turning_Torso",
    architect: "Santiago Calatrava", status: "completed",
  },
  {
    id: "custom_one_tower", name: "One Tower", city: "Thessaloniki", country: "Greece",
    height: 166, floors: 44, year: 2024, use: "Mixed", style: "Modern",
    lat: 40.6119, lng: 22.9554, color: "#6890B0", status: "completed",
  },
  {
    id: "custom_torre_isozaki", name: "Allianz Tower", city: "Milan", country: "Italy",
    height: 209, floors: 50, year: 2015, use: "Office", style: "Modern",
    lat: 45.4801, lng: 9.1519, color: "#7898B0", wiki: "Allianz_Tower_(Milan)",
    architect: "Arata Isozaki", status: "completed",
  },
  {
    id: "custom_torre_generali", name: "Generali Tower", city: "Milan", country: "Italy",
    height: 185, floors: 44, year: 2017, use: "Office", style: "Modern",
    lat: 45.4807, lng: 9.1510, color: "#7098A8", wiki: "Generali_Tower",
    architect: "Zaha Hadid", status: "completed",
  },
  {
    id: "custom_the_shard", name: "The Shard", city: "London", country: "United Kingdom",
    height: 310, floors: 72, year: 2012, use: "Mixed", style: "Modern",
    lat: 51.5045, lng: -0.0865, color: "#8AA0C0", wiki: "The_Shard",
    architect: "Renzo Piano", status: "completed",
  },
  {
    id: "custom_one_canada_sq", name: "One Canada Square", city: "London", country: "United Kingdom",
    height: 235, floors: 50, year: 1991, use: "Office", style: "Postmodern",
    lat: 51.5050, lng: -0.0185, color: "#7A98B0", wiki: "One_Canada_Square",
    architect: "Cesar Pelli", status: "completed",
  },
  {
    id: "custom_22_bishopsgate", name: "22 Bishopsgate", city: "London", country: "United Kingdom",
    height: 278, floors: 62, year: 2020, use: "Office", style: "Modern",
    lat: 51.5137, lng: -0.0820, color: "#8098B8", wiki: "22_Bishopsgate",
    architect: "PLP Architecture", status: "completed",
  },
  {
    id: "custom_tour_first", name: "Tour First", city: "Paris", country: "France",
    height: 231, floors: 50, year: 2011, use: "Office", style: "Modern",
    lat: 48.8935, lng: 2.2367, color: "#6A90A8", wiki: "Tour_First",
    status: "completed",
  },
  {
    id: "custom_commerzbank", name: "Commerzbank Tower", city: "Frankfurt", country: "Germany",
    height: 259, floors: 56, year: 1997, use: "Office", style: "Modern",
    lat: 50.1093, lng: 8.6720, color: "#7A88A8", wiki: "Commerzbank_Tower",
    architect: "Norman Foster", status: "completed",
  },
  {
    id: "custom_maastoren", name: "Maastoren", city: "Rotterdam", country: "Netherlands",
    height: 165, floors: 44, year: 2010, use: "Office", style: "Modern",
    lat: 51.9044, lng: 4.4862, color: "#6898A0", wiki: "Maastoren",
    architect: "Dam & Partners", status: "completed",
  },
  {
    id: "custom_torre_cepsa", name: "Torre Cepsa", city: "Madrid", country: "Spain",
    height: 248, floors: 45, year: 2009, use: "Office", style: "Modern",
    lat: 40.4536, lng: -3.6893, color: "#7888B0", wiki: "Torre_Cepsa",
    architect: "Norman Foster", status: "completed",
  },
  {
    id: "custom_mercury_city", name: "Mercury City Tower", city: "Moscow", country: "Russia",
    height: 339, floors: 75, year: 2013, use: "Mixed", style: "Modern",
    lat: 55.7480, lng: 37.5371, color: "#8A90C0", wiki: "Mercury_City_Tower",
    status: "completed",
  },
  {
    id: "custom_lakhta", name: "Lakhta Center", city: "Saint Petersburg", country: "Russia",
    height: 462, floors: 87, year: 2019, use: "Office", style: "Modern",
    lat: 59.9875, lng: 30.1781, color: "#6A80B8", wiki: "Lakhta_Center",
    architect: "RMJM", status: "completed",
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
