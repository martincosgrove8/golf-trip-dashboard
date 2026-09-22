import { transfers } from "../data/tripData";
import { Bus, Plane, Clock, ArrowRight, Info } from "lucide-react";

const airportTransfers = transfers.filter((t) => t.type === "airport");
const golfTransfers = transfers.filter((t) => t.type === "golf");

const golfDays = [...new Set(golfTransfers.map((t) => t.day))];

export default function TransfersPage() {
  return (
    <div className="space-y-8">
      {/* ── Airport Transfers ───────────────────────────────── */}
      <section>
        <SectionHeader icon={<Plane size={15} />} label="Airport Transfers" color="sky" />
        <div className="space-y-2">
          {airportTransfers.map((t) => (
            <TransferCard key={t.id} transfer={t} accent="sky" />
          ))}
        </div>
      </section>

      {/* ── Golf Course Transfers ───────────────────────────── */}
      <section>
        <SectionHeader icon={<Bus size={15} />} label="Golf Course Transfers" color="emerald" />
        <div className="space-y-6">
          {golfDays.map((day) => {
            const items = golfTransfers.filter((t) => t.day === day);
            return (
              <div key={day}>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 px-1">
                  {day}
                </div>
                <div className="space-y-2">
                  {items.map((t) => (
                    <TransferCard key={t.id} transfer={t} accent="emerald" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon, label, color }) {
  const styles = {
    sky:     "bg-sky-50 border-sky-200 text-sky-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  };
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 mb-3 font-semibold text-sm ${styles[color]}`}>
      {icon}
      {label}
    </div>
  );
}

function TransferCard({ transfer: t, accent }) {
  const dotStyle = accent === "sky"
    ? "bg-sky-50 text-sky-600"
    : "bg-emerald-50 text-emerald-600";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex gap-4 items-start">
      <div className={`rounded-lg p-2 mt-0.5 ${dotStyle}`}>
        {accent === "sky" ? <Plane size={16} /> : <Bus size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="flex items-center gap-1 text-sm font-semibold text-slate-700">
            <Clock size={12} className="text-slate-400" />
            {t.time}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-sm text-slate-700 truncate">{t.from}</span>
          <ArrowRight size={12} className="text-slate-400 shrink-0" />
          <span className="text-sm font-semibold text-slate-700 truncate">{t.to}</span>
        </div>
        {t.notes && (
          <div className="flex items-start gap-1 mt-1.5 text-xs text-slate-500">
            <Info size={11} className="mt-0.5 shrink-0" />
            <span>{t.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
}
