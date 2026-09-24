import { useState, useEffect, useRef } from "react";
import { getPlayers, setHandicaps, getTees, setTees, applyTees, setRawHandicaps, getRawHandicaps, TEE_OPTIONS, DEFAULT_TEES } from "../../data/storage";
import { CheckCircle, Upload, AlertCircle, ChevronDown } from "lucide-react";
import * as XLSX from "xlsx";

const ROUNDS = [
  { key: "r1", label: "R1", course: "Faldo Course" },
  { key: "r2", label: "R2", course: "Dom Pedro Laguna" },
  { key: "r3", label: "R3", course: "Vale do Lobo Royal" },
  { key: "r4", label: "R4", course: "Quinta do Vale" },
];

const TEE_COLOURS = {
  white:  { label: "White",  dot: "#ffffff", border: "#94a3b8" },
  yellow: { label: "Yellow", dot: "#fbbf24", border: "#fbbf24" },
  blue:   { label: "Blue",   dot: "#3b82f6", border: "#3b82f6" },
};

// Parse the known multi-header Excel layout and return all tee values
// Returns: { players: [{ name, r1: { white, yellow, blue }, r2: {...}, ... }] }
function parseHandicapSheet(ws) {
  // Always read as raw 2D array to avoid header-detection issues
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  if (!raw.length) return { players: [], strategy: "empty" };

  const row0 = raw[0].map((v) => String(v).trim().toLowerCase());
  const row1 = (raw[1] ?? []).map((v) => String(v).trim().toLowerCase());

  // Detect the known multi-header layout:
  // row0 has a name-like cell and at least one R1/R2/R3/R4 label
  // row1 has tee colour labels
  const hasRoundLabels = row0.some((v) => /r[1-4]/.test(v));
  const hasTeeLabels   = row1.some((v) => /white|yellow|blue/.test(v));

  if (hasRoundLabels && hasTeeLabels) {
    const nameCol = row0.findIndex((v) => /name|player/.test(v));

    // Build map: { r1: { white: colIdx, yellow: colIdx, blue: colIdx }, r2: … }
    const roundMap = {};
    let currentRound = null;
    for (let i = 0; i < row0.length; i++) {
      const m = row0[i].match(/r([1-4])/);
      if (m) currentRound = `r${m[1]}`;
      if (!currentRound) continue;
      if (!roundMap[currentRound]) roundMap[currentRound] = {};
      const tee = row1[i];
      if (tee === "white" || tee === "yellow" || tee === "blue") {
        roundMap[currentRound][tee] = i;
      }
    }

    const players = [];
    for (let ri = 2; ri < raw.length; ri++) {
      const row = raw[ri];
      const name = nameCol >= 0 ? String(row[nameCol] ?? "").trim() : String(row[0] ?? "").trim();
      if (!name) continue;
      const entry = { name };
      for (const [rk, teeMap] of Object.entries(roundMap)) {
        entry[rk] = {};
        for (const [tee, col] of Object.entries(teeMap)) {
          entry[rk][tee] = Number(row[col]) || 0;
        }
      }
      players.push(entry);
    }
    return { players, strategy: "multi-header" };
  }

  // Simple fallback: first row is a proper header row
  // Find name col and round cols by index
  const nameCol = row0.findIndex((v) => /name|player/.test(v));
  if (nameCol < 0) return { players: [], strategy: "no-name-col", cols: row0 };

  // Try to detect round columns from row0 labels
  function detectRound(v) {
    if (/r1|round.?1|faldo/.test(v)) return "r1";
    if (/r2|round.?2|laguna/.test(v)) return "r2";
    if (/r3|round.?3|lobo/.test(v)) return "r3";
    if (/r4|round.?4|quinta/.test(v)) return "r4";
    if (/handicap|hcp/.test(v)) return "r1";
    return null;
  }

  const roundCols = {};
  row0.forEach((v, i) => {
    const rk = detectRound(v);
    if (rk && !roundCols[rk]) roundCols[rk] = i;
  });

  const players = raw.slice(1).map((row) => {
    const name = String(row[nameCol] ?? "").trim();
    if (!name) return null;
    const entry = { name };
    for (const [rk, ci] of Object.entries(roundCols)) {
      entry[rk] = { white: Number(row[ci]) || 0 };
    }
    return entry;
  }).filter(Boolean);

  return { players, strategy: "simple" };
}

