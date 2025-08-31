'use client';

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
    <div className='relative max-h-screen min-h-screen overflow-hidden bg-black text-green-400'>
      {/* Matrix Rain Background */}
      <ClientOnly>
        <MatrixRain />
      </ClientOnly>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main
        className={`relative z-10 ${
          isMobile ? 'pt-16 pb-16' : 'px-4 pt-16 pb-16 sm:px-6 sm:pt-20'
        }`}
      >
        <div
          className={`${isMobile ? 'w-full' : 'mx-auto max-w-7xl'}`}
          style={{ height: 'calc(100vh - 128px)' }}
        >
          {isMobile ? (
            // Mobile layout: Terminal only (full screen)
            <div className='h-full w-full overflow-hidden'>
              <ClientOnly
                fallback={
                  <div className='flex h-full w-full items-center justify-center bg-black'>
                    <span className='font-mono text-green-400'>
                      Loading terminal...
                    </span>
                  </div>
                }
              >
                <TerminalComponent />
              </ClientOnly>
            </div>
          ) : isTablet ? (
            // Tablet layout: Stack vertically with different proportions
            <div className='flex h-full flex-col gap-6 overflow-hidden'>
              {/* 3D Card - 35% height on tablet */}
              <div className='h-[35%] min-h-[280px] flex-shrink-0'>
                <ClientOnly
                  fallback={
                    <div className='flex h-full w-full items-center justify-center rounded-lg border border-green-500/30 bg-black/20'>
                      <span className='font-mono text-green-400'>
                        Loading 3D Scene...
                      </span>
                    </div>
                  }
                >
                  <ThreeDCard />
                </ClientOnly>
              </div>

              {/* Terminal - 65% height on tablet */}
              <div className='h-[65%] min-h-[400px] flex-shrink-0 overflow-hidden'>
                <ClientOnly
                  fallback={
                    <div className='flex h-full w-full items-center justify-center rounded-lg border border-green-500/50 bg-black'>
                      <span className='font-mono text-green-400'>
                        Loading terminal...
                      </span>
                    </div>
                  }
                >
                  <TerminalComponent />
                </ClientOnly>
              </div>
            </div>
          ) : (
            // Desktop layout: Side by side (4:6 ratio)
            <div className='grid h-full grid-cols-10 gap-6 overflow-hidden'>
              {/* Left side - 3D Card (40% width on desktop) */}
              <div className='col-span-4 h-full overflow-hidden'>
                <ClientOnly
                  fallback={
                    <div className='flex h-full w-full items-center justify-center rounded-lg border border-green-500/30 bg-black/20'>
                      <span className='font-mono text-green-400'>
                        Loading 3D Scene...
                      </span>
                    </div>
                  }
                >
                  <ThreeDCard />
                </ClientOnly>
              </div>

              {/* Right side - Terminal (60% width on desktop) */}
              <div className='col-span-6 h-full overflow-hidden'>
                <ClientOnly
                  fallback={
                    <div className='flex h-full w-full items-center justify-center rounded-lg border border-green-500/50 bg-black'>
                      <span className='font-mono text-green-400'>
                        Loading terminal...
                      </span>
                    </div>
                  }
                >
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
