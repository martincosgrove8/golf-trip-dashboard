import { rydercupMatches, players } from "../data/tripData";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend,
} from "recharts";
import { Sword, Shield } from "lucide-react";

function getNames(ids) {
  return ids.map((id) => players.find((p) => p.id === id)?.name?.split(" ")[0] ?? `P${id}`).join(" & ");
}

function computeCumulative() {
  let red = 0, blue = 0;
  return rydercupMatches.map((day) => {
    const dr = day.matches.reduce((a, m) => a + m.redPts, 0);
    const db = day.matches.reduce((a, m) => a + m.bluePts, 0);
    red += dr;
    blue += db;
    return { day: day.dayLabel.split("—")[0].trim(), red, blue, drRed: dr, drBlue: db };
  });
}

export default function TeamBattlePage() {
  const cumulative = computeCumulative();
  const totalRed = cumulative[cumulative.length - 1]?.red ?? 0;
  const totalBlue = cumulative[cumulative.length - 1]?.blue ?? 0;
  const winner = totalRed > totalBlue ? "Red" : totalBlue > totalRed ? "Blue" : null;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Sword size={18} /> Ryder Cup Team Battle
      </h2>

      {/* Score header */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <TeamScore team="Red" total={totalRed} winner={winner === "Red"} />
        <div className="flex items-center justify-center">
          <div className="text-slate-400 font-bold text-lg">VS</div>
        </div>
        <TeamScore team="Blue" total={totalBlue} winner={winner === "Blue"} />
      </div>

      {winner ? (
        <div className={`rounded-xl text-center py-3 px-4 mb-5 font-bold text-white text-sm ${
          winner === "Red" ? "bg-red-600" : "bg-blue-600"
        }`}>
          🏆 Team {winner} wins! ({totalRed}–{totalBlue})
        </div>
      ) : (
        <div className="rounded-xl text-center py-3 px-4 mb-5 font-bold text-slate-700 bg-slate-100 text-sm">
          Level — All Square ({totalRed}–{totalBlue})
        </div>
      )}

      {/* Cumulative chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Cumulative Points
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={cumulative} margin={{ top: 4, right: 16, bottom: 4, left: -10 }}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
              formatter={(v, name) => [`${v} pts`, name === "red" ? "Team Red" : "Team Blue"]}
            />
            <Legend
              formatter={(value) => value === "red" ? "Team Red" : "Team Blue"}
              wrapperStyle={{ fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="red"
              stroke="#DC2626"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "#DC2626" }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="blue"
              stroke="#2563EB"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "#2563EB" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Day-by-day results */}
      {rydercupMatches.map((day, di) => {
        const dr = day.matches.reduce((a, m) => a + m.redPts, 0);
        const db = day.matches.reduce((a, m) => a + m.bluePts, 0);
        return (
          <div key={day.day} className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold text-slate-700">{day.dayLabel}</div>
              <DayResult redPts={dr} bluePts={db} />
            </div>
            <div className="space-y-2">
              {day.matches.map((m) => (
                <MatchRow key={m.id} match={m} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TeamScore({ team, total, winner }) {
  const isRed = team === "Red";
  return (
    <div
      className={`rounded-2xl p-4 text-center ${
        isRed ? "bg-red-50 border border-red-200" : "bg-blue-50 border border-blue-200"
      } ${winner ? "ring-2 ring-offset-1 " + (isRed ? "ring-red-500" : "ring-blue-500") : ""}`}
    >
      <Shield size={20} className={`mx-auto mb-1 ${isRed ? "text-red-500" : "text-blue-500"}`} />
      <div className={`text-2xl font-bold ${isRed ? "text-red-700" : "text-blue-700"}`}>
        {total}
      </div>
      <div className={`text-xs font-semibold ${isRed ? "text-red-500" : "text-blue-500"}`}>
        Team {team}
      </div>
    </div>
  );
}

function DayResult({ redPts, bluePts }) {
  const winner = redPts > bluePts ? "red" : bluePts > redPts ? "blue" : "tie";
  return (
    <div className="flex items-center gap-1.5 text-xs font-bold">
      <span className={winner === "red" ? "text-red-600 text-base" : "text-red-400"}>{redPts}</span>
      <span className="text-slate-400">–</span>
      <span className={winner === "blue" ? "text-blue-600 text-base" : "text-blue-400"}>{bluePts}</span>
    </div>
  );
}

function MatchRow({ match: m }) {
  const result = m.result;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-3 py-2.5 flex items-center gap-2 text-xs">
      <div className="flex-1 text-red-700 font-medium text-right truncate">
        {getNames(m.redPlayers)}
      </div>
      <div
        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs ${
          result === "W"
            ? "bg-red-500"
            : result === "L"
            ? "bg-blue-500"
            : "bg-slate-400"
        }`}
        title={result === "W" ? "Red won" : result === "L" ? "Blue won" : "Halved"}
      >
        {result}
      </div>
      <div className="flex-1 text-blue-700 font-medium truncate">
        {getNames(m.bluePlayers)}
      </div>
      <div className="shrink-0 text-slate-400 font-mono">
        {m.redPts}–{m.bluePts}
      </div>
    </div>
  );
}
