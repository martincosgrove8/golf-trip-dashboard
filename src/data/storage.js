import { supabase } from "./supabase";
import {
  players as defaultPlayers,
  rounds as defaultRounds,
} from "./tripData";

// ─── Local helpers ───────────────────────────────────────────────────────────

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
}
function load(key) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : null;
  } catch (_) { return null; }
}

// ─── Supabase helpers ─────────────────────────────────────────────────────────

async function dbGet(key) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("golf_data")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) return null;
    return data?.value ?? null;
  } catch (_) { return null; }
}

async function dbSet(key, value) {
  if (!supabase) return;
  try {
    await supabase
      .from("golf_data")
      .upsert({ key, value }, { onConflict: "key" });
  } catch (_) {}
}

async function dbDelete(key) {
  if (!supabase) return;
  try {
    await supabase.from("golf_data").delete().eq("key", key);
  } catch (_) {}
}

// Read from Supabase, fall back to localStorage cache
async function getRemote(key) {
  const remote = await dbGet(key);
  if (remote !== null) {
    save(key, remote); // keep local cache fresh
    return remote;
  }
  return load(key); // offline fallback
}

// ─── Auth (localStorage only — per-session flag) ──────────────────────────────

export const ADMIN_PASSWORD = "algarve2026";
export const isAuthed  = () => localStorage.getItem("golf_admin_authed") === "true";
export const login     = (pw) => { if (pw === ADMIN_PASSWORD) localStorage.setItem("golf_admin_authed", "true"); return pw === ADMIN_PASSWORD; };
export const logout    = () => localStorage.removeItem("golf_admin_authed");

// ─── Scores ───────────────────────────────────────────────────────────────────

export async function getScores() {
  return getRemote("golf_scores"); // null = nothing entered yet
}

export async function setScore(day, playerId, total, countback = null) {
  const current = await getScores() ?? [];
  const idx = current.findIndex((s) => s.day === day && s.playerId === playerId);
  const entry = { day, playerId, holes: Array(18).fill(0), total: Math.max(0, Number(total) || 0), countback: countback || null };
  if (idx >= 0) current[idx] = entry; else current.push(entry);
  save("golf_scores", current);
  await dbSet("golf_scores", current);
}

export async function resetScores() {
  localStorage.removeItem("golf_scores");
  await dbDelete("golf_scores");
}

// ─── Players / Handicaps ──────────────────────────────────────────────────────

// handicaps stored as { r1, r2, r3, r4 } per player (one per round)
export async function getPlayers() {
  const overrides = await getRemote("golf_players") ?? [];
  return defaultPlayers.map((p) => {
    const o = overrides.find((x) => x.id === p.id);
    return o ? { ...p, handicap: o.handicap ?? 0, handicaps: o.handicaps ?? null } : p;
  });
}

// Get the handicap for a specific round (1-indexed). Falls back to the single handicap value.
export async function getHandicapForRound(playerId, round) {
  const players = await getPlayers();
  const p = players.find((x) => x.id === playerId);
  if (!p) return 0;
  if (p.handicaps) return p.handicaps[`r${round}`] ?? p.handicap ?? 0;
  return p.handicap ?? 0;
}

export async function setHandicap(playerId, handicap) {
  const overrides = (await getRemote("golf_players")) ?? [];
  const idx = overrides.findIndex((x) => x.id === playerId);
  const entry = { id: playerId, handicap: Number(handicap) };
  if (idx >= 0) overrides[idx] = { ...overrides[idx], ...entry }; else overrides.push(entry);
  save("golf_players", overrides);
  await dbSet("golf_players", overrides);
}

// Set all 4 round handicaps for a player at once: handicaps = { r1, r2, r3, r4 }
export async function setHandicaps(playerId, handicaps) {
  const overrides = (await getRemote("golf_players")) ?? [];
  const idx = overrides.findIndex((x) => x.id === playerId);
  const entry = { id: playerId, handicap: handicaps.r1 ?? 0, handicaps };
  if (idx >= 0) overrides[idx] = entry; else overrides.push(entry);
  save("golf_players", overrides);
  await dbSet("golf_players", overrides);
}

