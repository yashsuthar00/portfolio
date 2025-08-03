"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import useTerminal from '@/hooks/useTerminal';
import dynamic from 'next/dynamic';

const SnakeGame = dynamic(() => import('@/components/SnakeGame'), { ssr: false });

interface TerminalComponentProps {
  className?: string;
}

const TerminalComponent: React.FC<TerminalComponentProps> = ({ className = "" }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [showSnakeGame, setShowSnakeGame] = useState<boolean>(false);
  const { session, executeCommand } = useTerminal();

  const writePrompt = useCallback((terminal: Terminal): void => {
    const prompt = `${session.user}@${session.hostname}:${session.currentDirectory}$ `;
    terminal.write(prompt);
  }, [session.user, session.hostname, session.currentDirectory]);

  useEffect(() => {
    if (!terminalRef.current || isInitialized) return;

    const timer = setTimeout(() => {
      const container = terminalRef.current;
      if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) {
        return; // Wait for container to have proper dimensions
      }

      try {
        // Create terminal instance
        const terminal = new Terminal({
          theme: {
            background: '#000000',
            foreground: '#00ff00',
            cursor: '#00ff00',
            cursorAccent: '#000000',
            selectionBackground: '#44aa44',
            black: '#000000',
            red: '#ff5555',
            green: '#00ff00',
            yellow: '#ffff55',
            blue: '#5555ff',
            magenta: '#ff55ff',
            cyan: '#55ffff',
            white: '#bbbbbb',
            brightBlack: '#555555',
            brightRed: '#ff5555',
            brightGreen: '#55ff55',
            brightYellow: '#ffff55',
            brightBlue: '#5555ff',
            brightMagenta: '#ff55ff',
            brightCyan: '#55ffff',
            brightWhite: '#ffffff'
          },
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: 14,
          fontWeight: 'normal',
          lineHeight: 1.2,
          cursorBlink: true,
          cursorStyle: 'block',
          scrollback: 1000,
          tabStopWidth: 4,
          allowProposedApi: true
        });

        // Create and load fit addon
        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);

        // Open terminal
        terminal.open(container);
        
        // Store references
        xtermRef.current = terminal;
        fitAddonRef.current = fitAddon;

        // Fit the terminal
        setTimeout(() => {
          try {
            if (fitAddon && terminal && container.offsetWidth > 0 && container.offsetHeight > 0) {
              fitAddon.fit();
              
              // Hide scrollbar after terminal is rendered
              const viewport = container.querySelector('.xterm-viewport') as HTMLElement;
              if (viewport) {
                viewport.style.scrollbarWidth = 'none';
                (viewport.style as unknown as { msOverflowStyle?: string }).msOverflowStyle = 'none';
                viewport.style.setProperty('scrollbar-width', 'none', 'important');
                viewport.style.setProperty('-ms-overflow-style', 'none', 'important');
              }
            }
          } catch {
            // Ignore fit errors and try again later
            setTimeout(() => {
              try {
                if (fitAddon && terminal) {
                  fitAddon.fit();
                }
              } catch {}
            }, 200);
          }
        }, 200);

        // Write welcome message
        terminal.writeln('🖥️  Yash Suthar Portfolio Terminal v1.0.0');
        terminal.writeln('================================================');
        terminal.writeln('Welcome! Type "help" to see available commands.');
        terminal.writeln('');
        
        // Write initial prompt
        writePrompt(terminal);

        // Handle input
        let currentLine = '';
        terminal.onData((data: string) => {
          const char = data.charCodeAt(0);
          
          if (char === 13) { // Enter
            terminal.writeln('');
            if (currentLine.trim()) {
              executeCommand(currentLine.trim()).then(() => {
                writePrompt(terminal);
              }).catch(() => {
                writePrompt(terminal);
              });
            } else {
              writePrompt(terminal);
            }
            currentLine = '';
            setCurrentInput('');
          } else if (char === 127 || char === 8) { // Backspace
            if (currentLine.length > 0) {
              currentLine = currentLine.slice(0, -1);
              terminal.write('\b \b');
              setCurrentInput(currentLine);
            }
          } else if (char >= 32 && char <= 126) { // Printable characters
            currentLine += data;
            terminal.write(data);
            setCurrentInput(currentLine);
          }
        });

        // Handle window resize
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            if (fitAddon && terminal && container.offsetWidth > 0 && container.offsetHeight > 0) {
              try {
                // Check if terminal is still properly mounted
                const element = terminal.element;
                if (element && element.offsetParent !== null) {
                  fitAddon.fit();
                }
              } catch {}
            }
          }, 100);
        };

        window.addEventListener('resize', handleResize);
        setIsInitialized(true);

      } catch {}
    }, 150);

    return () => clearTimeout(timer);
  }, [isInitialized, executeCommand, writePrompt]);

  // Update terminal output when session changes
  useEffect(() => {
    if (!xtermRef.current || !isInitialized) return;

    const terminal = xtermRef.current;
    const lastOutput = session.output[session.output.length - 1];
    
    if (lastOutput && lastOutput.content) {
      try {
        if (lastOutput.content === '') {
          // Clear command
          terminal.clear();
          writePrompt(terminal);
        } else if (lastOutput.content === 'SNAKE_GAME_COMPONENT') {
          // Show snake game
          setShowSnakeGame(true);
        } else {
          // Regular output
          const lines = lastOutput.content.toString().split('\n');
          lines.forEach((line, index) => {
            if (index === 0 && line.includes('$')) {
              // Skip command echo as it's already shown
              return;
            }
            terminal.writeln(line);
          });
        }
      } catch {}
    }
  }, [session.output, isInitialized, writePrompt]);

  const handleSnakeGameExit = (): void => {
    setShowSnakeGame(false);
    if (xtermRef.current) {
      xtermRef.current.writeln('Game exited. Thanks for playing!');
      writePrompt(xtermRef.current);
    }
  };

  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* Loading indicator */}
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-black rounded-lg border border-green-400/20 z-10">
          <div className="text-green-400 animate-pulse text-lg">Initializing terminal...</div>
        </div>
      )}
      
      {/* Terminal container */}
      <div 
        ref={terminalRef} 
        className="w-full h-full p-4 bg-black rounded-lg border-2 border-green-400/40 focus-within:border-green-400/80 transition-colors duration-200 [&_.xterm-viewport]:!scrollbar-none [&_.xterm-viewport]:!overflow-hidden"
        style={{ 
          minHeight: '400px', 
          minWidth: '300px' 
        }}
      />
      
      {/* Snake Game Overlay */}
      {showSnakeGame && (
        <SnakeGame 
          onExit={handleSnakeGameExit}
          isMobile={typeof window !== 'undefined' && window.innerWidth < 768}
        />
      )}
      
      {/* Mobile helper text */}
      <div className="md:hidden mt-2 text-xs text-green-400/60 text-center">
        Tap terminal to focus • Swipe up for command palette
      </div>
      
      {/* Command suggestions for mobile */}
      {currentInput && (
        <div className="md:hidden mt-2 p-2 bg-gray-900/80 rounded border border-green-400/20">
          <div className="text-xs text-green-400 mb-1">Suggestions:</div>
          <div className="flex flex-wrap gap-1">
            {['help', 'about', 'skills', 'projects'].map(cmd => (
              <button
                key={cmd}
                className="px-2 py-1 bg-green-400/10 text-green-400 rounded text-xs border border-green-400/20"
                onClick={() => {
                  if (xtermRef.current) {
                    // Clear current input
                    for (let i = 0; i < currentInput.length; i++) {
                      xtermRef.current.write('\b \b');
                    }
                    // Write suggestion
                    xtermRef.current.write(cmd);
                    setCurrentInput(cmd);
                  }
                }}
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalComponent;
