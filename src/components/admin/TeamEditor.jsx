import { useState } from "react";
import { getTeams, saveTeams } from "../../data/storage";
import { getPlayers } from "../../data/storage";
import { Plus, Trash2, Save, CheckCircle, Users } from "lucide-react";

const PALETTE = [
  "#15803D", "#0F766E", "#1D4ED8", "#7C3AED", "#B45309",
  "#DC2626", "#0369A1", "#BE185D", "#047857", "#92400E",
];

function newTeam(index) {
  return {
    id: `T${Date.now()}_${index}`,
    name: `Team ${String.fromCharCode(65 + index)}`,
    color: PALETTE[index % PALETTE.length],
    players: [],
  };
}

export default function TeamEditor() {
  const allPlayers = getPlayers().filter((p) => p.id <= 15);
  const [teams, setTeams] = useState(() => getTeams() ?? []);
  const [saved, setSaved] = useState(false);

  // All player IDs already assigned to any team
  const assignedIds = teams.flatMap((t) => t.players);
  const unassigned = allPlayers.filter((p) => !assignedIds.includes(p.id));

  function addTeam() {
    setTeams((prev) => [...prev, newTeam(prev.length)]);
    setSaved(false);
  }

  function removeTeam(id) {
    setTeams((prev) => prev.filter((t) => t.id !== id));
    setSaved(false);
  }

  function updateTeam(id, patch) {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setSaved(false);
  }

  function addPlayerToTeam(teamId, playerId) {
    if (!playerId) return;
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId && !t.players.includes(playerId)
          ? { ...t, players: [...t.players, playerId] }
          : t
      )
    );
    setSaved(false);
  }

  function removePlayerFromTeam(teamId, playerId) {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId ? { ...t, players: t.players.filter((id) => id !== playerId) } : t
      )
    );
    setSaved(false);
  }

  function handleSave() {
    saveTeams(teams);
    setSaved(true);
  }

  return (
    <div>
      <p className="text-xs text-slate-500 mb-4">
        Create teams, assign players, and pick colours. Teams will appear on the Overview and Leaderboard pages once saved.
      </p>

      {/* Unassigned warning */}
      {unassigned.length > 0 && teams.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4 text-xs text-amber-700 flex items-start gap-2">
          <Users size={13} className="mt-0.5 shrink-0" />
          <span><span className="font-semibold">Unassigned:</span> {unassigned.map((p) => p.name).join(", ")}</span>
        </div>
      )}

      <div className="space-y-4 mb-4">
        {teams.map((team, idx) => {
          // Players available to add to THIS team = not in any team yet
          const available = allPlayers.filter((p) => !assignedIds.includes(p.id));
          return (
            <div key={team.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Team header */}
              <div
                className="px-4 py-2.5 flex items-center gap-3"
                style={{ backgroundColor: team.color + "18", borderBottom: `2px solid ${team.color}40` }}
              >
                {/* Colour picker */}
                <div className="relative">
                  <input
                    type="color"
                    value={team.color}
                    onChange={(e) => updateTeam(team.id, { color: e.target.value })}
                    className="w-7 h-7 rounded-full border-2 border-white shadow cursor-pointer"
                    style={{ padding: 0, backgroundColor: team.color }}
                    title="Pick team colour"
                  />
                </div>
                {/* Name input */}
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                  className="flex-1 bg-transparent font-bold text-sm focus:outline-none focus:ring-0 placeholder-slate-400"
                  style={{ color: team.color }}
                  placeholder="Team name"
                />
                <button
                  onClick={() => removeTeam(team.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors ml-auto"
                  title="Remove team"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Players */}
              <div className="p-3 flex flex-wrap gap-2">
                {team.players.map((pid) => {
                  const p = allPlayers.find((pl) => pl.id === pid);
                  return (
                    <span
                      key={pid}
                      className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: team.color }}
                    >
                      {p?.name ?? `Player ${pid}`}
                      <button
                        onClick={() => removePlayerFromTeam(team.id, pid)}
                        className="opacity-70 hover:opacity-100 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}

                {/* Add player dropdown — only unassigned players */}
                <select
                  value=""
                  onChange={(e) => { addPlayerToTeam(team.id, Number(e.target.value)); }}
                  className="text-xs border border-dashed border-slate-300 rounded-full px-2 py-1 text-slate-500 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                >
                  <option value="" disabled>+ Add player</option>
                  {available.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-10 text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200 mb-4">
          No teams yet. Click "Add Team" to get started.
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={addTeam}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-slate-500 text-xs hover:border-emerald-400 hover:text-emerald-600 transition-colors"
        >
          <Plus size={13} /> Add Team
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          {saved ? <><CheckCircle size={14} /> Saved</> : <><Save size={14} /> Save Teams</>}
        </button>
      </div>
    </div>
  );
}
