// ─── TRIP DETAILS ────────────────────────────────────────────────────────────
export const trip = {
  name: "Algarve Golf Trip 2026",
  destination: "Algarve, Portugal",
  flag: "🇵🇹",
  dateStart: "2026-10-02",
  dateEnd: "2026-10-09",
  hotel: "Pinhal da Marina",
  hotelAddress: "Apartado 798, Vilamoura, 8125-911 Vilamoura, Portugal",
  hotelPhone: "",
  emergencyContact: "Martin Cosgrove +353 872561265",
};

// ─── PLAYERS ─────────────────────────────────────────────────────────────────
export const players = [
  { id: 1,  name: "Ciaran Rabbett",   handicap: 0 },
  { id: 2,  name: "David Scott",      handicap: 0 },
  { id: 3,  name: "Eamon Mangan",     handicap: 0 },
  { id: 4,  name: "Fergal Ruane",     handicap: 0 },
  { id: 5,  name: "James Mangan",     handicap: 0 },
  { id: 6,  name: "John Lennon",      handicap: 0 },
  { id: 7,  name: "John Wilson",      handicap: 0 },
  { id: 8,  name: "Kenny Concannon",  handicap: 0 },
  { id: 9,  name: "Kevin Fallon",     handicap: 0 },
  { id: 10, name: "Kevin Padden",     handicap: 0 },
  { id: 11, name: "Martin Cosgrove",  handicap: 0 },
  { id: 12, name: "Peter Mulry",      handicap: 0 },
  { id: 13, name: "Brendan Keane",    handicap: 0 },
  { id: 14, name: "Eugene Galligan",  handicap: 0 },
  { id: 15, name: "John Mangan",      handicap: 0 },
  { id: 16, name: "Tom Gruddy",       handicap: 0 },
  { id: 17, name: "Guest",            handicap: 0 },
];

// ─── FLIGHTS ─────────────────────────────────────────────────────────────────
export const flights = [
  {
    id: "f1",
    direction: "outbound",
    flightNo: "FR 2452",
    airline: "Ryanair",
    from: "Knock (NOC)",
    to: "Faro (FAO)",
    date: "Fri 02 Oct 2026",
    departure: "09:25",
    arrival: "12:15",
    duration: "2h 50m",
    terminal: "",
    passengers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  },
  {
    id: "f2",
    direction: "return",
    flightNo: "FR 2451",
    airline: "Ryanair",
    from: "Faro (FAO)",
    to: "Knock (NOC)",
    date: "Fri 09 Oct 2026",
    departure: "06:05",
    arrival: "09:00",
    duration: "2h 55m",
    terminal: "",
    passengers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  },
];

// ─── ACCOMMODATION ───────────────────────────────────────────────────────────
export const accommodation = {
  name: "Pinhal da Marina",
  address: "Apartado 798, Vilamoura, 8125-911 Vilamoura, Portugal",
  checkIn: "Fri 02 Oct 2026 — 15:00",
  checkOut: "Fri 09 Oct 2026 — 11:00",
  mapsUrl: "https://maps.google.com/?q=Pinhal+da+Marina+Vilamoura",
  rooms: [
    { room: "1", occupants: [5, 6, 9] },   // James Mangan, John Lennon, Kevin Fallon
    { room: "2", occupants: [11, 10, 15] }, // Martin Cosgrove, Kevin Padden, John Mangan
    { room: "3", occupants: [7, 13, 2] },   // John Wilson, Brendan Keane, David Scott
    { room: "4", occupants: [12, 3, 1] },   // Peter Mulry, Eamon Mangan, Ciaran Rabbett
    { room: "5", occupants: [4, 8, 14] },   // Fergal Ruane, Kenny Concannon, Eugene Galligan
  ],
};

