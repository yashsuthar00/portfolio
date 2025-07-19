import { FileSystemItem, TerminalLine, getHelpText } from '../terminalTextUtils';

export interface CommandContext {
  addLine: (content: string, isCommand?: boolean, isSpecial?: boolean) => void;
  setCurrentDir: (dir: string[]) => void;
  setLines: (lines: TerminalLine[]) => void;
  setInstalledPackages: (fn: (prev: string[]) => string[]) => void;
  setCurrentTheme: (theme: string) => void;
  setShowMatrix: (show: boolean) => void;
  commandHistory: string[];
  currentDir: string[];
  fileSystem: FileSystemItem;
  installedPackages: string[];
  currentTheme: string;
  getPrompt: () => string;
  getCurrentDirectory: () => FileSystemItem;
  resolvePath: (path: string) => string[];
}

export function handleHelp(ctx: CommandContext) {
  ctx.addLine(getHelpText());
}

export function handleLs(ctx: CommandContext, arg: string, args: string[]) {
  const lsPath = arg ? ctx.resolvePath(arg) : ctx.currentDir;
  try {
    let lsDir = ctx.fileSystem;
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
      ctx.addLine(`total ${Object.keys(lsDir).length}\n${details.join('\n')}`);
    } else {
      ctx.addLine(items.join('  '));
    }
  } catch {
    ctx.addLine(`ls: cannot access '${arg}': No such file or directory`);
  }
}

// Add more command handlers here as needed
