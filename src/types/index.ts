// Global Types for Portfolio Project

export interface TerminalCommand {
  command: string;
  args: string[];
  description: string;
  category: 'portfolio' | 'system' | 'fun' | 'games';
  hidden?: boolean;
}

export interface CommandOutput {
  type: 'text' | 'html' | 'component';
  content: string | React.ReactNode;
  timestamp: Date;
}

export interface TerminalSession {
  history: string[];
  output: CommandOutput[];
  currentDirectory: string;
  user: string;
  hostname: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    email: string;
    location: string;
    bio: string;
  };
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string[];
    technologies: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    duration: string;
    gpa?: string;
    achievements?: string[];
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    featured: boolean;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
  socialLinks: {
    platform: string;
    url: string;
    username: string;
  }[];
}

export interface GameState {
  isActive: boolean;
  score: number;
  highScore: number;
  gameType: 'snake' | null;
}

export interface SnakeGame {
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  direction: 'up' | 'down' | 'left' | 'right';
  score: number;
  gameOver: boolean;
  boardSize: { width: number; height: number };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface ThreeDCardProps {
  className?: string;
  children?: React.ReactNode;
  interactive?: boolean;
}

export interface LoaderState {
  isActive: boolean;
  currentStep: number;
  progress: number;
  currentMessage: string;
  isComplete: boolean;
}

export interface AudioSettings {
  enabled: boolean;
  volume: number;
  tickSound: boolean;
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export interface ResponsiveState {
  isMobile: boolean;
  activePanel: 'terminal' | 'card' | 'both';
  swipeDirection: 'vertical' | 'horizontal';
}

// Terminal Command Handler Types
export type CommandHandler = (args: string[], session: TerminalSession) => Promise<CommandOutput> | CommandOutput;

export interface CommandRegistry {
  [key: string]: {
    handler: CommandHandler;
    command: TerminalCommand;
  };
}

// Navigation Types
export interface NavItem {
  label: string;
  href?: string;
  action?: () => void;
  icon?: string;
}

// Animation Types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
  loop?: boolean;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  stack?: string;
  timestamp: Date;
}

// Hook Types
export interface UseTerminalReturn {
  session: TerminalSession;
  executeCommand: (command: string) => Promise<void>;
  clearTerminal: () => void;
  addToHistory: (command: string) => void;
}

export interface UseGameReturn {
  gameState: GameState;
  startGame: (gameType: 'snake') => void;
  endGame: () => void;
  updateScore: (score: number) => void;
}

export interface UseAchievementsReturn {
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  checkAchievements: (action: string, data?: unknown) => void;
}
