import { CommandContext } from './commands/general';
import { handleHelp, handleLs } from './commands/general';
import { handleCd } from './commands/navigation';
import { handlePwd, handleWhoami, handleHostname } from './commands/system';
import { handleCat } from './commands/fileops';
import { handleNeofetch, handleDate } from './commands/fun';
import { getYashManText, getRandomFortune } from './terminalTextUtils';
import { FileSystemItem } from './terminalTextUtils';

export function handleCommand(input: string, ctx: CommandContext) {
  const [command, ...args] = input.trim().split(' ');
  const arg = args.join(' ');

  ctx.addLine(`${ctx.getPrompt()}${input}`, true);

  switch (command.toLowerCase()) {
    case 'help':
      handleHelp(ctx);
      break;
    case 'ls':
      handleLs(ctx, arg, args);
      break;
    case 'cd':
      handleCd(ctx, arg);
      break;
    case 'pwd':
      handlePwd(ctx);
      break;
    case 'cat':
      handleCat(ctx, arg);
      break;
    case 'whoami':
      handleWhoami(ctx);
      break;
    case 'hostname':
      handleHostname(ctx);
      break;
    case 'neofetch':
      handleNeofetch(ctx);
      break;
    case 'date':
      handleDate(ctx);
      break;
    case 'clear':
      ctx.setLines([]);
      break;
    case 'history':
      ctx.commandHistory.forEach((cmd, index) => {
        ctx.addLine(`${index + 1}  ${cmd}`);
      });
      break;
    case 'man':
      if (arg === 'yash') {
        ctx.addLine(getYashManText());
      } else if (arg) {
        ctx.addLine(`No manual entry for ${arg}`);
      } else {
        ctx.addLine('What manual page do you want?');
      }
      break;
    case 'sudo':
      if (arg === 'rm -rf /') {
        ctx.addLine('😱 Nice try! But I\'m not falling for that one.\n\n🛡️  Permission denied: Cannot delete the universe.\n\n💡 Pro tip: Try something less destructive! 😄');
      } else {
        ctx.addLine(`[sudo] password for yash: \nSorry, try again.`);
      }
      break;
    case 'exit':
      ctx.addLine('Goodbye! 👋');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      break;
    case 'matrix':
      ctx.setShowMatrix(true);
      setTimeout(() => ctx.setShowMatrix(false), 5000);
      ctx.addLine('Entering the Matrix... 🔴💊');
      break;
    case 'fortune':
      ctx.addLine(getRandomFortune());
      break;
    case 'tree':
      ctx.addLine(`/home/yash/\n├── README.md\n├── bio.txt\n├── contact.txt\n├── skills/\n│   ├── languages.txt\n│   ├── frameworks.txt\n│   └── tools.txt\n├── projects/\n│   ├── e-commerce.md\n│   ├── ai-chatbot.md\n│   └── portfolio.md\n├── certifications/\n│   ├── aws.txt\n│   ├── docker.txt\n│   └── react.txt\n└── .secrets/\n    └── secret.txt`);
      break;
    case 'uptime': {
      const win = window as Window & { startTime?: number };
      const uptimeMs = Date.now() - (win.startTime ?? 0);
      const uptimeSeconds = Math.floor(uptimeMs / 1000);
      const uptimeMinutes = Math.floor(uptimeSeconds / 60);
      const uptimeHours = Math.floor(uptimeMinutes / 60);
      ctx.addLine(`up ${uptimeHours}:${uptimeMinutes % 60}:${uptimeSeconds % 60}`);
      break;
    }
    case 'ps':
      ctx.addLine(`  PID TTY          TIME CMD\n    1 pts/0    00:00:01 portfolio-sh\n    2 pts/0    00:00:00 neofetch\n    3 pts/0    00:00:00 react-renderer\n    4 pts/0    00:00:00 typescript-compiler`);
      break;
    case 'apt': {
      const aptCmd = args[0];
      const aptArg = args.slice(1).join(' ');
      if (aptCmd === 'search') {
        const packages = ['snake-game', 'tetris', 'calculator', 'weather-app', 'todo-list'];
        const matches = packages.filter(pkg => pkg.includes(aptArg));
        if (matches.length > 0) {
          ctx.addLine(`Found packages:\n${matches.map(pkg => `  ${pkg} - A ${pkg.replace('-', ' ')}`).join('\n')}`);
        } else {
          ctx.addLine(`No packages found matching '${aptArg}'`);
        }
      } else if (aptCmd === 'install') {
        if (aptArg === 'snake-game') {
          ctx.setInstalledPackages(prev => [...prev, 'snake-game']);
          ctx.addLine('Installing snake-game...\n[████████████████████████████████████████] 100%\nsnake-game installed successfully!\nTry running: snake');
        } else {
          ctx.addLine(`Package '${aptArg}' not found`);
        }
      } else if (aptCmd === 'list') {
        if (ctx.installedPackages.length === 0) {
          ctx.addLine('No packages installed');
        } else {
          ctx.addLine(`Installed packages:\n${ctx.installedPackages.join('\n')}`);
        }
      } else {
        ctx.addLine('Usage: apt [search|install|list] [package]');
      }
      break;
    }
    case 'theme':
      if (args.includes('dracula')) {
        ctx.setCurrentTheme('dracula');
        ctx.addLine('Theme changed to Dracula 🧛‍♂️');
      } else if (args.includes('matrix')) {
        ctx.setCurrentTheme('matrix');
        ctx.addLine('Theme changed to Matrix 🔰');
      } else if (args.includes('default')) {
        ctx.setCurrentTheme('default');
        ctx.addLine('Theme changed to Default 💚');
      } else {
        ctx.addLine('Available themes: default, dracula, matrix\nUsage: theme [name]');
      }
      break;
    case 'snake':
      if (ctx.installedPackages.includes('snake-game')) {
        ctx.addLine('Starting Snake Game... 🐍\n(This would launch a snake game in a real implementation)');
      } else {
        ctx.addLine('snake: command not found\nTry: apt install snake-game');
      }
      break;
    case 'cowsay': {
      const message = arg || 'Hello, World!';
      ctx.addLine(`<span class="text-green-400"> ${'_'.repeat(message.length + 2)}\n< ${message} >\n ${'‾'.repeat(message.length + 2)}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||</span>`, false, true);
      break;
    }
    case 'sl':
      ctx.addLine('🚂💨 Choo choo! The steam locomotive has passed by!');
      break;
    case 'factor': {
      const num = parseInt(arg);
      if (isNaN(num)) {
        ctx.addLine('factor: invalid number');
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
        ctx.addLine(`${num}: ${factors.join(' ')}`);
      }
      break;
    }
    case 'head': {
      if (!arg) {
        ctx.addLine('head: missing operand');
      } else {
        try {
          const current = ctx.getCurrentDirectory();
          const file = current[arg];
          if (typeof file === 'string') {
            const lines = file.split('\n').slice(0, 10);
            ctx.addLine(lines.join('\n'));
          } else {
            ctx.addLine(`head: ${arg}: Is a directory`);
          }
        } catch {
          ctx.addLine(`head: ${arg}: No such file or directory`);
        }
      }
      break;
    }
    case 'tail': {
      if (!arg) {
        ctx.addLine('tail: missing operand');
      } else {
        try {
          const current = ctx.getCurrentDirectory();
          const file = current[arg];
          if (typeof file === 'string') {
            const lines = file.split('\n').slice(-10);
            ctx.addLine(lines.join('\n'));
          } else {
            ctx.addLine(`tail: ${arg}: Is a directory`);
          }
        } catch {
          ctx.addLine(`tail: ${arg}: No such file or directory`);
        }
      }
      break;
    }
    case 'grep':
      if (!arg) {
        ctx.addLine('grep: missing operand');
      } else {
        ctx.addLine('grep: requires file input or pipe');
      }
      break;
    case 'find': {
      if (!arg) {
        ctx.addLine('find: missing operand');
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
        searchInDir(ctx.fileSystem, '');
        if (searchResults.length > 0) {
          ctx.addLine(searchResults.join('\n'));
        } else {
          ctx.addLine(`find: '${arg}': No such file or directory`);
        }
      }
      break;
    }
    default:
      ctx.addLine(`Command not found: ${command}\nType 'help' for available commands.`);
  }
}
