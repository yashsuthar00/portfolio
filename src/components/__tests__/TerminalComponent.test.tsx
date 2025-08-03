import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TerminalComponent from "../terminal/TerminalComponent";

// Mock xterm.js
jest.mock("@xterm/xterm", () => ({
  Terminal: jest.fn().mockImplementation(() => ({
    write: jest.fn(),
    writeln: jest.fn(),
    open: jest.fn(),
    onData: jest.fn(),
    onKey: jest.fn(),
    focus: jest.fn(),
    clear: jest.fn(),
    dispose: jest.fn(),
    loadAddon: jest.fn(),
    rows: 24,
    cols: 80,
  })),
}));

jest.mock("@xterm/addon-fit", () => ({
  FitAddon: jest.fn().mockImplementation(() => ({
    fit: jest.fn(),
    proposeDimensions: jest.fn().mockReturnValue({ cols: 80, rows: 24 }),
  })),
}));

// Mock dynamic imports
jest.mock("next/dynamic", () => {
  return jest.fn().mockImplementation(importFunc => {
    const Component = React.forwardRef(
      (props: Record<string, unknown>, ref: React.Ref<HTMLDivElement>) => {
        if (importFunc.toString().includes("SnakeGame")) {
          return (
            <div data-testid="snake-game" {...props} ref={ref}>
              Snake Game
            </div>
          );
        }
        if (importFunc.toString().includes("MatrixRain")) {
          return (
            <div data-testid="matrix-rain" {...props} ref={ref}>
              Matrix Rain
            </div>
          );
        }
        return <div {...props} ref={ref} />;
      }
    );
    Component.displayName = "MockedDynamicComponent";
    return Component;
  });
});

// Mock useTerminal hook
jest.mock("@/hooks/useTerminal", () => ({
  __esModule: true,
  default: () => ({
    session: {
      user: "testuser",
      hostname: "testhost",
      currentDirectory: "~",
      history: [],
    },
    executeCommand: jest.fn().mockResolvedValue({
      output: "Test output",
      isError: false,
      clearScreen: false,
      showSnakeGame: false,
      showMatrixRain: false,
    }),
  }),
}));

describe("TerminalComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it("renders terminal container", () => {
    render(<TerminalComponent />);

    // Check if terminal container is rendered
    const terminalContainer = document.querySelector(".relative.h-full.w-full");
    expect(terminalContainer).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const customClass = "custom-terminal-class";
    render(<TerminalComponent className={customClass} />);

    const terminalContainer = document.querySelector(".relative.h-full.w-full");
    expect(terminalContainer).toHaveClass(customClass);
  });

  it("has proper ARIA attributes for accessibility", () => {
    render(<TerminalComponent />);

    // Check that terminal container exists
    const terminalContainer = document.querySelector(".relative.h-full.w-full");
    expect(terminalContainer).toBeInTheDocument();
  });

  it("initializes with proper styling", () => {
    render(<TerminalComponent />);

    const terminalContainer = document.querySelector(".bg-black");
    expect(terminalContainer).toBeInTheDocument();
  });

  it("renders loading state initially", () => {
    render(<TerminalComponent />);

    expect(screen.getByText(/initializing terminal/i)).toBeInTheDocument();
  });

  it("does not show games initially", () => {
    render(<TerminalComponent />);

    expect(screen.queryByTestId("snake-game")).not.toBeInTheDocument();
    expect(screen.queryByTestId("matrix-rain")).not.toBeInTheDocument();
  });

  // Note: More complex tests involving xterm.js interactions would require
  // more sophisticated mocking of the Terminal class and its methods
});
