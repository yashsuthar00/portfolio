import { CommandContext } from './general';
import { FileSystemItem } from '../terminalTextUtils';

export function handleCd(ctx: CommandContext, arg: string) {
  if (!arg || arg === '~') {
    ctx.setCurrentDir(['home', 'yash']);
  } else {
    const newPath = ctx.resolvePath(arg);
    try {
      let testDir: FileSystemItem = ctx.fileSystem;
      for (const dir of newPath) {
        const next = testDir[dir];
        if (typeof next === 'object' && next !== null) {
          testDir = next as FileSystemItem;
        } else {
          throw new Error('Not a directory');
        }
      }
      ctx.setCurrentDir(newPath);
    } catch {
      ctx.addLine(`cd: ${arg}: No such file or directory`);
    }
  }
}
