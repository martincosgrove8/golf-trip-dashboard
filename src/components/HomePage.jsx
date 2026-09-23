import { useState, useEffect } from "react";
import TripHeader from "./TripHeader";
import { getPlayers, getScores, getTeams } from "../data/storage";
import { rounds, competitionDays } from "../data/tripData";
import { Flag, Trophy, Users } from "lucide-react";

export default function HomePage() {
  const [players, setPlayers] = useState([]);
  const [rawScores, setRawScores] = useState(undefined);
  const [teams, setTeams] = useState(undefined);

  useEffect(() => {
    getPlayers().then(setPlayers);
    getScores().then(setRawScores);
    getTeams().then(setTeams);
  }, []);

  const scores = rawScores ?? [];
  const scoresEntered = rawScores !== null && rawScores !== undefined;

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Players" value={15} icon="👥" />
        <StatCard label="Rounds" value={rounds.length} icon="⛳" />
        <StatCard label="Days Away" value={7} icon="🌴" />
        <StatCard label="Teams" value={teams ? teams.length : "—"} icon="🏆" />
      </div>

      {/* Team standings */}
      <SectionHeader icon={<Trophy size={14} />} label="Team Standings" />
      {leaderboard === null ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl px-4 py-8 text-center mb-8">
          <Users size={28} className="text-slate-300 mx-auto mb-2" />
          <div className="text-sm text-slate-500 font-medium mb-0.5">No teams yet</div>
          <div className="text-xs text-slate-400">Visit <span className="font-medium text-slate-500">Admin → Teams</span> to create them.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {(leaderboard ?? []).map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              style={{ borderTopWidth: 3, borderTopColor: team.color }}
            >
              <div className="px-3 py-2.5 flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">{team.name}</span>
                <span className="text-sm font-bold" style={{ color: team.color }}>
                  {scoresEntered ? `${team.total} pts` : "— pts"}
                </span>
              </div>
              <div className="px-3 pb-3 flex flex-wrap gap-1">
                {team.players.map((pid) => {
                  const p = players.find((p) => p.id === pid);
                  return (
                    <span key={pid} className="text-xs px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 font-medium border border-slate-100">
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
      <SectionHeader icon={<Flag size={14} />} label="Round Schedule" />
      <div className="space-y-2">
        {rounds.map((r, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex items-center justify-between">
            <div>
              <div className={`text-xs font-bold ${i === 0 ? "text-slate-400" : "text-emerald-600"}`}>
                {r.dayLabel}{i === 0 ? " — not in team competition" : ""}
              </div>
              <div className="text-sm font-medium text-slate-700">{r.day}</div>
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
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className="text-xs text-slate-400 font-medium mt-0.5">{label}</div>
    </div>
  );
}

function SectionHeader({ icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-slate-400">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}
