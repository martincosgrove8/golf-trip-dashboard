import { useState } from "react";
import { getRounds, setRoundGroups, getReleasedFlags, setReleased } from "../../data/storage";
import { getPlayers } from "../../data/storage";
import { players as allPlayers } from "../../data/tripData";
import { Save, CheckCircle, Plus, X, Eye, EyeOff } from "lucide-react";

export default function TeeTimeEditor() {
  const [roundIdx, setRoundIdx] = useState(0);
  const [rounds, setRounds] = useState(() => getRounds());
  const [released, setReleasedState] = useState(() => getReleasedFlags());
  const [saved, setSaved] = useState(false);
  const players = getPlayers();

  const round = rounds[roundIdx];

  function handleTime(groupIdx, value) {
    setRounds((prev) => {
      const updated = prev.map((r, i) => {
        if (i !== roundIdx) return r;
        const groups = r.groups.map((g, gi) =>
          gi === groupIdx ? { ...g, time: value } : g
        );
        return { ...r, groups };
      });
      return updated;
    });
    setSaved(false);
  }

  function removePlayer(groupIdx, playerId) {
    setRounds((prev) => {
      const updated = prev.map((r, i) => {
        if (i !== roundIdx) return r;
        const groups = r.groups.map((g, gi) =>
          gi === groupIdx ? { ...g, players: g.players.filter((id) => id !== playerId) } : g
        );
        return { ...r, groups };
      });
      return updated;
    });
    setSaved(false);
  }

  function addPlayer(groupIdx, playerId) {
    if (!playerId) return;
    setRounds((prev) => {
      const updated = prev.map((r, i) => {
        if (i !== roundIdx) return r;
        const groups = r.groups.map((g, gi) => {
          if (gi !== groupIdx) return g;
          if (g.players.includes(playerId)) return g;
          return { ...g, players: [...g.players, playerId] };
        });
        return { ...r, groups };
      });
      return updated;
    });
    setSaved(false);
  }

  function addGroup() {
    setRounds((prev) => {
      const updated = prev.map((r, i) => {
        if (i !== roundIdx) return r;
        return { ...r, groups: [...r.groups, { time: "", players: [] }] };
      });
      return updated;
    });
    setSaved(false);
  }

  function removeGroup(groupIdx) {
    setRounds((prev) => {
      const updated = prev.map((r, i) => {
        if (i !== roundIdx) return r;
        return { ...r, groups: r.groups.filter((_, gi) => gi !== groupIdx) };
      });
      return updated;
    });
    setSaved(false);
  }

  function save() {
    setRoundGroups(roundIdx, round.groups);
    setSaved(true);
  }

  function toggleReleased() {
    const next = !released[roundIdx];
    setReleased(roundIdx, next);
    setReleasedState((prev) => {
      const copy = [...prev];
      copy[roundIdx] = next;
      return copy;
    });
  }

  const assignedIds = round.groups.flatMap((g) => g.players);
  const unassigned = allPlayers.filter((p) => !assignedIds.includes(p.id));
  const isReleased = released[roundIdx];

  return (
    <div>
      {/* Round selector */}
      <div className="flex gap-2 flex-wrap mb-4">
        {rounds.map((r, i) => (
          <button
            key={i}
            onClick={() => { setRoundIdx(i); setSaved(false); }}
            className={`relative px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              roundIdx === i
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-600 border-slate-300 hover:border-emerald-400"
            }`}
          >
            {r.dayLabel}
            {released[i] && (
              <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 align-middle" title="Published" />
            )}
          </button>
        ))}
      </div>

      {/* Course info + publish toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-slate-500">{round.day} — {round.course}</div>
        <button
          onClick={toggleReleased}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isReleased
              ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              : "bg-slate-50 text-slate-600 border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
          }`}
          title={isReleased ? "Click to hide from players" : "Click to publish to players"}
        >
          {isReleased ? <><Eye size={13} /> Published</> : <><EyeOff size={13} /> Hidden</>}
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {round.groups.map((g, gi) => (
          <div key={gi} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-700 px-3 py-2 flex items-center gap-3">
              <span className="text-white text-xs font-semibold">Group {gi + 1}</span>
              <input
                type="time"
                value={g.time}
                onChange={(e) => handleTime(gi, e.target.value)}
                className="bg-slate-600 text-white text-xs rounded px-2 py-0.5 border-0 outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <button
                onClick={() => removeGroup(gi)}
                className="ml-auto text-slate-400 hover:text-red-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-3 flex flex-wrap gap-2">
              {g.players.map((id) => {
                const p = players.find((pl) => pl.id === id);
                return (
                  <span
                    key={id}
                    className="flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded-full"
                  >
                    {p?.name ?? `Player ${id}`}
                    <button
                      onClick={() => removePlayer(gi, id)}
                      className="text-slate-400 hover:text-red-500 ml-0.5"
                    >
                      <X size={11} />
                    </button>
                  </span>
                );
              })}
              <select
                defaultValue=""
                onChange={(e) => { addPlayer(gi, Number(e.target.value)); e.target.value = ""; }}
                className="text-xs border border-dashed border-slate-300 rounded-full px-2 py-1 text-slate-500 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
              >
                <option value="" disabled>+ Add player</option>
                {allPlayers
                  .filter((p) => !assignedIds.includes(p.id))
                  .map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {unassigned.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4 text-xs text-amber-700">
          <span className="font-semibold">Unassigned:</span>{" "}
          {unassigned.map((p) => p.name).join(", ")}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={addGroup}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-slate-500 text-xs hover:border-emerald-400 hover:text-emerald-600 transition-colors"
        >
          <Plus size={13} /> Add Group
        </button>
        <button
          onClick={save}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          {saved ? <><CheckCircle size={14} /> Saved</> : <><Save size={14} /> Save Round</>}
        </button>
      </div>
    </div>
  );
}
