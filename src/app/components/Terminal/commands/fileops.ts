import { CommandContext } from './general';

export function handleCat(ctx: CommandContext, arg: string) {
  if (!arg) {
    ctx.addLine('cat: missing operand');
    return;
  }
  try {
    const current = ctx.getCurrentDirectory();
    const file = current[arg];
    if (typeof file === 'string') {
      ctx.addLine(file);
    } else {
      ctx.addLine(`cat: ${arg}: Is a directory`);
    }
  } catch {
    ctx.addLine(`cat: ${arg}: No such file or directory`);
  }
}
