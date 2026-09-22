import { useState } from "react";
import { saveTeams, setScore, resetScores, resetTeams } from "../../data/storage";
import { Shuffle, CheckCircle, Loader } from "lucide-react";

const PLAYER_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const TEAM_NAMES  = ["Eagles", "Birdies", "Bogeys", "Albatross", "Condors"];
const TEAM_COLORS = ["#15803D", "#0F766E", "#1D4ED8", "#7C3AED", "#B45309"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randScore() {
  // Realistic Stableford total: roughly 28–44 pts
  return Math.floor(Math.random() * 17) + 28;
}

export default function SeedData() {
  const [status, setStatus] = useState("idle"); // idle | running | done
  const [preview, setPreview] = useState(null);

  function buildSeed() {
    const playerOrder = shuffle(PLAYER_IDS);
    const teams = TEAM_NAMES.map((name, i) => ({
      id: `seed_${i}`,
      name,
      color: TEAM_COLORS[i],
      players: playerOrder.slice(i * 3, i * 3 + 3),
    }));

    const scores = [];
    for (const pid of PLAYER_IDS) {
      for (let day = 1; day <= 4; day++) {
        scores.push({ day, playerId: pid, total: randScore() });
      }
    }

    return { teams, scores };
  }

  function handlePreview() {
    setPreview(buildSeed());
    setStatus("idle");
  }

  async function handleGenerate() {
    const seed = preview ?? buildSeed();
    setStatus("running");

    await resetTeams();
    await resetScores();
    await saveTeams(seed.teams);
    for (const s of seed.scores) {
      await setScore(s.day, s.playerId, s.total);
    }

    setStatus("done");
    setPreview(null);
  }

  return (
    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Shuffle size={14} className="text-slate-500" />
            Generate Test Data
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Creates 5 random teams of 3 and fills scores for all 4 rounds with realistic Stableford totals.
          </div>
        </div>
      </div>

      {/* Team preview */}
      {preview && (
        <div className="mb-3 space-y-1.5">
          {preview.teams.map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
              <span className="font-semibold text-slate-700 w-20">{t.name}</span>
              <span className="text-slate-500">
                {t.players.map((id) => {
                  const names = ["","Ciaran R","David S","Eamon M","Fergal R","James M","John L","John W","Kenny C","Kevin F","Kevin P","Martin C","Peter M","Brendan K","Eugene G","John M"];
                  return names[id];
                }).join(", ")}
              </span>
            </div>
          ))}
        </div>
      )}

      {status === "done" ? (
        <div className="flex items-center gap-2 text-sm text-emerald-700 font-semibold">
          <CheckCircle size={15} /> Test data generated — reload any page to see it.
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handlePreview}
            disabled={status === "running"}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-medium hover:border-slate-400 transition-colors disabled:opacity-50"
          >
            Randomise preview
          </button>
          <button
            onClick={handleGenerate}
            disabled={status === "running"}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {status === "running" ? (
              <><Loader size={13} className="animate-spin" /> Generating…</>
            ) : (
              <><Shuffle size={13} /> Generate &amp; Save</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
