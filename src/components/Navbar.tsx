'use client';

import React, { useState } from 'react';
import { useResponsive } from '@/hooks';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigationItems = [
    { href: '#about', label: 'about' },
    { href: '#projects', label: 'projects' },
    { href: '#contact', label: 'contact' },
  ];

  return (
    <nav className='fixed top-0 right-0 left-0 z-50 border-b border-green-500/20 bg-black/10 backdrop-blur-md'>
      <div className='navbar-content mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4'>
        {isMobile ? (
          // Mobile: Just name centered
          <div className='flex items-center justify-center'>
            <span className='font-mono text-lg font-bold text-green-400'>
              YASH SUTHAR
            </span>
          </div>
        ) : (
          // Desktop/Tablet: Full navbar with menu
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <span className='font-mono text-lg font-bold text-green-400 sm:text-xl'>
                YASH SUTHAR
              </span>
            </div>

            {isTablet ? (
              // Tablet menu
              <div className='relative'>
                <button
                  onClick={toggleMenu}
                  className='p-2 font-mono text-sm text-green-300 transition-colors duration-200 hover:text-green-400'
                  aria-label='Toggle menu'
                >
                  {isMenuOpen ? '✕' : '☰'}
                </button>

                {isMenuOpen && (
                  <div className='absolute top-full right-0 mt-2 min-w-[120px] rounded-lg border border-green-500/30 bg-black/90 py-2 backdrop-blur-md'>
                    {navigationItems.map(item => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className='block px-4 py-2 font-mono text-sm text-green-300 transition-colors duration-200 hover:bg-green-500/10 hover:text-green-400'
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Desktop menu
              <div className='flex items-center space-x-6 sm:space-x-8'>
                {navigationItems.map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    className='font-mono text-sm text-green-300 transition-colors duration-200 hover:text-green-400 sm:text-base'
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
