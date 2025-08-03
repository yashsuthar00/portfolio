/**
 * Client-side leaderboard functions that use API routes
 * Falls back to in-memory storage when API is unavailable
 */

export interface LeaderboardEntry {
  playerName: string;
  score: number;
  timestamp: number;
  rank?: number;
}

export interface PlayerStats {
  bestScore: number;
  rank: number;
  totalGames: number;
}

// In-memory fallback storage
let inMemoryScores: LeaderboardEntry[] = [];

/**
 * Sanitize player name for safety and consistency
 */
function sanitizePlayerName(name: string): string {
  return name
    .replace(/[<>&"']/g, "") // Remove potentially harmful characters
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim()
    .substring(0, 20); // Limit length
}

/**
 * Add a new score to the leaderboard
 */
export async function addScore(
  playerName: string,
  score: number
): Promise<boolean> {
  const sanitizedName = sanitizePlayerName(playerName);

  try {
    // Try API first
    const response = await fetch("/api/leaderboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerName: sanitizedName, score }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.success;
    }
  } catch {
    // API failed, use in-memory storage
  }

  // Fallback to in-memory storage
  const entry: LeaderboardEntry = {
    playerName: sanitizedName,
    score,
    timestamp: Date.now(),
  };

  inMemoryScores.push(entry);

  // Keep only top 100 scores to prevent memory bloat
  inMemoryScores.sort((a, b) => b.score - a.score);
  if (inMemoryScores.length > 100) {
    inMemoryScores = inMemoryScores.slice(0, 100);
  }

  return true;
}

/**
 * Get top scores from leaderboard
 */
export async function getTopScores(
  limit: number = 10
): Promise<LeaderboardEntry[]> {
  try {
    // Try API first
    const response = await fetch(`/api/leaderboard?limit=${limit}`);

    if (response.ok) {
      const data = await response.json();
      return data.scores.map((score: LeaderboardEntry, index: number) => ({
        ...score,
        rank: index + 1,
      }));
    }
  } catch {
    // API failed, use in-memory storage
  }

  // Fallback to in-memory storage
  const sortedScores = [...inMemoryScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((score, index) => ({
      ...score,
      rank: index + 1,
    }));

  return sortedScores;
}

/**
 * Get player statistics
 */
export async function getPlayerStats(
  playerName: string
): Promise<PlayerStats | null> {
  const sanitizedName = sanitizePlayerName(playerName);

  try {
    // Try API first
    const response = await fetch(
      `/api/player-stats?playerName=${encodeURIComponent(sanitizedName)}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.stats;
    }
  } catch {
    // API failed, use in-memory storage
  }

  // Fallback to in-memory storage
  const playerScores = inMemoryScores.filter(
    entry => entry.playerName.toLowerCase() === sanitizedName.toLowerCase()
  );

  if (playerScores.length === 0) {
    return null;
  }

  const bestScore = Math.max(...playerScores.map(entry => entry.score));

  // Calculate rank
  const betterScores = inMemoryScores.filter(entry => entry.score > bestScore);
  const uniqueBetterScores = [
    ...new Set(betterScores.map(entry => entry.score)),
  ];
  const rank = uniqueBetterScores.length + 1;

  return {
    bestScore,
    rank,
    totalGames: playerScores.length,
  };
}

/**
 * Get total number of unique players
 */
export async function getTotalPlayers(): Promise<number> {
  try {
    // Try API first (if we implement this endpoint later)
    const response = await fetch("/api/leaderboard");
    if (response.ok) {
      const data = await response.json();
      // This would need to be implemented in the API
      return data.totalPlayers || 0;
    }
  } catch {
    // API failed, use in-memory storage
  }

  // Fallback to in-memory storage
  const uniquePlayers = new Set(
    inMemoryScores.map(entry => entry.playerName.toLowerCase())
  );
  return uniquePlayers.size;
}
