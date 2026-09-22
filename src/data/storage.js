import {
  scores as defaultScores,
  rounds as defaultRounds,
  players as defaultPlayers,
} from "./tripData";

const KEYS = {
  scores: "golf_scores",
  rounds: "golf_rounds",
  roundsReleased: "golf_rounds_released",
  players: "golf_players",
  teams: "golf_teams",
  authed: "golf_admin_authed",
};

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Scores ──────────────────────────────────────────────────────────────────
// Returns null when no scores have been entered yet (not the tripData defaults).

export function getScores() {
  return load(KEYS.scores); // null = no scores entered
}

export function setScore(day, playerId, total) {
  const all = load(KEYS.scores) ?? [];
  const t = Math.max(0, Number(total) || 0);
  const idx = all.findIndex((s) => s.day === day && s.playerId === playerId);
  const entry = { day, playerId, holes: Array(18).fill(0), total: t };
  if (idx >= 0) all[idx] = entry;
  else all.push(entry);
  save(KEYS.scores, all);
}

export function resetScores() {
  localStorage.removeItem(KEYS.scores);
}

// ─── Players (handicaps) ─────────────────────────────────────────────────────

export function getPlayers() {
  const overrides = load(KEYS.players);
  if (!overrides) return defaultPlayers;
  return defaultPlayers.map((p) => {
    const o = overrides.find((x) => x.id === p.id);
    return o ? { ...p, handicap: o.handicap } : p;
  });
}

export function setHandicap(playerId, handicap) {
  const overrides = load(KEYS.players) ?? [];
  const idx = overrides.findIndex((x) => x.id === playerId);
  const entry = { id: playerId, handicap: Number(handicap) };
  if (idx >= 0) overrides[idx] = entry;
  else overrides.push(entry);
  save(KEYS.players, overrides);
}

export function resetHandicaps() {
  localStorage.removeItem(KEYS.players);
}

// ─── Rounds (tee times) ──────────────────────────────────────────────────────
// getRounds always returns the full list (for admin editing).
// getReleasedRounds returns only rounds the admin has published — null entries
// for unreleased rounds so the public page can show a locked placeholder.

export function getRounds() {
  const overrides = load(KEYS.rounds);
  if (!overrides) return defaultRounds;
  return defaultRounds.map((r, i) => {
    const o = overrides[i];
    return o ? { ...r, groups: o.groups } : r;
  });
}

export function getReleasedFlags() {
  return load(KEYS.roundsReleased) ?? defaultRounds.map(() => false);
}

export function setReleased(roundIndex, released) {
  const flags = getReleasedFlags();
  flags[roundIndex] = released;
  save(KEYS.roundsReleased, flags);
}

export function setRoundGroups(roundIndex, groups) {
  const existing = load(KEYS.rounds) ?? defaultRounds.map(() => null);
  existing[roundIndex] = { groups };
  save(KEYS.rounds, existing);
}

export function resetRounds() {
  localStorage.removeItem(KEYS.rounds);
  localStorage.removeItem(KEYS.roundsReleased);
}

// ─── Teams ───────────────────────────────────────────────────────────────────
// Returns null when no teams have been created yet.

export function getTeams() {
  return load(KEYS.teams); // null = no teams created
}

export function saveTeams(teams) {
  save(KEYS.teams, teams);
}

export function resetTeams() {
  localStorage.removeItem(KEYS.teams);
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const ADMIN_PASSWORD = "algarve2026";

export function isAuthed() {
  return localStorage.getItem(KEYS.authed) === "true";
}

export function login(password) {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(KEYS.authed, "true");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(KEYS.authed);
}

// ─── Reset all ───────────────────────────────────────────────────────────────

export function resetAll() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