// ─── TRANSFERS ───────────────────────────────────────────────────────────────
export const transfers = [
  // ── Airport transfers (Suntransfers SUNTR_XK0896) ──────────────────────────
  {
    id: "t-arr",
    type: "airport",
    day: "Fri 02 Oct",
    time: "~12:45",
    from: "Faro Airport (FAO) — meet driver at Café Central",
    to: "Pinhal da Marina Apartments, Vilamoura",
    notes: "Suntransfers SUNTR_XK0896 · Private coach · 18 pax · Driver arrives ~30 min after landing · Lead: Martin Cosgrove +353 872561265 · Can't find driver: +351 289 878 159",
  },
  {
    id: "t-dep",
    type: "airport",
    day: "Fri 09 Oct",
    time: "02:45",
    from: "Pinhal da Marina Apartments, Vilamoura",
    to: "Faro Airport (FAO)",
    notes: "Suntransfers SUNTR_XK0896 · Private coach · 18 pax · Be ready at 02:45 sharp — driver waits max 15 min · Flight FR2451 departs 06:05 · Lead: Martin Cosgrove +353 872561265",
  },

  // ── Golf transfers (Algarserra booking 260915-92812) ───────────────────────
  {
    id: "t1-out",
    type: "golf",
    day: "Sat 03 Oct",
    time: "14:00",
    from: "Pinhal da Marina Apartments, Vilamoura",
    to: "Amendoeira Faldo Golf Course, Alcantarilha",
    notes: "Ref 167633 · Tee time 15:40 · 15 pax · Algarserra +351 308 800 730 (code 9281265#)",
  },
  {
    id: "t1-ret",
    type: "golf",
    day: "Sat 03 Oct",
    time: "20:00",
    from: "Amendoeira Faldo Golf Course, Alcantarilha",
    to: "Pinhal da Marina Apartments, Vilamoura",
    notes: "Ref 167634 · 15 pax · Algarserra +351 308 800 730 (code 9281265#)",
  },
  {
    id: "t5-out",
    type: "golf",
    day: "Wed 07 Oct",
    time: "06:30",
    from: "Pinhal da Marina Apartments, Vilamoura",
    to: "Quinta do Vale Golf, Castro Marim",
    notes: "Ref 167630 · Tee time 08:00 · 15 pax · Night fee included · Algarserra +351 308 800 730 (code 9281265#)",
  },
  {
    id: "t5-ret",
    type: "golf",
    day: "Wed 07 Oct",
    time: "16:00",
    from: "Quinta do Vale Golf, Castro Marim",
    to: "Pinhal da Marina Apartments, Vilamoura",
    notes: "Ref 167631 · 15 pax · Algarserra +351 308 800 730 (code 9281265#)",
  },
];

