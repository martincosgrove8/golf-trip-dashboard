// Convert "HH:MM" (or "~HH:MM") to "H:MMam" / "H:MMpm"
export function fmtTime(t) {
  if (!t) return t;
  const prefix = t.startsWith("~") ? "~" : "";
  const clean = t.replace("~", "");
  const [h, m] = clean.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return t;
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${prefix}${h12}:${String(m).padStart(2, "0")}${suffix}`;
}
