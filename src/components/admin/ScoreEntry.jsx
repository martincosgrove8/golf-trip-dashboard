import { useState, useEffect } from "react";
import { getScores, setScore } from "../../data/storage";
import { getRounds, getPlayers } from "../../data/storage";
import { Save, CheckCircle } from "lucide-react";

function ptColor(total) {
  if (total >= 40) return "text-emerald-700 font-bold";
  if (total >= 30) return "text-emerald-600";
  if (total >= 20) return "text-slate-600";
  return "text-orange-500";
}

export default function ScoreEntry() {
  const [day, setDay] = useState(1);
  const rounds = getRounds();
  const players = getPlayers().filter((p) => p.id <= 15);

  const [totals, setTotals] = useState({});
  const [saved, setSaved] = useState({});

  // Load existing totals from storage whenever day changes
  useEffect(() => {
    const scores = getScores() ?? [];
    const init = {};
    players.forEach((p) => {
      const entry = scores.find((s) => s.day === day && s.playerId === p.id);
      init[p.id] = entry?.total ?? "";
    });
    setTotals(init);
    setSaved({});
  }, [day]);

  function handleChange(playerId, value) {
    const v = value === "" ? "" : Math.max(0, Number(value) || 0);
    setTotals((prev) => ({ ...prev, [playerId]: v }));
    setSaved((prev) => ({ ...prev, [playerId]: false }));
  }

  function savePlayer(playerId) {
    const total = Number(totals[playerId]) || 0;
    setScore(day, playerId, total);
    setSaved((prev) => ({ ...prev, [playerId]: true }));
  }

  function saveAll() {
    players.forEach((p) => savePlayer(p.id));
  }

  const round = rounds[day - 1];

  return (
    <div>
      {/* Day selector */}
      <div className="flex gap-2 flex-wrap mb-4">
        {rounds.map((r, i) => (
          <button
            key={i}
            onClick={() => setDay(i + 1)}
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
        <div className="text-xs text-slate-500 mb-4">{round.day} — {round.course}</div>
      )}

      <button
        onClick={saveAll}
        className="mb-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
      >
        <Save size={14} /> Save All
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2 font-semibold text-slate-600">Player</th>
              <th className="text-right px-4 py-2 font-semibold text-slate-600 w-12 text-xs text-slate-400 font-normal">HCP</th>
              <th className="text-center px-4 py-2 font-semibold text-slate-600 w-32">Stableford Pts</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => {
              const val = totals[p.id] ?? "";
              const isSaved = saved[p.id];
              return (
                <tr
                  key={p.id}
                  className={`border-b border-slate-50 last:border-0 transition-colors ${
                    isSaved ? "bg-emerald-50/40" : i % 2 === 0 ? "" : "bg-slate-50/50"
                  }`}
                >
                  <td className="px-4 py-2.5 font-medium text-slate-700">{p.name}</td>
                  <td className="px-4 py-2.5 text-right text-xs text-slate-400">{p.handicap}</td>
                  <td className="px-4 py-2.5 text-center">
                    <input
                      type="number"
                      min={0}
                      max={108}
                      value={val}
                      placeholder="—"
                      onChange={(e) => handleChange(p.id, e.target.value)}
                      onBlur={() => val !== "" && savePlayer(p.id)}
                      className={`w-20 text-center border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                        val !== "" ? ptColor(Number(val)) : "text-slate-400"
                      }`}
                    />
                  </td>
                  <td className="pr-3 text-center">
                    {isSaved && <CheckCircle size={14} className="text-emerald-500 inline" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