export async function resetHandicaps() {
  localStorage.removeItem("golf_players");
  localStorage.removeItem("golf_tees");
  localStorage.removeItem("golf_handicap_raw");
  await dbDelete("golf_players");
  await dbDelete("golf_tees");
  await dbDelete("golf_handicap_raw");
}

// ─── Tee selections (per round) ───────────────────────────────────────────────
// Stored as { r1: "yellow", r2: "white", r3: "white", r4: "white" }

export const TEE_OPTIONS = {
  r1: ["white", "yellow", "blue"],
  r2: ["white", "yellow", "blue"],
  r3: ["white", "yellow"],
  r4: ["white", "yellow", "blue"],
};

export const DEFAULT_TEES = { r1: "yellow", r2: "white", r3: "white", r4: "white" };

export async function getTees() {
  return (await getRemote("golf_tees")) ?? DEFAULT_TEES;
}

export async function setTees(tees) {
  save("golf_tees", tees);
  await dbSet("golf_tees", tees);
}

// ─── Raw handicap data (all tees, stored at import time) ─────────────────────
// Shape: { [playerId]: { r1: { white: N, yellow: N, blue: N }, r2: {...}, ... } }

export async function getRawHandicaps() {
  return (await getRemote("golf_handicap_raw")) ?? null;
}

export async function setRawHandicaps(raw) {
  save("golf_handicap_raw", raw);
  await dbSet("golf_handicap_raw", raw);
}

// Recompute and save player handicaps based on current tee selections + raw data
export async function applyTees(tees) {
  const raw = await getRawHandicaps();
  if (!raw) return;
  const overrides = (await getRemote("golf_players")) ?? [];
  for (const [playerIdStr, rounds] of Object.entries(raw)) {
    const playerId = Number(playerIdStr);
    const handicaps = {
      r1: rounds.r1?.[tees.r1] ?? 0,
      r2: rounds.r2?.[tees.r2] ?? 0,
      r3: rounds.r3?.[tees.r3] ?? 0,
      r4: rounds.r4?.[tees.r4] ?? 0,
    };
    const idx = overrides.findIndex((x) => x.id === playerId);
    const entry = { id: playerId, handicap: handicaps.r1, handicaps };
    if (idx >= 0) overrides[idx] = entry; else overrides.push(entry);
  }
  save("golf_players", overrides);
  await dbSet("golf_players", overrides);
}

// ─── Rounds / Tee Times ───────────────────────────────────────────────────────

export async function getRounds() {
  const overrides = await getRemote("golf_rounds") ?? [];
  return defaultRounds.map((r, i) => overrides[i] ? { ...r, groups: overrides[i].groups } : r);
}

export async function setRoundGroups(roundIndex, groups) {
  const overrides = (await getRemote("golf_rounds")) ?? defaultRounds.map(() => null);
  overrides[roundIndex] = { groups };
  save("golf_rounds", overrides);
  await dbSet("golf_rounds", overrides);
}

export async function getReleasedFlags() {
  const flags = await getRemote("golf_rounds_released");
  return flags ?? defaultRounds.map(() => false);
}

export async function setReleased(roundIndex, released) {
  const flags = await getReleasedFlags();
  flags[roundIndex] = released;
  save("golf_rounds_released", flags);
  await dbSet("golf_rounds_released", flags);
}

export async function resetRounds() {
  localStorage.removeItem("golf_rounds");
  localStorage.removeItem("golf_rounds_released");
  await dbDelete("golf_rounds");
  await dbDelete("golf_rounds_released");
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export async function getTeams() {
  return getRemote("golf_teams"); // null = no teams created yet
}

export async function saveTeams(teams) {
  save("golf_teams", teams);
  await dbSet("golf_teams", teams);
}

export async function resetTeams() {
  localStorage.removeItem("golf_teams");
  await dbDelete("golf_teams");
}

// ─── Reset all ────────────────────────────────────────────────────────────────

export async function resetAll() {
  await Promise.all([resetScores(), resetHandicaps(), resetRounds(), resetTeams()]);
  logout();
}
