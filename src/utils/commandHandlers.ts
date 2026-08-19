import { portfolioData } from '../data/portfolio';
import { trackEvent } from './analytics';

// Canonical list of commands the terminal understands. Keep in sync with the
// switch in TerminalComponent. Used to separate real commands from free-typed
// input in analytics (see sanitizeCommand).
export const KNOWN_COMMANDS = [
  'help',
  'about',
  'skills',
  'projects',
  'contact',
  'experience',
  'education',
  'certifications',
  'sudo',
  'social',
  'github',
  'linkedin',
  'leetcode',
  'codeforces',
  'resume',
  'cv',
  'clear',
] as const;

export interface TerminalWriter {
  write: (text: string) => void;
  clear: () => void;
}

// ── ANSI palette ──────────────────────────────────────────────────────────
// Named so intent is obvious at the call site instead of raw escape codes.
export const ANSI = {
  reset: '\x1b[0m',
  dim: '\x1b[38;5;65m', // muted green — secondary / system chatter
  green: '\x1b[32m', // body text
  brightGreen: '\x1b[92m', // headings
  cyan: '\x1b[38;5;51m', // labels / accents
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  white: '\x1b[37m',
} as const;

// Typing state management
let isTyping = false;
let skipRequested = false;

export const getTypingStatus = (): boolean => isTyping;

// A keypress while text is animating fast-forwards the rest of the current
// command's output. The flag is reset when a new animated block begins.
export const requestSkip = (): void => {
  if (isTyping) skipRequested = true;
};
export const resetSkip = (): void => {
  skipRequested = false;
};

// Honor the OS "reduce motion" setting: animations collapse to instant output.
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

// Motion budget: a single line never animates for longer than its budget, no
// matter how long it is. Short lines type character-by-character (the classic
// feel); long lines reveal several characters per frame so they land within
// budget instead of making the reader wait proportional to length.
const FRAME_MS = 8; // delay between reveal frames
// Command output is reference material people want to READ, so it streams fast.
// The welcome is the one "hero" moment, so it gets a slower, characterful pace.
export const LINE_BUDGET_FAST = 95;
export const LINE_BUDGET_WELCOME = 320;

// Active per-line budget. Command handlers pass no budget and inherit this;
// the welcome bumps it up for a moment so the intro reads as deliberate typing.
let lineBudget = LINE_BUDGET_FAST;
export const setTypingPace = (pace: 'fast' | 'welcome'): void => {
  lineBudget = pace === 'welcome' ? LINE_BUDGET_WELCOME : LINE_BUDGET_FAST;
};

// Typewriter effect utility
export const typewriterEffect = async (
  terminal: TerminalWriter,
  text: string,
  budgetMs = LINE_BUDGET_FAST,
  color: string = ANSI.white
): Promise<void> => {
  // Instant output in tests, for reduced-motion users, or when the viewer has
  // pressed a key to fast-forward the current command.
  if (
    process.env.NODE_ENV === 'test' ||
    prefersReducedMotion() ||
    skipRequested
  ) {
    terminal.write(color + text + ANSI.reset);
    return Promise.resolve();
  }

  isTyping = true;

  // Reveal enough characters per frame that the whole line finishes in budget.
  // xterm keeps the viewport pinned to the bottom on each write, so there is no
  // manual scrolling here — that used to fight xterm's native scroll and stutter.
  const frame = FRAME_MS;
  const maxFrames = Math.max(1, Math.round(budgetMs / frame));
  const chunk = Math.max(1, Math.ceil(text.length / maxFrames));

  return new Promise(resolve => {
    let index = 0;

    const finish = () => {
      isTyping = false;
      resolve();
    };

    const typeChunk = () => {
      // Viewer hit a key mid-animation — flush the remainder instantly.
      if (skipRequested) {
        if (index < text.length) {
          terminal.write(color + text.slice(index) + ANSI.reset);
        }
        finish();
        return;
      }

      if (index < text.length) {
        const next = text.slice(index, index + chunk);
        terminal.write(color + next + ANSI.reset);
        index += chunk;
        setTimeout(typeChunk, frame);
      } else {
        finish();
      }
    };

    typeChunk();
  });
};

