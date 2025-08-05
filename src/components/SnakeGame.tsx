"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SnakeGame } from "@/types";
import {
  addScore,
  getTopScores,
  getPlayerStats,
  getRecentScores,
  LeaderboardEntry,
  PlayerStats,
} from "@/lib/leaderboard";
import { audioService } from "@/services/AudioService";

interface SnakeGameComponentProps {
  onExit: () => void;
  isMobile?: boolean;
}

const BOARD_SIZE = { width: 20, height: 15 };
const INITIAL_SNAKE = [{ x: 10, y: 7 }];
const INITIAL_FOOD = { x: 15, y: 7 };

const SnakeGameComponent: React.FC<SnakeGameComponentProps> = ({
  onExit,
  isMobile = false,
}) => {
  const [gameState, setGameState] = useState<SnakeGame>({
    snake: INITIAL_SNAKE,
    food: INITIAL_FOOD,
    direction: "right",
    score: 0,
    gameOver: false,
    boardSize: BOARD_SIZE,
  });

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [recentScores, setRecentScores] = useState<LeaderboardEntry[]>([]);
  const [collisionPosition, setCollisionPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [collisionType, setCollisionType] = useState<"wall" | "self" | null>(
    null
  );

  // Update recent scores in real-time
  const updateRecentScores = useCallback(async () => {
    // Skip in test environment to avoid act warnings
    if (process.env.NODE_ENV === "test") return;

    try {
      const chronologicalRecent = await getRecentScores(5);
      setRecentScores(chronologicalRecent);
    } catch {
      // Silently handle errors to avoid breaking the game
    }
  }, []);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("snake-high-score");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Load recent scores initially and set up periodic updates
  useEffect(() => {
    updateRecentScores();

    // Update recent scores more frequently during active gameplay for competitive feel
    const interval = setInterval(() => {
      if (gameStarted) {
        updateRecentScores();
      }
    }, 5000); // Update every 5 seconds during game

    return () => clearInterval(interval);
  }, [updateRecentScores, gameStarted]);

  // Save high score
  useEffect(() => {
    if (gameState.score > highScore) {
      setHighScore(gameState.score);
      localStorage.setItem("snake-high-score", gameState.score.toString());
    }
  }, [gameState.score, highScore]);

  const generateFood = useCallback(
    (snake: { x: number; y: number }[]): { x: number; y: number } => {
      let newFood: { x: number; y: number };
      do {
        newFood = {
          x: Math.floor(Math.random() * BOARD_SIZE.width),
          y: Math.floor(Math.random() * BOARD_SIZE.height),
        };
      } while (
        snake.some(
          segment => segment.x === newFood.x && segment.y === newFood.y
        )
      );

      return newFood;
    },
    []
  );

  const moveSnake = useCallback(() => {
    if (gameState.gameOver || isPaused) return;

    setGameState(prev => {
      const head = prev.snake[0];
      if (!head) return prev;

      let newHead: { x: number; y: number };

      switch (prev.direction) {
        case "up":
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case "down":
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case "left":
          newHead = { x: head.x - 1, y: head.y };
          break;
        case "right":
          newHead = { x: head.x + 1, y: head.y };
          break;
        default:
          newHead = head;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= BOARD_SIZE.width ||
        newHead.y < 0 ||
        newHead.y >= BOARD_SIZE.height
      ) {
        setCollisionPosition(newHead);
        setCollisionType("wall");
        return { ...prev, gameOver: true };
      }

      // Check self collision
      if (
        prev.snake.some(
          segment => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
        setCollisionPosition(newHead);
        setCollisionType("self");
        return { ...prev, gameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];

      // Check food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: prev.score + 10,
        };
      }

      // Remove tail if no food eaten
      newSnake.pop();

      return {
        ...prev,
        snake: newSnake,
      };
    });
  }, [gameState.gameOver, isPaused, generateFood]);

  const changeDirection = useCallback(
    (newDirection: "up" | "down" | "left" | "right") => {
      // Prevent reverse direction
      const opposites: Record<string, string> = {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
      };

      setGameState(prev => {
        if (opposites[prev.direction] === newDirection) {
          return prev; // Don't allow reverse direction
        }
        return { ...prev, direction: newDirection };
      });
    },
    []
  );

  const resetGame = useCallback(() => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: INITIAL_FOOD,
      direction: "right",
      score: 0,
      gameOver: false,
      boardSize: BOARD_SIZE,
    });
    setIsPaused(false);
    setShowLeaderboard(false);
    setShowNameInput(false);
    setGameStarted(true);
    setCollisionPosition(null);
    setCollisionType(null);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Load leaderboard data and recent scores
  const loadLeaderboard = useCallback(async () => {
    // Skip in test environment to avoid act warnings
    if (process.env.NODE_ENV === "test") return;

    try {
      const topScores = await getTopScores(10);
      const chronologicalRecent = await getRecentScores(5);

      setLeaderboard(topScores);
      setRecentScores(chronologicalRecent);
    } catch {
      // Silently handle errors
    }
  }, []);

  // Handle game over and show name input
  const handleGameOver = useCallback(async () => {
    audioService.playGameOver();

    // Add a delay to show the collision animation
    setTimeout(() => {
      setGameStarted(false);

      if (gameState.score > 0) {
        setShowNameInput(true);
      } else {
        setShowLeaderboard(true);
        loadLeaderboard();
      }
    }, 1500); // 1.5 second delay to show collision
  }, [gameState.score, loadLeaderboard]);

  // Submit score to leaderboard
  const submitScore = useCallback(async () => {
    if (
      playerName.trim() &&
      playerName.trim().length >= 2 &&
      playerName.trim().length <= 20 &&
      gameState.score > 0
    ) {
      try {
        const success = await addScore(playerName.trim(), gameState.score);
        if (success) {
          audioService.playSuccess();
          // Load updated leaderboard and player stats
          await loadLeaderboard();
          const stats = await getPlayerStats(playerName.trim());

          React.startTransition(() => {
            setPlayerStats(stats);
          });

          // Update recent scores for real-time display
          await updateRecentScores();
        }
      } catch {
        // Silently handle errors
      }
    }

    React.startTransition(() => {
      setShowNameInput(false);
      setShowLeaderboard(true);
    });
  }, [playerName, gameState.score, loadLeaderboard, updateRecentScores]);

  // Start game with name input
  const startGame = useCallback(() => {
    setShowNameInput(true);
  }, []);

  const startGameWithName = useCallback(() => {
    if (
      playerName.trim() &&
      playerName.trim().length >= 2 &&
      playerName.trim().length <= 20
    ) {
      setShowNameInput(false);
      setGameStarted(true);
      resetGame();
    }
  }, [playerName, resetGame]);

  // Handle game over
  useEffect(() => {
    if (gameState.gameOver && gameStarted) {
      handleGameOver();
    }
  }, [gameState.gameOver, gameStarted, handleGameOver]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameState.gameOver || isPaused) return;

    const gameInterval = setInterval(moveSnake, 120); // Faster game loop for better responsiveness
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameStarted, gameState.gameOver, isPaused]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      // Don't handle game keys when user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Always allow escape and quit keys
      if (e.key === "Escape" || e.key === "q" || e.key === "Q") {
        e.preventDefault();
        onExit();
        return;
      }

      // Handle movement controls when game is started and active
      if (gameStarted && !gameState.gameOver && !isPaused) {
        switch (e.key) {
          case "ArrowUp":
          case "w":
          case "W":
            e.preventDefault();
            changeDirection("up");
            return;
          case "ArrowDown":
          case "s":
          case "S":
            e.preventDefault();
            changeDirection("down");
            return;
          case "ArrowLeft":
          case "a":
          case "A":
            e.preventDefault();
            changeDirection("left");
            return;
          case "ArrowRight":
          case "d":
          case "D":
            e.preventDefault();
            changeDirection("right");
            return;
        }
      }

      // Handle other game controls when game is started
      if (gameStarted) {
        switch (e.key) {
          case " ":
            e.preventDefault();
            togglePause();
            break;
          case "r":
          case "R":
            e.preventDefault();
            if (gameState.gameOver) {
              resetGame();
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    changeDirection,
    togglePause,
    onExit,
    gameState.gameOver,
    resetGame,
    gameStarted,
    isPaused,
  ]);

  // Touch controls for mobile
  const handleSwipe = (direction: "up" | "down" | "left" | "right"): void => {
    changeDirection(direction);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black p-4">
      {/* Welcome/Name Input Screen */}
      {!gameStarted && showNameInput && (
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-green-400">
            🐍 Snake Game
          </h2>
          <div className="mb-4">
            <p className="mb-4 text-white">Enter your name to start playing!</p>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyPress={e => e.key === "Enter" && startGameWithName()}
              placeholder="Your name (2-20 characters)"
              minLength={2}
              maxLength={20}
              className="w-64 rounded border border-green-400/40 bg-gray-900 px-4 py-2 text-white focus:border-green-400 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="space-x-4">
            <button
              onClick={startGameWithName}
              disabled={
                !playerName.trim() ||
                playerName.trim().length < 2 ||
                playerName.trim().length > 20
              }
              className="rounded bg-green-400 px-6 py-2 font-medium text-black transition-colors hover:bg-green-300 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
            >
              Start Game
            </button>
            <button
              onClick={onExit}
              className="rounded bg-gray-600 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-500"
            >
              Exit
            </button>
          </div>
          {!playerName.trim() && (
            <p className="mt-2 text-sm text-gray-400">
              You can play anonymously by leaving the name empty
            </p>
          )}
        </div>
      )}

      {/* Post-game Name Input Screen */}
      {!gameStarted && showNameInput && gameState.gameOver && (
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-400">Game Over!</h2>
          <p className="mb-2 text-green-400">Final Score: {gameState.score}</p>
          <p className="mb-4 text-white">
            Enter your name for the leaderboard:
          </p>
          <div className="mb-4">
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyPress={e => e.key === "Enter" && submitScore()}
              placeholder="Your name (2-20 characters)"
              minLength={2}
              maxLength={20}
              className="w-64 rounded border border-green-400/40 bg-gray-900 px-4 py-2 text-white focus:border-green-400 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="space-x-4">
            <button
              onClick={submitScore}
              disabled={
                !playerName.trim() ||
                playerName.trim().length < 2 ||
                playerName.trim().length > 20
              }
              className="rounded bg-green-400 px-6 py-2 font-medium text-black transition-colors hover:bg-green-300 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
            >
              Submit Score
            </button>
            <button
              onClick={() => {
                setShowNameInput(false);
                setShowLeaderboard(true);
                loadLeaderboard();
              }}
              className="rounded bg-gray-600 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-500"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard Screen */}
      {!gameStarted && showLeaderboard && (
        <div className="w-full max-w-md text-center">
          <h2 className="mb-6 text-3xl font-bold text-green-400">
            🏆 Leaderboard
          </h2>

          {playerStats && (
            <div className="mb-6 rounded border border-blue-400/40 bg-blue-400/10 p-4">
              <h3 className="mb-2 text-lg font-bold text-blue-400">
                Your Stats
              </h3>
              <div className="text-sm text-white">
                <p>Best Score: {playerStats.bestScore}</p>
                <p>Rank: #{playerStats.rank}</p>
                <p>Games Played: {playerStats.totalGames}</p>
              </div>
            </div>
          )}

          <div className="mb-6 rounded border border-green-400/40 bg-green-400/10 p-4">
            <h3 className="mb-4 text-lg font-bold text-green-400">
              Top Scores
            </h3>
            {leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-yellow-400">#{entry.rank}</span>
                    <span className="text-white">{entry.playerName}</span>
                    <span className="text-green-400">{entry.score}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No scores yet. Be the first!</p>
            )}
          </div>

          <div className="space-x-4">
            <button
              onClick={() => {
                setShowLeaderboard(false);
                setShowNameInput(true);
              }}
              className="rounded bg-green-400 px-6 py-2 font-medium text-black transition-colors hover:bg-green-300"
            >
              Play Again
            </button>
            <button
              onClick={onExit}
              className="rounded bg-gray-600 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-500"
            >
              Exit
            </button>
          </div>
        </div>
      )}

      {/* Game Screen */}
      {gameStarted && (
        <>
          {/* Real-time Competitive Recent Scores Display */}
          {recentScores.length > 0 && (
            <div className="absolute top-4 right-4 min-w-[200px] rounded border border-purple-400/40 bg-purple-400/10 p-3 text-xs backdrop-blur-sm">
              <h4 className="mb-2 font-bold text-purple-400">Recent Scores</h4>
              <div className="space-y-1">
                {recentScores.slice(0, 3).map((entry, index) => {
                  const isCurrentPlayer =
                    playerName && entry.playerName === playerName.trim();
                  const shouldHighlight =
                    isCurrentPlayer ||
                    (gameStarted &&
                      !gameState.gameOver &&
                      gameState.score > entry.score);

                  return (
                    <div
                      key={`recent-${entry.playerName}-${entry.timestamp}-${index}`}
                      className={`flex items-center justify-between rounded p-1 transition-all duration-300 ${
                        isCurrentPlayer
                          ? "scale-105 transform border border-blue-400/50 bg-blue-500/20"
                          : shouldHighlight
                            ? "border border-yellow-400/30 bg-yellow-500/10"
                            : "hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <span
                          className={`text-xs ${
                            isCurrentPlayer ? "text-blue-400" : "text-gray-400"
                          }`}
                        >
                          #{index + 1}
                        </span>
                        <span
                          className={`mr-2 truncate ${
                            isCurrentPlayer
                              ? "font-bold text-blue-300"
                              : "text-white"
                          }`}
                          title={entry.playerName}
                        >
                          {entry.playerName.length > 8
                            ? entry.playerName.substring(0, 8) + "..."
                            : entry.playerName}
                        </span>
                      </div>
                      <span
                        className={`font-mono ${
                          isCurrentPlayer
                            ? "font-bold text-blue-400"
                            : "text-green-400"
                        }`}
                      >
                        {entry.score}
                      </span>
                    </div>
                  );
                })}

                {/* Show current player's live score if they're playing and would be in top recent */}
                {gameStarted &&
                  !gameState.gameOver &&
                  playerName &&
                  gameState.score > 0 && (
                    <div className="mt-2 border-t border-purple-400/30 pt-2">
                      <div className="flex scale-105 transform animate-pulse items-center justify-between rounded border border-green-400/50 bg-green-500/20 p-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-green-400">🎮</span>
                          <span
                            className="mr-2 truncate font-bold text-green-300"
                            title={playerName}
                          >
                            {playerName.length > 8
                              ? playerName.substring(0, 8) + "..."
                              : playerName}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-green-400">
                          {gameState.score}
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-4 text-center">
            <h2 className="mb-2 text-2xl font-bold text-green-400">
              🐍 Snake Game
            </h2>
            <div className="flex justify-center space-x-6 text-sm">
              <span className="text-green-400">Score: {gameState.score}</span>
              <span className="text-yellow-400">High Score: {highScore}</span>
              {playerName && (
                <span className="text-blue-400">Player: {playerName}</span>
              )}
            </div>
          </div>

          {/* Game Board */}
          <div className="relative">
            <div
              className="grid rounded-lg border-2 border-green-400 bg-gray-900 p-2"
              style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE.width}, 1fr)`,
                gridTemplateRows: `repeat(${BOARD_SIZE.height}, 1fr)`,
                width: isMobile ? "300px" : "400px",
                height: isMobile ? "225px" : "300px",
              }}
            >
              {Array.from({ length: BOARD_SIZE.width * BOARD_SIZE.height }).map(
                (_, index) => {
                  const x = index % BOARD_SIZE.width;
                  const y = Math.floor(index / BOARD_SIZE.width);

                  const isSnake = gameState.snake.some(
                    segment => segment.x === x && segment.y === y
                  );
                  const isHead =
                    gameState.snake[0]?.x === x && gameState.snake[0]?.y === y;
                  const isFood =
                    gameState.food.x === x && gameState.food.y === y;
                  const isCollision =
                    collisionPosition &&
                    collisionPosition.x === x &&
                    collisionPosition.y === y;

                  return (
                    <div
                      key={index}
                      className={`h-full w-full border border-gray-700 ${
                        isCollision && gameState.gameOver
                          ? collisionType === "wall"
                            ? "animate-pulse bg-red-600 shadow-lg shadow-red-500/50"
                            : "animate-pulse bg-orange-600 shadow-lg shadow-orange-500/50"
                          : isFood
                            ? "bg-red-400"
                            : isHead && gameState.gameOver
                              ? "animate-pulse bg-red-500"
                              : isHead
                                ? "bg-green-300"
                                : isSnake
                                  ? gameState.gameOver
                                    ? "bg-red-400/80"
                                    : "bg-green-400"
                                  : "bg-gray-800"
                      }`}
                    />
                  );
                }
              )}
            </div>

            {/* Pause Overlay */}
            {isPaused && !gameState.gameOver && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/80">
                <div className="text-center">
                  <div className="mb-2 text-xl font-bold text-yellow-400">
                    Paused
                  </div>
                  <div className="text-green-400">Press SPACE to continue</div>
                </div>
              </div>
            )}

            {/* Game Over Overlay */}
            {gameState.gameOver && gameStarted && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/90">
                <div className="animate-pulse text-center">
                  <div className="mb-2 text-2xl font-bold text-red-400">
                    💥 GAME OVER!
                  </div>
                  <div className="mb-2 text-lg text-white">
                    Score: {gameState.score}
                  </div>
                  <div className="text-sm text-gray-400">
                    {collisionType === "wall"
                      ? "Hit the wall!"
                      : "Snake ate itself!"}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Submitting score...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 text-center">
            {!isMobile ? (
              <div className="text-sm text-gray-400">
                <div>Use WASD or Arrow keys to move</div>
                <div>SPACE to pause • Q/ESC to quit • R to restart</div>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div></div>
                <button
                  onClick={() => handleSwipe("up")}
                  className="flex h-12 w-12 items-center justify-center rounded border border-green-400/40 bg-green-400/20 text-green-400"
                >
                  ↑
                </button>
                <div></div>
                <button
                  onClick={() => handleSwipe("left")}
                  className="flex h-12 w-12 items-center justify-center rounded border border-green-400/40 bg-green-400/20 text-green-400"
                >
                  ←
                </button>
                <button
                  onClick={togglePause}
                  className="flex h-12 w-12 items-center justify-center rounded border border-yellow-400/40 bg-yellow-400/20 text-xs text-yellow-400"
                >
                  {isPaused ? "▶" : "⏸"}
                </button>
                <button
                  onClick={() => handleSwipe("right")}
                  className="flex h-12 w-12 items-center justify-center rounded border border-green-400/40 bg-green-400/20 text-green-400"
                >
                  →
                </button>
                <div></div>
                <button
                  onClick={() => handleSwipe("down")}
                  className="flex h-12 w-12 items-center justify-center rounded border border-green-400/40 bg-green-400/20 text-green-400"
                >
                  ↓
                </button>
                <button
                  onClick={onExit}
                  className="flex h-12 w-12 items-center justify-center rounded border border-red-400/40 bg-red-400/20 text-xs text-red-400"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Initial screen when no game started and no name input */}
      {!gameStarted && !showNameInput && !showLeaderboard && (
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-green-400">
            🐍 Snake Game
          </h2>
          <div className="space-x-4">
            <button
              onClick={startGame}
              className="rounded bg-green-400 px-6 py-2 font-medium text-black transition-colors hover:bg-green-300"
            >
              Start Game
            </button>
            <button
              onClick={() => {
                setShowLeaderboard(true);
                loadLeaderboard();
              }}
              className="rounded bg-blue-400 px-6 py-2 font-medium text-black transition-colors hover:bg-blue-300"
            >
              View Leaderboard
            </button>
            <button
              onClick={onExit}
              className="rounded bg-gray-600 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-500"
            >
              Exit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGameComponent;
