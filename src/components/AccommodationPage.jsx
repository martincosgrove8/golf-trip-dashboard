import { accommodation, players } from "../data/tripData";
import { MapPin, Calendar, BedDouble, ExternalLink, Hotel } from "lucide-react";
import PageHeader from "./PageHeader";

function getNames(ids) {
  return ids.map((id) => players.find((p) => p.id === id)?.name ?? `Player ${id}`);
}

export default function AccommodationPage() {
  const a = accommodation;
  return (
    <div>
      <PageHeader eyebrow="Where we're staying" title="Hotel" subtitle={a.name} />

      {/* Main hotel card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 flex items-center gap-3 text-white">
          <Hotel size={20} />
          <span className="font-bold text-lg">{a.name}</span>
        </div>
        <div className="p-5 space-y-4">
          {/* Address */}
          <div className="flex items-start gap-3">
            <span className="text-amber-500 mt-0.5"><MapPin size={15} /></span>
            <div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Address</div>
              <div className="text-sm text-slate-700">{a.address}</div>
            </div>
          </div>

          {/* Check-in / Check-out chips */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              <Calendar size={14} className="text-amber-500 shrink-0" />
              <div>
                <div className="text-xs text-amber-600 font-semibold uppercase tracking-wide">Check-in</div>
                <div className="text-sm font-bold text-slate-800">{a.checkIn}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Calendar size={14} className="text-slate-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Check-out</div>
                <div className="text-sm font-bold text-slate-800">{a.checkOut}</div>
              </div>
            </div>
          </div>

          {/* Map button */}
          <a
            href={a.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <ExternalLink size={14} />
            View on Google Maps
          </a>
        </div>
      </div>

      {/* Room assignments */}
      <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
        <BedDouble size={15} className="text-slate-400" /> Room Assignments
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {a.rooms.map((r) => (
          <div key={r.room} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-amber-500 px-3 py-2">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Room {r.room}</span>
            </div>
            <div className="p-3 space-y-2">
              {getNames(r.occupants).map((name) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-sm text-slate-700 font-medium">{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