export const typewriterLine = async (
  terminal: TerminalWriter,
  text: string,
  // Legacy per-call speed hint from the handlers — ignored now that pacing is
  // governed by the active line budget (see setTypingPace). Kept so the many
  // existing call sites compile unchanged.
  _legacySpeed = 0,
  color: string = ANSI.white
): Promise<void> => {
  await typewriterEffect(terminal, text, lineBudget, color);
  terminal.write('\r\n');
};

export const writeColoredText = (
  terminal: TerminalWriter,
  text: string,
  color = '\x1b[37m'
) => {
  terminal.write(`${color}${text}\x1b[0m`);
};

export const writeLine = (
  terminal: TerminalWriter,
  text: string,
  color = '\x1b[37m'
) => {
  writeColoredText(terminal, text + '\r\n', color);
};

export const writeSeparator = (
  terminal: TerminalWriter,
  char = '━',
  length = 20
) => {
  writeLine(terminal, char.repeat(length));
};

// A rule that draws itself in left-to-right — a small motion cue that a new
// section has started. Collapses to an instant line in tests/reduced-motion.
export const typeSeparator = async (
  terminal: TerminalWriter,
  length = 24,
  color: string = ANSI.dim
) => {
  if (
    process.env.NODE_ENV === 'test' ||
    prefersReducedMotion() ||
    skipRequested
  ) {
    writeLine(terminal, '━'.repeat(length), color);
    return;
  }
  isTyping = true;
  for (let i = 0; i < length; i++) {
    if (skipRequested) {
      terminal.write(color + '━'.repeat(length - i) + ANSI.reset);
      break;
    }
    terminal.write(color + '━' + ANSI.reset);
    await sleep(3);
  }
  terminal.write('\r\n');
  isTyping = false;
};

// A braille spinner that ticks in place (carriage-return overwrite) to make
// "work happening" feel deliberate before an action like opening a link.
const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
export const spinner = async (
  terminal: TerminalWriter,
  label: string,
  durationMs = 700,
  color: string = ANSI.cyan
): Promise<void> => {
  if (process.env.NODE_ENV === 'test' || prefersReducedMotion()) {
    writeLine(terminal, `${label}`, color);
    return;
  }
  isTyping = true;
  const start = Date.now();
  let frame = 0;
  while (Date.now() - start < durationMs && !skipRequested) {
    terminal.write(
      `\r${color}${SPINNER_FRAMES[frame % SPINNER_FRAMES.length]} ${label}${ANSI.reset}`
    );
    frame++;
    await sleep(80);
  }
  // Clear the spinner line and leave a settled state.
  terminal.write(`\r${color}▸ ${label}${ANSI.reset}\r\n`);
  isTyping = false;
};

export const handleHelpCommand = async (
  terminal: TerminalWriter,
  isMobile = false
) => {
  await typewriterLine(terminal, 'Available commands:', 15, ANSI.brightGreen);
  // await typewriterLine(
  //   terminal,
  //   '  help          - Show this help message',
  //   12
  // );
  await typewriterLine(terminal, '  about         - Learn more about me', 12);
  await typewriterLine(
    terminal,
    '  skills        - View my technical skills',
    12
  );
  await typewriterLine(
    terminal,
    '  projects      - See my latest projects',
    12
  );
  await typewriterLine(
    terminal,
    '  experience    - View my work experience',
    12
  );
  await typewriterLine(
    terminal,
    '  education     - View my educational background',
    12
  );
  await typewriterLine(
    terminal,
    '  certifications- View my certifications',
    12
  );
  await typewriterLine(terminal, '  contact       - Get in touch', 12);
  await typewriterLine(
    terminal,
    '  social        - View social media commands',
    12
  );

  await typewriterLine(
    terminal,
    '  sudo          - Execute with elevated privileges',
    12
  );

  if (!isMobile) {
    await typewriterLine(terminal, '  github        - Open GitHub profile', 12);
    await typewriterLine(
      terminal,
      '  linkedin      - Open LinkedIn profile',
      12
    );
    await typewriterLine(
      terminal,
      '  leetcode      - Open LeetCode profile',
      12
    );
    await typewriterLine(
      terminal,
      '  codeforces    - Open CodeForces profile',
      12
    );
  }

  await typewriterLine(terminal, '  resume/cv     - Download my resume', 12);
  await typewriterLine(terminal, '  clear         - Clear the terminal', 12);
};

