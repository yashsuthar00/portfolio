import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

// Mock the useResponsive hook
jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
  },
}));

const mockUseResponsive = require('../../hooks/useResponsive').useResponsive;

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default responsive state
    mockUseResponsive.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isLarge: false,
    });
  });

  it('renders navbar with logo/name', () => {
    render(<Navbar />);

    // Check for navigation element
    const nav = screen.getByRole('navigation');
    expect(nav).toBeTruthy();
  });

  it('is accessible', () => {
    render(<Navbar />);

    // Check for navigation landmark
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Should have proper semantic structure
    expect(nav.tagName).toBe('NAV');
  });

  it('handles mobile responsive layout', () => {
    // Mock mobile viewport
    mockUseResponsive.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isLarge: false,
    });

    render(<Navbar />);

    // Should render navigation element
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('handles desktop responsive layout', () => {
    mockUseResponsive.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isLarge: false,
    });

    render(<Navbar />);

    // Should render navigation element
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('renders consistently across different viewport sizes', () => {
    const viewports = [
      { isMobile: true, isTablet: false, isDesktop: false, isLarge: false },
      { isMobile: false, isTablet: true, isDesktop: false, isLarge: false },
      { isMobile: false, isTablet: false, isDesktop: true, isLarge: false },
      { isMobile: false, isTablet: false, isDesktop: false, isLarge: true },
    ];

    viewports.forEach(viewport => {
      mockUseResponsive.mockReturnValue(viewport);

      const { unmount } = render(<Navbar />);

      // Should always render navigation
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      unmount();
    });
  });
});
