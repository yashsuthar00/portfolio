'use client';

import { useResponsive } from '@/hooks';
import { ShutdownMessage, TerminalConfig } from '@/types';
import {
  handleAboutCommand,
  handleCertificationsCommand,
  handleContactCommand,
  handleEducationCommand,
  handleExperienceCommand,
  handleHelpCommand,
  handleProjectsCommand,
  handleResumeCommand,
  handleSkillsCommand,
  handleSocialCommand,
  handleSocialLinkCommand,
  handleSudoCommand,
  handleWhoamiCommand,
  showWelcomeWithTypewriter,
  TerminalWriter,
} from '@/utils';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const terminal = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fitAddon = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
  const { isMobile } = useResponsive();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getTerminalConfig = useCallback(
    (): TerminalConfig => ({
      theme: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#00ff00',
        cursorAccent: '#000000',
        selectionBackground: 'rgba(0, 255, 0, 0.3)',
      },
      fontFamily:
        '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Fira Code", "SF Mono", Monaco, Menlo, "Ubuntu Mono", "Courier New", monospace',
      fontSize: isMobile ? 14 : 18,
      fontWeight: 'normal',
      lineHeight: 1.4,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      tabStopWidth: 4,
    }),
    [isMobile]
  );

  const createTerminalWriter = useCallback(
    (): TerminalWriter => ({
      write: (text: string) => terminal.current?.write(text),
      clear: () => terminal.current?.clear(),
    }),
    []
  );

  const showWelcomeMessage = useCallback(async () => {
    if (!terminal.current) return;

    const writer = createTerminalWriter();
    await showWelcomeWithTypewriter(writer, isMobile);
  }, [isMobile, createTerminalWriter]);

  const showPrompt = useCallback(() => {
    if (!terminal.current) return;
    terminal.current.write('\x1b[34myash@portfolio:~$ \x1b[0m');

    // Auto-scroll to bottom to ensure content is visible
    setTimeout(() => {
      if (terminal.current) {
        terminal.current.scrollToBottom();
      }
    }, 50);
  }, []);

  const handleShutdownSequence = useCallback(() => {
    if (!terminal.current) return;

    terminal.current.write(
      '\x1b[33m⚡ Initiating terminal shutdown sequence...\r\n'
    );
    terminal.current.write(
      '\x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\r\n'
    );

    const shutdownMessages: ShutdownMessage[] = [
      { msg: '🔐 Securing session...', color: '\x1b[32m', delay: 500 },
      { msg: '💾 Saving terminal state...', color: '\x1b[32m', delay: 800 },
      { msg: '🧹 Cleaning up processes...', color: '\x1b[32m', delay: 1100 },
      {
        msg: '🌐 Closing network connections...',
        color: '\x1b[32m',
        delay: 1400,
      },
      { msg: '⚡ Power down initiated...', color: '\x1b[33m', delay: 1700 },
    ];

    shutdownMessages.forEach(message => {
      setTimeout(() => {
        terminal.current?.write(`${message.color}${message.msg}\r\n\x1b[0m`);
      }, message.delay);
    });

    // Linux-style shutdown sequence
    const linuxMessages = [
      { msg: '[ OK ] Stopped session.', delay: 2200 },
      { msg: '[ OK ] Stopped terminal service.', delay: 2500 },
      { msg: '[ OK ] Reached target shutdown.', delay: 2800 },
      { msg: '[ OK ] System halted.', delay: 3100 },
    ];

    linuxMessages.forEach(message => {
      setTimeout(() => {
        terminal.current?.write(`\x1b[90m${message.msg}\r\n\x1b[0m`);
      }, message.delay);
    });

    // Screen fade effect
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.style.transition = 'opacity 2s ease-out';
        terminalRef.current.style.opacity = '0';
      }
    }, 3400);

    // Complete shutdown
    setTimeout(() => {
      terminal.current?.clear();
      if (terminalRef.current) {
        terminalRef.current.style.opacity = '1';
        terminalRef.current.style.transition = '';
      }

      terminal.current?.write(
        '\x1b[90m\r\nSystem powered down.\r\n\r\nPress any key to restart...\r\n\x1b[0m'
      );
      setIsShutdown(true);
    }, 5500);
  }, []);

  const handleBootSequence = useCallback(() => {
    if (!terminal.current) return;

    terminal.current.clear();
    terminal.current.write('\x1b[32m⚡ Initializing system...\r\n\x1b[0m');

    const bootMessages = [
      { msg: '[ OK ] Starting terminal service...', delay: 300 },
      { msg: '[ OK ] Loading user session...', delay: 600 },
      { msg: '[ OK ] System ready.', delay: 1000 },
    ];

    bootMessages.forEach(message => {
      setTimeout(() => {
        terminal.current?.write(`\x1b[90m${message.msg}\r\n\x1b[0m`);
      }, message.delay);
    });

    setTimeout(async () => {
      terminal.current?.write('\r\n');
      await showWelcomeMessage();
      showPrompt();
      setIsShutdown(false);
    }, 1200);
  }, [showWelcomeMessage, showPrompt]);

  const handleCommand = useCallback(
    async (command: string) => {
      if (!terminal.current) return;

      const cmd = command.trim().toLowerCase();
      const writer = createTerminalWriter();

      switch (cmd) {
        case 'help':
          await handleHelpCommand(writer, isMobile);
          break;
        case 'about':
          await handleAboutCommand(writer);
          break;
        case 'skills':
          await handleSkillsCommand(writer);
          break;
        case 'projects':
          await handleProjectsCommand(writer);
          break;
        case 'contact':
          await handleContactCommand(writer);
          break;
        case 'experience':
          await handleExperienceCommand(writer);
          break;
        case 'education':
          await handleEducationCommand(writer);
          break;
        case 'certifications':
          await handleCertificationsCommand(writer);
          break;
        case 'whoami':
          await handleWhoamiCommand(writer);
          break;
        case 'sudo':
          await handleSudoCommand(writer);
          break;
        case 'social':
          await handleSocialCommand(writer);
          break;
        case 'github':
        case 'linkedin':
        case 'leetcode':
        case 'codeforces':
          await handleSocialLinkCommand(writer, cmd);
          break;
        case 'resume':
          await handleResumeCommand(writer);
          break;
        case 'clear':
          terminal.current.clear();
          showPrompt();
          return;
        case 'exit':
          handleShutdownSequence();
          return;
        case '':
          break;
        default:
          terminal.current.write(
            `\x1b[31mbash: ${command}: command not found\r\n`
          );
          terminal.current.write(
            'Type "help" to see available commands.\r\n\x1b[0m'
          );
          break;
      }
      terminal.current.write('\r\n');

      // Auto-scroll to bottom after command execution
      setTimeout(() => {
        if (terminal.current) {
          terminal.current.scrollToBottom();
        }
      }, 100);
    },
    [createTerminalWriter, showPrompt, handleShutdownSequence, isMobile]
  );

  useEffect(() => {
    if (!isMounted || !terminalRef.current || terminal.current) return;

    const initTerminal = async () => {
      try {
        const { Terminal } = await import('@xterm/xterm');
        const { FitAddon } = await import('@xterm/addon-fit');
        const { Unicode11Addon } = await import('@xterm/addon-unicode11');

        const config = getTerminalConfig();

        terminal.current = new Terminal({
          theme: config.theme,
          fontFamily: config.fontFamily,
          fontSize: config.fontSize,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fontWeight: config.fontWeight as any,
          lineHeight: config.lineHeight,
          cursorBlink: config.cursorBlink,
          cursorStyle: config.cursorStyle,
          scrollback: config.scrollback,
          tabStopWidth: config.tabStopWidth,
          allowProposedApi: true,
          allowTransparency: true,
          convertEol: true,
          letterSpacing: 0,
        });

        fitAddon.current = new FitAddon();
        const unicode11Addon = new Unicode11Addon();

        terminal.current.loadAddon(fitAddon.current);
        terminal.current.loadAddon(unicode11Addon);
        terminal.current.unicode.activeVersion = '11';
        terminal.current.open(terminalRef.current);

        setTimeout(async () => {
          if (terminal.current) {
            terminal.current.clear();
            await showWelcomeMessage();
            showPrompt();
            terminal.current.focus();
          }
        }, 100);

        let commandBuffer = '';
        terminal.current.onData((data: string) => {
          if (!terminal.current) return;

          if (isShutdown) {
            handleBootSequence();
            return;
          }

          if (data === '\r') {
            // Enter key
            if (commandBuffer.trim().toLowerCase() === 'clear') {
              terminal.current.write('\r\n');
              handleCommand(commandBuffer).then(() => {
                commandBuffer = '';
              });
              return;
            }

            terminal.current.write('\r');
            terminal.current.write('\x1b[K');
            terminal.current.write(
              `\x1b[34myash@portfolio:~$ \x1b[32m${commandBuffer}\x1b[0m\r\n`
            );
            handleCommand(commandBuffer).then(() => {
              commandBuffer = '';
              showPrompt();
            });
          } else if (data === '\u007f') {
            // Backspace
            if (commandBuffer.length > 0) {
              terminal.current.write('\b \b');
              commandBuffer = commandBuffer.slice(0, -1);
            }
          } else if (data >= ' ') {
            // Printable characters
            terminal.current.write('\x1b[32m' + data + '\x1b[0m');
            commandBuffer += data;
          }
        });

        const handleResize = () => {
          if (fitAddon.current && terminal.current) {
            try {
              fitAddon.current.fit();
            } catch (error) {
              // eslint-disable-next-line no-console
              console.warn('Terminal resize failed:', error);
            }
          }
        };

        window.addEventListener('resize', handleResize);
        // Initial fit with multiple attempts to ensure proper sizing
        setTimeout(handleResize, 100);
        setTimeout(handleResize, 300);
        setTimeout(handleResize, 500);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (terminal.current) {
            terminal.current.dispose();
          }
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize terminal:', error);
      }
    };

    initTerminal();
  }, [
    isMounted,
    getTerminalConfig,
    showWelcomeMessage,
    showPrompt,
    handleCommand,
    isShutdown,
    handleBootSequence,
  ]);

  if (!isMounted) {
    return (
      <div className='flex h-full w-full items-center justify-center overflow-hidden bg-black'>
        <div className='font-mono text-base text-green-400'>
          Loading terminal...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`flex h-full w-full flex-col overflow-hidden bg-black ${
        isMobile ? 'mobile-terminal-fullscreen' : ''
      }`}
      initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: isMobile ? 0.2 : 0.4 }}
    >
      {/* Command Bar - Fixed at top of terminal */}
      <div className='w-full flex-shrink-0 border-b border-green-500/20 bg-black px-4 py-2'>
        <div
          className='font-mono text-green-400'
          style={{
            fontSize: isMobile ? '14px' : '18px',
          }}
        >
          {isMobile ? (
            // Mobile: Show fewer commands
            <span>
              help | about | social | projects | skills | contact | clear
            </span>
          ) : (
            // Desktop: Show all commands
            <span>
              help | about | social | projects | skills | experience | contact |
              education | certifications | sudo | whoami | clear
            </span>
          )}
        </div>
      </div>

      {/* Terminal Content - Scrollable */}
      <div
        ref={terminalRef}
        className={`min-h-0 w-full flex-1 overflow-auto ${
          isMobile ? 'p-2' : 'p-1.5 sm:p-2'
        }`}
      />
    </motion.div>
  );
};

export default TerminalComponent;
