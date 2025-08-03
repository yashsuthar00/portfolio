"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import useResponsive from '@/hooks/useResponsive';

// Dynamic imports for better performance
const TerminalComponent = dynamic(
  () => import('@/components/terminal/TerminalComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-black rounded-lg border border-green-400/20 flex items-center justify-center">
        <div className="text-green-400">Loading terminal...</div>
      </div>
    )
  }
);

const ThreeDCard = dynamic(
  () => import('@/components/ThreeDCard'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-900 rounded-lg border border-green-400/20 flex items-center justify-center">
        <div className="text-green-400">Loading 3D card...</div>
      </div>
    )
  }
);

export default function Home(): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { responsive, setActivePanel, handleSwipe } = useResponsive();

  const handleLoaderComplete = (): void => {
    setIsLoading(false);
  };

  // Touch handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent): void => {
    const touch = e.touches[0];
    if (!touch) return;
    
    const startY = touch.clientY;
    const startX = touch.clientX;

    const handleTouchEnd = (endEvent: TouchEvent): void => {
      const endTouch = endEvent.changedTouches[0];
      if (!endTouch) return;

      const deltaY = endTouch.clientY - startY;
      const deltaX = endTouch.clientX - startX;
      const threshold = 50;

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          handleSwipe('down');
        } else {
          handleSwipe('up');
        }
      }

      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd);
  };

  if (isLoading) {
    return <Loader onComplete={handleLoaderComplete} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main 
        className="flex-1 relative"
        onTouchStart={handleTouchStart}
      >
        {/* Desktop Layout */}
        <div className="hidden md:flex h-full min-h-[600px]">
          {/* Left Panel - 3D Card (40%) */}
          <div className="w-2/5 p-6 flex items-center justify-center">
            <div className="w-full max-w-md">
              <ThreeDCard interactive={true} />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-gradient-to-b from-transparent via-green-400/50 to-transparent my-8 hover:via-green-400/80 transition-colors duration-300" />

          {/* Right Panel - Terminal (60%) */}
          <div className="w-3/5 p-6">
            <div className="h-full">
              <TerminalComponent />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden h-screen">
          {/* Mobile Panel Indicator */}
          <div className="flex justify-center py-2 bg-black/50 backdrop-blur-sm border-b border-green-400/20">
            <div className="flex space-x-2">
              <button
                onClick={() => setActivePanel('terminal')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                  responsive.activePanel === 'terminal'
                    ? 'bg-green-400 text-black'
                    : 'text-green-400 border border-green-400/30'
                }`}
              >
                Terminal
              </button>
              <button
                onClick={() => setActivePanel('card')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                  responsive.activePanel === 'card'
                    ? 'bg-green-400 text-black'
                    : 'text-green-400 border border-green-400/30'
                }`}
              >
                3D Card
              </button>
            </div>
          </div>

          {/* Mobile Swipe Instruction */}
          <div className="text-center py-2 text-xs text-green-400/60">
            Swipe up/down to switch panels
          </div>

          {/* Mobile Content */}
          <div className="h-full px-4 pb-4">
            <div 
              className={`transition-transform duration-300 ease-in-out h-full ${
                responsive.activePanel === 'terminal' ? 'translate-y-0' : '-translate-y-full'
              }`}
            >
              {responsive.activePanel === 'terminal' && (
                <TerminalComponent />
              )}
            </div>

            <div 
              className={`transition-transform duration-300 ease-in-out h-full ${
                responsive.activePanel === 'card' ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              {responsive.activePanel === 'card' && (
                <div className="h-full flex items-center justify-center">
                  <div className="w-full max-w-sm">
                    <ThreeDCard interactive={true} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50" />
          
          {/* Animated grid */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
          
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/3 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
