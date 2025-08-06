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
import { realtimeService } from "@/services/RealtimeService";

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
  const [pendingDirection, setPendingDirection] = useState<
    "up" | "down" | "left" | "right" | null
  >(null);

  // Direction queue for ultra-smooth rapid key handling
  const [directionQueue, setDirectionQueue] = useState<
    ("up" | "down" | "left" | "right")[]
  >([]);
  const [nameInputDisabled, setNameInputDisabled] = useState<boolean>(false);
  const [showEditIcon, setShowEditIcon] = useState<boolean>(false);

  // Simplified state without complex animations
  const [specialFood, setSpecialFood] = useState<{
    x: number;
    y: number;
    type: "golden" | "speed" | "bonus";
  } | null>(null);
  const [speedBoost, setSpeedBoost] = useState<boolean>(false);
  const [powerUpTimer, setPowerUpTimer] = useState<number>(0);

  // Simplified recent scores update without complex animations
  const updateRecentScores = useCallback(async () => {
    // Skip in test environment to avoid act warnings
    if (process.env.NODE_ENV === "test") return;

    try {
      const chronologicalRecent = await getRecentScores(5);

      // Simply update the scores, no complex animations
      setRecentScores(chronologicalRecent);
    } catch {
      // Silently handle errors to avoid breaking the game
    }
  }, []); // Remove dependencies to prevent infinite loops

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("snake-high-score");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Initialize realtime connection with minimal performance impact
  useEffect(() => {
    let isInitialized = false;

    const initRealtime = () => {
      if (isInitialized) return;
      isInitialized = true;

      realtimeService.connect();
      realtimeService.joinGameRoom();

      // Set up real-time score listeners (simplified)
      const handleRecentScoresUpdate = (
        newRecentScores: LeaderboardEntry[]
      ) => {
        if (process.env.NODE_ENV !== "test") {
          React.startTransition(() => {
            setRecentScores(newRecentScores);
          });
        }
      };

      const handleLeaderboardUpdate = (newLeaderboard: LeaderboardEntry[]) => {
        if (process.env.NODE_ENV !== "test") {
          React.startTransition(() => {
            setLeaderboard(newLeaderboard);
          });
        }
      };

      realtimeService.onRecentScoresUpdate(handleRecentScoresUpdate);
      realtimeService.onLeaderboardUpdate(handleLeaderboardUpdate);
    };

    // Initialize immediately without complex timing
    initRealtime();

    return () => {
      realtimeService.off();
      realtimeService.leaveGameRoom();
      realtimeService.disconnect();
    };
  }, []); // Empty dependencies to run only once

  // Removed fallback polling - rely only on SSE for real-time updates

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

      // 15% chance to generate special food
      if (Math.random() < 0.15 && !specialFood) {
        const specialTypes: ("golden" | "speed" | "bonus")[] = [
          "golden",
          "speed",
          "bonus",
        ];
        const randomType = specialTypes[
          Math.floor(Math.random() * specialTypes.length)
        ] as "golden" | "speed" | "bonus";

        let specialPos: { x: number; y: number };
        do {
          specialPos = {
            x: Math.floor(Math.random() * BOARD_SIZE.width),
            y: Math.floor(Math.random() * BOARD_SIZE.height),
          };
        } while (
          snake.some(
            segment => segment.x === specialPos.x && segment.y === specialPos.y
          ) ||
          (specialPos.x === newFood.x && specialPos.y === newFood.y)
        );

        setSpecialFood({ x: specialPos.x, y: specialPos.y, type: randomType });

        // Remove special food after 8 seconds
        setTimeout(() => {
          setSpecialFood(null);
        }, 8000);
      }

      return newFood;
    },
    [specialFood]
  );

  const moveSnake = useCallback(() => {
    if (gameState.gameOver || isPaused) return;

    setGameState(prev => {
      const head = prev.snake[0];
      if (!head) return prev;

      // Ultra-responsive direction handling: use queue first, then pending, then current
      let actualDirection = prev.direction;

      if (directionQueue.length > 0 && directionQueue[0]) {
        actualDirection = directionQueue[0];
        // Process the direction queue
        setDirectionQueue(prevQueue => prevQueue.slice(1));
      } else if (pendingDirection) {
        actualDirection = pendingDirection;
        setPendingDirection(null);
      }

      let newHead: { x: number; y: number };

      switch (actualDirection) {
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

      // Check special food collision
      if (
        specialFood &&
        newHead.x === specialFood.x &&
        newHead.y === specialFood.y
      ) {
        let scoreBonus = 0;

        switch (specialFood.type) {
          case "golden":
            scoreBonus = 25; // Golden food gives more points
            audioService.playSuccess(); // Special sound effect
            break;
          case "speed":
            scoreBonus = 15;
            setSpeedBoost(true);
            setPowerUpTimer(150); // 150 game cycles ≈ 18 seconds at 120ms per cycle
            break;
          case "bonus":
            scoreBonus = 20;
            // Bonus extends snake by 2 segments instead of 1
            newSnake.push(prev.snake[prev.snake.length - 1] || newHead);
            break;
        }

        setSpecialFood(null);

        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: prev.score + scoreBonus,
          direction: actualDirection,
        };
      }

      // Check regular food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: prev.score + 10,
          direction: actualDirection,
        };
      }

      // Remove tail if no food eaten
      newSnake.pop();

      return {
        ...prev,
        snake: newSnake,
        direction: actualDirection, // Update direction after successful move
      };
    });
  }, [
    gameState.gameOver,
    isPaused,
    generateFood,
    pendingDirection,
    directionQueue,
    specialFood,
  ]);

  const changeDirection = useCallback(
    (newDirection: "up" | "down" | "left" | "right") => {
      // Prevent reverse direction
      const opposites: Record<string, string> = {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
      };

      // Get the effective current direction (pending, queued, or actual)
      const currentDirection =
        directionQueue.length > 0
          ? directionQueue[directionQueue.length - 1]
          : pendingDirection || gameState.direction;

      // Don't allow reverse direction or same direction
      if (
        currentDirection &&
        (opposites[currentDirection] === newDirection ||
          currentDirection === newDirection)
      ) {
        return;
      }

      // Add to queue for ultra-responsive rapid key handling (max 2 directions in queue)
      setDirectionQueue(prev => {
        const newQueue = [...prev, newDirection];
        return newQueue.slice(-2); // Keep only last 2 directions for responsiveness
      });
    },
    [gameState.direction, pendingDirection, directionQueue]
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
    setPendingDirection(null);
    setDirectionQueue([]); // Clear direction queue for fresh start
    setNameInputDisabled(false);
    setShowEditIcon(false);
    setSpecialFood(null);
    setSpeedBoost(false);
    setPowerUpTimer(0);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Handle game over and show name input
  const handleGameOver = useCallback(async () => {
    audioService.playGameOver();

    // Freeze the snake and show collision animation
    // Don't change game state immediately - let the animation play
    setTimeout(() => {
      setGameStarted(false);
      setNameInputDisabled(false); // Allow name editing after game over
      setShowEditIcon(false); // Hide edit icon initially

      if (gameState.score > 0) {
        setShowNameInput(true);
      } else {
        setShowLeaderboard(true);
        // Load leaderboard directly without circular dependency
        (async () => {
          if (process.env.NODE_ENV === "test") return;
          try {
            const [topScores, chronologicalRecent] = await Promise.all([
              getTopScores(10),
              getRecentScores(5),
            ]);
            setLeaderboard(topScores);
            setRecentScores(chronologicalRecent);
          } catch {
            // Silently handle errors
          }
        })();
      }
    }, 2500); // Longer delay for better game over experience
  }, [gameState.score]); // Removed loadLeaderboard dependency

  // Handle game over
  useEffect(() => {
    if (gameState.gameOver && gameStarted) {
      handleGameOver();
    }
  }, [gameState.gameOver, gameStarted, handleGameOver]);

  // Submit score to leaderboard with socket optimization
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

          // Emit new score to realtime service for real-time updates
          realtimeService.emitNewScore(playerName.trim(), gameState.score);

          // Only load leaderboard once instead of multiple calls
          const [topScores, stats] = await Promise.all([
            getTopScores(10),
            getPlayerStats(playerName.trim()),
          ]);

          React.startTransition(() => {
            setLeaderboard(topScores);
            setPlayerStats(stats);
          });

          // Update recent scores only if realtime is not handling it
          if (realtimeService.isFallbackMode()) {
            await updateRecentScores();
          }

          // Disable name input and show edit icon
          setNameInputDisabled(true);
          setShowEditIcon(true);
        }
      } catch {
        // Silently handle errors
      }
    }

    React.startTransition(() => {
      setShowNameInput(false);
      setShowLeaderboard(true);
    });
  }, [playerName, gameState.score, updateRecentScores]);

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

  // Handle name editing functionality
  const enableNameEdit = useCallback(() => {
    setNameInputDisabled(false);
    setShowEditIcon(false);
  }, []);

  const saveNameEdit = useCallback(() => {
    if (
      playerName.trim() &&
      playerName.trim().length >= 2 &&
      playerName.trim().length <= 20
    ) {
      setNameInputDisabled(true);
      setShowEditIcon(true);
    }
  }, [playerName]);

  // Handle power-up timer countdown
  useEffect(() => {
    if (powerUpTimer > 0) {
      const timer = setTimeout(() => {
        setPowerUpTimer(prev => {
          if (prev <= 1) {
            setSpeedBoost(false);
            return 0;
          }
          return prev - 1;
        });
      }, 100); // Faster countdown for power-ups

      return () => clearTimeout(timer);
    }

    return () => {}; // Always return a cleanup function
  }, [powerUpTimer]);

  // Game loop with speed boost - ULTRA OPTIMIZED for buttery-smooth gameplay
  useEffect(() => {
    if (!gameStarted || gameState.gameOver || isPaused) return;

    // Ultra-fast refresh rate for maximum responsiveness and smoothness
    const gameSpeed = speedBoost ? 60 : 100; // Even faster for zero-lag experience
    const gameInterval = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameStarted, gameState.gameOver, isPaused, speedBoost]);

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
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  startGameWithName();
                }
              }}
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
            <div className="relative">
              <input
                type="text"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitScore();
                  }
                }}
                onBlur={saveNameEdit}
                placeholder="Your name (2-20 characters)"
                minLength={2}
                maxLength={20}
                disabled={nameInputDisabled}
                className={`w-64 rounded border border-green-400/40 bg-gray-900 px-4 py-2 pr-10 text-white focus:border-green-400 focus:outline-none ${
                  nameInputDisabled ? "cursor-not-allowed opacity-70" : ""
                }`}
                autoFocus={!nameInputDisabled}
              />
              {showEditIcon && (
                <button
                  onClick={enableNameEdit}
                  className="absolute top-1/2 right-2 -translate-y-1/2 transform text-blue-400 transition-colors hover:text-blue-300"
                  title="Edit name"
                >
                  ✏️
                </button>
              )}
            </div>
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
              onClick={async () => {
                setShowNameInput(false);
                setShowLeaderboard(true);
                // Inline leaderboard loading to avoid dependency issues
                if (process.env.NODE_ENV !== "test") {
                  try {
                    const [topScores, chronologicalRecent] = await Promise.all([
                      getTopScores(10),
                      getRecentScores(5),
                    ]);
                    setLeaderboard(topScores);
                    setRecentScores(chronologicalRecent);
                  } catch {
                    // Silently handle errors
                  }
                }
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
          {/* Simple Recent Scores Display */}
          {recentScores.length > 0 && (
            <div className="absolute top-4 right-4 min-w-[200px] rounded border border-purple-400/40 bg-purple-400/10 p-3 text-xs backdrop-blur-sm">
              <h4 className="mb-2 font-bold text-purple-400">Recent Scores</h4>
              <div className="space-y-1">
                {recentScores
                  .sort((a, b) => b.score - a.score) // Sort by score descending
                  .slice(0, 5)
                  .map((entry, index) => {
                    const isCurrentPlayer =
                      playerName && entry.playerName === playerName.trim();

                    return (
                      <div
                        key={`recent-${entry.playerName}-${entry.timestamp}-${index}`}
                        className={`flex items-center justify-between rounded p-1 ${
                          isCurrentPlayer
                            ? "border border-blue-400/50 bg-blue-500/20"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-400">
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

                {/* Show current player's live score if they're playing */}
                {gameStarted &&
                  !gameState.gameOver &&
                  playerName &&
                  gameState.score > 0 && (
                    <div className="mt-2 border-t border-purple-400/30 pt-2">
                      <div className="flex items-center justify-between rounded border border-green-400/50 bg-green-500/20 p-1">
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
              {speedBoost && (
                <span className="animate-pulse font-bold text-blue-400">
                  ⚡ SPEED BOOST! ({Math.ceil(powerUpTimer / 8)}s)
                </span>
              )}
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
                  const isSpecialFood =
                    specialFood && specialFood.x === x && specialFood.y === y;
                  const isCollision =
                    collisionPosition &&
                    collisionPosition.x === x &&
                    collisionPosition.y === y;

                  let cellClass = "h-full w-full border border-gray-700 ";

                  if (isCollision && gameState.gameOver) {
                    cellClass +=
                      collisionType === "wall"
                        ? "animate-pulse bg-red-600 shadow-lg shadow-red-500/50"
                        : "animate-pulse bg-orange-600 shadow-lg shadow-orange-500/50";
                  } else if (isSpecialFood) {
                    switch (specialFood?.type) {
                      case "golden":
                        cellClass +=
                          "bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50";
                        break;
                      case "speed":
                        cellClass +=
                          "bg-blue-400 animate-bounce shadow-lg shadow-blue-400/50";
                        break;
                      case "bonus":
                        cellClass +=
                          "bg-purple-400 animate-spin shadow-lg shadow-purple-400/50";
                        break;
                    }
                  } else if (isFood) {
                    cellClass += "bg-red-400";
                  } else if (isHead && gameState.gameOver) {
                    cellClass += "animate-pulse bg-red-500";
                  } else if (isHead) {
                    cellClass += speedBoost
                      ? "bg-blue-300 animate-pulse"
                      : "bg-green-300";
                  } else if (isSnake) {
                    cellClass += gameState.gameOver
                      ? "bg-red-400/80"
                      : speedBoost
                        ? "bg-blue-400"
                        : "bg-green-400";
                  } else {
                    cellClass += "bg-gray-800";
                  }

                  return <div key={index} className={cellClass} />;
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

            {/* Enhanced Game Over Overlay */}
            {gameState.gameOver && gameStarted && (
              <>
                {/* Game Over text above snake head */}
                {gameState.snake[0] && (
                  <div
                    className="absolute z-10 animate-bounce text-center"
                    style={{
                      left: `${(gameState.snake[0].x / BOARD_SIZE.width) * 100}%`,
                      top: `${(gameState.snake[0].y / BOARD_SIZE.height) * 100 - 15}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="text-lg font-bold text-red-400 drop-shadow-lg">
                      💀 GAME OVER!
                    </div>
                  </div>
                )}

                {/* Full overlay with details */}
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/70">
                  <div className="text-center">
                    <div className="mb-4 animate-pulse text-3xl font-bold text-red-400">
                      ☠️ GAME OVER! ☠️
                    </div>
                    <div className="mb-2 text-xl text-white">
                      Final Score:{" "}
                      <span className="font-bold text-green-400">
                        {gameState.score}
                      </span>
                    </div>
                    <div className="mb-4 text-sm text-gray-400">
                      {collisionType === "wall"
                        ? "🧱 Crashed into the wall!"
                        : "🐍 Snake ate itself!"}
                    </div>
                    <div className="animate-pulse text-sm text-yellow-400">
                      Processing your score...
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 text-center">
            {!isMobile ? (
              <div className="text-sm text-gray-400">
                <div>Use WASD or Arrow keys to move</div>
                <div>SPACE to pause • Q/ESC to quit • R to restart</div>
                <div className="mt-2 text-xs">
                  <span className="text-yellow-400">🌟 +25pts</span> •{" "}
                  <span className="text-blue-400">⚡ Speed</span> •{" "}
                  <span className="text-purple-400">💎 +Growth</span>
                </div>
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
              onClick={async () => {
                setShowLeaderboard(true);
                // Inline leaderboard loading to avoid dependency issues
                if (process.env.NODE_ENV !== "test") {
                  try {
                    const [topScores, chronologicalRecent] = await Promise.all([
                      getTopScores(10),
                      getRecentScores(5),
                    ]);
                    setLeaderboard(topScores);
                    setRecentScores(chronologicalRecent);
                  } catch {
                    // Silently handle errors
                  }
                }
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
