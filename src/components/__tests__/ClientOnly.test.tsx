import { render, screen } from '@testing-library/react';
import ClientOnly from '../ClientOnly';

describe('ClientOnly', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders fallback content during SSR', () => {
    const mockUseState = jest.spyOn(require('react'), 'useState');
    mockUseState.mockImplementation(() => [false, jest.fn()]);

    render(
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>Client content</div>
      </ClientOnly>
    );

    expect(screen.getByText('Loading...')).toBeTruthy();
    expect(screen.queryByText('Client content')).toBeNull();

    mockUseState.mockRestore();
  });

  it('renders children after hydration', () => {
    const mockUseState = jest.spyOn(require('react'), 'useState');
    mockUseState.mockImplementation(() => [true, jest.fn()]);

    render(
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>Client content</div>
      </ClientOnly>
    );

    expect(screen.getByText('Client content')).toBeTruthy();
    expect(screen.queryByText('Loading...')).toBeNull();

    mockUseState.mockRestore();
  });

  it('renders null fallback when no fallback provided', () => {
    const mockUseState = jest.spyOn(require('react'), 'useState');
    mockUseState.mockImplementation(() => [false, jest.fn()]);

    const { container } = render(
      <ClientOnly>
        <div>Client content</div>
      </ClientOnly>
    );

    expect(container.firstChild).toBeNull();

    mockUseState.mockRestore();
  });

  it('calls useEffect to set mounted state', () => {
    const mockSetHasMounted = jest.fn();
    const mockUseState = jest.spyOn(require('react'), 'useState');
    const mockUseEffect = jest.spyOn(require('react'), 'useEffect');

    mockUseState.mockImplementation(() => [false, mockSetHasMounted]);
    mockUseEffect.mockImplementation((callback: any) => callback());

    render(
      <ClientOnly>
        <div>Client content</div>
      </ClientOnly>
    );

    expect(mockSetHasMounted).toHaveBeenCalledWith(true);

    mockUseState.mockRestore();
    mockUseEffect.mockRestore();
  });
});