export const handleAboutCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(
    terminal,
    `About ${portfolioData.name}:`,
    15,
    ANSI.brightGreen
  );
  await typeSeparator(terminal, 24);
  await typewriterLine(
    terminal,
    `${portfolioData.title} - ${portfolioData.description}`,
    12,
    ANSI.green
  );
  writeLine(terminal, '');
  await typewriterLine(
    terminal,
    `🎓 Education: ${portfolioData.education}`,
    12
  );
  await typewriterLine(
    terminal,
    `💼 Experience: ${portfolioData.experience}`,
    12
  );
  await typewriterLine(
    terminal,
    '🌟 Specializing in modern JavaScript frameworks',
    12
  );
};

export const handleSkillsCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(terminal, 'Technical Skills:', 15, ANSI.brightGreen);
  await typeSeparator(terminal, 24);

  for (const category of portfolioData.skills) {
    await typewriterLine(terminal, `${category.name}:`, 12, ANSI.cyan);
    for (const skill of category.skills) {
      await typewriterLine(terminal, `  • ${skill}`, 10, ANSI.green);
    }
    writeLine(terminal, '');
  }
};

export const handleProjectsCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(terminal, 'Recent Projects:', 15, ANSI.brightGreen);
  await typeSeparator(terminal, 24);

  for (const project of portfolioData.projects) {
    await typewriterLine(terminal, `🚀 ${project.title}`, 12, ANSI.cyan);
    await typewriterLine(
      terminal,
      `   • ${project.description}`,
      10,
      ANSI.green
    );
    if (project.technologies.length > 0) {
      await typewriterLine(
        terminal,
        `   • Tech: ${project.technologies.join(', ')}`,
        15,
        ANSI.dim
      );
    }
    writeLine(terminal, '');
  }
};

export const handleContactCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(terminal, 'Contact Information:', 15, ANSI.brightGreen);
  await typeSeparator(terminal, 24);
  await typewriterLine(
    terminal,
    `📧 Email:    ${portfolioData.contact.email}`,
    20,
    ANSI.green
  );
  await typewriterLine(
    terminal,
    `📧 Personal: ${portfolioData.contact.personalEmail}`,
    20,
    ANSI.green
  );
  writeLine(terminal, '');
  await typewriterLine(
    terminal,
    'Feel free to reach out for collaborations!',
    20,
    ANSI.cyan
  );
};

export const handleSocialCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(
    terminal,
    'Social Media Commands:',
    15,
    ANSI.brightGreen
  );
  await typeSeparator(terminal, 24);
  await typewriterLine(
    terminal,
    'Use these commands to quickly access my profiles:',
    20,
    ANSI.green
  );
  writeLine(terminal, '');

  for (const social of portfolioData.social) {
    await typewriterLine(
      terminal,
      `${social.icon} ${social.command.padEnd(10)} - Open ${social.name} profile`,
      18
    );
  }

  writeLine(terminal, '');
  await typewriterLine(
    terminal,
    'Just type any of these commands to visit the profile!',
    20
  );
};

export const handleSocialLinkCommand = async (
  terminal: TerminalWriter,
  command: string
) => {
  const social = portfolioData.social.find(s => s.command === command);
  if (social) {
    await spinner(terminal, `Opening ${social.name} profile…`, 700);
    // Analytics: a profile link was opened from the terminal (not the footer).
    trackEvent('outbound_click', { platform: command, location: 'terminal' });
    window.open(social.url, '_blank');
  }
};

