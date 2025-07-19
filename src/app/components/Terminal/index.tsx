'use client'; 

import React, { useState, useRef, useEffect } from 'react';
import { fileSystem, FileSystemItem, TerminalLine, bootSequence } from './terminalTextUtils';
import { handleCommand } from './handleCommand';
import { CommandContext } from './commands/general';

// Command handler imports

const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState(['home', 'yash']);
  const [isBooting, setIsBooting] = useState(true);
  const [showMatrix, setShowMatrix] = useState(false);
  const [_lineCounter, setLineCounter] = useState(0);
  const [installedPackages, setInstalledPackages] = useState<string[]>([]);
  const [currentTheme, setCurrentTheme] = useState('default');
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const themes = {
    default: {
      bg: 'bg-black',
      text: 'text-white',
      prompt: 'text-blue-400',
      accent: 'text-cyan-400',
      command: 'text-green-400',
      special: 'text-green-400' // For ASCII art, matrix, etc.
    },
    dracula: {
      bg: 'bg-gray-900',
      text: 'text-gray-200',
      prompt: 'text-pink-400',
      accent: 'text-cyan-300',
      command: 'text-green-400',
      special: 'text-green-400'
    },
    matrix: {
      bg: 'bg-black',
      text: 'text-green-300',
      prompt: 'text-green-400',
      accent: 'text-green-500',
      command: 'text-green-400',
      special: 'text-green-400'
    }
  };

  const getTheme = () => themes[currentTheme as keyof typeof themes] || themes.default;

  const addLine = (content: string, isCommand = false, isSpecial = false) => {
    const uniqueId = `${Date.now()}-${Math.random()}`;
    setLines(prev => [...prev, {
      id: uniqueId,
      content,
      isCommand,
      isSpecial,
      timestamp: new Date()
    }]);
    setLineCounter(prev => prev + 1);
  };

  const getPrompt = () => {
    const path = currentDir.join('/');
    return `yash@portfolio:/${path}$ `;
  };

  const getCurrentDirectory = (): FileSystemItem => {
    let current = fileSystem;
    for (const dir of currentDir) {
      current = current[dir] as FileSystemItem;
    }
    return current;
  };

  const resolvePath = (path: string): string[] => {
    if (path.startsWith('/')) {
      return path.split('/').filter(p => p);
    }

    const parts = path.split('/').filter(p => p);
    const resolved = [...currentDir];
    
    for (const part of parts) {
      if (part === '..') {
        resolved.pop();
      } else if (part !== '.') {
        resolved.push(part);
      }
    }
    
    return resolved;
  };

  const handleCommandWrapper = (input: string) => {
    const ctx: CommandContext = {
      addLine,
      setCurrentDir,
      setLines,
      setInstalledPackages,
      setCurrentTheme,
      setShowMatrix,
      commandHistory,
      currentDir,
      fileSystem,
      installedPackages,
      currentTheme,
      getPrompt,
      getCurrentDirectory,
      resolvePath,
    };
    handleCommand(input, ctx);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (currentInput.trim()) {
        setCommandHistory(prev => [currentInput, ...prev]);
        handleCommandWrapper(currentInput);
      }
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for commands
      const commands = ['help', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'clear', 'history', 'neofetch', 'exit'];
      const matches = commands.filter(cmd => cmd.startsWith(currentInput));
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      }
    }
  };

  useEffect(() => {
    (window as Window & { startTime?: number }).startTime = Date.now();

    if (isBooting) {
      let index = 0;
      const bootInterval = setInterval(() => {
        if (index < bootSequence.length) {
          addLine(bootSequence[index]);
          index++;
        } else {
          clearInterval(bootInterval);
          setIsBooting(false);
        }
      }, 300);
      
      return () => clearInterval(bootInterval);
    }
  }, [isBooting]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (inputRef.current && !isBooting) {
      inputRef.current.focus();
    }
  }, [isBooting, lines]);

  const MatrixRain = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const columns = Math.floor(window.innerWidth / 20);
    const drops = Array(columns).fill(0);
    
    useEffect(() => {
      const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = '15px monospace';
        
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(text, i * 20, drops[i] * 20);
          
          if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };
      
      const interval = setInterval(draw, 35);
      return () => clearInterval(interval);
    }, []);
    
    return (
      <canvas
        id="matrix-canvas"
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ background: 'rgba(0, 0, 0, 0.8)' }}
      />
    );
  };

  const theme = getTheme();

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-mono text-sm relative overflow-hidden`}>
      {showMatrix && <MatrixRain />}
      
      <div
        ref={terminalRef}
        className="h-screen overflow-y-auto p-4 pb-20"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line) => (
          <div key={line.id} className="mb-1 whitespace-pre-wrap break-words">
            <span 
              className={
                line.isCommand ? theme.command : 
                line.isSpecial ? '' : 
                theme.text
              }
              dangerouslySetInnerHTML={{ __html: line.content }}
            />
          </div>
        ))}
        
        {!isBooting && (
          <div className="flex items-center">
            <span className={theme.prompt}>{getPrompt()}</span>
            <div className="relative flex-1">
              <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full bg-transparent border-none outline-none ${theme.text} pr-2 pl-2`}
          autoFocus
          spellCheck={false}
          style={{ caretColor: 'transparent' }}
              />
              {/* Vim-style green block cursor */}
              {!isBooting && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${8 + (currentInput.length * 8)}px`, // 8px per char, adjust as needed
              width: '8px',
              height: '1.5em',
              background: '#4ade80',
              display: 'inline-block',
              animation: 'vim-blink 1s steps(1) infinite'
            }}
          />
              )}
            </div>
          </div>
        )}
            </div>
            
            {/* Mobile touch area */}
            <div 
        className="fixed bottom-0 left-0 right-0 h-16 bg-transparent md:hidden"
        onClick={() => inputRef.current?.focus()}
            />
            
            {/* Vim-style block cursor blink animation */}
            <style jsx>{`
        @keyframes vim-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
            `}</style>
    </div>
  );
};

export default Terminal;