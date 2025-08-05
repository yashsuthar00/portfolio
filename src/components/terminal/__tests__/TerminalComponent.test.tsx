import { render, screen } from "@testing-library/react";
import TerminalComponent from "@/components/terminal/TerminalComponent";

// Mock the useTerminal hook
const mockExecuteCommand = jest.fn();
jest.mock("@/hooks/useTerminal", () => ({
  __esModule: true,
  default: () => ({
    session: {
      history: [],
      output: [],
      currentDirectory: "~",
      user: "yash",
      hostname: "portfolio",
    },
    executeCommand: mockExecuteCommand,
  }),
}));

describe("TerminalComponent", () => {
  beforeEach(() => {
    mockExecuteCommand.mockClear();
  });

  it("should render terminal container", () => {
    render(<TerminalComponent />);

    // Check that the component renders without errors
    expect(document.querySelector(".relative")).toBeTruthy();
  });

  it("should show loading indicator initially", () => {
    render(<TerminalComponent />);

    expect(screen.getByText("Initializing terminal...")).toBeDefined();
  });

  it("should have proper CSS classes", () => {
    render(<TerminalComponent />);

    const container = document.querySelector(".relative.h-full.w-full");
    expect(container).toBeTruthy();
  });
});