export const handleResumeCommand = async (terminal: TerminalWriter) => {
  await spinner(terminal, '📄 Preparing resume…', 700);

  try {
    const link = document.createElement('a');
    link.href = '/resume/cv.pdf';
    link.download = 'Yash_Suthar_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Analytics: the CV was downloaded (via the resume/cv terminal command).
    trackEvent('cv_download', { source: 'terminal' });

    await typewriterLine(
      terminal,
      '✅ Resume downloaded successfully!',
      20,
      ANSI.brightGreen
    );
    await typewriterLine(
      terminal,
      '📁 Check your Downloads folder for "Yash_Suthar_Resume.pdf"',
      20,
      ANSI.green
    );
  } catch {
    await typewriterLine(
      terminal,
      '❌ Error downloading resume. Please try again.',
      20,
      '\x1b[31m'
    );
  }
};

export const handleExperienceCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(terminal, 'Work Experience:', 15, ANSI.brightGreen);
  await typeSeparator(terminal, 24);

  await typewriterLine(
    terminal,
    '💼 Full Stack Developer (Current)',
    20,
    ANSI.cyan
  );
  await typewriterLine(
    terminal,
    '   • Building scalable web applications with React & Node.js',
    18
  );
  await typewriterLine(
    terminal,
    '   • Experience with cloud services (AWS, Vercel)',
    18
  );
  await typewriterLine(
    terminal,
    '   • Implementing modern DevOps practices',
    18
  );
  writeLine(terminal, '');

  await typewriterLine(terminal, '🚀 Freelance Developer', 20, ANSI.cyan);
  await typewriterLine(
    terminal,
    '   • Created custom web solutions for various clients',
    18
  );
  await typewriterLine(
    terminal,
    '   • Specialized in React, Next.js, and TypeScript',
    18
  );
  await typewriterLine(terminal, '   • Delivered 10+ successful projects', 18);
};

export const handleEducationCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(
    terminal,
    'Educational Background:',
    15,
    ANSI.brightGreen
  );
  await typeSeparator(terminal, 24);

  await typewriterLine(
    terminal,
    '🎓 Computer Science Engineering',
    20,
    ANSI.cyan
  );
  await typewriterLine(terminal, '   • Focus on Software Development & AI', 18);
  await typewriterLine(
    terminal,
    '   • Relevant Coursework: Data Structures, Algorithms, Web Development',
    18
  );
  await typewriterLine(
    terminal,
    '   • Projects: Full-stack applications, AI/ML implementations',
    18
  );
  writeLine(terminal, '');

  await typewriterLine(
    terminal,
    '📚 Self-Taught Continuous Learning',
    20,
    ANSI.cyan
  );
  await typewriterLine(
    terminal,
    '   • Modern JavaScript frameworks and libraries',
    18
  );
  await typewriterLine(
    terminal,
    '   • Cloud computing and DevOps practices',
    18
  );
  await typewriterLine(
    terminal,
    '   • AI/ML technologies and implementation',
    18
  );
};

export const handleCertificationsCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(
    terminal,
    'Certifications & Achievements:',
    15,
    ANSI.brightGreen
  );
  await typeSeparator(terminal, 30);

  await typewriterLine(
    terminal,
    '🏆 Web Development Certifications',
    20,
    ANSI.cyan
  );
  await typewriterLine(terminal, '   • React Advanced Patterns', 18);
  await typewriterLine(terminal, '   • Node.js Backend Development', 18);
  await typewriterLine(terminal, '   • TypeScript Professional', 18);
  writeLine(terminal, '');

  await typewriterLine(terminal, '☁️ Cloud & DevOps', 20, ANSI.cyan);
  await typewriterLine(terminal, '   • AWS Cloud Practitioner', 18);
  await typewriterLine(terminal, '   • Docker & Kubernetes Fundamentals', 18);
  writeLine(terminal, '');

  await typewriterLine(terminal, '🤖 AI/ML Certifications', 20, ANSI.cyan);
  await typewriterLine(terminal, '   • Machine Learning Fundamentals', 18);
  await typewriterLine(terminal, '   • Deep Learning Specialization', 18);
};

