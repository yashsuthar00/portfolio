"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks';
import { TerminalConfig, ShutdownMessage } from '@/types';
import {
  getWelcomeMessage,
  handleHelpCommand,
  handleAboutCommand,
  handleSkillsCommand,
  handleProjectsCommand,
  handleContactCommand,
  handleSocialCommand,
  handleSocialLinkCommand,
  handleResumeCommand,
  TerminalWriter,
} from '@/utils';

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

  const getTerminalConfig = useCallback((): TerminalConfig => ({
    theme: {
      background: '#000000',
      foreground: '#ffffff',
      cursor: '#00ff00',
      cursorAccent: '#000000',
      selectionBackground: 'rgba(0, 255, 0, 0.3)',
    },
    fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Fira Code", "SF Mono", Monaco, Menlo, "Ubuntu Mono", "Courier New", monospace',
    fontSize: isMobile ? 12 : 14,
    fontWeight: 'normal',
    lineHeight: 1.4,
    cursorBlink: true,
    cursorStyle: 'block',
    scrollback: 1000,
    tabStopWidth: 4,
  }), [isMobile]);

  const showWelcomeMessage = useCallback(() => {
    if (!terminal.current) return;
    
    const welcome = getWelcomeMessage(isMobile);
    welcome.forEach(line => {
      terminal.current?.write('\x1b[37m' + line + '\r\n\x1b[0m');
    });
  }, [isMobile]);

  const showPrompt = useCallback(() => {
    if (!terminal.current) return;
    terminal.current.write('\x1b[34myash@portfolio:~$ \x1b[0m');
  }, []);

  const createTerminalWriter = useCallback((): TerminalWriter => ({
    write: (text: string) => terminal.current?.write(text),
    clear: () => terminal.current?.clear(),
  }), []);

  const handleShutdownSequence = useCallback(() => {
    if (!terminal.current) return;

    terminal.current.write('\x1b[33m⚡ Initiating terminal shutdown sequence...\r\n');
    terminal.current.write('\x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\r\n');
    
    const shutdownMessages: ShutdownMessage[] = [
      { msg: '🔐 Securing session...', color: '\x1b[32m', delay: 500 },
      { msg: '💾 Saving terminal state...', color: '\x1b[32m', delay: 800 },
      { msg: '🧹 Cleaning up processes...', color: '\x1b[32m', delay: 1100 },
      { msg: '🌐 Closing network connections...', color: '\x1b[32m', delay: 1400 },
      { msg: '⚡ Power down initiated...', color: '\x1b[33m', delay: 1700 },
    ];

    shutdownMessages.forEach((message) => {
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

    linuxMessages.forEach((message) => {
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
      
      terminal.current?.write('\x1b[90m\r\nSystem powered down.\r\n\r\nPress any key to restart...\r\n\x1b[0m');
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

    bootMessages.forEach((message) => {
      setTimeout(() => {
        terminal.current?.write(`\x1b[90m${message.msg}\r\n\x1b[0m`);
      }, message.delay);
    });

    setTimeout(() => {
      terminal.current?.write('\r\n');
      showWelcomeMessage();
      showPrompt();
      setIsShutdown(false);
    }, 1200);
  }, [showWelcomeMessage, showPrompt]);

  const handleCommand = useCallback((command: string) => {
    if (!terminal.current) return;

    const cmd = command.trim().toLowerCase();
    const writer = createTerminalWriter();

    switch (cmd) {
      case 'help':
        handleHelpCommand(writer, isMobile);
        break;
      case 'about':
        handleAboutCommand(writer);
        break;
      case 'skills':
        handleSkillsCommand(writer);
        break;
      case 'projects':
        handleProjectsCommand(writer);
        break;
      case 'contact':
        handleContactCommand(writer);
        break;
      case 'social':
        handleSocialCommand(writer);
        break;
      case 'github':
      case 'linkedin':
      case 'leetcode':
      case 'codeforces':
        handleSocialLinkCommand(writer, cmd);
        break;
      case 'resume':
        handleResumeCommand(writer);
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
        terminal.current.write(`\x1b[31mbash: ${command}: command not found\r\n`);
        terminal.current.write('Type "help" to see available commands.\r\n\x1b[0m');
        break;
    }
    terminal.current.write('\r\n');
  }, [createTerminalWriter, showPrompt, handleShutdownSequence, isMobile]);

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
        
        setTimeout(() => {
          if (terminal.current) {
            terminal.current.clear();
            showWelcomeMessage();
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

          if (data === '\r') { // Enter key
            if (commandBuffer.trim().toLowerCase() === 'clear') {
              terminal.current.write('\r\n');
              handleCommand(commandBuffer);
              commandBuffer = '';
              return;
            }
            
            terminal.current.write('\r');
            terminal.current.write('\x1b[K');
            terminal.current.write(`\x1b[34myash@portfolio:~$ \x1b[32m${commandBuffer}\x1b[0m\r\n`);
            handleCommand(commandBuffer);
            commandBuffer = '';
            showPrompt();
          } else if (data === '\u007f') { // Backspace
            if (commandBuffer.length > 0) {
              terminal.current.write('\b \b');
              commandBuffer = commandBuffer.slice(0, -1);
            }
          } else if (data >= ' ') { // Printable characters
            terminal.current.write('\x1b[32m' + data + '\x1b[0m');
            commandBuffer += data;
          }
        });

        const handleResize = () => {
          if (fitAddon.current) {
            fitAddon.current.fit();
          }
        };

        window.addEventListener('resize', handleResize);
        setTimeout(handleResize, 100);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (terminal.current) {
            terminal.current.dispose();
          }
        };
      } catch (error) {
        console.error('Failed to initialize terminal:', error);
      }
    };

    initTerminal();
  }, [isMounted, getTerminalConfig, showWelcomeMessage, showPrompt, handleCommand, isShutdown, handleBootSequence]);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-black border border-green-500/50 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-green-400 font-mono text-sm">Loading terminal...</div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`w-full h-full bg-black border border-green-500/50 rounded-lg overflow-hidden ${isMobile ? 'mobile-terminal-fullscreen' : ''}`}
      initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: isMobile ? 0.2 : 0.4 }}
    >
      {/* Terminal Header */}
      <div className="bg-gray-800 border-b border-green-500/30 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-green-400 font-mono text-xs sm:text-sm">yash@portfolio:~</span>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef} 
        className="w-full h-[calc(100%-32px)] sm:h-[calc(100%-40px)] p-1.5 sm:p-2"
        style={{ minHeight: isMobile ? '250px' : '400px' }}
      />
    </motion.div>
  );
};

export default TerminalComponent;
