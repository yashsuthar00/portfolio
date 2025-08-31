"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThreeDCard from '@/components/ThreeDCard';
import TerminalComponent from '@/components/TerminalComponent';
import MatrixRain from '@/components/MatrixRain';
import ClientOnly from '@/components/ClientOnly';
import { useResponsive } from '@/hooks';

export default function Home() {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div className="min-h-screen max-h-screen bg-black text-green-400 overflow-hidden relative">
      {/* Matrix Rain Background */}
      <ClientOnly>
        <MatrixRain />
      </ClientOnly>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className={`relative z-10 ${
        isMobile 
          ? 'pt-16 pb-16' 
          : 'pt-16 sm:pt-20 pb-16 px-4 sm:px-6'
      }`}>
        <div className={`${isMobile ? 'w-full' : 'max-w-7xl mx-auto'}`} style={{ height: 'calc(100vh - 128px)' }}>
          {isMobile ? (
            // Mobile layout: Terminal only (full screen)
            <div className="w-full h-full overflow-hidden">
              <ClientOnly fallback={<div className="w-full h-full bg-black flex items-center justify-center">
                <span className="text-green-400 font-mono">Loading terminal...</span>
              </div>}>
                <TerminalComponent />
              </ClientOnly>
            </div>
          ) : isTablet ? (
            // Tablet layout: Stack vertically with different proportions
            <div className="flex flex-col gap-6 h-full overflow-hidden">
              {/* 3D Card - 35% height on tablet */}
              <div className="h-[35%] min-h-[280px] flex-shrink-0">
                <ClientOnly fallback={<div className="w-full h-full bg-black/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 font-mono">Loading 3D Scene...</span>
                </div>}>
                  <ThreeDCard />
                </ClientOnly>
              </div>
              
              {/* Terminal - 65% height on tablet */}
              <div className="h-[65%] min-h-[400px] flex-shrink-0 overflow-hidden">
                <ClientOnly fallback={<div className="w-full h-full bg-black border border-green-500/50 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 font-mono">Loading terminal...</span>
                </div>}>
                  <TerminalComponent />
                </ClientOnly>
              </div>
            </div>
          ) : (
            // Desktop layout: Side by side (4:6 ratio)
            <div className="grid grid-cols-10 gap-6 h-full overflow-hidden">
              {/* Left side - 3D Card (40% width on desktop) */}
              <div className="col-span-4 h-full overflow-hidden">
                <ClientOnly fallback={<div className="w-full h-full bg-black/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 font-mono">Loading 3D Scene...</span>
                </div>}>
                  <ThreeDCard />
                </ClientOnly>
              </div>
              
              {/* Right side - Terminal (60% width on desktop) */}
              <div className="col-span-6 h-full overflow-hidden">
                <ClientOnly fallback={<div className="w-full h-full bg-black border border-green-500/50 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 font-mono">Loading terminal...</span>
                </div>}>
                  <TerminalComponent />
                </ClientOnly>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
