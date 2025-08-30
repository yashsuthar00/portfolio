export interface TerminalCommand {
  name: string;
  description: string;
  handler: () => void;
}

export interface TerminalTheme {
  background: string;
  foreground: string;
  cursor: string;
  cursorAccent: string;
  selectionBackground: string;
}

export interface TerminalConfig {
  theme: TerminalTheme;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  lineHeight: number;
  cursorBlink: boolean;
  cursorStyle: 'block' | 'underline' | 'bar';
  scrollback: number;
  tabStopWidth: number;
}

export interface ShutdownMessage {
  msg: string;
  color: string;
  delay: number;
}