import TripHeader from "./TripHeader";
import { getPlayers, getScores, getTeams } from "../data/storage";
import { rounds, competitionDays } from "../data/tripData";
import { Flag, Trophy } from "lucide-react";

export default function HomePage() {
  const players = getPlayers();
  const rawScores = getScores(); // null = nothing entered yet
  const teams = getTeams();

  const scores = rawScores ?? [];
  const scoresEntered = rawScores !== null;

  function teamCumulative(team) {
    return competitionDays.reduce((sum, d) => {
      return sum + team.players.reduce((s, pid) => {
        const sc = scores.find((sc) => sc.day === d && sc.playerId === pid);
        return s + (sc?.total ?? 0);
      }, 0);
    }, 0);
  }

  const leaderboard = teams
    ? [...teams].map((t) => ({ ...t, total: teamCumulative(t) })).sort((a, b) => b.total - a.total)
    : null;

  return (
    <div>
      <TripHeader />

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Players" value={15} icon="👥" />
        <StatCard label="Rounds" value={rounds.length} icon="⛳" />
        <StatCard label="Days Away" value={7} icon="🌴" />
        <StatCard label="Teams" value={teams ? teams.length : "—"} icon="🏆" />
      </div>

      {/* Team standings */}
      <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <Trophy size={15} /> Team Standings
      </h3>
      {leaderboard === null ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl px-4 py-6 text-center text-slate-400 text-sm mb-6">
          Teams haven't been set up yet. Visit <span className="font-medium text-slate-500">Admin → Teams</span> to create them.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {leaderboard.map((team, rank) => (
            <div
              key={team.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div
                className="px-3 py-2 flex items-center justify-between text-white text-sm font-bold"
                style={{ backgroundColor: team.color }}
              >
                <span className="flex items-center gap-2">
                  {scoresEntered ? (rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : `#${rank + 1}`) : `#${rank + 1}`}
                  {team.name}
                </span>
                <span>{scoresEntered ? `${team.total} pts` : "— pts"}</span>
              </div>
              <div className="p-2 flex flex-wrap gap-1">
                {team.players.map((pid) => {
                  const p = players.find((p) => p.id === pid);
                  return (
                    <span key={pid} className="text-xs px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 font-medium">
                      {p?.name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule summary */}
      <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <Flag size={15} /> Round Schedule
      </h3>
      <div className="space-y-2">
        {rounds.map((r, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex items-center justify-between">
            <div>
              <div className={`text-xs font-bold ${i === 0 ? "text-slate-400" : "text-emerald-600"}`}>
                {r.dayLabel}{i === 0 ? " (not in competition)" : ""}
              </div>
              <div className="text-sm text-slate-700">{r.day}</div>
            </div>
            <div className="text-xs text-right text-slate-500 font-medium max-w-[180px] truncate">
              {r.course}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
