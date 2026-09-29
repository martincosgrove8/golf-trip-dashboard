import { useState, useEffect } from "react";
import { getRounds, getReleasedFlags, getTeams, getPlayers } from "../data/storage";
import { Clock, Flag, Users, Lock, Printer } from "lucide-react";
import PageHeader from "./PageHeader";
import { fmtTime } from "../utils";

function printAllRounds(rounds, released, players, teams) {
  function getPlayer(id) {
    return players.find((p) => p.id === id) ?? { name: `Player ${id}` };
  }
  function teamColor(id) {
    const t = teams.find((t) => t.players.includes(id));
    return t ? t.color : "#94a3b8";
  }

  const roundsHtml = rounds.map((r, i) => {
    if (!released[i]) return "";
    const groupsHtml = r.groups.map((g) => {
      const playersHtml = g.players.map((id) => {
        const p = getPlayer(id);
        const hcp = p.handicaps ? (p.handicaps[`r${i + 1}`] ?? p.handicap ?? 0) : (p.handicap ?? 0);
        const color = teamColor(id);
        return `<span class="player-badge" style="border-left:3px solid ${color}">
          ${p.name}${hcp > 0 ? ` <span class="hcp">(${hcp})</span>` : ""}
        </span>`;
      }).join("");
      return `<div class="group">
        <div class="group-time">${fmtTime(g.time)}</div>
        <div class="group-players">${playersHtml}</div>
      </div>`;
    }).join("");

    return `<div class="round">
      <div class="round-header">
        <div class="round-label">${r.dayLabel}</div>
        <div class="round-meta">${r.day} &nbsp;·&nbsp; ${r.course}</div>
      </div>
      ${groupsHtml}
    </div>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Tee Times — Autumn Golf Getaway 2026</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; color: #1e293b; padding: 24px; }
    h1 { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
    .subtitle { color: #64748b; font-size: 11px; margin-bottom: 20px; }
    .round { margin-bottom: 24px; break-inside: avoid; }
    .round-header { background: #0f172a; color: white; padding: 8px 12px; border-radius: 6px 6px 0 0; }
    .round-label { font-weight: 700; font-size: 13px; }
    .round-meta { font-size: 10px; color: #94a3b8; margin-top: 2px; }
    .group { border: 1px solid #e2e8f0; border-top: none; padding: 10px 12px; display: flex; align-items: flex-start; gap: 16px; }
    .group:last-child { border-radius: 0 0 6px 6px; }
    .group-time { font-weight: 700; font-size: 13px; color: #0f172a; min-width: 56px; padding-top: 2px; }
    .group-players { display: flex; flex-wrap: wrap; gap: 6px; }
    .player-badge { padding: 3px 8px 3px 6px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 11px; font-weight: 600; background: #f8fafc; }
    .hcp { font-weight: 400; color: #94a3b8; }
    @media print {
      body { padding: 16px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>⛳ Tee Times — Autumn Golf Getaway 2026</h1>
  <div class="subtitle">Vilamoura, Portugal · 2–9 October 2026</div>
  ${roundsHtml}
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
}

export default function TeeTimesPage() {
  const [rounds, setRounds] = useState([]);
  const [released, setReleased] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getRounds(), getReleasedFlags(), getTeams(), getPlayers()]).then(
      ([r, rel, t, p]) => {
        setRounds(r);
        setReleased(rel);
        setTeams(t ?? []);
        setPlayers(p);
        const first = rel.findIndex(Boolean);
        setSelectedDay(first >= 0 ? first : 0);
        setLoaded(true);
      }
    );
  }, []);

  if (!loaded) return null;

  const round = rounds[selectedDay];
  const isReleased = released[selectedDay];
  const anyReleased = released.some(Boolean);
  const anyReleasedRounds = rounds.filter((_, i) => released[i]);

  function getPlayer(id) {
    return players.find((p) => p.id === id) ?? { name: `Player ${id}` };
  }

  function badgeStyle(id) {
    const team = teams.find((t) => t.players.includes(id));
    if (team) return { backgroundColor: team.color + "18", color: team.color, borderColor: team.color + "44" };
    return { backgroundColor: "#f8fafc", color: "#64748b", borderColor: "#e2e8f0" };
  }

  function dotColor(id) {
    const team = teams.find((t) => t.players.includes(id));
    return team ? team.color : "#94a3b8";
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <PageHeader eyebrow="Schedule" title="Tee Times" subtitle="Starting times and playing groups by round" />
        {anyReleased && (
          <button
            onClick={() => printAllRounds(rounds, released, players, teams)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:border-emerald-400 hover:text-emerald-700 transition-colors shadow-sm shrink-0 mt-1"
          >
            <Printer size={13} /> Print / PDF
          </button>
        )}
      </div>

      {!anyReleased ? (
        <div className="mt-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl px-6 py-12 text-center">
          <Lock size={36} className="text-slate-300 mx-auto mb-3" />
          <div className="text-slate-500 font-semibold mb-1">Tee times not published yet</div>
          <div className="text-sm text-slate-400">
            Check back soon — the admin will publish tee times before each round.
          </div>
        </div>
      ) : (
        <>
          {/* Day selector */}
          <div className="flex gap-2 flex-wrap mb-5">
            {rounds.map((r, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                disabled={!released[i]}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  !released[i]
                    ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                    : selectedDay === i
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-600 border-slate-300 hover:border-emerald-400"
                }`}
              >
                {r.dayLabel}
                {!released[i] && <Lock size={9} className="inline ml-1 mb-0.5" />}
              </button>
            ))}
          </div>

          {!isReleased ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl px-4 py-8 text-center">
              <Lock size={24} className="text-slate-300 mx-auto mb-2" />
              <div className="text-sm text-slate-400">Tee times for this round haven't been published yet.</div>
            </div>
          ) : (
            <>
              {/* Course header */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-3 mb-5">
                <Flag size={16} className="text-emerald-600" />
                <div>
                  <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">{round.day}</div>
                  <div className="text-sm font-bold text-emerald-800">{round.course}</div>
                </div>
              </div>

              {/* Tee time groups */}
              <div className="space-y-3">
                {round.groups.map((g, gi) => (
                  <div key={gi} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-700 px-4 py-2 flex items-center gap-2 text-white text-sm font-semibold">
                      <Clock size={14} />
                      {fmtTime(g.time)}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                        <Users size={12} />
                        {g.players.length} players
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {g.players.map((id) => {
                          const p = getPlayer(id);
                          return (
                            <div
                              key={id}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                              style={badgeStyle(id)}
                            >
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor(id) }} />
                              {p.name}
                              {(() => {
                                const hcp = p.handicaps ? (p.handicaps[`r${selectedDay + 1}`] ?? p.handicap ?? 0) : (p.handicap ?? 0);
                                return hcp > 0 ? <span className="opacity-60 font-normal">({hcp})</span> : null;
                              })()}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
