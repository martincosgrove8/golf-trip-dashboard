import { accommodation, players } from "../data/tripData";
import { Hotel, MapPin, Phone, Calendar, BedDouble, ExternalLink } from "lucide-react";

function getNames(ids) {
  return ids.map((id) => players.find((p) => p.id === id)?.name ?? `Player ${id}`);
}

export default function AccommodationPage() {
  const a = accommodation;
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">Accommodation</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-5 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 flex items-center gap-3 text-white">
          <Hotel size={20} />
          <span className="font-semibold text-lg">{a.name}</span>
        </div>
        <div className="p-5 space-y-3">
          <InfoRow icon={<MapPin size={15} />} label="Address" value={a.address} />
          <InfoRow icon={<Calendar size={15} />} label="Check-in" value={a.checkIn} />
          <InfoRow icon={<Calendar size={15} />} label="Check-out" value={a.checkOut} />
          <a
            href={a.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            <ExternalLink size={13} />
            View on Google Maps
          </a>
        </div>
      </div>

      <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <BedDouble size={16} /> Room Assignments
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {a.rooms.map((r) => (
          <div key={r.room} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
              Room {r.room}
            </div>
            <div className="space-y-1">
              {getNames(r.occupants).map((name) => (
                <div key={name} className="text-sm text-slate-700 font-medium">{name}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-amber-500 mt-0.5">{icon}</span>
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm font-medium text-slate-800">{value}</div>
      </div>
    </div>
  );
}
