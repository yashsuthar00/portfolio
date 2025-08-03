"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { SnakeGame } from '@/types';

interface SnakeGameComponentProps {
  onExit: () => void;
  isMobile?: boolean;
}

const BOARD_SIZE = { width: 20, height: 15 };
const INITIAL_SNAKE = [{ x: 10, y: 7 }];
const INITIAL_FOOD = { x: 15, y: 7 };

const SnakeGameComponent: React.FC<SnakeGameComponentProps> = ({ onExit, isMobile = false }) => {
  const [gameState, setGameState] = useState<SnakeGame>({
    snake: INITIAL_SNAKE,
    food: INITIAL_FOOD,
    direction: 'right',
    score: 0,
    gameOver: false,
    boardSize: BOARD_SIZE
  });

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score
  useEffect(() => {
    if (gameState.score > highScore) {
      setHighScore(gameState.score);
      localStorage.setItem('snake-high-score', gameState.score.toString());
    }
  }, [gameState.score, highScore]);

  const generateFood = useCallback((snake: { x: number; y: number }[]): { x: number; y: number } => {
    let newFood: { x: number; y: number };
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE.width),
        y: Math.floor(Math.random() * BOARD_SIZE.height)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState.gameOver || isPaused) return;

    setGameState(prev => {
      const head = prev.snake[0];
      if (!head) return prev;

      let newHead: { x: number; y: number };

      switch (prev.direction) {
        case 'up':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'down':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'left':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'right':
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
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...prev, gameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];

      // Check food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: prev.score + 10
        };
      }

      // Remove tail if no food eaten
      newSnake.pop();

      return {
        ...prev,
        snake: newSnake
      };
    });
  }, [gameState.gameOver, isPaused, generateFood]);

  const changeDirection = useCallback((newDirection: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prev => {
      // Prevent reverse direction
      const opposites: Record<string, string> = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left'
      };

      if (opposites[prev.direction] === newDirection) {
        return prev;
      }

      return { ...prev, direction: newDirection };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: INITIAL_FOOD,
      direction: 'right',
      score: 0,
      gameOver: false,
      boardSize: BOARD_SIZE
    });
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Game loop
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          e.preventDefault();
          changeDirection('up');
          break;
        case 'arrowdown':
        case 's':
          e.preventDefault();
          changeDirection('down');
          break;
        case 'arrowleft':
        case 'a':
          e.preventDefault();
          changeDirection('left');
          break;
        case 'arrowright':
        case 'd':
          e.preventDefault();
          changeDirection('right');
          break;
        case ' ':
          e.preventDefault();
          togglePause();
          break;
        case 'q':
        case 'escape':
          e.preventDefault();
          onExit();
          break;
        case 'r':
          e.preventDefault();
          if (gameState.gameOver) {
            resetGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, togglePause, onExit, gameState.gameOver, resetGame]);

  // Touch controls for mobile
  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right'): void => {
    changeDirection(direction);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-green-400 mb-2">🐍 Snake Game</h2>
        <div className="flex justify-center space-x-6 text-sm">
          <span className="text-green-400">Score: {gameState.score}</span>
          <span className="text-yellow-400">High Score: {highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div 
          className="grid bg-gray-900 border-2 border-green-400 rounded-lg p-2"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE.width}, 1fr)`,
            gridTemplateRows: `repeat(${BOARD_SIZE.height}, 1fr)`,
            width: isMobile ? '300px' : '400px',
            height: isMobile ? '225px' : '300px'
          }}
        >
          {Array.from({ length: BOARD_SIZE.width * BOARD_SIZE.height }).map((_, index) => {
            const x = index % BOARD_SIZE.width;
            const y = Math.floor(index / BOARD_SIZE.width);
            
            const isSnake = gameState.snake.some(segment => segment.x === x && segment.y === y);
            const isHead = gameState.snake[0]?.x === x && gameState.snake[0]?.y === y;
            const isFood = gameState.food.x === x && gameState.food.y === y;

            return (
              <div
                key={index}
                className={`w-full h-full border border-gray-700 ${
                  isFood ? 'bg-red-400' : 
                  isHead ? 'bg-green-300' :
                  isSnake ? 'bg-green-400' : 
                  'bg-gray-800'
                }`}
              />
            );
          })}
        </div>

        {/* Game Over Overlay */}
        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="text-red-400 text-xl font-bold mb-2">Game Over!</div>
              <div className="text-green-400 mb-4">Final Score: {gameState.score}</div>
              <div className="space-x-4">
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-green-400 text-black rounded font-medium hover:bg-green-300 transition-colors"
                >
                  Play Again (R)
                </button>
                <button
                  onClick={onExit}
                  className="px-4 py-2 bg-gray-600 text-white rounded font-medium hover:bg-gray-500 transition-colors"
                >
                  Exit (Q)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && !gameState.gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="text-yellow-400 text-xl font-bold mb-2">Paused</div>
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
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div></div>
            <button
              onClick={() => handleSwipe('up')}
              className="w-12 h-12 bg-green-400/20 border border-green-400/40 rounded flex items-center justify-center text-green-400"
            >
              ↑
            </button>
            <div></div>
            <button
              onClick={() => handleSwipe('left')}
              className="w-12 h-12 bg-green-400/20 border border-green-400/40 rounded flex items-center justify-center text-green-400"
            >
              ←
            </button>
            <button
              onClick={togglePause}
              className="w-12 h-12 bg-yellow-400/20 border border-yellow-400/40 rounded flex items-center justify-center text-yellow-400 text-xs"
            >
              {isPaused ? '▶' : '⏸'}
            </button>
            <button
              onClick={() => handleSwipe('right')}
              className="w-12 h-12 bg-green-400/20 border border-green-400/40 rounded flex items-center justify-center text-green-400"
            >
              →
            </button>
            <div></div>
            <button
              onClick={() => handleSwipe('down')}
              className="w-12 h-12 bg-green-400/20 border border-green-400/40 rounded flex items-center justify-center text-green-400"
            >
              ↓
            </button>
            <button
              onClick={onExit}
              className="w-12 h-12 bg-red-400/20 border border-red-400/40 rounded flex items-center justify-center text-red-400 text-xs"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGameComponent;
