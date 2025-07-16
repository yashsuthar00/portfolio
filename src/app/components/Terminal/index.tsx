'use client'; 

import React, { useState, useRef, useEffect } from 'react';
// import styles from './Terminal.module.css';

interface FileSystemItem {
  [key: string]: string | FileSystemItem;
}

interface TerminalLine {
  id: string;
  content: string;
  isCommand?: boolean;
  isSpecial?: boolean;
  timestamp?: Date;
}


const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState(['home', 'yash']);
  const [isBooting, setIsBooting] = useState(true);
  const [showMatrix, setShowMatrix] = useState(false);
  const [_lineCounter, setLineCounter] = useState(0);
  const [installedPackages, setInstalledPackages] = useState<string[]>([]);
  const [currentTheme, setCurrentTheme] = useState('default');
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // File system structure
  const fileSystem: FileSystemItem = {
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

  const themes = {
    default: {
      bg: 'bg-black',
      text: 'text-white',
      prompt: 'text-blue-400',
      accent: 'text-cyan-400',
      command: 'text-green-400',
      special: 'text-green-400' // For ASCII art, matrix, etc.
    },
    dracula: {
      bg: 'bg-gray-900',
      text: 'text-gray-200',
      prompt: 'text-pink-400',
      accent: 'text-cyan-300',
      command: 'text-green-400',
      special: 'text-green-400'
    },
    matrix: {
      bg: 'bg-black',
      text: 'text-green-300',
      prompt: 'text-green-400',
      accent: 'text-green-500',
      command: 'text-green-400',
      special: 'text-green-400'
    }
  };

  const getTheme = () => themes[currentTheme as keyof typeof themes] || themes.default;

  const addLine = (content: string, isCommand = false, isSpecial = false) => {
    const uniqueId = `${Date.now()}-${Math.random()}`;
    setLines(prev => [...prev, {
      id: uniqueId,
      content,
      isCommand,
      isSpecial,
      timestamp: new Date()
    }]);
    setLineCounter(prev => prev + 1);
  };

  const getPrompt = () => {
    const path = currentDir.join('/');
    return `yash@portfolio:/${path}$ `;
  };

  const getCurrentDirectory = (): FileSystemItem => {
    let current = fileSystem;
    for (const dir of currentDir) {
      current = current[dir] as FileSystemItem;
    }
    return current;
  };

  const resolvePath = (path: string): string[] => {
    if (path.startsWith('/')) {
      return path.split('/').filter(p => p);
    }

    const parts = path.split('/').filter(p => p);
    const resolved = [...currentDir];
    
    for (const part of parts) {
      if (part === '..') {
        resolved.pop();
      } else if (part !== '.') {
        resolved.push(part);
      }
    }
    
    return resolved;
  };

  const getNeofetch = () => {
    const win = window as Window & { startTime?: number };
    const uptime = Math.floor((Date.now() - (win.startTime ?? Date.now())) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
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
    Projects   ${
    typeof fileSystem.home === 'object' &&
    fileSystem.home !== null &&
    fileSystem.home.hasOwnProperty('yash') &&
    typeof (fileSystem.home['yash']) === 'object' &&
    fileSystem.home['yash'] !== null &&
    (fileSystem.home['yash'] as FileSystemItem).hasOwnProperty('projects') &&
    typeof ((fileSystem.home['yash'] as FileSystemItem)['projects']) === 'object'
    ? Object.keys((fileSystem.home['yash'] as FileSystemItem)['projects'] as FileSystemItem).length
    : 0
  } active repositories
    Packages   ${installedPackages.length} installed</span>`.trim();
  };

const getRandomFortune = () => {
    const fortunes = [
      "\"The best way to predict the future is to implement it.\" - Alan Kay",
      "\"Code is poetry written in logic.\" - Anonymous",
      "\"First, solve the problem. Then, write the code.\" - John Johnson",
      "\"The only way to learn a new programming language is by writing programs in it.\" - Dennis Ritchie",
      "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" - Martin Fowler",
      "\"Experience is the name everyone gives to their mistakes.\" - Oscar Wilde",
      "\"In order to understand recursion, one must first understand recursion.\" - Anonymous",
      "\"The best error message is the one that never shows up.\" - Thomas Fuchs"
    ];
    return fortunes[Math.floor(Math.random() * fortunes.length)];
  };

  const handleCommand = (input: string) => {
    const [command, ...args] = input.trim().split(' ');
    const arg = args.join(' ');
    
    addLine(`${getPrompt()}${input}`, true);
    
    switch (command.toLowerCase()) {
      case 'help':
        addLine(`Available commands:
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

Type 'man [command]' for detailed help on any command.`);
        break;
        
      case 'ls':
        const lsPath = arg ? resolvePath(arg) : currentDir;
        try {
          let lsDir = fileSystem;
          for (const dir of lsPath) {
            lsDir = lsDir[dir] as FileSystemItem;
          }
          
          const items = Object.keys(lsDir).map(key => {
            const item = lsDir[key];
            const isDir = typeof item === 'object' && item !== null;
            const color = isDir ? 'text-blue-400' : 'text-white';
            const suffix = isDir ? '/' : '';
            return `<span class="${color}">${key}${suffix}</span>`;
          });
          
          if (args.includes('-la') || args.includes('-al')) {
            const details = Object.keys(lsDir).map(key => {
              const item = lsDir[key];
              const isDir = typeof item === 'object' && item !== null;
              const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
              const size = isDir ? '4096' : (typeof item === 'string' ? item.length : '0');
              const date = 'Jan 15 12:34';
              return `${perms} yash yash ${String(size).padStart(8)} ${date} ${key}`;
            });
            addLine(`total ${Object.keys(lsDir).length}\n${details.join('\n')}`);
          } else {
            addLine(items.join('  '));
          }
        } catch {
          addLine(`ls: cannot access '${arg}': No such file or directory`);
        }
        break;
        
      case 'cd':
        if (!arg || arg === '~') {
          setCurrentDir(['home', 'yash']);
        } else {
          const newPath = resolvePath(arg);
          try {
            let testDir = fileSystem;
            for (const dir of newPath) {
              testDir = testDir[dir] as FileSystemItem;
            }
            if (typeof testDir === 'object') {
              setCurrentDir(newPath);
            } else {
              addLine(`cd: ${arg}: Not a directory`);
            }
          } catch {
            addLine(`cd: ${arg}: No such file or directory`);
          }
        }
        break;
        
      case 'pwd':
        addLine(`/${currentDir.join('/')}`);
        break;
        
      case 'cat':
        if (!arg) {
          addLine('cat: missing operand');
          break;
        }
        try {
          const current = getCurrentDirectory();
          const file = current[arg];
          if (typeof file === 'string') {
            addLine(file);
          } else {
            addLine(`cat: ${arg}: Is a directory`);
          }
        } catch {
          addLine(`cat: ${arg}: No such file or directory`);
        }
        break;
        
      case 'whoami':
        addLine('yash');
        break;
        
      case 'hostname':
        addLine('portfolio');
        break;
        
      case 'uname':
        if (args.includes('-a')) {
          addLine('Linux portfolio 6.5.0-portfolio #1 SMP PREEMPT_DYNAMIC Wed Jul 16 2025 x86_64 GNU/Linux');
        } else {
          addLine('Linux');
        }
        break;
        
      case 'neofetch':
        addLine(getNeofetch(), false, true);
        break;
        
      case 'date':
        addLine(new Date().toString());
        break;
        
      case 'clear':
        setLines([]);
        break;
        
      case 'history':
        commandHistory.forEach((cmd, index) => {
          addLine(`${index + 1}  ${cmd}`);
        });
        break;
        
      case 'man':
        if (arg === 'yash') {
          addLine(`YASH(1)                     User Commands                     YASH(1)

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
       cat(1), ls(1), neofetch(1), linkedin(1), github(1)`);
        } else if (arg) {
          addLine(`No manual entry for ${arg}`);
        } else {
          addLine('What manual page do you want?');
        }
        break;
        
      case 'sudo':
        if (arg === 'rm -rf /') {
          addLine('😱 Nice try! But I\'m not falling for that one.\n\n🛡️  Permission denied: Cannot delete the universe.\n\n💡 Pro tip: Try something less destructive! 😄');
        } else {
          addLine(`[sudo] password for yash: \nSorry, try again.`);
        }
        break;
        
      case 'exit':
        addLine('Goodbye! 👋');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        break;
        
      case 'matrix':
        setShowMatrix(true);
        setTimeout(() => setShowMatrix(false), 5000);
        addLine('Entering the Matrix... 🔴💊');
        break;
        
      case 'fortune':
        addLine(getRandomFortune());
        break;
        
      case 'tree':
        addLine(`/home/yash/
├── README.md
├── bio.txt
├── contact.txt
├── skills/
│   ├── languages.txt
│   ├── frameworks.txt
│   └── tools.txt
├── projects/
│   ├── e-commerce.md
│   ├── ai-chatbot.md
│   └── portfolio.md
├── certifications/
│   ├── aws.txt
│   ├── docker.txt
│   └── react.txt
└── .secrets/
    └── secret.txt`);
        break;
        
      case 'uptime':
        const win = window as Window & { startTime?: number };
        const uptimeMs = Date.now() - (win.startTime ?? 0);
        const uptimeSeconds = Math.floor(uptimeMs / 1000);
        const uptimeMinutes = Math.floor(uptimeSeconds / 60);
        const uptimeHours = Math.floor(uptimeMinutes / 60);
        addLine(`up ${uptimeHours}:${uptimeMinutes % 60}:${uptimeSeconds % 60}`);
        break;
        
      case 'ps':
        addLine(`  PID TTY          TIME CMD
    1 pts/0    00:00:01 portfolio-sh
    2 pts/0    00:00:00 neofetch
    3 pts/0    00:00:00 react-renderer
    4 pts/0    00:00:00 typescript-compiler`);
        break;
        
      case 'apt':
        const aptCmd = args[0];
        const aptArg = args.slice(1).join(' ');
        
        if (aptCmd === 'search') {
          const packages = ['snake-game', 'tetris', 'calculator', 'weather-app', 'todo-list'];
          const matches = packages.filter(pkg => pkg.includes(aptArg));
          if (matches.length > 0) {
            addLine(`Found packages:\n${matches.map(pkg => `  ${pkg} - A ${pkg.replace('-', ' ')}`).join('\n')}`);
          } else {
            addLine(`No packages found matching '${aptArg}'`);
          }
        } else if (aptCmd === 'install') {
          if (aptArg === 'snake-game') {
            setInstalledPackages(prev => [...prev, 'snake-game']);
            addLine('Installing snake-game...\n[████████████████████████████████████████] 100%\nsnake-game installed successfully!\nTry running: snake');
          } else {
            addLine(`Package '${aptArg}' not found`);
          }
        } else if (aptCmd === 'list') {
          if (installedPackages.length === 0) {
            addLine('No packages installed');
          } else {
            addLine(`Installed packages:\n${installedPackages.join('\n')}`);
          }
        } else {
          addLine('Usage: apt [search|install|list] [package]');
        }
        break;
        
      case 'theme':
        if (args.includes('dracula')) {
          setCurrentTheme('dracula');
          addLine('Theme changed to Dracula 🧛‍♂️');
        } else if (args.includes('matrix')) {
          setCurrentTheme('matrix');
          addLine('Theme changed to Matrix 🔰');
        } else if (args.includes('default')) {
          setCurrentTheme('default');
          addLine('Theme changed to Default 💚');
        } else {
          addLine('Available themes: default, dracula, matrix\nUsage: theme [name]');
        }
        break;
        
      case 'snake':
        if (installedPackages.includes('snake-game')) {
          addLine('Starting Snake Game... 🐍\n(This would launch a snake game in a real implementation)');
        } else {
          addLine('snake: command not found\nTry: apt install snake-game');
        }
        break;
        
      case 'cowsay':
        const message = arg || 'Hello, World!';
        addLine(`<span class="text-green-400"> ${'_'.repeat(message.length + 2)}
< ${message} >
 ${'‾'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||</span>`, false, true);
        break;
        
      case 'sl':
        addLine('🚂💨 Choo choo! The steam locomotive has passed by!');
        break;
        
      case 'factor':
        const num = parseInt(arg);
        if (isNaN(num)) {
          addLine('factor: invalid number');
        } else {
          const factors = [];
          let n = num;
          for (let i = 2; i * i <= n; i++) {
            while (n % i === 0) {
              factors.push(i);
              n /= i;
            }
          }
          if (n > 1) factors.push(n);
          addLine(`${num}: ${factors.join(' ')}`);
        }
        break;
        
      case 'head':
        if (!arg) {
          addLine('head: missing operand');
        } else {
          try {
            const current = getCurrentDirectory();
            const file = current[arg];
            if (typeof file === 'string') {
              const lines = file.split('\n').slice(0, 10);
              addLine(lines.join('\n'));
            } else {
              addLine(`head: ${arg}: Is a directory`);
            }
          } catch {
            addLine(`head: ${arg}: No such file or directory`);
          }
        }
        break;
        
      case 'tail':
        if (!arg) {
          addLine('tail: missing operand');
        } else {
          try {
            const current = getCurrentDirectory();
            const file = current[arg];
            if (typeof file === 'string') {
              const lines = file.split('\n').slice(-10);
              addLine(lines.join('\n'));
            } else {
              addLine(`tail: ${arg}: Is a directory`);
            }
          } catch {
            addLine(`tail: ${arg}: No such file or directory`);
          }
        }
        break;
        
      case 'grep':
        if (!arg) {
          addLine('grep: missing operand');
        } else {
          addLine('grep: requires file input or pipe');
        }
        break;
        
      case 'find':
        if (!arg) {
          addLine('find: missing operand');
        } else {
          const searchResults: string[] = [];
          const searchInDir = (dir: FileSystemItem, path: string) => {
            Object.keys(dir).forEach(key => {
              const fullPath = path + '/' + key;
              if (key.includes(arg)) {
                searchResults.push(fullPath);
              }
              if (typeof dir[key] === 'object') {
                searchInDir(dir[key] as FileSystemItem, fullPath);
              }
            });
          };
          
          searchInDir(fileSystem, '');
          
          if (searchResults.length > 0) {
            addLine(searchResults.join('\n'));
          } else {
            addLine(`find: '${arg}': No such file or directory`);
          }
        }
        break;
        
      default:
        addLine(`Command not found: ${command}\nType 'help' for available commands.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (currentInput.trim()) {
        setCommandHistory(prev => [currentInput, ...prev]);
        handleCommand(currentInput);
      }
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for commands
      const commands = ['help', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'clear', 'history', 'neofetch', 'exit'];
      const matches = commands.filter(cmd => cmd.startsWith(currentInput));
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      }
    }
  };

  const bootSequence = [
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

  useEffect(() => {
    (window as Window & { startTime?: number }).startTime = Date.now();

    if (isBooting) {
      let index = 0;
      const bootInterval = setInterval(() => {
        if (index < bootSequence.length) {
          addLine(bootSequence[index]);
          index++;
        } else {
          clearInterval(bootInterval);
          setIsBooting(false);
        }
      }, 300);
      
      return () => clearInterval(bootInterval);
    }
  }, [isBooting]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (inputRef.current && !isBooting) {
      inputRef.current.focus();
    }
  }, [isBooting, lines]);

  const MatrixRain = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const columns = Math.floor(window.innerWidth / 20);
    const drops = Array(columns).fill(0);
    
    useEffect(() => {
      const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = '15px monospace';
        
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(text, i * 20, drops[i] * 20);
          
          if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };
      
      const interval = setInterval(draw, 35);
      return () => clearInterval(interval);
    }, []);
    
    return (
      <canvas
        id="matrix-canvas"
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ background: 'rgba(0, 0, 0, 0.8)' }}
      />
    );
  };

  const theme = getTheme();

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-mono text-sm relative overflow-hidden`}>
      {showMatrix && <MatrixRain />}
      
      <div
        ref={terminalRef}
        className="h-screen overflow-y-auto p-4 pb-20"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line) => (
          <div key={line.id} className="mb-1 whitespace-pre-wrap break-words">
            <span 
              className={
                line.isCommand ? theme.command : 
                line.isSpecial ? '' : 
                theme.text
              }
              dangerouslySetInnerHTML={{ __html: line.content }}
            />
          </div>
        ))}
        
        {!isBooting && (
          <div className="flex items-center">
            <span className={theme.prompt}>{getPrompt()}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 bg-transparent border-none outline-none ${theme.text} terminal-cursor`}
              autoFocus
              spellCheck={false}
            />
          </div>
        )}
      </div>
      
      {/* Mobile touch area */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-16 bg-transparent md:hidden"
        onClick={() => inputRef.current?.focus()}
      />
      
      {/* Cursor blink animation */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes cursor-blink {
          0%, 50% { 
            border-right: 2px solid #4ade80;
            background-color: #4ade80;
          }
          51%, 100% { 
            border-right: 2px solid transparent;
            background-color: transparent;
          }
        }
        .terminal-cursor {
          caret-color: transparent;
          position: relative;
        }
        .terminal-cursor::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 2px;
          height: 100%;
          background-color: #4ade80;
          animation: cursor-blink 1s infinite;
        }
        .terminal-cursor:focus::after {
          animation: cursor-blink 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default Terminal;