"use client";

import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/10 border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4 navbar-content">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-mono text-xl font-bold">
              YASH SUTHAR
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#about" 
              className="text-green-300 hover:text-green-400 font-mono transition-colors duration-200"
            >
              about
            </a>
            <a 
              href="#projects" 
              className="text-green-300 hover:text-green-400 font-mono transition-colors duration-200"
            >
              projects
            </a>
            <a 
              href="#contact" 
              className="text-green-300 hover:text-green-400 font-mono transition-colors duration-200"
            >
              contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
