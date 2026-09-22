import { useState } from "react";
import { flights, players } from "../data/tripData";
import { Plane, ArrowRight, Users } from "lucide-react";

function getPlayerNames(ids) {
  return ids.map((id) => players.find((p) => p.id === id)?.name ?? `Player ${id}`);
}

export default function FlightsPage() {
  const [dir, setDir] = useState("outbound");
  const filtered = flights.filter((f) => f.direction === dir);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">Flights</h2>
      <div className="flex gap-2 mb-5">
        {["outbound", "return"].map((d) => (
          <button
            key={d}
            onClick={() => setDir(d)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              dir === d
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-600 border-slate-300 hover:border-emerald-400"
            }`}
          >
            {d === "outbound" ? "✈️ Outbound" : "🏠 Return"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((f) => (
          <FlightCard key={f.id} flight={f} />
        ))}
      </div>
    </div>
  );
}

function FlightCard({ flight: f }) {
  const names = getPlayerNames(f.passengers);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Plane size={16} />
          {f.airline} — {f.flightNo}
        </div>
        <span className="text-sky-100 text-sm">{f.date}</span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{f.departure}</div>
            <div className="text-xs text-slate-500">{f.from}</div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-0.5">
            <div className="text-xs text-slate-400">{f.duration}</div>
            <div className="w-full flex items-center gap-1">
              <div className="flex-1 border-t-2 border-dashed border-slate-200" />
              <ArrowRight size={16} className="text-slate-400" />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{f.arrival}</div>
            <div className="text-xs text-slate-500">{f.to}</div>
          </div>
        </div>
        {f.terminal && (
          <div className="text-xs text-slate-500 mb-3">Terminal: {f.terminal}</div>
        )}        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Users size={13} />
            Passengers ({names.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {names.map((n) => (
              <span key={n} className="bg-sky-50 text-sky-700 text-xs px-2 py-0.5 rounded-full font-medium">
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
