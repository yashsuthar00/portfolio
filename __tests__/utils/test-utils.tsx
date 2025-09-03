import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Common test utilities
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  global.ResizeObserver = mockResizeObserver;
  return mockResizeObserver;
};

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  global.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

export const mockWindowSize = (width = 1024, height = 768) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

export const waitForNextTick = () =>
  new Promise(resolve => setTimeout(resolve, 0));

// Test to prevent Jest warning about no tests
describe('Test Utils', () => {
  it('should export utility functions', () => {
    expect(mockResizeObserver).toBeDefined();
    expect(mockIntersectionObserver).toBeDefined();
    expect(mockMatchMedia).toBeDefined();
    expect(mockWindowSize).toBeDefined();
    expect(waitForNextTick).toBeDefined();
  });
});
