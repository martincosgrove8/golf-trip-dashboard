import { useState, useEffect } from "react";
import { getScores, setScore, getRounds, getPlayers } from "../../data/storage";
import { Save, CheckCircle, ArrowDownUp } from "lucide-react";

function ptColor(total) {
  if (total >= 40) return "text-emerald-700 font-bold";
  if (total >= 30) return "text-emerald-600";
  if (total >= 20) return "text-slate-600";
  return "text-orange-500";
}

const COUNTBACK_OPTIONS = [
  { value: "",    label: "—" },
  { value: "B9",  label: "B.9" },
  { value: "L6",  label: "L.6" },
  { value: "L3",  label: "L.3" },
  { value: "L1",  label: "L.1" },
  { value: "F9",  label: "F.9" },
];

export default function ScoreEntry() {
  const [day, setDay] = useState(1);
  const [rounds, setRounds] = useState([]);
  const [players, setPlayers] = useState([]);
  const [totals, setTotals] = useState({});
  const [countbacks, setCountbacks] = useState({});
  const [saved, setSaved] = useState({});
  const [saving, setSaving] = useState(false);
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    getRounds().then(setRounds);
    getPlayers().then((p) => setPlayers(p.filter((pl) => pl.id <= 17)));
  }, []);

  useEffect(() => {
    if (!players.length) return;
    getScores().then((scores) => {
      const all = scores ?? [];
      const initTotals = {};
      const initCb = {};
      players.forEach((p) => {
        const entry = all.find((s) => s.day === day && s.playerId === p.id);
        initTotals[p.id] = entry?.total ?? "";
        initCb[p.id] = entry?.countback ?? "";
      });
      setTotals(initTotals);
      setCountbacks(initCb);
      setSaved({});
    });
  }, [day, players]);

  function handleChange(playerId, value) {
    const v = value === "" ? "" : Math.max(0, Number(value) || 0);
    setTotals((prev) => ({ ...prev, [playerId]: v }));
    setSaved((prev) => ({ ...prev, [playerId]: false }));
  }

  function handleCountback(playerId, value) {
    setCountbacks((prev) => ({ ...prev, [playerId]: value }));
    setSaved((prev) => ({ ...prev, [playerId]: false }));
  }

  async function savePlayer(playerId) {
    const total = Number(totals[playerId]) || 0;
    const cb = countbacks[playerId] || null;
    await setScore(day, playerId, total, cb);
    setSaved((prev) => ({ ...prev, [playerId]: true }));
  }

  async function saveAll() {
    setSaving(true);
    await Promise.all(players.map((p) => savePlayer(p.id)));
    setSaving(false);
  }

  const round = rounds[day - 1];

  // Tom Gruddy (16) and Guest (17) only play R2 (day 2)
  const activePlayers = players.filter((p) => p.id <= 15 || day === 2);

  const displayPlayers = sortByScore
    ? [...activePlayers].sort((a, b) => (Number(totals[b.id]) || 0) - (Number(totals[a.id]) || 0))
    : activePlayers;

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

      <div className="flex gap-2 mb-4">
        <button
          onClick={saveAll}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          <Save size={14} /> {saving ? "Saving…" : "Save All"}
        </button>
        <button
          onClick={() => setSortByScore((s) => !s)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
            sortByScore
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white text-slate-600 border-slate-300 hover:border-emerald-400"
          }`}
        >
          <ArrowDownUp size={13} /> Sort by score
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2 font-semibold text-slate-600">Player</th>
              <th className="text-right px-3 py-2 text-xs text-slate-400 font-normal w-10">HCP</th>
              <th className="text-center px-3 py-2 font-semibold text-slate-600 w-28">Pts</th>
              <th className="text-center px-3 py-2 font-semibold text-slate-600 w-24">
                <span className="text-xs font-normal text-slate-400">Countback</span>
              </th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {displayPlayers.map((p, i) => {
              const val = totals[p.id] ?? "";
              const cb  = countbacks[p.id] ?? "";
              const isSaved = saved[p.id];
              return (
                <tr
                  key={p.id}
                  className={`border-b border-slate-50 last:border-0 transition-colors ${
                    isSaved ? "bg-emerald-50/40" : i % 2 === 0 ? "" : "bg-slate-50/50"
                  }`}
                >
                  <td className="px-4 py-2 font-medium text-slate-700">{p.name}</td>
                  <td className="px-3 py-2 text-right text-xs text-slate-400">
                    {p.handicaps ? (p.handicaps[`r${day}`] ?? p.handicap ?? 0) : (p.handicap ?? 0)}
                  </td>
                  <td className="px-3 py-2 text-center">
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
                  <td className="px-3 py-2 text-center">
                    <select
                      value={cb}
                      onChange={(e) => { handleCountback(p.id, e.target.value); }}
                      onBlur={() => savePlayer(p.id)}
                      className="text-xs border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-600 bg-white w-full"
                    >
                      {COUNTBACK_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
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
      <p className="text-xs text-slate-400 mt-2">Countback only needed when players are tied — leave blank otherwise.</p>
    </div>
  );
}
