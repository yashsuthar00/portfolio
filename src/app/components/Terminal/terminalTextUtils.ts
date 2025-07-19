// Utility functions for long, static, or basic text used in the Terminal component

export const getNeofetchText = (currentTheme: string, installedPackages: string[], fileSystem: FileSystemItem): string => {
  const win = window as Window & { startTime?: number };
  const uptime = Math.floor((Date.now() - (win.startTime ?? Date.now())) / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  // Type-safe access for projects
  let projectCount = 0;
  if (
    typeof fileSystem.home === 'object' &&
    fileSystem.home !== null &&
    Object.prototype.hasOwnProperty.call(fileSystem.home, 'yash') &&
    typeof (fileSystem.home['yash']) === 'object' &&
    fileSystem.home['yash'] !== null &&
    Object.prototype.hasOwnProperty.call(fileSystem.home['yash'], 'projects') &&
    typeof ((fileSystem.home['yash'] as Record<string, unknown>)['projects']) === 'object'
  ) {
    projectCount = Object.keys((fileSystem.home['yash'] as Record<string, object>)['projects'] as object).length;
  }

  return `<span class="text-green-400">
    ██╗   ██╗ █████╗ ███████╗██╗  ██╗ ██████╗ ███████╗
    ╚██╗ ██╔╝██╔══██╗██╔════╝██║  ██║██╔═══██╗██╔════╝
     ╚████╔╝ ███████║███████╗███████║██║   ██║███████╗
      ╚██╔╝  ██╔══██║╚════██║██╔══██║██║   ██║╚════██║
       ██║   ██║  ██║███████║██║  ██║╚██████╔╝███████║
       ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝</span>
    <span class="text-cyan-400">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
    <span class="text-white">OS         Portfolio OS (Next.js 14)
    Host       Yash's Terminal Portfolio
    Kernel     React 18.2.0
    Shell      portfolio-sh v1.0.0
    Resolution ${window.innerWidth}x${window.innerHeight}
    Theme      ${currentTheme}
    Uptime     ${hours}h ${minutes}m
    Memory     ∞ GB (unlimited creativity)
    CPU        Brain-powered ARM64</span>
    <span class="text-cyan-400">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
    <span class="text-white">Skills     TypeScript, React, Next.js, Node.js, Python
    Projects   ${projectCount} active repositories
    Packages   ${installedPackages.length} installed</span>`.trim();
};

export const getRandomFortune = (): string => {
  const fortunes = [
    '"The best way to predict the future is to implement it." - Alan Kay',
    '"Code is poetry written in logic." - Anonymous',
    '"First, solve the problem. Then, write the code." - John Johnson',
    '"The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie',
    '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler',
    '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
    '"In order to understand recursion, one must first understand recursion." - Anonymous',
    '"The best error message is the one that never shows up." - Thomas Fuchs'
  ];
  return fortunes[Math.floor(Math.random() * fortunes.length)];
};

export const getHelpText = (): string => `Available commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Navigation:
  ls [path]          List directory contents
  cd [path]          Change directory
  pwd                Print working directory
  tree               Show directory tree
  find [name]        Find files/directories

File Operations:
  cat [file]         Display file contents
  head [file]        Show first 10 lines
  tail [file]        Show last 10 lines
  grep [pattern]     Search for patterns

System Info:
  whoami             Display current user
  hostname           Display system hostname
  uname -a           Display system information
  neofetch           Display system info with ASCII art
  date               Display current date/time
  uptime             Display system uptime
  ps                 Display running processes

Terminal:
  clear              Clear the terminal
  history            Show command history
  man [command]      Show manual for command
  sudo [command]     Execute as superuser
  exit               Exit terminal

Package Manager:
  apt search [pkg]   Search for packages
  apt install [pkg]  Install a package
  apt list           List installed packages

Customization:
  theme [name]       Change terminal theme
  alias [name=cmd]   Create command alias

Fun:
  fortune            Display random quote
  matrix             Enter the matrix
  cowsay [text]      ASCII cow says something
  sl                 Steam locomotive
  factor [number]    Prime factorization

Type 'man [command]' for detailed help on any command.`;

export const getYashManText = (): string => `YASH(1)                     User Commands                     YASH(1)

NAME
       yash - Full Stack Developer and Terminal Enthusiast

SYNOPSIS
       yash [OPTIONS] [PROJECTS...]

DESCRIPTION
       Yash is a passionate full-stack developer who loves creating
       interactive web applications. Currently specializing in React,
       Next.js, and Node.js development.

       This manual page describes the human known as Yash, who enjoys
       building terminal applications and exploring new technologies.

OPTIONS
       --contact     Display contact information
       --skills      Show technical skills
       --projects    List current projects
       --help        You're looking at it!

EXAMPLES
       cat contact.txt           Display contact information
       ls projects/              List all projects
       neofetch                  Display system information

AUTHOR
       Written by Yash.

REPORTING BUGS
       Report bugs to yash@example.com

COPYRIGHT
       Copyright © 2025 Yash. All rights reserved.

SEE ALSO
       cat(1), ls(1), neofetch(1), linkedin(1), github(1)`;

export interface FileSystemItem {
  [key: string]: string | FileSystemItem;
}

export const fileSystem: FileSystemItem = {
  home: {
    yash: {
      'README.md': "Welcome to Yash's Portfolio Terminal!\n\nThis is a fully interactive Linux-like terminal experience.\nType 'help' to see available commands.\n\nExplore the filesystem with 'ls' and 'cd' commands.\nUse 'cat' to read files and 'neofetch' for system info.\n\nEnjoy your stay! 🚀",
      'bio.txt': "Name: Yash\nRole: Full Stack Developer\nLocation: Ahmedabad, Gujarat, IN\nPassion: Building amazing digital experiences\n\nI love creating interactive applications that push the boundaries of what's possible on the web. This terminal portfolio is just one example of how I like to blend creativity with technical skills.",
      'contact.txt': "📧 Email: yash@example.com\n📱 Phone: +91-XXXXXXXXXX\n🔗 LinkedIn: linkedin.com/in/yash\n🐙 GitHub: github.com/yash\n🌐 Portfolio: yash.dev\n🐦 Twitter: @yash_dev",
      skills: {
        'languages.txt': "Programming Languages:\n━━━━━━━━━━━━━━━━━━━━\n• JavaScript/TypeScript  ████████████ 95%\n• Python                ██████████   80%\n• Java                  ████████     70%\n• C++                   ██████       60%\n• Go                    ████         40%\n• Rust                  ███          30%",
        'frameworks.txt': "Frameworks & Libraries:\n━━━━━━━━━━━━━━━━━━━━━━━\n• React/Next.js         ████████████ 95%\n• Node.js/Express       ██████████   85%\n• Django/FastAPI        ████████     75%\n• Vue.js                ██████       65%\n• Angular               ████         45%\n• React Native          ████         45%",
        'tools.txt': "Tools & Technologies:\n━━━━━━━━━━━━━━━━━━━━━\n• Git/GitHub            ████████████ 95%\n• Docker/Kubernetes     ██████████   80%\n• AWS/GCP               ████████     75%\n• MongoDB/PostgreSQL    ██████████   85%\n• Redis                 ████████     70%\n• Nginx                 ██████       65%"
      },
      projects: {
        'e-commerce.md': "# E-Commerce Platform\n\n**Tech Stack:** Next.js, TypeScript, PostgreSQL, Stripe\n**Status:** Production\n**GitHub:** github.com/yash/ecommerce\n\nA full-stack e-commerce platform with:\n- Server-side rendering for SEO\n- Real-time inventory management\n- Secure payment processing\n- Admin dashboard\n- Mobile-responsive design\n\n**Key Features:**\n• User authentication & authorization\n• Product catalog with search & filters\n• Shopping cart & checkout process\n• Order tracking & management\n• Payment integration with Stripe\n• Admin panel for inventory management",
        'ai-chatbot.md': "# AI Chatbot Assistant\n\n**Tech Stack:** Python, OpenAI API, FastAPI, React\n**Status:** Production\n**GitHub:** github.com/yash/ai-chatbot\n\nAn intelligent chatbot with natural language processing:\n- Context-aware conversations\n- Multi-language support\n- Custom training on domain-specific data\n- Real-time responses\n- Analytics dashboard\n\n**Key Features:**\n• Natural language understanding\n• Contextual memory across conversations\n• Custom knowledge base integration\n• Multi-platform deployment\n• Usage analytics & insights\n• A/B testing for response optimization",
        'portfolio.md': "# Terminal Portfolio\n\n**Tech Stack:** Next.js, TypeScript, Tailwind CSS\n**Status:** You're looking at it! 🎉\n**GitHub:** github.com/yash/terminal-portfolio\n\nThis interactive terminal portfolio you're currently using:\n- Full Linux command simulation\n- File system navigation\n- Command history & autocomplete\n- Easter eggs and hidden features\n- Mobile responsive design\n\n**Key Features:**\n• 25+ Linux commands implemented\n• Virtual file system with navigation\n• Command history with arrow key support\n• Tab completion for commands & files\n• Customizable themes\n• Boot sequence simulation\n• Matrix rain easter egg"
      },
      certifications: {
        'aws.txt': "AWS Certified Solutions Architect - Associate\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nIssued: January 2024\nExpires: January 2027\nCredential ID: AWS-CSA-2024-001\n\nValidation: aws.amazon.com/verification\nSkills: EC2, S3, Lambda, RDS, VPC, CloudFormation",
        'docker.txt': "Docker Certified Associate\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nIssued: March 2024\nExpires: March 2027\nCredential ID: DCA-2024-002\n\nValidation: docker.com/verification\nSkills: Containerization, Orchestration, Swarm, Compose",
        'react.txt': "Meta React Developer Certificate\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nIssued: February 2024\nProvider: Meta via Coursera\nCredential ID: META-REACT-2024-003\n\nValidation: coursera.org/verification\nSkills: React, JSX, Hooks, Context API, Testing"
      },
      '.secrets': {
        'secret.txt': "🎉 Congratulations! You found the secret file!\n\nHere's a hidden fact: This terminal supports over 25 commands\nand has a fully functional virtual file system.\n\nTry typing 'sudo rm -rf /' for a surprise! 😄\n\nOr type 'matrix' for some visual effects.\n\nKeep exploring! There are more easter eggs hidden around... 🕵️‍♂️"
      }
    }
  }
};

export interface TerminalLine {
  id: string;
  content: string;
  isCommand?: boolean;
  isSpecial?: boolean;
  timestamp?: Date;
}

export const bootSequence: string[] = [
  'ssh yash@portfolio',
  'The authenticity of host "portfolio" can\'t be established.',
  'ECDSA key fingerprint is SHA256:2f4d7c8a9b3e1f6a8c2d4e7f9a1b3c5d8e2f4a6b.',
  'Are you sure you want to continue connecting (yes/no/[fingerprint])? yes',
  'Warning: Permanently added "portfolio" (ECDSA) to the list of known hosts.',
  'yash@portfolio\'s password: ••••••••',
  '',
  'Welcome to YashOS 1.0 (Ubuntu 22.04.3 LTS based)',
  'System information as of ' + new Date().toLocaleString(),
  '',
  ' * Documentation:  https://yash.dev/docs',
  ' * Management:     https://yash.dev/admin',
  ' * Support:        https://yash.dev/support',
  '',
  'Last login: ' + new Date().toLocaleString() + ' from 192.168.1.1',
  '',
  '🎉 Welcome to my interactive terminal portfolio!',
  '📚 Type "help" to see available commands',
  '🔍 Try "ls" to explore the file system',
  '⭐ Use "neofetch" for system info',
  '🎮 Try "fortune" for inspirational quotes',
  '🔍 Hidden easter eggs await discovery...',
  ''
];
