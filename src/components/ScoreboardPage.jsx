import { useState, useEffect } from "react";
import { getScores, getPlayers, getTeams } from "../data/storage";
import { ClipboardList, Trophy } from "lucide-react";
import { rounds } from "../data/tripData";
import PageHeader from "./PageHeader";

const COUNTBACK_RANK = { B9: 0, L6: 1, L3: 2, L1: 3, F9: 4 };
const COUNTBACK_LABEL = { B9: "B.9", L6: "L.6", L3: "L.3", L1: "L.1", F9: "F.9" };

function medal(rank) {
  if (rank === 0) return "🥇";
  if (rank === 1) return "🥈";
  if (rank === 2) return "🥉";
  return null;
}

function sortWithCountback(scores) {
  return [...scores].sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    const ra = a.countback ? (COUNTBACK_RANK[a.countback] ?? 99) : 99;
    const rb = b.countback ? (COUNTBACK_RANK[b.countback] ?? 99) : 99;
    return ra - rb;
  });
}

export default function ScoreboardPage() {
  const [day, setDay] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [allScores, setAllScores] = useState(undefined);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    Promise.all([getScores(), getPlayers(), getTeams()]).then(([s, p, t]) => {
      setAllScores(s);
      setPlayers(p);
      setTeams(t ?? []);
      setVisible(true);
    });
  }, []);

  useEffect(() => {
    setVisible(false);
    getScores().then((s) => { setAllScores(s); setVisible(true); });
  }, [day]);

  const scores = allScores ?? [];
  const dayScores = scores.filter((s) => s.day === day);
  const hasScores = dayScores.length > 0;
  const sorted = sortWithCountback(dayScores);
  const round = rounds[day - 1];

  const totalCounts = {};
  sorted.forEach((s) => { totalCounts[s.total] = (totalCounts[s.total] ?? 0) + 1; });

  function teamFor(playerId) {
    return teams.find((t) => t.players.includes(playerId));
  }

  return (
    <div>
      <PageHeader eyebrow="Leaderboard" title="Scoreboard" subtitle="Individual Stableford results by round" />

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
        <div
          className="space-y-2 transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {sorted.map((s, rank) => {
            const player = players.find((p) => p.id === s.playerId);
            const m = medal(rank);
            const isTied = totalCounts[s.total] > 1;
            const cbLabel = s.countback ? COUNTBACK_LABEL[s.countback] : null;
            const team = teamFor(s.playerId);

            return (
              <div
                key={s.playerId}
                className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3"
                style={{ borderLeftWidth: 3, borderLeftColor: team?.color ?? "#e2e8f0" }}
              >
                <div className="w-7 text-center shrink-0">
                  {m ? <span className="text-lg">{m}</span> : <span className="text-xs font-bold text-slate-400">#{rank + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm">{player?.name}</div>
                  {team && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: team.color }} />
                      <span className="text-xs text-slate-400">{team.name}</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-medium shrink-0">Hcp {player?.handicap}</div>
                <div className="text-base font-bold text-emerald-700 shrink-0">{s.total}</div>
                <div className="text-xs text-slate-400 shrink-0">pts</div>
                {isTied && cbLabel && (
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                    {cbLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
