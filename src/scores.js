const SCORES_FILE = "scores.json";
const MAX_SCORES = 10;

/** @returns {{name: string, score: number}[]} highest score first */
export function loadScores() {
  const text = std.loadFile(SCORES_FILE);
  if (!text) return [];
  try {
    return JSON.parse(text);
  } catch (e) {
    return [];
  }
}

export function saveScore(name, score) {
  const scores = loadScores();
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);

  const file = std.open(SCORES_FILE, "w");
  if (!file) return;
  file.puts(JSON.stringify(scores.slice(0, MAX_SCORES)));
  file.close();
}
