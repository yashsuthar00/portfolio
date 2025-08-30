"use client";

import React, { useState } from 'react';
import { useResponsive } from '@/hooks';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile } = useResponsive();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigationItems = [
    { href: '#about', label: 'about' },
    { href: '#projects', label: 'projects' },
    { href: '#contact', label: 'contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/10 border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 navbar-content">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-mono text-lg sm:text-xl font-bold">
              YASH SUTHAR
            </span>
          </div>
          
          {isMobile ? (
            // Mobile menu
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="text-green-300 hover:text-green-400 font-mono text-sm transition-colors duration-200 p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-black/90 backdrop-blur-md border border-green-500/30 rounded-lg min-w-[120px] py-2">
                  {navigationItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-green-300 hover:text-green-400 hover:bg-green-500/10 font-mono text-sm transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Desktop menu
            <div className="flex items-center space-x-6 sm:space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-green-300 hover:text-green-400 font-mono text-sm sm:text-base transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
