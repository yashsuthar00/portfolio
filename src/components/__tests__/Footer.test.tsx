import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "../Footer";

// Mock the portfolio data
jest.mock("@/data/portfolio", () => ({
  portfolioData: {
    socialLinks: [
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/test",
        username: "test",
      },
      { platform: "GitHub", url: "https://github.com/test", username: "test" },
      {
        platform: "LeetCode",
        url: "https://leetcode.com/test",
        username: "test",
      },
      {
        platform: "Codeforces",
        url: "https://codeforces.com/profile/test",
        username: "test",
      },
    ],
  },
}));

// Mock scroll functions
Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
});

describe("Footer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date to ensure consistent time testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-15T10:30:45"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders footer with live time", () => {
    render(<Footer />);

    // Check if footer is rendered
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    // Check if initial time is displayed
    expect(screen.getByText("10:30:45")).toBeInTheDocument();
  });

  it("updates time every second", () => {
    render(<Footer />);

    // Initial time
    expect(screen.getByText("10:30:45")).toBeInTheDocument();

    // Fast-forward 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText("10:30:46")).toBeInTheDocument();

    // Fast-forward another second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText("10:30:47")).toBeInTheDocument();
  });

  it("renders social links correctly", () => {
    render(<Footer />);

    // Check if social links are rendered using screen reader text
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LeetCode")).toBeInTheDocument();
    expect(screen.getByText("Codeforces")).toBeInTheDocument();
  });

  it("displays current time", () => {
    render(<Footer />);

    // Check for time display
    expect(screen.getByText("10:30:45")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const customClass = "custom-footer-class";
    render(<Footer className={customClass} />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass(customClass);
  });

  it("cleans up timer on unmount", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    const { unmount } = render(<Footer />);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
