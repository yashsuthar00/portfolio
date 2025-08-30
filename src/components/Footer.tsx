"use client";

import React, { useState, useEffect } from 'react';
import { useResponsive } from '@/hooks';
import { portfolioData } from '@/data';

const Footer = () => {
  const [time, setTime] = useState('');
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = isMobile 
        ? {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }
        : {
            weekday: 'short',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          };

      setTime(new Date().toLocaleString(undefined, options));
    };
    
    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-black/10 border-t border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 footer-content">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-green-400 font-mono text-xs sm:text-sm">
              [yash@portfolio ~]$
            </span>
            <span className="text-green-300 font-mono text-xs sm:text-sm">
              <span className="animate-pulse inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 mr-1 sm:mr-2" />
              connected
            </span>
            {!isMobile && (
              <span className="text-green-300 font-mono text-xs sm:text-sm">
                {time}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isMobile ? (
              // Mobile: Show only time and year
              <>
                <span className="text-green-300 font-mono text-xs">
                  {time}
                </span>
                <span className="text-green-400 font-mono text-xs">
                  © {new Date().getFullYear()}
                </span>
              </>
            ) : isTablet ? (
              // Tablet: Show main links only
              <>
                {portfolioData.social.slice(0, 2).map((social) => (
                  <a
                    key={social.command}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-green-400 font-mono text-sm transition-colors duration-200"
                  >
                    {social.command}
                  </a>
                ))}
                <span className="text-green-400 font-mono text-sm">
                  © {new Date().getFullYear()}
                </span>
              </>
            ) : (
              // Desktop: Show all links
              <>
                {portfolioData.social.map((social) => (
                  <a
                    key={social.command}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-green-400 font-mono text-sm transition-colors duration-200"
                  >
                    {social.command}
                  </a>
                ))}
                <span className="text-green-400 font-mono text-sm">
                  © {new Date().getFullYear()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
