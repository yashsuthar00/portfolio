"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const fitAddon = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isMounted, setIsMounted] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showWelcomeMessage = useCallback(() => {
    if (!terminal.current) return;
    
    const welcome = [
      '╔══════════════════════════════════════════════════════════╗',
      '║                    Welcome to Portfolio                 ║',
      '║                                                          ║',
      '║              Yash Suthar - Full Stack Developer         ║',
      '╚══════════════════════════════════════════════════════════╝',
      '',
      'Available commands:',
      '  help     - Show available commands',
      '  about    - Learn more about me',
      '  skills   - View my technical skills',
      '  projects - See my latest projects',
      '  contact  - Get in touch',
      '  social   - View social media commands',
      '  github   - Open GitHub profile',
      '  linkedin - Open LinkedIn profile',
      '  leetcode - Open LeetCode profile',
      '  codeforces - Open CodeForces profile',
      '  resume   - Download my resume',
      '  clear    - Clear the terminal',
      '  exit     - Shutdown terminal session',
      '',
    ];

    welcome.forEach(line => {
      terminal.current?.write('\x1b[37m' + line + '\r\n\x1b[0m');
    });
  }, []);

  const showPrompt = useCallback(() => {
    if (!terminal.current) return;
    terminal.current.write('\x1b[34myash@portfolio:~$ \x1b[0m');
  }, []);

  const handleCommand = useCallback((command: string) => {
    if (!terminal.current) return;

    const cmd = command.trim().toLowerCase();

    switch (cmd) {
      case 'help':
        terminal.current.write('\x1b[37mAvailable commands:\r\n');
        terminal.current.write('  help     - Show this help message\r\n');
        terminal.current.write('  about    - Learn more about me\r\n');
        terminal.current.write('  skills   - View my technical skills\r\n');
        terminal.current.write('  projects - See my latest projects\r\n');
        terminal.current.write('  contact  - Get in touch\r\n');
        terminal.current.write('  social   - View social media commands\r\n');
        terminal.current.write('  github   - Open GitHub profile\r\n');
        terminal.current.write('  linkedin - Open LinkedIn profile\r\n');
        terminal.current.write('  leetcode - Open LeetCode profile\r\n');
        terminal.current.write('  codeforces - Open CodeForces profile\r\n');
        terminal.current.write('  resume   - Download my resume\r\n');
        terminal.current.write('  clear    - Clear the terminal\r\n');
        terminal.current.write('  exit     - Shutdown terminal session\r\n\x1b[0m');
        break;

      case 'about':
        terminal.current.write('\x1b[37mAbout Yash Suthar:\r\n');
        terminal.current.write('━━━━━━━━━━━━━━━━━━\r\n');
        terminal.current.write('Full Stack Developer passionate about creating\r\n');
        terminal.current.write('innovative web applications and user experiences.\r\n');
        terminal.current.write('Currently focused on React, Next.js, and Node.js.\r\n');
        terminal.current.write('\r\n');
        terminal.current.write('🎓 Education: Computer Science Engineering\r\n');
        terminal.current.write('💼 Experience: 1+ years in web development\r\n');
        terminal.current.write('🌟 Specializing in modern JavaScript frameworks\r\n\x1b[0m');
        break;

      case 'skills':
        terminal.current.write('\x1b[37mTechnical Skills:\r\n');
        terminal.current.write('━━━━━━━━━━━━━━━━━\r\n');
        terminal.current.write('Frontend:\r\n');
        terminal.current.write('  • React, Next.js, TypeScript\r\n');
        terminal.current.write('  • Tailwind CSS, Material-UI\r\n');
        terminal.current.write('  • Three.js, Framer Motion\r\n');
        terminal.current.write('\r\n');
        terminal.current.write('Backend:\r\n');
        terminal.current.write('  • Node.js, Express.js\r\n');
        terminal.current.write('  • Python, Django\r\n');
        terminal.current.write('  • MongoDB, PostgreSQL\r\n');
        terminal.current.write('\r\n');
        terminal.current.write('Tools & Technologies:\r\n');
        terminal.current.write('  • Git, Docker, AWS\r\n');
        terminal.current.write('  • Vercel, Netlify\r\n');
        terminal.current.write('  • Jest, Cypress\r\n\x1b[0m');
        break;

      case 'projects':
        terminal.current.write('\x1b[37mRecent Projects:\r\n');
        terminal.current.write('━━━━━━━━━━━━━━━━━\r\n');
        terminal.current.write('🚀 Interactive Terminal Portfolio\r\n');
        terminal.current.write('   • Built with Next.js, Three.js, and xterm.js\r\n');
        terminal.current.write('   • Features 3D graphics and real terminal\r\n');
        terminal.current.write('\r\n');
        terminal.current.write('📱 Full-Stack Web Applications\r\n');
        terminal.current.write('   • E-commerce platforms with React\r\n');
        terminal.current.write('   • Real-time chat applications\r\n');
        terminal.current.write('\r\n');
        terminal.current.write('🔧 Open Source Contributions\r\n');
        terminal.current.write('   • Contributing to React ecosystem\r\n');
        terminal.current.write('   • Building developer tools\r\n\x1b[0m');
        break;

      case 'contact':
        terminal.current.write('\x1b[37mContact Information:\r\n');
        terminal.current.write('━━━━━━━━━━━━━━━━━━━━\r\n');
        terminal.current.write('📧 Email:    hello@yashsuthar.com\r\n');
        terminal.current.write('📧 Personal: yashsuthar0309@gmail.com\r\n');
        terminal.current.write('\r\n');
        terminal.current.write('Feel free to reach out for collaborations!\r\n\x1b[0m');
        break;

      case 'social':
        terminal.current.write('\x1b[37mSocial Media Commands:\r\n');
        terminal.current.write('━━━━━━━━━━━━━━━━━━━━━━━\r\n');
        terminal.current.write('Use these commands to quickly access my profiles:\r\n');
        terminal.current.write('\r\n');
        terminal.current.write('🐙 github    - Open GitHub profile\r\n');
        terminal.current.write('💼 linkedin  - Open LinkedIn profile\r\n');
        terminal.current.write('🧩 leetcode  - Open LeetCode profile\r\n');
        terminal.current.write('⚡ codeforces - Open CodeForces profile\r\n');
        terminal.current.write('\r\n');
        terminal.current.write('Just type any of these commands to visit the profile!\r\n\x1b[0m');
        break;

      case 'github':
        terminal.current.write('\x1b[37m🐙 Opening GitHub profile...\r\n\x1b[0m');
        setTimeout(() => {
          window.open('https://github.com/yashsuthar00', '_blank');
        }, 1000);
        break;

      case 'linkedin':
        terminal.current.write('\x1b[37m💼 Opening LinkedIn profile...\r\n\x1b[0m');
        setTimeout(() => {
          window.open('https://linkedin.com/in/yashsuthar00', '_blank');
        }, 1000);
        break;

      case 'leetcode':
        terminal.current.write('\x1b[37m🧩 Opening LeetCode profile...\r\n\x1b[0m');
        setTimeout(() => {
          window.open('https://leetcode.com/yashsuthar00', '_blank');
        }, 1000);
        break;

      case 'codeforces':
        terminal.current.write('\x1b[37m⚡ Opening CodeForces profile...\r\n\x1b[0m');
        setTimeout(() => {
          window.open('https://codeforces.com/profile/yashsuthar00', '_blank');
        }, 1000);
        break;

      case 'resume':
        terminal.current.write('\x1b[37m📄 Downloading resume...\r\n');
        terminal.current.write('━━━━━━━━━━━━━━━━━━━━━━━━\r\n');
        
        // Download the actual PDF resume
        try {
          const link = document.createElement('a');
          link.href = '/resume/cv.pdf';
          link.download = 'Yash_Suthar_Resume.pdf';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          terminal.current.write('✅ Resume downloaded successfully!\r\n');
          terminal.current.write('📁 Check your Downloads folder for "Yash_Suthar_Resume.pdf"\r\n\x1b[0m');
        } catch {
          terminal.current.write('\x1b[31m❌ Error downloading resume. Please try again.\r\n\x1b[0m');
        }
        break;

      case 'clear':
        terminal.current.clear();
        showPrompt();
        return; // Don't add extra newline

      case 'exit':
        terminal.current.write('\x1b[33m⚡ Initiating terminal shutdown sequence...\r\n');
        terminal.current.write('\x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\r\n');
        
        // Animated shutdown sequence
        const shutdownMessages = [
          { msg: '🔐 Securing session...', color: '\x1b[32m', delay: 500 },
          { msg: '💾 Saving terminal state...', color: '\x1b[32m', delay: 800 },
          { msg: '🧹 Cleaning up processes...', color: '\x1b[32m', delay: 1100 },
          { msg: '🌐 Closing network connections...', color: '\x1b[32m', delay: 1400 },
          { msg: '⚡ Power down initiated...', color: '\x1b[33m', delay: 1700 },
        ];

        let messageIndex = 0;
        const showShutdownMessage = () => {
          if (messageIndex < shutdownMessages.length) {
            const { msg, color } = shutdownMessages[messageIndex];
            terminal.current?.write(`${color}${msg}\r\n\x1b[0m`);
            messageIndex++;
          }
        };

        // Show messages with delays
        shutdownMessages.forEach((_, index) => {
          setTimeout(showShutdownMessage, shutdownMessages[index].delay);
        });

        // Linux-style shutdown sequence
        setTimeout(() => {
          terminal.current?.write('\x1b[90m\r\n[ OK ] Stopped session.\r\n\x1b[0m');
        }, 2200);

        setTimeout(() => {
          terminal.current?.write('\x1b[90m[ OK ] Stopped terminal service.\r\n\x1b[0m');
        }, 2500);

        setTimeout(() => {
          terminal.current?.write('\x1b[90m[ OK ] Reached target shutdown.\r\n\x1b[0m');
        }, 2800);

        setTimeout(() => {
          terminal.current?.write('\x1b[90m[ OK ] System halted.\r\n\x1b[0m');
        }, 3100);

        // Start screen fade to black effect
        setTimeout(() => {
          if (terminalRef.current) {
            terminalRef.current.style.transition = 'opacity 2s ease-out';
            terminalRef.current.style.opacity = '0';
          }
        }, 3400);

        // Complete shutdown - clear screen and show restart message
        setTimeout(() => {
          terminal.current?.clear();
          if (terminalRef.current) {
            terminalRef.current.style.opacity = '1';
            terminalRef.current.style.transition = '';
          }
          
          terminal.current?.write('\x1b[90m\r\n');
          terminal.current?.write('System powered down.\r\n');
          terminal.current?.write('\r\n');
          terminal.current?.write('Press any key to restart...\r\n\x1b[0m');
          setIsShutdown(true);
        }, 5500);
        return; // Don't add extra newline or prompt

      case '':
        // Empty command, just show new prompt
        break;

      default:
        terminal.current.write(`\x1b[31mbash: ${command}: command not found\r\n`);
        terminal.current.write('Type "help" to see available commands.\r\n\x1b[0m');
        break;
    }
    terminal.current.write('\r\n');
  }, [showWelcomeMessage, showPrompt, setIsShutdown]);

  useEffect(() => {
    if (!isMounted || !terminalRef.current || terminal.current) return;

    const initTerminal = async () => {
      try {
        // Dynamically import xterm to avoid SSR issues
        const { Terminal } = await import('@xterm/xterm');
        const { FitAddon } = await import('@xterm/addon-fit');
        const { Unicode11Addon } = await import('@xterm/addon-unicode11');

        // Initialize terminal
        terminal.current = new Terminal({
          theme: {
            background: '#000000',
            foreground: '#ffffff', // White text as default
            cursor: '#00ff00',
            cursorAccent: '#000000',
            selectionBackground: 'rgba(0, 255, 0, 0.3)',
          },
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Fira Code", "SF Mono", Monaco, Menlo, "Ubuntu Mono", "Courier New", monospace',
          fontSize: 14,
          fontWeight: 'normal',
          lineHeight: 1.4,
          cursorBlink: true,
          cursorStyle: 'block',
          scrollback: 1000,
          tabStopWidth: 4,
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
        
        // Initial setup
        setTimeout(() => {
          if (terminal.current) {
            terminal.current.clear();
            showWelcomeMessage();
            showPrompt();
            // Auto-focus the terminal to show blinking cursor
            terminal.current.focus();
          }
        }, 100);

        // Handle user input
        let commandBuffer = '';
        terminal.current.onData((data: string) => {
          if (!terminal.current) return;

          // If terminal is shutdown, restart on any key press
          if (isShutdown) {
            terminal.current.clear();
            
            // Boot sequence messages
            terminal.current.write('\x1b[32m⚡ Initializing system...\r\n\x1b[0m');
            
            setTimeout(() => {
              terminal.current?.write('\x1b[90m[ OK ] Starting terminal service...\r\n\x1b[0m');
            }, 300);
            
            setTimeout(() => {
              terminal.current?.write('\x1b[90m[ OK ] Loading user session...\r\n\x1b[0m');
            }, 600);
            
            setTimeout(() => {
              terminal.current?.write('\x1b[32m[ OK ] System ready.\r\n\r\n\x1b[0m');
              showWelcomeMessage();
              showPrompt();
              setIsShutdown(false);
            }, 1000);
            return;
          }

          if (data === '\r') { // Enter key
            // Special handling for clear command - don't show it in history
            if (commandBuffer.trim().toLowerCase() === 'clear') {
              terminal.current.write('\r\n');
              handleCommand(commandBuffer);
              commandBuffer = '';
              return; // Don't show prompt after clear, handleCommand will handle it
            }
            
            // Clear the current line and rewrite the command in green
            terminal.current.write('\r');
            terminal.current.write('\x1b[K'); // Clear to end of line
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
            terminal.current.write('\x1b[32m' + data + '\x1b[0m'); // Green text while typing
            commandBuffer += data;
          }
        });

        // Fit terminal to container
        const handleResize = () => {
          if (fitAddon.current) {
            fitAddon.current.fit();
          }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

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
  }, [isMounted, handleCommand, showPrompt, showWelcomeMessage, isShutdown]);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-black border border-green-500/50 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-green-400 font-mono">Loading terminal...</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full h-full bg-black border border-green-500/50 rounded-lg overflow-hidden"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.4 }}
    >
      {/* Terminal Header */}
      <div className="bg-gray-800 border-b border-green-500/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-green-400 font-mono text-sm">yash@portfolio:~</span>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef} 
        className="w-full h-[calc(100%-40px)] p-2"
        style={{ minHeight: '400px' }}
      />
    </motion.div>
  );
};

export default TerminalComponent;
