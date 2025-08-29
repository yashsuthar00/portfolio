"use client";

import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }));
    };
    
    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-black/10 border-t border-green-500/20">
      <div className="max-w-7xl mx-auto px-6 py-3 footer-content">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-green-400 font-mono text-sm">
              [yash@portfolio ~]$
            </span>
            <span className="text-green-300 font-mono text-sm">
              <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-green-400 mr-2" />
              connected
            </span>
            <span className="text-green-300 font-mono text-sm">
              {time}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/yashsuthar00" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300 hover:text-green-400 font-mono text-sm transition-colors duration-200"
            >
              github
            </a>
            <a 
              href="https://linkedin.com/in/yashsuthar00" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300 hover:text-green-400 font-mono text-sm transition-colors duration-200"
            >
              linkedin
            </a>
            <a 
              href="https://leetcode.com/yashsuthar00" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300 hover:text-green-400 font-mono text-sm transition-colors duration-200"
            >
              leetcode
            </a>
            <a 
              href="https://codeforces.com/profile/yashsuthar00" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300 hover:text-green-400 font-mono text-sm transition-colors duration-200"
            >
              codeforces
            </a>
            <span className="text-green-400 font-mono text-sm">
              © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
