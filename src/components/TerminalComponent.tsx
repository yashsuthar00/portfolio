'use client';

import { useResponsive } from '@/hooks';
import { TerminalConfig } from '@/types';
import {
  getTypingStatus,
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
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { isMobile } = useResponsive();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addToHistory = useCallback((command: string) => {
    const trimmedCommand = command.trim();
    if (trimmedCommand && trimmedCommand !== '') {
      setCommandHistory(prev => {
        // Remove the command if it already exists to avoid duplicates
        const filtered = prev.filter(cmd => cmd !== trimmedCommand);
        // Add the new command to the end and keep only last 50 commands
        const newHistory = [...filtered, trimmedCommand].slice(-50);
        return newHistory;
      });
    }
    setHistoryIndex(-1); // Reset history index after adding command
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
        '"Fira Code", "SF Mono", Monaco, Menlo, "Ubuntu Mono", "Courier New", monospace',
      fontSize: isMobile ? 14 : 16,
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

    // Auto-scroll to bottom to ensure content is visible, with padding for footer
    setTimeout(() => {
      if (terminal.current) {
        const viewport =
          terminal.current.element?.querySelector('.xterm-viewport');
        if (viewport) {
          // Clear any existing scroll timeout
          const existingTimeout = (viewport as any).scrollTimeout;
          if (existingTimeout) {
            clearTimeout(existingTimeout);
          }

          // Debounced scroll to prevent lag
          const offset = isMobile ? 80 : 60;
          (viewport as any).scrollTimeout = setTimeout(() => {
            viewport.scrollTo({
              top: viewport.scrollHeight - viewport.clientHeight - offset,
              behavior: 'smooth',
            });
          }, 100);
        }
      }

      // Intercept paste events and convert Unicode codepoint text to emoji
      terminal.current.attachCustomKeyEventHandler((_e: KeyboardEvent) => {
        // Let all key events pass through
        return true;
      });
      terminal.current.element?.addEventListener(
        'paste',
        (event: ClipboardEvent) => {
          if (!event.clipboardData) return;
          let pasted = event.clipboardData.getData('text');
          // Replace any \U0001f60e style codepoints with actual emoji
          pasted = pasted.replace(/\\U([0-9a-fA-F]{8})/g, (match, code) => {
            try {
              return String.fromCodePoint(parseInt(code, 16));
            } catch {
              return match;
            }
          });
          // Write the processed text to the terminal
          terminal.current.write(pasted);
          event.preventDefault();
        }
      );
    }, 50);
  }, [isMobile]);

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
        case 'cv':
          await handleResumeCommand(writer);
          break;
        case 'clear':
          terminal.current.clear();
          showPrompt();
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

      // Enhanced auto-scroll after command execution, especially for mobile - with debounce
      setTimeout(
        () => {
          if (terminal.current) {
            const viewport =
              terminal.current.element?.querySelector('.xterm-viewport');
            if (viewport) {
              // Clear any existing scroll timeout to prevent conflicts
              const existingTimeout = (viewport as any).scrollTimeout;
              if (existingTimeout) {
                clearTimeout(existingTimeout);
              }

              const offset = isMobile ? 80 : 60;
              (viewport as any).scrollTimeout = setTimeout(() => {
                viewport.scrollTo({
                  top: viewport.scrollHeight - viewport.clientHeight - offset,
                  behavior: 'smooth',
                });
              }, 150); // Debounced scroll
            }
          }
        },
        isMobile ? 300 : 150
      );
    },
    [createTerminalWriter, showPrompt, isMobile]
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
          fontWeightBold: 'normal',
          macOptionIsMeta: true,
          rightClickSelectsWord: false,
          windowsMode: false,
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

        const insertCommand = (command: string) => {
          if (!terminal.current) return;

          // Clear current input
          const currentLength = commandBuffer.length;
          for (let i = 0; i < currentLength; i++) {
            terminal.current.write('\b \b');
          }

          // Write new command
          commandBuffer = command;
          terminal.current.write('\x1b[32m' + command + '\x1b[0m');
        };

        terminal.current.onData((data: string) => {
          if (!terminal.current) return;

          // Don't allow input while typing animation is running
          if (getTypingStatus()) {
            return;
          }

          if (data === '\r') {
            // Enter key - dismiss keyboard on mobile and handle command
            if (isMobile) {
              // Immediate keyboard dismissal attempt
              setTimeout(() => {
                if (terminal.current?.element) {
                  const textarea =
                    terminal.current.element.querySelector('textarea');
                  if (textarea) {
                    textarea.blur();
                  }
                  terminal.current.element.blur();
                }
              }, 50);
            }

            // Handle clear command specially for mobile
            if (commandBuffer.trim().toLowerCase() === 'clear') {
              terminal.current.write('\r\n');
              addToHistory(commandBuffer); // Add to history
              handleCommand(commandBuffer).then(() => {
                commandBuffer = '';

                // Additional keyboard dismissal for clear command
                if (isMobile) {
                  setTimeout(() => {
                    if (
                      document.activeElement &&
                      document.activeElement instanceof HTMLElement
                    ) {
                      document.activeElement.blur();
                    }
                  }, 100);
                }
              });
              return;
            }

            terminal.current.write('\r');
            terminal.current.write('\x1b[K');
            terminal.current.write(
              `\x1b[34myash@portfolio:~$ \x1b[32m${commandBuffer}\x1b[0m\r\n`
            );

            addToHistory(commandBuffer); // Add to history
            handleCommand(commandBuffer).then(() => {
              commandBuffer = '';
              showPrompt();

              // Dismiss keyboard on mobile/tablet after command completion
              if (isMobile) {
                setTimeout(() => {
                  if (terminal.current?.element) {
                    // Focus and immediately blur to dismiss keyboard
                    const textarea =
                      terminal.current.element.querySelector('textarea');
                    if (textarea) {
                      textarea.blur();
                    }
                    // Also try to blur the main element
                    terminal.current.element.blur();
                    // Remove focus from any active element
                    if (
                      document.activeElement &&
                      document.activeElement instanceof HTMLElement
                    ) {
                      document.activeElement.blur();
                    }
                  }
                }, 300);
              }

              // Enhanced auto-scroll for mobile after command completion
              if (isMobile) {
                setTimeout(() => {
                  if (terminal.current) {
                    const viewport =
                      terminal.current.element?.querySelector(
                        '.xterm-viewport'
                      );
                    if (viewport) {
                      viewport.scrollTo({
                        top: viewport.scrollHeight - viewport.clientHeight - 80,
                        behavior: 'smooth',
                      });
                    }
                  }
                }, 500);
              }
            });
          } else if (data === '\u007f') {
            // Backspace
            if (commandBuffer.length > 0) {
              terminal.current.write('\b \b');
              commandBuffer = commandBuffer.slice(0, -1);
            }
          } else if (data === '\x1b[A') {
            // Up arrow - navigate to previous command
            if (commandHistory.length > 0) {
              let newIndex = historyIndex;
              if (historyIndex === -1) {
                newIndex = commandHistory.length - 1;
              } else if (historyIndex > 0) {
                newIndex = historyIndex - 1;
              }

              if (newIndex !== historyIndex && newIndex >= 0) {
                // Clear current command
                for (let i = 0; i < commandBuffer.length; i++) {
                  terminal.current.write('\b \b');
                }

                // Write historical command
                const historicalCommand = commandHistory[newIndex];
                terminal.current.write(
                  '\x1b[32m' + historicalCommand + '\x1b[0m'
                );
                commandBuffer = historicalCommand;
                setHistoryIndex(newIndex);
              }
            }
          } else if (data === '\x1b[B') {
            // Down arrow - navigate to next command
            if (commandHistory.length > 0 && historyIndex !== -1) {
              let newIndex = historyIndex;
              if (historyIndex < commandHistory.length - 1) {
                newIndex = historyIndex + 1;
              } else {
                newIndex = -1; // Go to empty command
              }

              // Clear current command
              for (let i = 0; i < commandBuffer.length; i++) {
                terminal.current.write('\b \b');
              }

              if (newIndex === -1) {
                // Empty command
                commandBuffer = '';
                setHistoryIndex(-1);
              } else {
                // Write historical command
                const historicalCommand = commandHistory[newIndex];
                terminal.current.write(
                  '\x1b[32m' + historicalCommand + '\x1b[0m'
                );
                commandBuffer = historicalCommand;
                setHistoryIndex(newIndex);
              }
            }
          } else if (data >= ' ') {
            // Printable characters
            terminal.current.write('\x1b[32m' + data + '\x1b[0m');
            commandBuffer += data;
          }
        });

        // Expose insertCommand to be used by command bar clicks
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (terminal.current as any).insertCommand = insertCommand;

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
    isMobile,
    addToHistory,
    commandHistory,
    historyIndex,
  ]);

  const handleCommandClick = useCallback((command: string) => {
    // Don't allow command insertion while typing animation is running
    if (getTypingStatus()) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (terminal.current && (terminal.current as any).insertCommand) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (terminal.current as any).insertCommand(command);
      // Focus the terminal after inserting command
      setTimeout(() => {
        if (terminal.current) {
          terminal.current.focus();
        }
      }, 50);
    }
  }, []);

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
      {/* Command Bar - Hidden on mobile, fixed at top on desktop */}
      {!isMobile && (
        <div className='w-full flex-shrink-0 border-b border-green-500/20 bg-black px-2 py-1 sm:px-4 sm:py-2'>
          <div
            className='font-mono text-green-400'
            style={{
              fontSize: '15px',
            }}
          >
            {/* Desktop: Show all commands */}
            <div className='flex flex-wrap gap-1'>
              {[
                'help',
                'about',
                'social',
                'projects',
                'skills',
                'experience',
                'contact',
                'education',
                'certifications',
                'sudo',
                'cv',
                'clear',
              ].map((cmd, index, array) => (
                <span key={cmd}>
                  <button
                    onClick={() => handleCommandClick(cmd)}
                    className='cursor-pointer transition-colors duration-200 hover:text-green-200 focus:text-green-200 focus:outline-none'
                    aria-label={`Insert ${cmd} command`}
                  >
                    {cmd}
                  </button>
                  {index < array.length - 1 && (
                    <span className='text-green-500'> | </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Terminal Content - Scrollable */}
      <div
        ref={terminalRef}
        className={`min-h-0 w-full flex-1 overflow-hidden ${
          isMobile ? 'p-1' : 'p-1.5 sm:p-2'
        }`}
      />
    </motion.div>
  );
};

export default TerminalComponent;
