import { renderHook, act } from '@testing-library/react';
import { useResponsive } from '../useResponsive';

// Mock window.innerWidth and innerHeight
const mockWindowSize = (width: number, height: number) => {
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

// Mock addEventListener and removeEventListener
const mockEventListener = () => {
  const listeners: { [key: string]: any[] } = {};

  (window.addEventListener as any) = jest.fn((event: string, callback: any) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  });

  (window.removeEventListener as any) = jest.fn(
    (event: string, callback: any) => {
      if (listeners[event]) {
        const index = listeners[event].indexOf(callback);
        if (index > -1) listeners[event].splice(index, 1);
      }
    }
  );

  return {
    trigger: (event: string) => {
      if (listeners[event]) {
        listeners[event].forEach(callback => callback(new Event(event)));
      }
    },
    listeners,
  };
};

describe('useResponsive', () => {
  let eventMock: ReturnType<typeof mockEventListener>;

  beforeEach(() => {
    eventMock = mockEventListener();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return mobile state for width < 768px', () => {
    mockWindowSize(767, 1000);

    const { result } = renderHook(() => useResponsive());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isLarge).toBe(false);
    expect(result.current.width).toBe(767);
    expect(result.current.height).toBe(1000);
  });

  it('should return tablet state for width between 768px and 1023px', () => {
    mockWindowSize(800, 600);

    const { result } = renderHook(() => useResponsive());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isLarge).toBe(false);
    expect(result.current.width).toBe(800);
    expect(result.current.height).toBe(600);
  });

  it('should return desktop state for width between 1024px and 1439px', () => {
    mockWindowSize(1200, 800);

    const { result } = renderHook(() => useResponsive());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isLarge).toBe(false);
    expect(result.current.width).toBe(1200);
    expect(result.current.height).toBe(800);
  });

  it('should return large state for width >= 1440px', () => {
    mockWindowSize(1920, 1080);

    const { result } = renderHook(() => useResponsive());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isLarge).toBe(true);
    expect(result.current.width).toBe(1920);
    expect(result.current.height).toBe(1080);
  });

  it('should update state when window is resized', () => {
    mockWindowSize(500, 800);

    const { result } = renderHook(() => useResponsive());

    // Initial state should be mobile
    expect(result.current.isMobile).toBe(true);
    expect(result.current.width).toBe(500);

    // Change window size and trigger resize
    act(() => {
      mockWindowSize(1200, 800);
      eventMock.trigger('resize');
    });

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.width).toBe(1200);
  });

  it('should add and remove event listener correctly', () => {
    const { unmount } = renderHook(() => useResponsive());

    // Check that event listener was added
    expect(window.addEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    // Unmount and check that event listener was removed
    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });

  it('should handle edge cases for breakpoints', () => {
    // Test exact breakpoint values
    mockWindowSize(768, 600);
    const { result: tabletResult } = renderHook(() => useResponsive());
    expect(tabletResult.current.isTablet).toBe(true);
    expect(tabletResult.current.isMobile).toBe(false);

    mockWindowSize(1024, 600);
    const { result: desktopResult } = renderHook(() => useResponsive());
    expect(desktopResult.current.isDesktop).toBe(true);
    expect(desktopResult.current.isTablet).toBe(false);

    mockWindowSize(1440, 600);
    const { result: largeResult } = renderHook(() => useResponsive());
    expect(largeResult.current.isLarge).toBe(true);
    expect(largeResult.current.isDesktop).toBe(false);
  });

  it('should handle zero or negative dimensions', () => {
    mockWindowSize(0, 0);

    const { result } = renderHook(() => useResponsive());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);
  });

  it('should handle very large dimensions', () => {
    mockWindowSize(9999, 9999);

    const { result } = renderHook(() => useResponsive());

    expect(result.current.isLarge).toBe(true);
    expect(result.current.width).toBe(9999);
    expect(result.current.height).toBe(9999);
  });
});
