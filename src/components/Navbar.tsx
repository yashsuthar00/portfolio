"use client";

import React, { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAnimated, setIsAnimated] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = (): void => {
    setIsDarkMode(!isDarkMode);
    // Theme toggle functionality will be expanded later
    document.documentElement.classList.toggle('light');
  };

  return (
    <nav className={`relative z-40 bg-black/90 backdrop-blur-sm border-b border-green-400/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-4">
            <div className="text-green-400 font-bold text-xl">
              {isAnimated ? (
                <TypeAnimation
                  sequence={[
                    'Y',
                    100,
                    'Ya',
                    100,
                    'Yas',
                    100,
                    'Yash',
                    200,
                    'Yash ',
                    100,
                    'Yash S',
                    100,
                    'Yash Su',
                    100,
                    'Yash Sut',
                    100,
                    'Yash Suth',
                    100,
                    'Yash Sutha',
                    100,
                    'Yash Suthar',
                  ]}
                  wrapper="span"
                  speed={75}
                  repeat={0}
                />
              ) : (
                'Yash Suthar'
              )}
            </div>
            <div className="text-gray-400 text-sm hidden sm:block">
              Software Developer
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className="text-green-400 hover:text-green-300 transition-colors duration-200 p-2 rounded-lg border border-green-400/20 hover:border-green-400/40"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <a
              href="#terminal"
              className="text-green-400 hover:text-green-300 transition-colors duration-200 text-sm font-medium"
            >
              Terminal
            </a>
            
            <a
              href="#about"
              className="text-green-400 hover:text-green-300 transition-colors duration-200 text-sm font-medium"
            >
              About
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-green-400 hover:text-green-300 focus:outline-none focus:text-green-300 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-green-400/20">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-sm">
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 w-full text-left px-3 py-2 text-green-400 hover:text-green-300 transition-colors duration-200"
              >
                {isDarkMode ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
              
              <a
                href="#terminal"
                className="block px-3 py-2 text-green-400 hover:text-green-300 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Terminal Interface
              </a>
              
              <a
                href="#about"
                className="block px-3 py-2 text-green-400 hover:text-green-300 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About Me
              </a>
              
              <div className="border-t border-green-400/20 pt-2 mt-2">
                <div className="px-3 py-2 text-gray-400 text-sm">
                  Software Developer
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animated underline */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
    </nav>
  );
};

export default Navbar;