// ─── TEE TIMES ────────────────────────────────────────────────────────────────
export const rounds = [
  {
    day: "Sat 03 Oct",
    dayLabel: "Round 1 — Faldo Course",
    course: "Faldo Course, Amendoeira",
    teeTime: "15:40",
    groups: [
      { time: "15:40", players: [8, 14, 4] },            // Kenny Concannon, Eugene Galligan, Fergal Ruane
      { time: "15:50", players: [11, 10, 15, 9] },       // Martin Cosgrove, Kevin Padden, John Mangan, Kevin Fallon
      { time: "16:00", players: [5, 6, 7, 2] },          // James Mangan, John Lennon, John Wilson, David Scott
      { time: "16:10", players: [12, 1, 3, 13] },        // Peter Mulry, Ciaran Rabbett, Eamon Mangan, Brendan Keane
    ],
  },
  {
    day: "Mon 05 Oct",
    dayLabel: "Round 2 — Dom Pedro Laguna",
    course: "Dom Pedro Laguna, Vilamoura",
    teeTime: "13:10",
    groups: [
      { time: "13:10", players: [3, 15, 14] },           // Eamon Mangan, John Mangan, Eugene Galligan
      { time: "13:20", players: [5, 16, 17] },           // James Mangan, Tom Gruddy, Guest
      { time: "13:30", players: [11, 6, 9] },            // Martin Cosgrove, John Lennon, Kevin Fallon
      { time: "13:40", players: [4, 1, 7, 10] },         // Fergal Ruane, Ciaran Rabbett, John Wilson, Kevin Padden
      { time: "13:50", players: [8, 2, 13, 12] },        // Kenny Concannon, David Scott, Brendan Keane, Peter Mulry
    ],
  },
  {
    day: "Tue 06 Oct",
    dayLabel: "Round 3 — Vale do Lobo Royal",
    course: "Vale do Lobo Royal Course",
    teeTime: "13:20",
    groups: [
      { time: "13:20", players: [2, 13, 14] },           // David Scott, Brendan Keane, Eugene Galligan
      { time: "13:30", players: [3, 8, 6, 4] },          // Eamon Mangan, Kenny Concannon, John Lennon, Fergal Ruane
      { time: "13:40", players: [11, 12, 10, 7] },       // Martin Cosgrove, Peter Mulry, Kevin Padden, John Wilson
      { time: "13:50", players: [15, 5, 9, 1] },         // John Mangan, James Mangan, Kevin Fallon, Ciaran Rabbett
    ],
  },
  {
    day: "Wed 07 Oct",
    dayLabel: "Round 4 — Quinta do Vale",
    course: "Quinta do Vale Golf, Castro Marim",
    teeTime: "08:00",
    groups: [
      { time: "08:00", players: [10, 9, 12] },           // Kevin Padden, Kevin Fallon, Peter Mulry
      { time: "08:10", players: [15, 6, 14, 2] },        // John Mangan, John Lennon, Eugene Galligan, David Scott
      { time: "08:20", players: [11, 1, 5, 7] },         // Martin Cosgrove, Ciaran Rabbett, James Mangan, John Wilson
      { time: "08:30", players: [4, 3, 13, 8] },         // Fergal Ruane, Eamon Mangan, Brendan Keane, Kenny Concannon
    ],
  },
];

