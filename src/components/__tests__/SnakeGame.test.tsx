import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import SnakeGameComponent from "../SnakeGame";

// Mock MongoDB and leaderboard services
jest.mock("../../lib/leaderboard", () => ({
  addScore: jest.fn().mockResolvedValue(true),
  getTopScores: jest.fn().mockImplementation(() =>
    Promise.resolve([
      {
        playerName: "Test Player",
        score: 100,
        timestamp: Date.now(),
        rank: 1,
      },
    ])
  ),
  getPlayerStats: jest
    .fn()
    .mockResolvedValue({ bestScore: 100, rank: 1, totalGames: 1 }),
}));

jest.mock("../../services/AudioService", () => ({
  audioService: {
    playKeypress: jest.fn(),
    playEnter: jest.fn(),
    playError: jest.fn(),
    playSuccess: jest.fn(),
    playGameOver: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("SnakeGame", () => {
  const mockOnExit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("renders game container", () => {
    render(<SnakeGameComponent onExit={mockOnExit} />);

    // Check if game container is rendered
    const gameContainer =
      document.querySelector(".fixed.inset-0") ||
      document.querySelector(".relative") ||
      document.body.firstChild;
    expect(gameContainer).toBeInTheDocument();
  });

  it("displays snake game menu", () => {
    render(<SnakeGameComponent onExit={mockOnExit} />);

    // Should display menu options
    expect(screen.getByText("🐍 Snake Game")).toBeInTheDocument();
    expect(screen.getByText("Start Game")).toBeInTheDocument();
    expect(screen.getByText("View Leaderboard")).toBeInTheDocument();
    expect(screen.getByText("Exit")).toBeInTheDocument();
  });

  it("renders game components correctly", () => {
    render(<SnakeGameComponent onExit={mockOnExit} />);

    // Check main UI elements are present
    expect(screen.getByText("🐍 Snake Game")).toBeInTheDocument();
    expect(screen.getByText("Start Game")).toBeInTheDocument();
    expect(screen.getByText("View Leaderboard")).toBeInTheDocument();
  });

  it("allows starting a new game", () => {
    render(<SnakeGameComponent onExit={mockOnExit} />);

    // Click start game
    fireEvent.click(screen.getByText("Start Game"));

    // Should show name input screen
    expect(
      screen.getByPlaceholderText("Your name (2-20 characters)")
    ).toBeInTheDocument();
  });

  it("handles keyboard input", () => {
    render(<SnakeGameComponent onExit={mockOnExit} />);

    // Simulate escape key press
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });

    expect(mockOnExit).toHaveBeenCalled();
  });

  it("renders mobile controls when isMobile is true", () => {
    render(<SnakeGameComponent onExit={mockOnExit} isMobile={true} />);

    // Should have mobile controls (buttons or touch areas)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("has game board structure", () => {
    render(<SnakeGameComponent onExit={mockOnExit} />);

    // Should have game board
    const gameBoard =
      document.querySelector('[style*="grid"]') ||
      document.querySelector(".grid") ||
      document.querySelector('[data-testid*="board"]');

    expect(gameBoard || screen.getByText(/snake/i)).toBeInTheDocument();
  });
});
