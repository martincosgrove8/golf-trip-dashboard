import { useState } from "react";
import { getRounds, getReleasedFlags, getTeams } from "../data/storage";
import { getPlayers } from "../data/storage";
import { Clock, Flag, Users, Lock } from "lucide-react";

export default function TeeTimesPage() {
  const rounds = getRounds();
  const released = getReleasedFlags();
  const teams = getTeams() ?? [];
  const players = getPlayers();

  // Default to first released round, or 0
  const firstReleased = released.findIndex(Boolean);
  const [selectedDay, setSelectedDay] = useState(firstReleased >= 0 ? firstReleased : 0);

  const round = rounds[selectedDay];
  const isReleased = released[selectedDay];

  function getPlayer(id) {
    return players.find((p) => p.id === id) ?? { name: `Player ${id}` };
  }

  function badgeStyle(id) {
    const team = teams.find((t) => t.players.includes(id));
    if (team) return { backgroundColor: team.color + "18", color: team.color, borderColor: team.color + "44" };
    return { backgroundColor: "#f8fafc", color: "#64748b", borderColor: "#e2e8f0" };
  }

  function dotColor(id) {
    const team = teams.find((t) => t.players.includes(id));
    return team ? team.color : "#94a3b8";
  }

  const anyReleased = released.some(Boolean);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">Tee Times</h2>

      {!anyReleased ? (
        <div className="mt-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl px-6 py-12 text-center">
          <Lock size={36} className="text-slate-300 mx-auto mb-3" />
          <div className="text-slate-500 font-semibold mb-1">Tee times not published yet</div>
          <div className="text-sm text-slate-400">
            Check back soon — the admin will publish tee times before each round.
          </div>
        </div>
      ) : (
        <>
          {/* Day selector */}
          <div className="flex gap-2 flex-wrap mb-5">
            {rounds.map((r, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                disabled={!released[i]}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  !released[i]
                    ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                    : selectedDay === i
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-600 border-slate-300 hover:border-emerald-400"
                }`}
              >
                {r.dayLabel}
                {!released[i] && <Lock size={9} className="inline ml-1 mb-0.5" />}
              </button>
            ))}
          </div>

          {!isReleased ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl px-4 py-8 text-center">
              <Lock size={24} className="text-slate-300 mx-auto mb-2" />
              <div className="text-sm text-slate-400">Tee times for this round haven't been published yet.</div>
            </div>
          ) : (
            <>
              {/* Course header */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-3 mb-5">
                <Flag size={16} className="text-emerald-600" />
                <div>
                  <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">{round.day}</div>
                  <div className="text-sm font-bold text-emerald-800">{round.course}</div>
                </div>
              </div>

              {/* Tee time groups */}
              <div className="space-y-3">
                {round.groups.map((g, gi) => (
                  <div key={gi} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-700 px-4 py-2 flex items-center gap-2 text-white text-sm font-semibold">
                      <Clock size={14} />
                      {g.time}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                        <Users size={12} />
                        {g.players.length} players
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {g.players.map((id) => {
                          const p = getPlayer(id);
                          return (
                            <div
                              key={id}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                              style={badgeStyle(id)}
                            >
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor(id) }} />
                              {p.name}
                              {p.handicap > 0 && (
                                <span className="opacity-60 font-normal">({p.handicap})</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
