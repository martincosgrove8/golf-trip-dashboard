import { useState } from "react";
import { isAuthed, login, logout, resetAll, getRounds, getReleasedFlags, getTeams, getPlayers } from "../data/storage";
import ScoreEntry from "./admin/ScoreEntry";
import HandicapEditor from "./admin/HandicapEditor";
import TeeTimeEditor from "./admin/TeeTimeEditor";
import TeamEditor from "./admin/TeamEditor";
import { Lock, LogOut, RotateCcw, ClipboardList, Users, Clock, Shield, Printer } from "lucide-react";
import SeedData from "./admin/SeedData";
import { fmtTime } from "../utils";

const TABS = [
  { id: "scores",    label: "Scores",    icon: ClipboardList },
  { id: "handicaps", label: "Handicaps", icon: Shield },
  { id: "teams",     label: "Teams",     icon: Users },
  { id: "teetimes",  label: "Tee Times", icon: Clock },
  { id: "print",     label: "Print",     icon: Printer },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => isAuthed());
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("scores");
  const [showReset, setShowReset] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    if (login(password)) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  }

  function handleLogout() {
    logout();
    setAuthed(false);
  }

  function handleReset() {
    resetAll();
    setShowReset(false);
    window.location.reload();
  }

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full max-w-sm">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Lock size={22} className="text-emerald-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 text-center mb-1">Admin Access</h2>
          <p className="text-sm text-slate-500 text-center mb-6">Enter the trip password to continue</p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Password"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                error ? "border-red-400 bg-red-50" : "border-slate-300"
              }`}
            />
            {error && (
              <p className="text-xs text-red-600 text-center">Incorrect password</p>
            )}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Admin</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowReset(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs hover:border-red-400 hover:text-red-600 transition-colors"
          >
            <RotateCcw size={12} /> Reset Data
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs hover:border-slate-400 transition-colors"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>

      {/* Reset confirmation modal */}
      {showReset && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-base font-bold text-slate-800 mb-2">Reset All Data?</h3>
            <p className="text-sm text-slate-500 mb-5">
              This will clear all saved scores, handicap overrides, and tee time changes. The app will reload with original data from tripData.js. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab strip */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              tab === id
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Test data generator */}
      <div className="mb-5">
        <SeedData />
      </div>

      {tab === "scores"    && <ScoreEntry />}
      {tab === "handicaps" && <HandicapEditor />}
      {tab === "teams"     && <TeamEditor />}
      {tab === "teetimes"  && <TeeTimeEditor />}
      {tab === "print"     && <PrintPanel />}
    </div>
  );
}

function PrintPanel() {
  const [status, setStatus] = useState("idle");

  async function handlePrint(releasedOnly) {
    setStatus("loading");
    const [rounds, released, teams, players] = await Promise.all([
      getRounds(), getReleasedFlags(), getTeams(), getPlayers(),
    ]);

    function teamColor(id) {
      const t = (teams ?? []).find((t) => t.players.includes(id));
      return t ? t.color : "#94a3b8";
    }
    function getPlayer(id) {
      return players.find((p) => p.id === id) ?? { name: `Player ${id}` };
    }

    const roundsHtml = rounds.map((r, i) => {
      if (releasedOnly && !released[i]) return "";
      const groupsHtml = r.groups.map((g) => {
        const playersHtml = g.players.map((id) => {
          const p = getPlayer(id);
          const hcp = p.handicaps ? (p.handicaps[`r${i + 1}`] ?? p.handicap ?? 0) : (p.handicap ?? 0);
          const color = teamColor(id);
          return `<span class="player-badge" style="border-left:3px solid ${color}">${p.name}${hcp > 0 ? ` <span class="hcp">(${hcp})</span>` : ""}</span>`;
        }).join("");
        return `<div class="group"><div class="group-time">${fmtTime(g.time)}</div><div class="group-players">${playersHtml}</div></div>`;
      }).join("");
      const label = releasedOnly ? "" : `<span class="status-badge ${released[i] ? "published" : "draft"}">${released[i] ? "Published" : "Draft"}</span>`;
      return `<div class="round">
        <div class="round-header">
          <div class="round-label">${r.dayLabel} ${label}</div>
          <div class="round-meta">${r.day} &nbsp;·&nbsp; ${r.course}</div>
        </div>
        ${groupsHtml || '<div class="no-groups">No groups set up yet</div>'}
      </div>`;
    }).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Tee Times — Autumn Golf Getaway 2026</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#1e293b;padding:24px}
  h1{font-size:20px;font-weight:800;margin-bottom:4px}
  .subtitle{color:#64748b;font-size:11px;margin-bottom:20px}
  .round{margin-bottom:24px;break-inside:avoid}
  .round-header{background:#0f172a;color:white;padding:8px 12px;border-radius:6px 6px 0 0;display:flex;align-items:center;justify-content:space-between}
  .round-label{font-weight:700;font-size:13px;display:flex;align-items:center;gap:8px}
  .round-meta{font-size:10px;color:#94a3b8;margin-top:2px}
  .status-badge{font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;text-transform:uppercase;letter-spacing:.05em}
  .published{background:#16a34a;color:white}
  .draft{background:#d97706;color:white}
  .group{border:1px solid #e2e8f0;border-top:none;padding:10px 12px;display:flex;align-items:flex-start;gap:16px}
  .group:last-child{border-radius:0 0 6px 6px}
  .group-time{font-weight:700;font-size:13px;color:#0f172a;min-width:56px;padding-top:2px}
  .group-players{display:flex;flex-wrap:wrap;gap:6px}
  .player-badge{padding:3px 8px 3px 6px;border:1px solid #e2e8f0;border-radius:4px;font-size:11px;font-weight:600;background:#f8fafc}
  .hcp{font-weight:400;color:#94a3b8}
  .no-groups{padding:8px 0;color:#94a3b8;font-size:11px;font-style:italic}
  @media print{body{padding:16px}}
</style></head><body>
<h1>⛳ Tee Times — Autumn Golf Getaway 2026</h1>
<div class="subtitle">Vilamoura, Portugal · 2–9 October 2026${releasedOnly ? "" : " · All rounds (admin view)"}</div>
${roundsHtml}
<script>window.onload=()=>window.print();</script>
</body></html>`;

    setStatus("idle");
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">Opens a print-ready page in a new tab. Choose "Save as PDF" in the browser print dialog.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handlePrint(true)}
          disabled={status === "loading"}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 shadow-sm"
        >
          <Printer size={15} /> Print published rounds only
        </button>
        <button
          onClick={() => handlePrint(false)}
          disabled={status === "loading"}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:border-slate-400 transition-colors disabled:opacity-60"
        >
          <Printer size={15} /> Print all 4 rounds (incl. drafts)
        </button>
      </div>
    </div>
  );
}