// ─── SCORES (Stableford points per hole) ─────────────────────────────────────
// 0 = no score, score to taste. 18 holes per entry.
export const scores = [
  // DAY 1
  { day: 1, playerId: 1,  holes: [3,2,3,4,2,3,3,2,3, 4,2,3,3,2,3,4,2,3], total: 51 },
  { day: 1, playerId: 2,  holes: [2,1,2,3,1,2,2,1,2, 3,1,2,2,1,2,3,1,2], total: 35 },
  { day: 1, playerId: 3,  holes: [4,3,4,4,3,4,4,3,4, 4,3,4,4,3,4,4,3,4], total: 66 },
  { day: 1, playerId: 4,  holes: [2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2], total: 36 },
  { day: 1, playerId: 5,  holes: [3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3], total: 54 },
  { day: 1, playerId: 6,  holes: [2,3,2,3,2,3,2,3,2, 3,2,3,2,3,2,3,2,3], total: 45 },
  { day: 1, playerId: 7,  holes: [3,2,4,3,2,4,3,2,4, 3,2,4,3,2,4,3,2,4], total: 54 },
  { day: 1, playerId: 8,  holes: [4,3,4,3,4,3,4,3,4, 3,4,3,4,3,4,3,4,3], total: 63 },
  { day: 1, playerId: 9,  holes: [2,2,1,2,2,1,2,2,1, 2,2,1,2,2,1,2,2,1], total: 32 },
  { day: 1, playerId: 10, holes: [3,4,3,3,4,3,3,4,3, 3,4,3,3,4,3,3,4,3], total: 59 },
  { day: 1, playerId: 11, holes: [1,2,2,1,2,2,1,2,2, 1,2,2,1,2,2,1,2,2], total: 32 },
  { day: 1, playerId: 12, holes: [3,3,2,3,3,2,3,3,2, 3,3,2,3,3,2,3,3,2], total: 48 },
  { day: 1, playerId: 13, holes: [2,2,3,2,2,3,2,2,3, 2,2,3,2,2,3,2,2,3], total: 43 },
  { day: 1, playerId: 14, holes: [3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3], total: 54 },
  { day: 1, playerId: 15, holes: [3,2,3,3,2,3,3,2,3, 3,2,3,3,2,3,3,2,3], total: 48 },
  // DAY 2
  { day: 2, playerId: 1,  holes: [3,3,2,4,2,3,3,3,2, 4,3,2,3,3,2,4,2,3], total: 51 },
  { day: 2, playerId: 2,  holes: [2,2,1,3,1,2,2,2,1, 3,2,1,2,2,1,3,1,2], total: 35 },
  { day: 2, playerId: 3,  holes: [4,4,3,4,3,4,4,4,3, 4,4,3,4,4,3,4,3,4], total: 67 },
  { day: 2, playerId: 4,  holes: [2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2], total: 36 },
  { day: 2, playerId: 5,  holes: [3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3], total: 54 },
  { day: 2, playerId: 6,  holes: [2,3,2,3,2,3,2,3,2, 3,2,3,2,3,2,3,2,3], total: 45 },
  { day: 2, playerId: 7,  holes: [4,3,4,3,4,3,4,3,4, 3,4,3,4,3,4,3,4,3], total: 63 },
  { day: 2, playerId: 8,  holes: [3,3,4,3,4,3,3,3,4, 3,3,4,3,3,4,3,4,3], total: 59 },
  { day: 2, playerId: 9,  holes: [1,2,2,1,2,2,1,2,2, 1,2,2,1,2,2,1,2,2], total: 32 },
  { day: 2, playerId: 10, holes: [3,4,3,3,4,3,3,4,3, 3,4,3,3,4,3,3,4,3], total: 59 },
  { day: 2, playerId: 11, holes: [2,2,1,2,2,1,2,2,1, 2,2,1,2,2,1,2,2,1], total: 33 },
  { day: 2, playerId: 12, holes: [3,3,2,3,3,2,3,3,2, 3,3,2,3,3,2,3,3,2], total: 48 },
  { day: 2, playerId: 13, holes: [3,2,3,2,3,2,3,2,3, 2,3,2,3,2,3,2,3,2], total: 45 },
  { day: 2, playerId: 14, holes: [3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3], total: 54 },
  { day: 2, playerId: 15, holes: [2,3,3,2,3,3,2,3,3, 2,3,3,2,3,3,2,3,3], total: 48 },
  // DAY 3
  { day: 3, playerId: 1,  holes: [3,2,3,4,2,3,3,2,3, 4,2,3,3,2,3,4,2,3], total: 51 },
  { day: 3, playerId: 2,  holes: [2,1,2,3,1,2,2,1,2, 3,1,2,2,1,2,3,1,2], total: 35 },
  { day: 3, playerId: 3,  holes: [4,3,4,4,3,4,4,3,4, 4,3,4,4,3,4,4,3,4], total: 66 },
  { day: 3, playerId: 4,  holes: [2,3,2,2,3,2,2,3,2, 2,3,2,2,3,2,2,3,2], total: 42 },
  { day: 3, playerId: 5,  holes: [3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3], total: 54 },
  { day: 3, playerId: 6,  holes: [3,3,2,3,2,3,3,3,2, 3,3,2,3,3,2,3,2,3], total: 48 },
  { day: 3, playerId: 7,  holes: [3,2,4,3,2,4,3,2,4, 3,2,4,3,2,4,3,2,4], total: 54 },
  { day: 3, playerId: 8,  holes: [4,3,4,3,4,3,4,3,4, 3,4,3,4,3,4,3,4,3], total: 63 },
  { day: 3, playerId: 9,  holes: [2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2], total: 36 },
  { day: 3, playerId: 10, holes: [3,4,3,3,4,3,3,4,3, 3,4,3,3,4,3,3,4,3], total: 59 },
  { day: 3, playerId: 11, holes: [2,2,1,2,2,1,2,2,1, 2,2,1,2,2,1,2,2,1], total: 33 },
  { day: 3, playerId: 12, holes: [3,3,2,3,3,2,3,3,2, 3,3,2,3,3,2,3,3,2], total: 48 },
  { day: 3, playerId: 13, holes: [2,2,3,2,2,3,2,2,3, 2,2,3,2,2,3,2,2,3], total: 43 },
  { day: 3, playerId: 14, holes: [3,3,3,3,3,3,4,3,3, 3,3,3,3,3,3,3,3,3], total: 55 },
  { day: 3, playerId: 15, holes: [3,2,3,3,2,3,3,2,3, 3,2,3,3,2,3,3,2,3], total: 48 },
  // DAY 4
  { day: 4, playerId: 1,  holes: [4,3,3,4,3,3,4,3,3, 4,3,3,4,3,3,4,3,3], total: 60 },
  { day: 4, playerId: 2,  holes: [2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2], total: 36 },
  { day: 4, playerId: 3,  holes: [4,4,3,4,4,3,4,4,3, 4,4,3,4,4,3,4,4,3], total: 67 },
  { day: 4, playerId: 4,  holes: [3,2,2,3,2,2,3,2,2, 3,2,2,3,2,2,3,2,2], total: 42 },
  { day: 4, playerId: 5,  holes: [3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3], total: 54 },
  { day: 4, playerId: 6,  holes: [2,3,3,2,3,3,2,3,3, 2,3,3,2,3,3,2,3,3], total: 48 },
  { day: 4, playerId: 7,  holes: [3,3,4,3,3,4,3,3,4, 3,3,4,3,3,4,3,3,4], total: 60 },
  { day: 4, playerId: 8,  holes: [4,3,4,3,4,3,4,3,4, 3,4,3,4,3,4,3,4,3], total: 63 },
  { day: 4, playerId: 9,  holes: [2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2], total: 36 },
  { day: 4, playerId: 10, holes: [3,4,3,4,3,4,3,4,3, 4,3,4,3,4,3,4,3,4], total: 63 },
  { day: 4, playerId: 11, holes: [2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2], total: 36 },
  { day: 4, playerId: 12, holes: [3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3], total: 54 },
  { day: 4, playerId: 13, holes: [3,2,3,3,2,3,3,2,3, 3,2,3,3,2,3,3,2,3], total: 48 },
  { day: 4, playerId: 14, holes: [4,3,3,4,3,3,4,3,3, 4,3,3,4,3,3,4,3,3], total: 60 },
  { day: 4, playerId: 15, holes: [3,3,3,3,3,3,3,3,3, 3,3,3,3,3,3,3,3,3], total: 54 },
];

// ─── TEAM COMPETITION (3-man teams, Rounds 2–4 cumulative Stableford) ─────────
// Rounds 2, 3, 4 = days 2, 3, 4 in scores (Mon 05, Tue 06, Wed 07 Oct)
// Tom Gruddy (16) and Guest (17) are excluded — one-day guests only
export const teams = [
  { id: "A", name: "Team A", color: "#15803D", players: [5, 6, 9]  },  // James Mangan, John Lennon, Kevin Fallon
  { id: "B", name: "Team B", color: "#0F766E", players: [11, 10, 15] }, // Martin Cosgrove, Kevin Padden, John Mangan
  { id: "C", name: "Team C", color: "#1D4ED8", players: [7, 13, 2]  },  // John Wilson, Brendan Keane, David Scott
  { id: "D", name: "Team D", color: "#7C3AED", players: [12, 3, 1]  },  // Peter Mulry, Eamon Mangan, Ciaran Rabbett
  { id: "E", name: "Team E", color: "#B45309", players: [4, 8, 14]  },  // Fergal Ruane, Kenny Concannon, Eugene Galligan
];
// Competition rounds — days 2, 3, 4 (scores use day: 2/3/4)
export const competitionDays = [2, 3, 4];
