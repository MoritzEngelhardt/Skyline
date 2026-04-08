export const FALLBACK_BUILDINGS = [
  {id:"Q12495",name:"Burj Khalifa",city:"Dubai",country:"UAE",height:828,floors:163,year:2010,status:"completed",use:"Mixed",style:"Neo-futurism",lat:25.1972,lng:55.2744,color:"#D4A574",wiki:"Burj_Khalifa",arch:"Adrian Smith",cost:"$1.5B"},
  {id:"Q111633953",name:"Merdeka 118",city:"Kuala Lumpur",country:"Malaysia",height:678.9,floors:118,year:2023,status:"completed",use:"Mixed",style:"Modern",lat:3.1412,lng:101.7006,color:"#7BA7BC",wiki:"Merdeka_118",arch:"Fender Katsalidis"},
  {id:"Q1461640",name:"Shanghai Tower",city:"Shanghai",country:"China",height:632,floors:128,year:2015,status:"completed",use:"Mixed",style:"Neo-futurism",lat:31.2356,lng:121.5016,color:"#8B9DAF",wiki:"Shanghai_Tower",arch:"Gensler",cost:"$2.4B"},
  {id:"Q379718",name:"Abraj Al-Bait",city:"Mecca",country:"Saudi Arabia",height:601,floors:120,year:2012,status:"completed",use:"Mixed",style:"Postmodern",lat:21.4189,lng:39.8263,color:"#C4A882",wiki:"Abraj_Al-Bait",arch:"Dar Al-Handasah",cost:"$15B"},
  {id:"Q1350498",name:"Ping An Finance Centre",city:"Shenzhen",country:"China",height:599.1,floors:115,year:2017,status:"completed",use:"Office",style:"Modern",lat:22.5333,lng:114.0543,color:"#A8B5C2",wiki:"Ping_An_Finance_Centre",arch:"Kohn Pedersen Fox",cost:"$1.5B"},
  {id:"Q489032",name:"Lotte World Tower",city:"Seoul",country:"South Korea",height:554.5,floors:123,year:2017,status:"completed",use:"Mixed",style:"Neo-futurism",lat:37.5126,lng:127.1026,color:"#B8C4D0",wiki:"Lotte_World_Tower",arch:"Kohn Pedersen Fox",cost:"$3.5B"},
  {id:"Q158477",name:"One World Trade Center",city:"New York",country:"USA",height:541.3,floors:104,year:2014,status:"completed",use:"Office",style:"Modern",lat:40.7127,lng:-74.0134,color:"#6D8BA4",wiki:"One_World_Trade_Center",arch:"SOM",cost:"$3.9B"},
  {id:"Q836602",name:"Taipei 101",city:"Taipei",country:"Taiwan",height:508,floors:101,year:2004,status:"completed",use:"Office",style:"Postmodern",lat:25.034,lng:121.5645,color:"#5B8C6E",wiki:"Taipei_101",arch:"C.Y. Lee",cost:"$1.8B"},
  {id:"Q131013",name:"Willis Tower",city:"Chicago",country:"USA",height:442.1,floors:108,year:1974,status:"completed",use:"Office",style:"International",lat:41.8789,lng:-87.6359,color:"#555",wiki:"Willis_Tower",arch:"SOM",cost:"$175M"},
  {id:"Q9188",name:"Empire State Building",city:"New York",country:"USA",height:443.2,floors:102,year:1931,status:"completed",use:"Office",style:"Art Deco",lat:40.7484,lng:-73.9857,color:"#C2A878",wiki:"Empire_State_Building",arch:"Shreve, Lamb & Harmon",cost:"$41M"},
  {id:"Q188553",name:"Petronas Tower 1",city:"Kuala Lumpur",country:"Malaysia",height:451.9,floors:88,year:1998,status:"completed",use:"Office",style:"Postmodern",lat:3.1579,lng:101.7116,color:"#BCC8D4",wiki:"Petronas_Towers",arch:"César Pelli",cost:"$1.6B"},
  {id:"Q36524",name:"Chrysler Building",city:"New York",country:"USA",height:318.9,floors:77,year:1930,status:"completed",use:"Office",style:"Art Deco",lat:40.7516,lng:-73.9755,color:"#C8B896",wiki:"Chrysler_Building",arch:"William Van Alen",cost:"$20M"},
  {id:"Q18715263",name:"Lakhta Center",city:"St. Petersburg",country:"Russia",height:462,floors:87,year:2019,status:"completed",use:"Office",style:"Neo-futurism",lat:59.9871,lng:30.1777,color:"#6A9EBF",wiki:"Lakhta_Center",arch:"Tony Kettle",cost:"$2.5B"},
  {id:"Q160409",name:"Central Park Tower",city:"New York",country:"USA",height:472.4,floors:98,year:2021,status:"completed",use:"Mixed",style:"Modern",lat:40.7669,lng:-73.9809,color:"#A0B0C0",wiki:"Central_Park_Tower",arch:"Adrian Smith + Gordon Gill",cost:"$3B"},
  {id:"Q18713566",name:"Salesforce Tower",city:"San Francisco",country:"USA",height:326,floors:61,year:2018,status:"completed",use:"Office",style:"Modern",lat:37.7898,lng:-122.3969,color:"#8AAABE",wiki:"Salesforce_Tower",arch:"César Pelli",cost:"$1.1B"},
  // European
  {id:"Q1138215",name:"The Shard",city:"London",country:"UK",height:310,floors:95,year:2012,status:"completed",use:"Mixed",style:"Modern",lat:51.5045,lng:-0.0865,color:"#A8B8C8",wiki:"The_Shard",arch:"Renzo Piano",cost:"£435M"},
  {id:"Q18712428",name:"Varso Tower",city:"Warsaw",country:"Poland",height:310,floors:53,year:2022,status:"completed",use:"Office",style:"Modern",lat:52.2282,lng:20.9977,color:"#7E95A9",wiki:"Varso_Tower",arch:"Foster + Partners"},
  {id:"Q151898",name:"Commerzbank Tower",city:"Frankfurt",country:"Germany",height:259,floors:56,year:1997,status:"completed",use:"Office",style:"Modern",lat:50.1094,lng:8.6718,color:"#8899AA",wiki:"Commerzbank_Tower",arch:"Norman Foster"},
  {id:"Q24190059",name:"Karlatornet",city:"Gothenburg",country:"Sweden",height:246,floors:73,year:2025,status:"completed",use:"Mixed",style:"Modern",lat:57.7075,lng:11.9388,color:"#7BA4BC",wiki:"Karlatornet",arch:"Wingårdhs"},
  {id:"Q1025862",name:"Transamerica Pyramid",city:"San Francisco",country:"USA",height:260,floors:48,year:1972,status:"completed",use:"Office",style:"Modern",lat:37.7952,lng:-122.4028,color:"#C8B896",wiki:"Transamerica_Pyramid",arch:"William Pereira",cost:"$32M"},
];

