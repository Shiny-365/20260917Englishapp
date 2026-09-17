export function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '');
}

export function levenshteinDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[rows - 1][cols - 1];
}

/**
 * The recognizer may pick up filler words or split the target across tokens,
 * so match against each token instead of requiring an exact full-transcript match.
 */
export function isPronunciationMatch(target: string, transcript: string): boolean {
  const normTarget = normalize(target);
  const normTranscript = normalize(transcript);
  if (!normTarget || !normTranscript) return false;
  if (normTranscript === normTarget) return true;

  const threshold = normTarget.length <= 4 ? 1 : 2;
  const tokens = normTranscript.split(/\s+/).filter(Boolean);
  return tokens.some((token) => levenshteinDistance(token, normTarget) <= threshold);
}
