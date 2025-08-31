'use client';

import ClientOnly from '@/components/ClientOnly';
import Footer from '@/components/Footer';
import MatrixRain from '@/components/MatrixRain';
import Navbar from '@/components/Navbar';
import TerminalComponent from '@/components/TerminalComponent';
import ThreeDCard from '@/components/ThreeDCard';
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
          isMobile ? 'pt-16 pb-16' : 'px-0 pt-16 pb-16 sm:px-0 sm:pt-20'
        }`}
      >
        <div className='w-full' style={{ height: 'calc(100vh - 128px)' }}>
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
            // Tablet layout: Stack vertically with divider
            <div className='flex h-full flex-col overflow-hidden'>
              {/* 3D Card - 35% height on tablet */}
              <div className='h-[35%] min-h-[280px] flex-shrink-0'>
                <ClientOnly
                  fallback={
                    <div className='flex h-full w-full items-center justify-center bg-black/20'>
                      <span className='font-mono text-green-400'>
                        Loading 3D Scene...
                      </span>
                    </div>
                  }
                >
                  <ThreeDCard />
                </ClientOnly>
              </div>

              {/* Divider */}
              <div className='h-px bg-green-500/30'></div>

              {/* Terminal - 65% height on tablet */}
              <div className='h-[65%] min-h-[400px] flex-shrink-0 overflow-hidden'>
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
            </div>
          ) : (
            // Desktop layout: Side by side with vertical divider
            <div className='flex h-full overflow-hidden'>
              {/* Left side - 3D Card (40% width on desktop) */}
              <div className='h-full w-[40%] overflow-hidden'>
                <ClientOnly
                  fallback={
                    <div className='flex h-full w-full items-center justify-center bg-black/20'>
                      <span className='font-mono text-green-400'>
                        Loading 3D Scene...
                      </span>
                    </div>
                  }
                >
                  <ThreeDCard />
                </ClientOnly>
              </div>

              {/* Vertical Divider */}
              <div className='w-px bg-green-500/30'></div>

              {/* Right side - Terminal (60% width on desktop) */}
              <div className='h-full w-[60%] overflow-hidden'>
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
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
