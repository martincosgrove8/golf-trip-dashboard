import { useState } from "react";
import { isAuthed, login, logout, resetAll } from "../data/storage";
import ScoreEntry from "./admin/ScoreEntry";
import HandicapEditor from "./admin/HandicapEditor";
import TeeTimeEditor from "./admin/TeeTimeEditor";
import TeamEditor from "./admin/TeamEditor";
import { Lock, LogOut, RotateCcw, ClipboardList, Users, Clock, Shield } from "lucide-react";
import SeedData from "./admin/SeedData";

const TABS = [
  { id: "scores",    label: "Scores",    icon: ClipboardList },
  { id: "handicaps", label: "Handicaps", icon: Shield },
  { id: "teams",     label: "Teams",     icon: Users },
  { id: "teetimes",  label: "Tee Times", icon: Clock },
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
    </div>
  );
}
