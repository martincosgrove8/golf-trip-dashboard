import { useState } from "react";
import { getScores, getPlayers, getTeams } from "../data/storage";
import { rounds } from "../data/tripData";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Trophy, ClipboardList } from "lucide-react";

function medal(rank) {
  if (rank === 0) return "🥇";
  if (rank === 1) return "🥈";
  if (rank === 2) return "🥉";
  return null;
}

export default function ScoreboardPage() {
  const [day, setDay] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const allScores = getScores(); // null if nothing entered yet
  const players = getPlayers();
  const teams = getTeams() ?? [];

  const scores = allScores ?? [];
  const dayScores = scores.filter((s) => s.day === day);
  const hasScores = dayScores.length > 0;
  const sorted = [...dayScores].sort((a, b) => b.total - a.total);
  const round = rounds[day - 1];

  const chartData = sorted.map((s) => {
    const player = players.find((p) => p.id === s.playerId);
    const team = teams.find((t) => t.players.includes(s.playerId));
    return {
      name: player?.name?.split(" ")[0] ?? "?",
      total: s.total,
      color: team?.color ?? "#64748b",
    };
  });

  const selected = selectedPlayer
    ? dayScores.find((s) => s.playerId === selectedPlayer)
    : null;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">Scoreboard</h2>

      {/* Day selector */}
      <div className="flex gap-2 flex-wrap mb-4">
        {rounds.map((r, i) => (
          <button
            key={i}
            onClick={() => { setDay(i + 1); setSelectedPlayer(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              day === i + 1
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-600 border-slate-300 hover:border-emerald-400"
            }`}
          >
            {r.dayLabel}
          </button>
        ))}
      </div>

      {round && (
        <div className="text-xs text-slate-500 mb-4 font-medium">{round.day} — {round.course}</div>
      )}

      {!hasScores ? (
        <div className="mt-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl px-6 py-12 text-center">
          <ClipboardList size={36} className="text-slate-300 mx-auto mb-3" />
          <div className="text-slate-500 font-semibold mb-1">No scores yet for this round</div>
          <div className="text-sm text-slate-400">
            Scores will appear here once they've been entered in the Admin panel.
          </div>
        </div>
      ) : (
        <>
          {/* Bar chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Stableford Points
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -10 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, "dataMax + 8"]} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                  formatter={(v) => [`${v} pts`, "Stableford"]}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Leaderboard */}
          <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Trophy size={15} /> Leaderboard
          </h3>
          <div className="space-y-2 mb-5">
            {sorted.map((s, rank) => {
              const player = players.find((p) => p.id === s.playerId);
              const m = medal(rank);
              const isSelected = selectedPlayer === s.playerId;
              return (
                <button
                  key={s.playerId}
                  onClick={() => setSelectedPlayer(isSelected ? null : s.playerId)}
                  className={`w-full text-left bg-white rounded-xl border shadow-sm px-4 py-3 flex items-center gap-3 transition-all hover:border-emerald-300 ${
                    isSelected ? "border-emerald-400 ring-1 ring-emerald-200" : "border-slate-200"
                  }`}
                >
                  <div className="w-7 text-center">
                    {m ? <span className="text-lg">{m}</span> : <span className="text-xs font-bold text-slate-400">#{rank + 1}</span>}
                  </div>
                  <div className="flex-1 font-semibold text-slate-800">{player?.name}</div>
                  <div className="text-xs text-slate-400 font-medium">Hcp {player?.handicap}</div>
                  <div className="text-base font-bold text-emerald-700">{s.total}</div>
                  <div className="text-xs text-slate-400">pts</div>
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mt-2">
              <div className="text-sm font-bold text-slate-700 mb-2">
                {players.find((p) => p.id === selected.playerId)?.name} — {selected.total} pts
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
