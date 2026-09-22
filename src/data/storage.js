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

export async function setScore(day, playerId, total) {
  const current = await getScores() ?? [];
  const idx = current.findIndex((s) => s.day === day && s.playerId === playerId);
  const entry = { day, playerId, holes: Array(18).fill(0), total: Math.max(0, Number(total) || 0) };
  if (idx >= 0) current[idx] = entry; else current.push(entry);
  save("golf_scores", current);
  await dbSet("golf_scores", current);
}

export async function resetScores() {
  localStorage.removeItem("golf_scores");
  await dbDelete("golf_scores");
}

// ─── Players / Handicaps ──────────────────────────────────────────────────────

export async function getPlayers() {
  const overrides = await getRemote("golf_players") ?? [];
  return defaultPlayers.map((p) => {
    const o = overrides.find((x) => x.id === p.id);
    return o ? { ...p, handicap: o.handicap } : p;
  });
}

export async function setHandicap(playerId, handicap) {
  const overrides = (await getRemote("golf_players")) ?? [];
  const idx = overrides.findIndex((x) => x.id === playerId);
  const entry = { id: playerId, handicap: Number(handicap) };
  if (idx >= 0) overrides[idx] = entry; else overrides.push(entry);
  save("golf_players", overrides);
  await dbSet("golf_players", overrides);
}

export async function resetHandicaps() {
  localStorage.removeItem("golf_players");
  await dbDelete("golf_players");
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