export const handleWhoamiCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(
    terminal,
    '🤖 Scanning digital fingerprint...',
    15,
    '\x1b[33m'
  );
  await new Promise(resolve => setTimeout(resolve, 500));
  await typewriterLine(
    terminal,
    '📡 Quantum signature detected:',
    15,
    '\x1b[36m'
  );
  await typewriterLine(terminal, '', 10);
  await typewriterLine(
    terminal,
    '┌─────────────────────────────────────┐',
    10,
    '\x1b[32m'
  );
  await typewriterLine(
    terminal,
    '│  👨‍💻 Entity: Yash Suthar              │',
    15,
    '\x1b[32m'
  );
  await typewriterLine(
    terminal,
    '│  🚀 Role: Code Architect & AI Wizard  │',
    15,
    '\x1b[32m'
  );
  await typewriterLine(
    terminal,
    '│  🌍 Location: Digital Realm           │',
    15,
    '\x1b[32m'
  );
  await typewriterLine(
    terminal,
    '│  ⚡ Status: Caffeinated & Creating    │',
    15,
    '\x1b[32m'
  );
  await typewriterLine(
    terminal,
    '│  🎯 Mission: Building the Future      │',
    15,
    '\x1b[32m'
  );
  await typewriterLine(
    terminal,
    '└─────────────────────────────────────┘',
    10,
    '\x1b[32m'
  );
};

export const handleSudoCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(
    terminal,
    'Hi, I am Yash Suthar a software & AI-engineer',
    20,
    '\x1b[37m'
  );
};

export const getWelcomeMessage = (isMobile = false): string[] => {
  if (isMobile) {
    return [
      '[yash@portfolio ~]$ welcome',
      '',
      "Hi, I'm Yash Suthar, a Software Engineer and AI Engineer.",
      'I love crafting digital experiences with modern technologies.',
      '',
      'Type "help" to explore more about me and my work!',
    ];
  }

  return [
    '[yash@portfolio ~]$ welcome',
    '',
    "Hi, I'm Yash Suthar, a Software Engineer and AI Engineer who loves",
    'crafting digital experiences with modern technologies.',
    '',
    'Type "help" to see all available commands and discover more about me!',
  ];
};

// Typewriter welcome message function
export const showWelcomeWithTypewriter = async (
  terminal: TerminalWriter,
  isMobile = false
): Promise<void> => {
  resetSkip();
  setTypingPace('welcome');
  if (isMobile) {
    // Show prompt instantly in blue, then green for welcome
    terminal.write('\x1b[34m[yash@portfolio ~]$ \x1b[32mwelcome\x1b[0m\r\n');
    await typewriterLine(
      terminal,
      "Hi, I'm Yash Suthar, a Software Engineer and AI Engineer.",
      15
    );
    await typewriterLine(
      terminal,
      'I love crafting digital experiences with modern technologies.',
      15
    );
    terminal.write('\r\n');
    await typewriterLine(
      terminal,
      'Type "help" to explore more about me and my work!',
      15,
      '\x1b[37m'
    );
  } else {
    // Show prompt instantly in blue, then green for welcome
    terminal.write('\x1b[34m[yash@portfolio ~]$ \x1b[32mwelcome\x1b[0m\r\n');
    await typewriterLine(
      terminal,
      "Hi, I'm Yash Suthar, a Software Engineer and AI Engineer who loves",
      15
    );
    await typewriterLine(
      terminal,
      'crafting digital experiences with modern technologies.',
      15
    );
    terminal.write('\r\n');
    await typewriterLine(
      terminal,
      'Type "help" to see all available commands and discover more about me!',
      15,
      '\x1b[37m'
    );
    terminal.write('\r\n');
  }
  // Back to the fast pace for everything the viewer triggers afterwards.
  setTypingPace('fast');
};
