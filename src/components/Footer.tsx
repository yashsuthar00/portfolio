'use client';

import { portfolioData } from '@/data';
import { useResponsive } from '@/hooks';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [time, setTime] = useState('');
  const { isMobile } = useResponsive();

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
    <footer
      className='w-full border-t border-green-500/20 bg-black backdrop-blur-md'
      role='contentinfo'
      aria-label='Site footer with social links and status'
    >
      <div className='footer-content w-full px-4 py-2 sm:px-6 sm:py-3'>
        {isMobile ? (
          // Mobile: Just prompt and time
          <div className='flex items-center justify-between'>
            <span className='font-mono text-xs text-green-400 sm:text-sm'>
              [yash@portfolio ~]$
            </span>
            <span className='font-mono text-xs text-green-300 sm:text-sm'>
              {time}
            </span>
          </div>
        ) : (
          // Desktop/Tablet: Full footer - yash@portfolio left, social links center, time right
          <div className='flex w-full items-center justify-between'>
            {/* Left: yash@portfolio */}
            <div className='flex items-center space-x-2'>
              <span className='font-mono text-xs text-green-400 sm:text-sm lg:text-base'>
                [yash@portfolio ~]$
              </span>
              <span className='font-mono text-xs text-green-300 sm:text-sm lg:text-base'>
                <span className='mr-1 inline-block h-1 w-1 animate-pulse rounded-full bg-green-400' />
                connected
              </span>
            </div>

            {/* Center: Social links with SEO-optimized attributes */}
            <nav
              className='flex items-center space-x-3'
              role='navigation'
              aria-label='Social media links'
            >
              {portfolioData.social.map(social => (
                <a
                  key={social.command}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-mono text-xs text-green-300 transition-colors duration-200 hover:text-green-400 focus:text-green-400 focus:outline-none sm:text-sm lg:text-base'
                  aria-label={`Visit Yash Suthar's ${social.command} profile`}
                  title={`${social.command} - ${social.url}`}
                >
                  {social.command}
                </a>
              ))}
            </nav>

            {/* Right: Time only */}
            <div className='flex items-center'>
              <span className='font-mono text-xs text-green-300 sm:text-sm lg:text-base'>
                {time}
              </span>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
