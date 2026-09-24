import { useState, useEffect, useRef } from "react";
import { getPlayers, setHandicaps } from "../../data/storage";
import { CheckCircle, Upload, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";

const ROUNDS = [
  { key: "r1", label: "R1 — Faldo" },
  { key: "r2", label: "R2 — Laguna" },
  { key: "r3", label: "R3 — Vale do Lobo" },
  { key: "r4", label: "R4 — Quinta do Vale" },
];

// Attempt to map a column header to a round key
function detectRoundKey(col) {
  const c = col.toLowerCase().trim();
  if (/r1|round.?1|faldo|amendoeira/.test(c)) return "r1";
  if (/r2|round.?2|laguna|dom.pedro/.test(c)) return "r2";
  if (/r3|round.?3|vale.do.lobo|lobo/.test(c)) return "r3";
  if (/r4|round.?4|quinta/.test(c)) return "r4";
  if (/^(handicap|hcp)$/.test(c)) return "r1"; // single-column fallback
  return null;
}

export default function HandicapEditor() {
  const [players, setPlayersState] = useState([]);
  const [saved, setSaved] = useState({});
  const [importMsg, setImportMsg] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    getPlayers().then(setPlayersState);
  }, []);

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
        const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
        if (!rows.length) { setImportMsg({ type: "error", text: "Empty spreadsheet." }); return; }

        const cols = Object.keys(rows[0]);
        const nameKey = cols.find((k) => /^(name|player)/i.test(k.trim()));
        if (!nameKey) {
          setImportMsg({ type: "error", text: `No "Name" column found. Columns: ${cols.join(", ")}` });
          return;
        }

        // Map each column to a round key
        const roundCols = {};
        cols.forEach((k) => {
          if (k === nameKey) return;
          const rk = detectRoundKey(k);
          if (rk) roundCols[k] = rk;
        });

        if (!Object.keys(roundCols).length) {
          setImportMsg({ type: "error", text: `No round/handicap columns found. Expected R1/R2/R3/R4 or Round 1–4. Columns: ${cols.join(", ")}` });
          return;
        }

        let matched = 0;
        const unmatched = [];
        const currentPlayers = await getPlayers();

        for (const row of rows) {
          const name = String(row[nameKey]).trim();
          const player = currentPlayers.find(
            (p) =>
              p.name.toLowerCase() === name.toLowerCase() ||
              p.name.toLowerCase().includes(name.toLowerCase()) ||
              name.toLowerCase().includes(p.name.split(" ")[1]?.toLowerCase() ?? "__")
          );
          if (!player) { if (name) unmatched.push(name); continue; }

          const existing = player.handicaps ?? { r1: player.handicap ?? 0, r2: 0, r3: 0, r4: 0 };
          const updated = { ...existing };
          Object.entries(roundCols).forEach(([col, rk]) => {
            updated[rk] = Math.min(54, Math.max(0, Number(row[col]) || 0));
          });
          await setHandicaps(player.id, updated);
          matched++;
        }

        getPlayers().then((p) => { setPlayersState(p); setSaved({}); });

        const roundsImported = Object.values(roundCols).filter((v, i, a) => a.indexOf(v) === i).map((rk) => {
          const r = ROUNDS.find((x) => x.key === rk);
          return r ? r.label : rk;
        });
        setImportMsg({
          type: matched > 0 ? "success" : "error",
          text: `Imported ${matched} player${matched !== 1 ? "s" : ""} for ${roundsImported.join(", ")}.${
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
      {/* Excel import */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-700">Import from Excel</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Include a <span className="font-medium">Name</span> column plus handicap columns named{" "}
              <span className="font-medium">R1</span>, <span className="font-medium">R2</span>,{" "}
              <span className="font-medium">R3</span>, <span className="font-medium">R4</span>{" "}
              (or Round 1–4, Faldo, Laguna etc.). Missing rounds stay unchanged.
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
        <div
          className={`flex items-start gap-2 rounded-xl px-4 py-3 mb-4 text-sm ${
            importMsg.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
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
              {ROUNDS.map((r) => (
                <th key={r.key} className="text-center px-2 py-2 font-semibold text-slate-600 text-xs w-24">{r.label}</th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {players.filter((p) => p.id <= 15).map((p, i) => (
              <tr key={p.id} className={`border-b border-slate-50 last:border-0 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                <td className="px-4 py-2 font-medium text-slate-700">{p.name}</td>
                {ROUNDS.map((r) => (
                  <td key={r.key} className="px-2 py-2 text-center">
                    <input
                      type="number"
                      min={0}
                      max={54}
                      value={hcpVal(p, r.key)}
                      onChange={(e) => handleChange(p.id, r.key, e.target.value)}
                      onBlur={() => handleBlur(p.id)}
                      className="w-14 text-center border border-slate-300 rounded-lg px-1 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </td>
                ))}
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
