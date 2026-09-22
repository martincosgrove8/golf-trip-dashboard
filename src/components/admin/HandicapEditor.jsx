import { useState, useEffect, useRef } from "react";
import { getPlayers, setHandicap } from "../../data/storage";
import { CheckCircle, Upload, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";

export default function HandicapEditor() {
  const [players, setPlayersState] = useState([]);
  const [saved, setSaved] = useState({});
  const [importMsg, setImportMsg] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    getPlayers().then((p) => setPlayersState(p));
  }, []);

  function handleChange(id, value) {
    const hcp = Math.min(54, Math.max(0, Number(value) || 0));
    setPlayersState((prev) => prev.map((p) => (p.id === id ? { ...p, handicap: hcp } : p)));
    setSaved((prev) => ({ ...prev, [id]: false }));
  }

  async function handleBlur(id, value) {
    const hcp = Math.min(54, Math.max(0, Number(value) || 0));
    await setHandicap(id, hcp);
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

        const nameKey = Object.keys(rows[0] ?? {}).find((k) => /^(name|player)/i.test(k.trim()));
        const hcpKey  = Object.keys(rows[0] ?? {}).find((k) => /^(handicap|hcp)/i.test(k.trim()));

        if (!nameKey || !hcpKey) {
          setImportMsg({
            type: "error",
            text: `Columns not found. Expected "Name" and "Handicap" (or HCP). Found: ${Object.keys(rows[0] ?? {}).join(", ")}`,
          });
          return;
        }

        let matched = 0;
        const unmatched = [];
        const currentPlayers = await getPlayers();

        for (const row of rows) {
          const name = String(row[nameKey]).trim();
          const hcp  = Math.min(54, Math.max(0, Number(row[hcpKey]) || 0));
          const player = currentPlayers.find(
            (p) =>
              p.name.toLowerCase() === name.toLowerCase() ||
              p.name.toLowerCase().includes(name.toLowerCase()) ||
              name.toLowerCase().includes(p.name.split(" ")[1]?.toLowerCase() ?? "__")
          );
          if (player) {
            await setHandicap(player.id, hcp);
            matched++;
          } else if (name) {
            unmatched.push(name);
          }
        }

        getPlayers().then((p) => setPlayersState(p));
        setSaved({});

        const msg = `Imported ${matched} handicap${matched !== 1 ? "s" : ""}.${
          unmatched.length ? ` Unmatched: ${unmatched.join(", ")}` : ""
        }`;
        setImportMsg({ type: matched > 0 ? "success" : "error", text: msg });
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
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-700">Import from Excel</div>
          <div className="text-xs text-slate-500 mt-0.5">
            Spreadsheet must have a <span className="font-medium">Name</span> column and a <span className="font-medium">Handicap</span> (or HCP) column.
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

      {importMsg && (
        <div
          className={`flex items-start gap-2 rounded-xl px-4 py-3 mb-4 text-sm ${
            importMsg.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {importMsg.type === "success" ? <CheckCircle size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
          {importMsg.text}
        </div>
      )}

      <p className="text-xs text-slate-500 mb-3">Or edit individually — changes save when you leave each field.</p>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2 font-semibold text-slate-600">Player</th>
              <th className="text-center px-4 py-2 font-semibold text-slate-600 w-28">Handicap</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {players.filter((p) => p.id <= 15).map((p, i) => (
              <tr key={p.id} className={`border-b border-slate-50 last:border-0 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                <td className="px-4 py-2 font-medium text-slate-700">{p.name}</td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="number"
                    min={0}
                    max={54}
                    value={p.handicap}
                    onChange={(e) => handleChange(p.id, e.target.value)}
                    onBlur={(e) => handleBlur(p.id, e.target.value)}
                    className="w-16 text-center border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </td>
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
