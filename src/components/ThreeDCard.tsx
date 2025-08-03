"use client";

import React from 'react';
import { ThreeDCardProps } from '@/types';

const ThreeDCard: React.FC<ThreeDCardProps> = ({ 
  className = "",
  children,
  interactive = true 
}) => {
  return (
    <div 
      className={`relative w-full h-full min-h-[400px] bg-gradient-to-br from-gray-900 to-black rounded-lg border border-green-400/20 ${className}`}
    >
      {/* Placeholder content - ready for 3D implementation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-32 h-32 mx-auto bg-green-400/10 rounded-full border-2 border-green-400/30 flex items-center justify-center">
            <div className="text-green-400 text-4xl font-bold">YS</div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              Yash Suthar
            </h3>
            <p className="text-green-400">
              Software Developer
            </p>
          </div>
          
          <div className="text-sm text-gray-400 max-w-xs">
            {interactive && (
              <p>3D Interactive Card - Ready for implementation</p>
            )}
          </div>
          
          {/* Placeholder for 3D scene */}
          <div className="mt-8">
            <div className="text-xs text-green-400/60 font-mono">
              {/* TODO: Insert your existing 3D card logic here */}
            </div>
            <div className="text-xs text-green-400/60 font-mono">
              {/* This component is prepared for Three.js integration */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-colors duration-300 pointer-events-none" />
      
      {/* Corner indicators */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-green-400/30" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-green-400/30" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-green-400/30" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-green-400/30" />
      
      {children}
    </div>
  );
};

export default ThreeDCard;
