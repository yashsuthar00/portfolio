"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SnakeGame } from "@/types";
import {
  addScore,
  getTopScores,
  getPlayerStats,
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

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("snake-high-score");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

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
        return { ...prev, gameOver: true };
      }

      // Check self collision
      if (
        prev.snake.some(
          segment => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
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
      setGameState(prev => {
        // Prevent reverse direction
        const opposites: Record<string, string> = {
          up: "down",
          down: "up",
          left: "right",
          right: "left",
        };

        if (opposites[prev.direction] === newDirection) {
          return prev;
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
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Load leaderboard data
  const loadLeaderboard = useCallback(async () => {
    const topScores = await getTopScores(10);
    setLeaderboard(topScores);
  }, []);

  // Handle game over and show name input
  const handleGameOver = useCallback(async () => {
    audioService.playGameOver();
    setGameStarted(false);

    if (gameState.score > 0) {
      setShowNameInput(true);
    } else {
      setShowLeaderboard(true);
      await loadLeaderboard();
    }
  }, [gameState.score, loadLeaderboard]);

  // Submit score to leaderboard
  const submitScore = useCallback(async () => {
    if (playerName.trim() && gameState.score > 0) {
      const success = await addScore(playerName.trim(), gameState.score);
      if (success) {
        audioService.playSuccess();
        // Load updated leaderboard and player stats
        await loadLeaderboard();
        const stats = await getPlayerStats(playerName.trim());
        setPlayerStats(stats);
      }
    }
    setShowNameInput(false);
    setShowLeaderboard(true);
  }, [playerName, gameState.score, loadLeaderboard]);

  // Start game with name input
  const startGame = useCallback(() => {
    setShowNameInput(true);
  }, []);

  const startGameWithName = useCallback(() => {
    if (playerName.trim()) {
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

    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameStarted, gameState.gameOver, isPaused]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
          e.preventDefault();
          changeDirection("up");
          break;
        case "arrowdown":
        case "s":
          e.preventDefault();
          changeDirection("down");
          break;
        case "arrowleft":
        case "a":
          e.preventDefault();
          changeDirection("left");
          break;
        case "arrowright":
        case "d":
          e.preventDefault();
          changeDirection("right");
          break;
        case " ":
          e.preventDefault();
          togglePause();
          break;
        case "q":
        case "escape":
          e.preventDefault();
          onExit();
          break;
        case "r":
          e.preventDefault();
          if (gameState.gameOver) {
            resetGame();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [changeDirection, togglePause, onExit, gameState.gameOver, resetGame]);

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
              placeholder="Your name (optional)"
              maxLength={20}
              className="rounded border border-green-400/40 bg-gray-900 px-4 py-2 text-white focus:border-green-400 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="space-x-4">
            <button
              onClick={startGameWithName}
              className="rounded bg-green-400 px-6 py-2 font-medium text-black transition-colors hover:bg-green-300"
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
              placeholder="Your name"
              maxLength={20}
              className="rounded border border-green-400/40 bg-gray-900 px-4 py-2 text-white focus:border-green-400 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="space-x-4">
            <button
              onClick={submitScore}
              className="rounded bg-green-400 px-6 py-2 font-medium text-black transition-colors hover:bg-green-300"
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

                  return (
                    <div
                      key={index}
                      className={`h-full w-full border border-gray-700 ${
                        isFood
                          ? "bg-red-400"
                          : isHead
                            ? "bg-green-300"
                            : isSnake
                              ? "bg-green-400"
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
