import { useState, useEffect } from "react";
import { getScores, getPlayers } from "../data/storage";
import { rounds } from "../data/tripData";
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
  const [allScores, setAllScores] = useState(undefined);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    getScores().then(setAllScores);
    getPlayers().then(setPlayers);
  }, []);

  // Reload scores when day changes
  useEffect(() => {
    getScores().then(setAllScores);
  }, [day]);

  const scores = allScores ?? [];
  const dayScores = scores.filter((s) => s.day === day);
  const hasScores = dayScores.length > 0;
  const sorted = [...dayScores].sort((a, b) => b.total - a.total);
  const round = rounds[day - 1];

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
