import React from "react";
import { render, screen } from "@testing-library/react";
import MatrixRain from "@/components/MatrixRain";

// Mock canvas with all required methods
const mockCanvasContext = {
  fillStyle: "",
  fillRect: jest.fn(),
  fillText: jest.fn(),
  clearRect: jest.fn(),
  font: "",
  save: jest.fn(),
  restore: jest.fn(),
  shadowColor: "",
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  globalAlpha: 1,
  measureText: jest.fn(() => ({ width: 10 })),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  rect: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  clip: jest.fn(),
};

const mockGetContext = jest.fn().mockReturnValue(mockCanvasContext);

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: mockGetContext,
});

describe("MatrixRain", () => {
  const mockOnExit = jest.fn();

  beforeEach(() => {
    mockOnExit.mockClear();
    mockGetContext.mockClear();
  });

  it("should render matrix rain canvas", () => {
    render(<MatrixRain onExit={mockOnExit} />);

    const canvas = document.querySelector("canvas");
    expect(canvas).toBeDefined();
  });

  it("should show exit instructions", () => {
    render(<MatrixRain onExit={mockOnExit} />);

    expect(
      screen.getByText(/Press Q, ESC, or type.*exit.*to return to terminal/)
    ).toBeDefined();
  });

  it("should initialize canvas context", () => {
    render(<MatrixRain onExit={mockOnExit} />);

    expect(mockGetContext).toHaveBeenCalledWith("2d");
  });
});
