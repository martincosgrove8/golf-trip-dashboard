import { getScores, getPlayers, getTeams } from "../data/storage";
import { competitionDays, rounds } from "../data/tripData";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Trophy, Users, Shuffle, Flag } from "lucide-react";

export default function TeamsPage() {
  const teams = getTeams();
  const rawScores = getScores(); // null = nothing entered yet
  const scores = rawScores ?? [];
  const scoresEntered = rawScores !== null;
  const players = getPlayers();

  if (!teams || teams.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Trophy size={18} /> Team Competition
        </h2>
        <div className="mt-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl px-6 py-12 text-center">
          <Users size={36} className="text-slate-300 mx-auto mb-3" />
          <div className="text-slate-500 font-semibold mb-1">No teams set up yet</div>
          <div className="text-sm text-slate-400">
            Go to <span className="font-medium text-slate-500">Admin → Teams</span> to create teams and assign players.
          </div>
        </div>
      </div>
    );
  }

  function teamDayScore(teamPlayerIds, day) {
    return teamPlayerIds.reduce((sum, pid) => {
      const s = scores.find((s) => s.day === day && s.playerId === pid);
      return sum + (s?.total ?? 0);
    }, 0);
  }

  const leaderboard = teams
    .map((team) => {
      const dayTotals = competitionDays.map((d) => ({
        day: d,
        pts: teamDayScore(team.players, d),
      }));
      const cumulative = dayTotals.reduce((a, d) => a + d.pts, 0);
      return { ...team, dayTotals, cumulative };
    })
    .sort((a, b) => b.cumulative - a.cumulative);

  const chartData = competitionDays.map((d) => {
    const row = { day: rounds[d - 1]?.day ?? `Day ${d}` };
    teams.forEach((t) => { row[t.id] = teamDayScore(t.players, d); });
    return row;
  });

  const winner = leaderboard[0];

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
        <Trophy size={18} /> Team Competition
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Cumulative Stableford — Dom Pedro Laguna, Vale do Lobo Royal &amp; Quinta do Vale
      </p>

      {/* Format info banner */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-5 space-y-2">
        <div className="flex items-start gap-2.5">
          <Shuffle size={14} className="text-emerald-600 mt-0.5 shrink-0" />
          <div className="text-xs text-emerald-800">
            <span className="font-semibold">Teams drawn in groups of 3.</span>{" "}
            Players are randomly drawn into teams of 3 for the competition.
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Flag size={14} className="text-emerald-600 mt-0.5 shrink-0" />
          <div className="text-xs text-emerald-800">
            <span className="font-semibold">Scoring rounds:</span>{" "}
            Stableford points from{" "}
            <span className="font-semibold">Dom Pedro Laguna</span>,{" "}
            <span className="font-semibold">Vale do Lobo Royal</span> and{" "}
            <span className="font-semibold">Quinta do Vale</span>{" "}
            count towards the overall team prize. Round 1 (Faldo Course) is not included.
          </div>
        </div>
      </div>

      {/* Winner banner — only when scores are in */}
      {scoresEntered && winner && winner.cumulative > 0 && (
        <div
          className="rounded-xl py-3 px-4 mb-5 text-white text-center font-bold text-sm"
          style={{ backgroundColor: winner.color }}
        >
          🏆 {winner.name} leads — {winner.cumulative} pts
        </div>
      )}

      {/* Leaderboard */}
      <div className="space-y-2 mb-6">
        {leaderboard.map((team, rank) => (
          <div
            key={team.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 text-center">
                {scoresEntered
                  ? (rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : <span className="text-xs font-bold text-slate-400">#{rank + 1}</span>)
                  : <span className="text-xs font-bold text-slate-400">#{rank + 1}</span>}
              </div>
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: team.color }} />
              <div className="flex-1 font-bold text-slate-800">{team.name}</div>
              {scoresEntered
                ? <><div className="text-lg font-bold" style={{ color: team.color }}>{team.cumulative}</div><div className="text-xs text-slate-400">pts</div></>
                : <div className="text-xs text-slate-400 italic">no scores yet</div>}
            </div>
            {/* Per-round breakdown — only when scores entered */}
            {scoresEntered && (
              <div className="flex gap-2 pl-10 flex-wrap">
                {team.dayTotals.map((d) => (
                  <div key={d.day} className="bg-slate-50 rounded-lg px-2 py-1 text-xs">
                    <span className="text-slate-400">{rounds[d.day - 1]?.day}: </span>
                    <span className="font-semibold text-slate-700">{d.pts} pts</span>
                  </div>
                ))}
              </div>
            )}
            {/* Players */}
            <div className="flex gap-1.5 pl-10 mt-2 flex-wrap">
              {team.players.map((pid) => {
                const p = players.find((pl) => pl.id === pid);
                return (
                  <span
                    key={pid}
                    className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                    style={{ backgroundColor: team.color + "cc" }}
                  >
                    {p?.name ?? `Player ${pid}`}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Grouped bar chart — only when scores are in */}
      {scoresEntered && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Points per Round
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -10 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                formatter={(v, name) => [`${v} pts`, teams.find((t) => t.id === name)?.name ?? name]}
              />
              <Legend
                formatter={(value) => teams.find((t) => t.id === value)?.name ?? value}
                wrapperStyle={{ fontSize: 11 }}
              />
              {teams.map((t) => (
                <Bar key={t.id} dataKey={t.id} fill={t.color} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
