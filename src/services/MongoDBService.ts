import mongoose, { Document, Model } from "mongoose";

// Define the score document interface
interface IScore extends Document {
  playerName: string;
  score: number;
  game: "snake";
  createdAt: Date;
  sanitizedName: string;
}

// MongoDB connection setup
const connectDB = async (): Promise<void> => {
  if (mongoose.connections[0]?.readyState) {
    return;
  }

  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
    await mongoose.connect(mongoUri);
    // MongoDB connected successfully
  } catch {
    // MongoDB connection error - continue without MongoDB
  }
};

// Score schema
const scoreSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    maxlength: 20,
    trim: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  game: {
    type: String,
    required: true,
    enum: ["snake"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sanitizedName: {
    type: String,
    required: true,
  },
});

scoreSchema.index({ game: 1, score: -1 });

// Create and export the Score model with proper typing
const Score: Model<IScore> =
  mongoose.models.Score || mongoose.model<IScore>("Score", scoreSchema);

/**
 * Sanitize player name to prevent XSS and ensure appropriate content
 */
function sanitizeName(name: string): string {
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
  score: number,
  game: string = "snake"
): Promise<boolean> {
  try {
    await connectDB();

    const sanitizedName = sanitizeName(playerName) || "Anonymous";

    const newScore = new Score({
      playerName: sanitizedName,
      score,
      game,
      sanitizedName,
    });

    await newScore.save();
    return true;
  } catch {
    // Error adding score
    return false;
  }
}

/**
 * Get top scores from the leaderboard
 */
export async function getTopScores(
  game: string = "snake",
  limit: number = 10
): Promise<
  Array<{
    playerName: string;
    score: number;
    createdAt: Date;
    rank: number;
  }>
> {
  try {
    await connectDB();

    const scores = await Score.find({ game })
      .sort({ score: -1, createdAt: 1 })
      .limit(limit)
      .select("playerName score createdAt")
      .lean();

    return scores.map((score: IScore, index: number) => ({
      playerName: score.playerName,
      score: score.score,
      createdAt: score.createdAt,
      rank: index + 1,
    }));
  } catch {
    // Error fetching scores
    return [];
  }
}

/**
 * Get player's best score and rank
 */
export async function getPlayerStats(
  playerName: string,
  game: string = "snake"
): Promise<{
  bestScore: number;
  rank: number;
  totalGames: number;
} | null> {
  try {
    await connectDB();

    const sanitizedName = sanitizeName(playerName);

    // Get player's best score
    const bestScoreDoc = await Score.findOne({ sanitizedName, game })
      .sort({ score: -1 })
      .select("score");

    if (!bestScoreDoc) {
      return null;
    }

    const bestScore = bestScoreDoc.score;

    // Get player's rank based on best score
    const betterScores = await Score.countDocuments({
      game,
      score: { $gt: bestScore },
    });

    // Get total games played by this player
    const totalGames = await Score.countDocuments({
      sanitizedName,
      game,
    });

    return {
      bestScore,
      rank: betterScores + 1,
      totalGames,
    };
  } catch {
    // Error fetching player stats
    return null;
  }
}

/**
 * Check if MongoDB is available
 */
export async function isMongoDBAvailable(): Promise<boolean> {
  try {
    await connectDB();
    return mongoose.connections[0]?.readyState === 1;
  } catch {
    return false;
  }
}
