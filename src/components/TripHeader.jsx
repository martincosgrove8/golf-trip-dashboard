import { trip } from "../data/tripData";

function getDaysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function formatDate(str) {
  return new Date(str).toLocaleDateString("en-IE", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function TripHeader() {
  const days = getDaysUntil(trip.dateStart);

  return (
    <div className="rounded-2xl overflow-hidden mb-6 shadow-xl relative" style={{ minHeight: 220 }}>
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />
      {/* Dark gradient overlay — heavier at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/70" />

      {/* Content */}
      <div className="relative px-6 pt-8 pb-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                {trip.destination}
              </span>
              <span className="text-white/40">·</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                {trip.flag}
              </span>
            </div>
            {/* Main title */}
            <h1
              className="font-extrabold leading-tight tracking-tight text-white"
              style={{ fontSize: "clamp(1.5rem, 5vw, 2.25rem)", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
            >
              Autumn Golf Getaway 2026
            </h1>
            <p
              className="mt-1 font-semibold tracking-wide"
              style={{ fontSize: "clamp(0.85rem, 2.5vw, 1.05rem)", color: "rgba(255,255,255,0.75)", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}
            >
              Vilamoura, Portugal
            </p>
          </div>

          {/* Countdown badge */}
          <div>
            {days > 0 ? (
              <div className="bg-white/15 border border-white/25 rounded-2xl px-5 py-3 backdrop-blur-md text-center shadow-lg">
                <div className="text-3xl font-extrabold tabular-nums" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{days}</div>
                <div className="text-xs text-white/70 font-semibold uppercase tracking-wider mt-0.5">days to go</div>
              </div>
            ) : days === 0 ? (
              <div className="bg-yellow-400/25 border border-yellow-300/40 rounded-2xl px-5 py-3 backdrop-blur-md text-center shadow-lg">
                <div className="text-xl font-extrabold">Today! ⛳</div>
                <div className="text-xs text-white/70 font-semibold uppercase tracking-wider mt-0.5">Let's go</div>
              </div>
            ) : (
              <div className="bg-white/15 border border-white/25 rounded-2xl px-5 py-3 backdrop-blur-md text-center shadow-lg">
                <div className="text-lg font-extrabold">Trip Complete</div>
                <div className="text-xs text-white/70 font-semibold uppercase tracking-wider mt-0.5">{Math.abs(days)} days ago</div>
              </div>
            )}
          </div>
        </div>

        {/* Info pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Pill label="Depart" value={formatDate(trip.dateStart)} />
          <Pill label="Return" value={formatDate(trip.dateEnd)} />
          <Pill label="Hotel" value={trip.hotel} />
          <Pill label="SOS" value={trip.emergencyContact} />
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value }) {
  return (
    <div className="bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 text-xs backdrop-blur-sm">
      <span className="text-white/55 font-semibold">{label}: </span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
