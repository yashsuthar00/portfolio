import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Web APIs
Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: callback => setTimeout(callback, 16),
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: id => clearTimeout(id),
});

// Mock three.js
jest.mock('three', () => ({
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
    domElement: document.createElement('canvas'),
  })),
  Scene: jest.fn(),
  PerspectiveCamera: jest.fn(),
  Vector3: jest.fn(),
  Group: jest.fn(),
  Mesh: jest.fn(),
  BoxGeometry: jest.fn(),
  MeshBasicMaterial: jest.fn(),
}));

// Mock @react-three/fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }) => (
    <div data-testid='canvas' {...props}>
      {children}
    </div>
  ),
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({
    camera: {},
    scene: {},
    gl: {},
  })),
}));

// Mock @react-three/drei
jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid='orbit-controls' />,
  PerspectiveCamera: () => <div data-testid='perspective-camera' />,
  Text: ({ children, ...props }) => (
    <div data-testid='text' {...props}>
      {children}
    </div>
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock xterm.js
jest.mock('@xterm/xterm', () => ({
  Terminal: jest.fn().mockImplementation(() => ({
    open: jest.fn(),
    write: jest.fn(),
    writeln: jest.fn(),
    clear: jest.fn(),
    dispose: jest.fn(),
    onData: jest.fn(),
    onKey: jest.fn(),
    loadAddon: jest.fn(),
  })),
}));

jest.mock('@xterm/addon-fit', () => ({
  FitAddon: jest.fn().mockImplementation(() => ({
    fit: jest.fn(),
    proposeDimensions: jest.fn(),
  })),
}));

jest.mock('@xterm/addon-unicode11', () => ({
  Unicode11Addon: jest.fn(),
}));
