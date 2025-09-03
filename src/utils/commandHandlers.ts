import { portfolioData } from '../data/portfolio';

export interface TerminalWriter {
  write: (text: string) => void;
  clear: () => void;
}

// Typing state management
let isTyping = false;
let scrollTimeout: NodeJS.Timeout | null = null;

export const getTypingStatus = (): boolean => isTyping;

// Debounced scroll function to prevent laggy repeated scrolling
const debouncedScroll = (element: HTMLElement, offset: number = 60) => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(() => {
    if (element) {
      element.scrollTo({
        top: element.scrollHeight - element.clientHeight - offset,
        behavior: 'smooth',
      });
    }
  }, 100); // Wait 100ms before scrolling
};

// Typewriter effect utility
export const typewriterEffect = async (
  terminal: TerminalWriter,
  text: string,
  speed = 15,
  color = '\x1b[37m'
): Promise<void> => {
  // Skip delays in test environment
  if (process.env.NODE_ENV === 'test') {
    terminal.write(color + text + '\x1b[0m');
    return Promise.resolve();
  }

  isTyping = true;
  let lastScrollTime = 0;

  return new Promise(resolve => {
    let index = 0;

    const typeChar = () => {
      if (index < text.length) {
        terminal.write(color + text[index] + '\x1b[0m');

        // Only scroll occasionally to prevent lag, and only on newlines or every 10 chars
        const now = Date.now();
        if (
          (text[index] === '\n' || index % 10 === 0) &&
          now - lastScrollTime > 200
        ) {
          lastScrollTime = now;
          // Try to find the viewport and scroll smoothly
          const terminalElement = document.querySelector(
            '.xterm-viewport'
          ) as HTMLElement;
          if (terminalElement) {
            debouncedScroll(terminalElement, 80);
          }
        }

        index++;
        setTimeout(typeChar, speed);
      } else {
        isTyping = false;
        // Final scroll when typing is complete
        setTimeout(() => {
          const terminalElement = document.querySelector(
            '.xterm-viewport'
          ) as HTMLElement;
          if (terminalElement) {
            debouncedScroll(terminalElement, 80);
          }
        }, 100);
        resolve();
      }
    };

    typeChar();
  });
};

export const typewriterLine = async (
  terminal: TerminalWriter,
  text: string,
  speed = 15,
  color = '\x1b[37m'
): Promise<void> => {
  await typewriterEffect(terminal, text, speed, color);
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

export const handleHelpCommand = async (
  terminal: TerminalWriter,
  isMobile = false
) => {
  await typewriterLine(terminal, 'Available commands:', 15);
  await typewriterLine(
    terminal,
    '  help          - Show this help message',
    12
  );
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
  await typewriterLine(terminal, `About ${portfolioData.name}:`, 15);
  writeSeparator(terminal);
  await typewriterLine(
    terminal,
    `${portfolioData.title} - ${portfolioData.description}`,
    12
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
  await typewriterLine(terminal, 'Technical Skills:', 15);
  writeSeparator(terminal);

  for (const category of portfolioData.skills) {
    await typewriterLine(terminal, `${category.name}:`, 12);
    for (const skill of category.skills) {
      await typewriterLine(terminal, `  • ${skill}`, 10);
    }
    writeLine(terminal, '');
  }
};

export const handleProjectsCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(terminal, 'Recent Projects:', 15);
  writeSeparator(terminal);

  for (const project of portfolioData.projects) {
    await typewriterLine(terminal, `🚀 ${project.title}`, 12);
    await typewriterLine(terminal, `   • ${project.description}`, 10);
    if (project.technologies.length > 0) {
      await typewriterLine(
        terminal,
        `   • Tech: ${project.technologies.join(', ')}`,
        15
      );
    }
    writeLine(terminal, '');
  }
};

export const handleContactCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(terminal, 'Contact Information:', 15);
  writeSeparator(terminal, '━', 20);
  await typewriterLine(
    terminal,
    `📧 Email:    ${portfolioData.contact.email}`,
    20
  );
  await typewriterLine(
    terminal,
    `📧 Personal: ${portfolioData.contact.personalEmail}`,
    20
  );
  writeLine(terminal, '');
  await typewriterLine(
    terminal,
    'Feel free to reach out for collaborations!',
    20
  );
};

export const handleSocialCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(terminal, 'Social Media Commands:', 15);
  writeSeparator(terminal, '━', 23);
  await typewriterLine(
    terminal,
    'Use these commands to quickly access my profiles:',
    20
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
    await typewriterLine(
      terminal,
      `${social.icon} Opening ${social.name} profile...`,
      25
    );
    setTimeout(() => {
      window.open(social.url, '_blank');
    }, 1000);
  }
};

export const handleResumeCommand = async (terminal: TerminalWriter) => {
  await typewriterLine(terminal, '📄 Downloading resume...', 25);
  writeSeparator(terminal, '━', 24);

  try {
    const link = document.createElement('a');
    link.href = '/resume/cv.pdf';
    link.download = 'Yash_Suthar_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await typewriterLine(terminal, '✅ Resume downloaded successfully!', 20);
    await typewriterLine(
      terminal,
      '📁 Check your Downloads folder for "Yash_Suthar_Resume.pdf"',
      20
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
  await typewriterLine(terminal, 'Work Experience:', 15);
  writeSeparator(terminal, '━', 16);

  await typewriterLine(terminal, '💼 Full Stack Developer (Current)', 20);
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

  await typewriterLine(terminal, '🚀 Freelance Developer', 20);
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
  await typewriterLine(terminal, 'Educational Background:', 15);
  writeSeparator(terminal, '━', 23);

  await typewriterLine(terminal, '🎓 Computer Science Engineering', 20);
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

  await typewriterLine(terminal, '📚 Self-Taught Continuous Learning', 20);
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
  await typewriterLine(terminal, 'Certifications & Achievements:', 15);
  writeSeparator(terminal, '━', 30);

  await typewriterLine(terminal, '🏆 Web Development Certifications', 20);
  await typewriterLine(terminal, '   • React Advanced Patterns', 18);
  await typewriterLine(terminal, '   • Node.js Backend Development', 18);
  await typewriterLine(terminal, '   • TypeScript Professional', 18);
  writeLine(terminal, '');

  await typewriterLine(terminal, '☁️ Cloud & DevOps', 20);
  await typewriterLine(terminal, '   • AWS Cloud Practitioner', 18);
  await typewriterLine(terminal, '   • Docker & Kubernetes Fundamentals', 18);
  writeLine(terminal, '');

  await typewriterLine(terminal, '🤖 AI/ML Certifications', 20);
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
};
