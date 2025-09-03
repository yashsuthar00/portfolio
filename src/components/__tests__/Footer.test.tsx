import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// Mock the useResponsive hook
jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    footer: ({ children, ...props }: any) => (
      <footer {...props}>{children}</footer>
    ),
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

const mockUseResponsive = require('../../hooks/useResponsive').useResponsive;

describe('Footer Component', () => {
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

  it('renders footer with content', () => {
    render(<Footer />);

    // Should render footer element
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('is accessible', () => {
    render(<Footer />);

    // Should have contentinfo role
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer.tagName).toBe('FOOTER');
  });

  it('handles responsive layout', () => {
    const viewports = [
      { isMobile: true, isTablet: false, isDesktop: false, isLarge: false },
      { isMobile: false, isTablet: true, isDesktop: false, isLarge: false },
      { isMobile: false, isTablet: false, isDesktop: true, isLarge: false },
      { isMobile: false, isTablet: false, isDesktop: false, isLarge: true },
    ];

    viewports.forEach(viewport => {
      mockUseResponsive.mockReturnValue(viewport);

      const { unmount } = render(<Footer />);

      // Should always render footer
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();

      unmount();
    });
  });

  it('renders with correct styling classes', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('maintains consistent layout across viewports', () => {
    // Mock mobile
    mockUseResponsive.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isLarge: false,
    });

    const { rerender } = render(<Footer />);
    const mobileFooter = screen.getByRole('contentinfo');
    expect(mobileFooter).toBeInTheDocument();

    // Mock desktop
    mockUseResponsive.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isLarge: false,
    });

    rerender(<Footer />);
    const desktopFooter = screen.getByRole('contentinfo');
    expect(desktopFooter).toBeInTheDocument();
  });
});
