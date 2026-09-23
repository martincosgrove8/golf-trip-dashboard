import { flights } from "../data/tripData";
import { Plane, ArrowRight } from "lucide-react";
import PageHeader from "./PageHeader";

export default function FlightsPage() {
  return (
    <div>
      <PageHeader eyebrow="Travel" title="Flights" subtitle="Knock ↔ Faro · Ryanair" />
      <div className="space-y-4">
        {flights.map((f) => (
          <FlightCard key={f.id} flight={f} />
        ))}
      </div>
    </div>
  );
}

function FlightCard({ flight: f }) {
  const label = f.direction === "outbound" ? "✈️ Outbound" : "🏠 Return";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Plane size={16} />
          {f.airline} — {f.flightNo}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sky-100 text-xs font-medium">{label}</span>
          <span className="text-sky-200 text-xs">·</span>
          <span className="text-sky-100 text-sm">{f.date}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3">
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
          <div className="text-xs text-slate-500 mt-3">Terminal: {f.terminal}</div>
        )}
      </div>
    </div>
  );
}
