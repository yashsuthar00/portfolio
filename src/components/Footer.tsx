'use client';

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
    <footer className='fixed right-0 bottom-0 left-0 z-50 border-t border-green-500/20 bg-black/10 backdrop-blur-md'>
      <div className='footer-content mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-3'>
        {isMobile ? (
          // Mobile: Just prompt and time
          <div className='flex items-center justify-between'>
            <span className='font-mono text-xs text-green-400'>
              [yash@portfolio ~]$
            </span>
            <span className='font-mono text-xs text-green-300'>{time}</span>
          </div>
        ) : (
          // Desktop/Tablet: Full footer
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2 sm:space-x-4'>
              <span className='font-mono text-xs text-green-400 sm:text-sm'>
                [yash@portfolio ~]$
              </span>
              <span className='font-mono text-xs text-green-300 sm:text-sm'>
                <span className='mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400 sm:mr-2 sm:h-2 sm:w-2' />
                connected
              </span>
              <span className='font-mono text-xs text-green-300 sm:text-sm'>
                {time}
              </span>
            </div>

            <div className='flex items-center space-x-2 sm:space-x-4'>
              {isTablet ? (
                // Tablet: Show main links only
                <>
                  {portfolioData.social.slice(0, 2).map(social => (
                    <a
                      key={social.command}
                      href={social.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='font-mono text-sm text-green-300 transition-colors duration-200 hover:text-green-400'
                    >
                      {social.command}
                    </a>
                  ))}
                  <span className='font-mono text-sm text-green-400'>
                    © {new Date().getFullYear()}
                  </span>
                </>
              ) : (
                // Desktop: Show all links
                <>
                  {portfolioData.social.map(social => (
                    <a
                      key={social.command}
                      href={social.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='font-mono text-sm text-green-300 transition-colors duration-200 hover:text-green-400'
                    >
                      {social.command}
                    </a>
                  ))}
                  <span className='font-mono text-sm text-green-400'>
                    © {new Date().getFullYear()}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
