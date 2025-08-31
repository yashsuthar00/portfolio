import { portfolioData } from '../data/portfolio';

export interface TerminalWriter {
  write: (text: string) => void;
  clear: () => void;
}

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

export const handleHelpCommand = (
  terminal: TerminalWriter,
  isMobile = false
) => {
  writeLine(terminal, 'Available commands:');
  writeLine(terminal, '  help     - Show this help message');
  writeLine(terminal, '  about    - Learn more about me');
  writeLine(terminal, '  skills   - View my technical skills');
  writeLine(terminal, '  projects - See my latest projects');
  writeLine(terminal, '  contact  - Get in touch');
  writeLine(terminal, '  social   - View social media commands');

  if (!isMobile) {
    writeLine(terminal, '  github   - Open GitHub profile');
    writeLine(terminal, '  linkedin - Open LinkedIn profile');
    writeLine(terminal, '  leetcode - Open LeetCode profile');
    writeLine(terminal, '  codeforces - Open CodeForces profile');
  }

  writeLine(terminal, '  resume   - Download my resume');
  writeLine(terminal, '  clear    - Clear the terminal');
  writeLine(terminal, '  exit     - Shutdown terminal session');
};

export const handleAboutCommand = (terminal: TerminalWriter) => {
  writeLine(terminal, `About ${portfolioData.name}:`);
  writeSeparator(terminal);
  writeLine(terminal, `${portfolioData.title} - ${portfolioData.description}`);
  writeLine(terminal, '');
  writeLine(terminal, `🎓 Education: ${portfolioData.education}`);
  writeLine(terminal, `💼 Experience: ${portfolioData.experience}`);
  writeLine(terminal, '🌟 Specializing in modern JavaScript frameworks');
};

export const handleSkillsCommand = (terminal: TerminalWriter) => {
  writeLine(terminal, 'Technical Skills:');
  writeSeparator(terminal);

  portfolioData.skills.forEach(category => {
    writeLine(terminal, `${category.name}:`);
    category.skills.forEach(skill => {
      writeLine(terminal, `  • ${skill}`);
    });
    writeLine(terminal, '');
  });
};

export const handleProjectsCommand = (terminal: TerminalWriter) => {
  writeLine(terminal, 'Recent Projects:');
  writeSeparator(terminal);

  portfolioData.projects.forEach(project => {
    writeLine(terminal, `🚀 ${project.title}`);
    writeLine(terminal, `   • ${project.description}`);
    if (project.technologies.length > 0) {
      writeLine(terminal, `   • Tech: ${project.technologies.join(', ')}`);
    }
    writeLine(terminal, '');
  });
};

export const handleContactCommand = (terminal: TerminalWriter) => {
  writeLine(terminal, 'Contact Information:');
  writeSeparator(terminal, '━', 20);
  writeLine(terminal, `📧 Email:    ${portfolioData.contact.email}`);
  writeLine(terminal, `📧 Personal: ${portfolioData.contact.personalEmail}`);
  writeLine(terminal, '');
  writeLine(terminal, 'Feel free to reach out for collaborations!');
};

export const handleSocialCommand = (terminal: TerminalWriter) => {
  writeLine(terminal, 'Social Media Commands:');
  writeSeparator(terminal, '━', 23);
  writeLine(terminal, 'Use these commands to quickly access my profiles:');
  writeLine(terminal, '');

  portfolioData.social.forEach(social => {
    writeLine(
      terminal,
      `${social.icon} ${social.command.padEnd(10)} - Open ${social.name} profile`
    );
  });

  writeLine(terminal, '');
  writeLine(terminal, 'Just type any of these commands to visit the profile!');
};

export const handleSocialLinkCommand = (
  terminal: TerminalWriter,
  command: string
) => {
  const social = portfolioData.social.find(s => s.command === command);
  if (social) {
    writeLine(terminal, `${social.icon} Opening ${social.name} profile...`);
    setTimeout(() => {
      window.open(social.url, '_blank');
    }, 1000);
  }
};

export const handleResumeCommand = (terminal: TerminalWriter) => {
  writeLine(terminal, '📄 Downloading resume...');
  writeSeparator(terminal, '━', 24);

  try {
    const link = document.createElement('a');
    link.href = '/resume/cv.pdf';
    link.download = 'Yash_Suthar_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    writeLine(terminal, '✅ Resume downloaded successfully!');
    writeLine(
      terminal,
      '📁 Check your Downloads folder for "Yash_Suthar_Resume.pdf"'
    );
  } catch {
    writeLine(
      terminal,
      '❌ Error downloading resume. Please try again.',
      '\x1b[31m'
    );
  }
};

export const getWelcomeMessage = (isMobile = false): string[] => {
  if (isMobile) {
    return [
      '╔════════════════════════════════════════╗',
      '║            Yash Suthar                ║',
      '║        Full Stack Developer           ║',
      '╚════════════════════════════════════════╝',
      '',
      'Available commands:',
      '  help     - Show available commands',
      '  about    - Learn more about me',
      '  skills   - View my technical skills',
      '  projects - See my latest projects',
      '  contact  - Get in touch',
      '  social   - View social media commands',
      '  resume   - Download my resume',
      '  clear    - Clear the terminal',
      '  exit     - Shutdown terminal session',
      '',
    ];
  }

  return [
    '╔══════════════════════════════════════════════════════════╗',
    '║                    Welcome to Portfolio                 ║',
    '║                                                          ║',
    `║              ${portfolioData.name} - ${portfolioData.title}         ║`,
    '╚══════════════════════════════════════════════════════════╝',
    '',
    'Available commands:',
    '  help     - Show available commands',
    '  about    - Learn more about me',
    '  skills   - View my technical skills',
    '  projects - See my latest projects',
    '  contact  - Get in touch',
    '  social   - View social media commands',
    '  github   - Open GitHub profile',
    '  linkedin - Open LinkedIn profile',
    '  leetcode - Open LeetCode profile',
    '  codeforces - Open CodeForces profile',
    '  resume   - Download my resume',
    '  clear    - Clear the terminal',
    '  exit     - Shutdown terminal session',
    '',
  ];
};
