import { CommandContext } from './general';

export function handlePwd(ctx: CommandContext) {
  ctx.addLine(`/${ctx.currentDir.join('/')}`);
}

export function handleWhoami(ctx: CommandContext) {
  ctx.addLine('yash');
}

export function handleHostname(ctx: CommandContext) {
  ctx.addLine('portfolio');
}
