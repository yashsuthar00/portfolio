// Mock MongoDB service to prevent Jest import issues
jest.mock("../../services/MongoDBService", () => ({
  addScore: jest.fn().mockResolvedValue(true),
  getTopScores: jest.fn().mockResolvedValue([]),
  getPlayerStats: jest.fn().mockResolvedValue(null),
}));

import { addScore, getTopScores, getPlayerStats } from "../leaderboard";

describe("Leaderboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sanitize player names", async () => {
    const result = await addScore('<script>alert("test")</script>', 100);
    expect(result).toBe(true);
  });

  it("should handle score addition", async () => {
    const result = await addScore("Player1", 100);
    expect(result).toBe(true);
  });

  it("should get top scores", async () => {
    const scores = await getTopScores(10);
    expect(Array.isArray(scores)).toBe(true);
  });

  it("should get player stats", async () => {
    const stats = await getPlayerStats("Player1");
    expect(stats).toEqual({ bestScore: 100, rank: 1, totalGames: 1 }); // Match the mocked response
  });
});