export const MAX_H = 830;
export const DECADES = ["All", "Pre-2000", "2000s", "2010s", "2020s"];
export const USES = ["All", "Office", "Mixed", "Residential"];
export const REGIONS = ["All", "Asia", "Middle East", "North America", "Europe", "Other"];
export const STATUSES = ["completed", "construction", "planned"];

export function getRegion(country) {
  if (!country) return "Other";
  const c = country.toLowerCase();
  if (["china","taiwan","south korea","malaysia","vietnam","japan","indonesia","philippines","singapore","hong kong"].some(x=>c.includes(x))) return "Asia";
  if (["uae","united arab emirates","saudi arabia","qatar","bahrain","kuwait","oman"].some(x=>c.includes(x))) return "Middle East";
  if (["usa","united states","canada","u.s."].some(x=>c.includes(x))) return "North America";
  if (["russia","uk","united kingdom","germany","france","spain","italy","poland","turkey","netherlands","sweden","norway","denmark","finland","austria","switzerland","belgium","czech","ireland","portugal","romania","hungary","greece"].some(x=>c.includes(x))) return "Europe";
  return "Other";
}

export function getDecade(year) {
  if (!year) return "Unknown";
  if (year < 2000) return "Pre-2000";
  if (year < 2010) return "2000s";
  if (year < 2020) return "2010s";
  return "2020s";
}

export function computeTallestBadges(buildings) {
  const completed = buildings.filter(b => b.year && b.height && b.status === "completed")
    .sort((a, b) => a.year - b.year || b.height - a.height);
  const s = new Set();
  let record = 0;
  completed.forEach(b => { if (b.height > record) { record = b.height; s.add(b.id); } });
  return s;
}

export function getStatusLabel(status) {
  if (status === "under_construction") return "Under Construction";
  if (status === "planned") return "Planned";
  return "Completed";
}

const PAL = ["#6D8BA4","#8B9DAF","#A8B5C2","#7BA7BC","#5B8C6E","#C2A878","#B8C4D0","#778DA0","#6A9EBF","#4A7A8C","#D4A574","#C4A882","#9AA8B8","#8899AA","#7B92A6"];
export function assignColor(i) { return PAL[i % PAL.length]; }