export default function HandicapEditor() {
  const [players, setPlayersState] = useState([]);
  const [tees, setTeesState] = useState(DEFAULT_TEES);
  const [hasRaw, setHasRaw] = useState(false);
  const [saved, setSaved] = useState({});
  const [importMsg, setImportMsg] = useState(null);
  const [teeMsg, setTeeMsg] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    Promise.all([getPlayers(), getTees(), getRawHandicaps()]).then(([p, t, raw]) => {
      setPlayersState(p);
      setTeesState(t ?? DEFAULT_TEES);
      setHasRaw(!!raw);
    });
  }, []);

  async function handleTeeChange(rk, tee) {
    const updated = { ...tees, [rk]: tee };
    setTeesState(updated);
    setTeeMsg("Updating…");
    await setTees(updated);
    await applyTees(updated);
    const p = await getPlayers();
    setPlayersState(p);
    setSaved({});
    setTeeMsg("Handicaps updated.");
    setTimeout(() => setTeeMsg(null), 2500);
  }

  function hcpVal(p, rk) {
    if (p.handicaps) return p.handicaps[rk] ?? 0;
    return rk === "r1" ? (p.handicap ?? 0) : 0;
  }

  function handleChange(id, rk, value) {
    const hcp = Math.min(54, Math.max(0, Number(value) || 0));
    setPlayersState((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const current = p.handicaps ?? { r1: p.handicap ?? 0, r2: 0, r3: 0, r4: 0 };
        return { ...p, handicaps: { ...current, [rk]: hcp } };
      })
    );
    setSaved((prev) => ({ ...prev, [id]: false }));
  }

  async function handleBlur(id) {
    const p = players.find((x) => x.id === id);
    if (!p) return;
    const hcps = p.handicaps ?? { r1: p.handicap ?? 0, r2: 0, r3: 0, r4: 0 };
    await setHandicaps(id, hcps);
    setSaved((prev) => ({ ...prev, [id]: true }));
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportMsg(null);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const wb = XLSX.read(ev.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const { players: parsed, strategy, cols } = parseHandicapSheet(ws);

        if (strategy === "empty") { setImportMsg({ type: "error", text: "Spreadsheet appears to be empty." }); return; }
        if (strategy === "no-name-col") { setImportMsg({ type: "error", text: `No "Name" column found in row 1. Values found: ${(cols ?? []).join(", ")}` }); return; }
        if (!parsed.length) { setImportMsg({ type: "error", text: "No player rows found." }); return; }

        const currentPlayers = await getPlayers();
        let matched = 0;
        const unmatched = [];
        const rawData = {};

        for (const row of parsed) {
          const player = currentPlayers.find(
            (p) =>
              p.name.toLowerCase() === row.name.toLowerCase() ||
              p.name.toLowerCase().includes(row.name.toLowerCase()) ||
              row.name.toLowerCase().includes(p.name.split(" ")[1]?.toLowerCase() ?? "__")
          );
          if (!player) { if (row.name) unmatched.push(row.name); continue; }

          // Store all tee values in raw
          rawData[player.id] = {
            r1: row.r1 ?? {},
            r2: row.r2 ?? {},
            r3: row.r3 ?? {},
            r4: row.r4 ?? {},
          };
          matched++;
        }

        // Save raw data then apply current tee selections
        await setRawHandicaps(rawData);
        await applyTees(tees);
        const updatedPlayers = await getPlayers();
        setPlayersState(updatedPlayers);
        setHasRaw(true);
        setSaved({});

        setImportMsg({
          type: matched > 0 ? "success" : "error",
          text: `Imported ${matched} player${matched !== 1 ? "s" : ""}.${
            unmatched.length ? ` Unmatched: ${unmatched.join(", ")}` : ""
          }`,
        });
      } catch (err) {
        setImportMsg({ type: "error", text: `Failed to read file: ${err.message}` });
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div>
      {/* Tee selectors */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-slate-700">Tee Selection</div>
          {teeMsg && (
            <span className="text-xs text-emerald-600 font-medium">{teeMsg}</span>
          )}
        </div>
        {!hasRaw && (
          <p className="text-xs text-amber-600 mb-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            Import the handicap spreadsheet first — tee changes will update all handicaps automatically.
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ROUNDS.map((r) => {
            const options = TEE_OPTIONS[r.key];
            const selected = tees[r.key] ?? "white";
            const teeInfo = TEE_COLOURS[selected];
            return (
              <div key={r.key}>
                <div className="text-xs font-semibold text-slate-500 mb-1">{r.label} — {r.course}</div>
                <div className="relative">
                  <select
                    value={selected}
                    onChange={(e) => handleTeeChange(r.key, e.target.value)}
                    disabled={!hasRaw}
                    className="w-full appearance-none border border-slate-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ color: teeInfo?.dot === "#ffffff" ? "#374151" : teeInfo?.dot }}
                  >
                    {options.map((t) => (
                      <option key={t} value={t}>{TEE_COLOURS[t].label}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Excel import */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-700">Import from Excel</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Upload your handicap spreadsheet. All tee colours are stored — use the dropdowns above to switch tees.
            </div>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shrink-0"
          >
            <Upload size={14} /> Choose File
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
        </div>
      </div>

      {importMsg && (
        <div className={`flex items-start gap-2 rounded-xl px-4 py-3 mb-4 text-sm ${
          importMsg.type === "success"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {importMsg.type === "success"
            ? <CheckCircle size={16} className="mt-0.5 shrink-0" />
            : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
          {importMsg.text}
        </div>
      )}

      <p className="text-xs text-slate-500 mb-3">Or edit individually — changes save when you leave each field.</p>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2 font-semibold text-slate-600">Player</th>
              {ROUNDS.map((r) => {
                const teeInfo = TEE_COLOURS[tees[r.key]] ?? TEE_COLOURS.white;
                return (
                  <th key={r.key} className="text-center px-2 py-2 font-semibold text-slate-600 text-xs w-24">
                    <div>{r.label}</div>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <span
                        className="w-2 h-2 rounded-full border"
                        style={{ backgroundColor: teeInfo.dot, borderColor: teeInfo.border }}
                      />
                      <span className="font-normal text-slate-400">{teeInfo.label}</span>
                    </div>
                  </th>
                );
              })}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {players.filter((p) => p.id <= 17).map((p, i) => (
              <tr key={p.id} className={`border-b border-slate-50 last:border-0 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                <td className="px-4 py-2 font-medium text-slate-700">
                  {p.name}
                  {p.id >= 16 && <span className="ml-1.5 text-xs text-slate-400 font-normal">(R2 only)</span>}
                </td>
                {ROUNDS.map((r) => {
                  const r2Only = p.id >= 16 && r.key !== "r2";
                  return (
                    <td key={r.key} className="px-2 py-2 text-center">
                      {r2Only ? (
                        <span className="text-xs text-slate-300">—</span>
                      ) : (
                        <input
                          type="number"
                          min={0}
                          max={54}
                          value={hcpVal(p, r.key)}
                          onChange={(e) => handleChange(p.id, r.key, e.target.value)}
                          onBlur={() => handleBlur(p.id)}
                          className="w-14 text-center border border-slate-300 rounded-lg px-1 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      )}
                    </td>
                  );
                })}
                <td className="pr-3 text-center">
                  {saved[p.id] && <CheckCircle size={14} className="text-emerald-500 inline" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
