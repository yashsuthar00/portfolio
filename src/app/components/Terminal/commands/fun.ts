import { CommandContext } from './general';
import { getNeofetchText } from '../terminalTextUtils';

export function handleNeofetch(ctx: CommandContext) {
  ctx.addLine(getNeofetchText(ctx.currentTheme, ctx.installedPackages, ctx.fileSystem), false, true);
}

export function handleDate(ctx: CommandContext) {
  ctx.addLine(new Date().toString());
}
