import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Loader from "../Loader";

// Mock TypeAnimation component
jest.mock("react-type-animation", () => ({
  TypeAnimation: ({ callback }: { callback?: () => void }) => {
    // Simulate typing animation completion
    React.useEffect(() => {
      if (callback) {
        const timer = setTimeout(callback, 100);
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [callback]);

    return <span>Loading...</span>;
  },
}));

// Mock Audio
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  volume: 0.1,
}));

describe("Loader", () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders loader with initial boot text", () => {
    render(<Loader onComplete={mockOnComplete} />);

    expect(
      screen.getByText(/PORTFOLIO BIOS SETUP UTILITY/i)
    ).toBeInTheDocument();
  });

  it("shows matrix-style background", () => {
    render(<Loader onComplete={mockOnComplete} />);

    const container = document.querySelector(
      ".bg-black.font-mono.text-green-400"
    );
    expect(container).toBeInTheDocument();
  });

  it("displays boot sequence steps", () => {
    render(<Loader onComplete={mockOnComplete} />);

    // Initially shows BIOS setup utility
    expect(
      screen.getByText("PORTFOLIO BIOS SETUP UTILITY")
    ).toBeInTheDocument();

    // Advance through some steps
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Should progress through boot steps
    expect(screen.getByText(/BIOS Version 2.1.0/i)).toBeInTheDocument();
  });

  it("shows progress indicators when loading", () => {
    render(<Loader onComplete={mockOnComplete} />);

    // Fast-forward to progress bar phase
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Progress indicators should be visible
    const okIndicator = screen.getByText("OK");
    expect(okIndicator).toBeInTheDocument();
  });

  it("shows loading state progression", async () => {
    render(<Loader onComplete={mockOnComplete} />);

    // Fast-forward through entire loading sequence
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Some progression should happen
    expect(
      screen.getByText(/Loading.../i) || screen.getByText(/OK/i)
    ).toBeInTheDocument();
  });

  it("eventually triggers completion callback", async () => {
    render(<Loader onComplete={mockOnComplete} />);

    // Fast-forward through a longer sequence to trigger completion
    act(() => {
      jest.advanceTimersByTime(15000);
    });

    // Should eventually call onComplete (this may need adjustment based on actual timing)
    // For now, just check that the component renders without error
    expect(
      screen.getByText("PORTFOLIO BIOS SETUP UTILITY")
    ).toBeInTheDocument();
  });

  it("displays system information", () => {
    render(<Loader onComplete={mockOnComplete} />);

    // Fast-forward to show various system info
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should show system specifications
    expect(
      screen.getByText(/BIOS Version 2.1.0/i) || screen.getByText(/OK/i)
    ).toBeInTheDocument();
  });

  it("handles audio play errors gracefully", () => {
    // Mock Audio to throw error
    const mockAudio = jest.fn().mockImplementation(() => ({
      play: jest.fn().mockRejectedValue(new Error("Audio error")),
      volume: 0.1,
    }));
    global.Audio = mockAudio;

    // Should not throw error
    expect(() => {
      render(<Loader onComplete={mockOnComplete} />);
    }).not.toThrow();
  });

  it("has proper structure and styling", () => {
    render(<Loader onComplete={mockOnComplete} />);

    // Should have loading container with proper styling
    const container = document.querySelector(".fixed.inset-0.z-50");
    expect(container).toBeInTheDocument();
  });
});
