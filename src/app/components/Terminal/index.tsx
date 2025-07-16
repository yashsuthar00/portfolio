'use client'; // This component needs to be a client component

import React, { useState, useRef, useEffect } from 'react';
import styles from './Terminal.module.css';

// --- Type Definitions ---
type HistoryItem = {
  type: 'command' | 'output';
  content: string;
};

// --- Your Portfolio Content ---
const commands: Record<string, string> = {
  help: `Available commands:<br/>
    <strong>about</strong>       - Who I am<br/>
    <strong>skills</strong>      - My technical skills<br/>
    <strong>education</strong>   - My educational background<br/>
    <strong>projects</strong>    - View my projects<br/>
    <strong>contact</strong>     - How to reach me<br/>
    <strong>clear</strong>       - Clear the terminal`,
  about: `Hello! I'm [Your Name], a passionate [Your Role] based in [Your City].<br/>
          I love building efficient, scalable, and user-friendly applications.`,
  skills: `<strong>Languages:</strong> TypeScript, Python, HTML5, CSS3<br/>
           <strong>Frameworks:</strong> Next.js, React, Node.js, Express<br/>
           <strong>Databases:</strong> PostgreSQL, MongoDB<br/>
           <strong>Tools:</strong> Git, Docker, AWS, Vercel`,
  education: `<strong>[Your Degree]</strong> - [Your University] (Year of Graduation)`,
  projects: `Here are a few of my projects:<br/>
    - <a href="[Link to Project 1]" target="_blank">Project One</a>: A brief description.<br/>
    - <a href="[Link to Project 2]" target="_blank">Project Two</a>: A brief description.`,
  contact: `You can reach me via:<br/>
    <strong>Email:</strong> <a href="mailto:your.email@example.com">your.email@example.com</a><br/>
    <strong>LinkedIn:</strong> <a href="[Your LinkedIn URL]" target="_blank">linkedin.com/in/yourprofile</a><br/>
    <strong>GitHub:</strong> <a href="[Your GitHub URL]" target="_blank">github.com/yourusername</a>`,
};

const Terminal = () => {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'output', content: "Welcome! Type 'help' to see available commands." },
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Focus the input field on component mount and on click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Scroll to the bottom whenever history changes
  useEffect(() => {
    if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = input.trim().toLowerCase();
      if (!command) return;

      const newHistory: HistoryItem[] = [...history, { type: 'command', content: command }];

      if (command === 'clear') {
        setHistory([]);
      } else if (commands[command]) {
        newHistory.push({ type: 'output', content: commands[command] });
        setHistory(newHistory);
      } else {
        newHistory.push({ type: 'output', content: `Command not found: ${command}` });
        setHistory(newHistory);
      }

      setInput('');
    }
  };

  return (
    <div className={styles.terminal} ref={terminalRef} onClick={() => inputRef.current?.focus()}>
      {history.map((item, index) => (
        <div key={index}>
          {item.type === 'command' ? (
            <div className={styles.commandLine}>
              <span className={styles.prompt}>Yash@portfolio:~$</span>
              <span>{item.content}</span>
            </div>
          ) : (
            <div
              className={styles.output}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          )}
        </div>
      ))}
      <div className={styles.commandLine}>
        <span className={styles.prompt}>yash@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default Terminal;