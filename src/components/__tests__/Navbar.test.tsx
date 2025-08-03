import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../Navbar";

// Mock TypeAnimation component
jest.mock("react-type-animation", () => ({
  TypeAnimation: () => <span>Yash Suthar</span>,
}));

describe("Navbar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders navbar with brand name", () => {
    render(<Navbar />);

    // Check if navbar is rendered
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    // Check if brand name is present (initially static)
    expect(screen.getByText("Yash Suthar")).toBeInTheDocument();
  });

  it("renders job title", () => {
    render(<Navbar />);

    expect(screen.getByText("Software Developer")).toBeInTheDocument();
  });

  it("renders tagline", () => {
    render(<Navbar />);

    expect(
      screen.getByText("Code Enthusiast's Playground")
    ).toBeInTheDocument();
  });

  it("triggers animation after mount", () => {
    render(<Navbar />);

    // Initially should show static text
    expect(screen.getByText("Yash Suthar")).toBeInTheDocument();

    // Fast-forward past the animation trigger delay
    act(() => {
      jest.advanceTimersByTime(600);
    });

    // TypeAnimation should now be active (mocked to show same text)
    expect(screen.getByText("Yash Suthar")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const customClass = "custom-navbar-class";
    render(<Navbar className={customClass} />);

    const navbar = screen.getByRole("navigation");
    expect(navbar).toHaveClass(customClass);
  });

  it("has proper styling classes", () => {
    render(<Navbar />);

    const navbar = screen.getByRole("navigation");
    expect(navbar).toHaveClass(
      "border-b",
      "border-green-400/20",
      "bg-black/90"
    );
  });

  it("has responsive design classes", () => {
    render(<Navbar />);

    // Check for responsive padding classes
    const container = screen.getByRole("navigation").querySelector(".mx-auto");
    expect(container).toHaveClass("max-w-7xl", "px-4", "sm:px-6", "lg:px-8");
  });

  it("hides job title on small screens", () => {
    render(<Navbar />);

    const jobTitle = screen.getByText("Software Developer");
    expect(jobTitle).toHaveClass("hidden", "sm:block");
  });

  it("cleans up timer on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { unmount } = render(<Navbar />);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
