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
    <div className='relative grid h-dvh w-full grid-rows-[auto_1fr_auto] overflow-hidden bg-black text-green-400'>
      {/* Matrix Rain Background - Lower z-index */}
      <div
        className='absolute inset-0 z-0'
        role='presentation'
        aria-hidden='true'
      >
        <ClientOnly>
          <MatrixRain />
        </ClientOnly>
      </div>

      {/* Header with Navigation - Semantic HTML */}
      <header className='relative z-50 flex-shrink-0' role='banner'>
        <Navbar />
      </header>

      {/* Main Content - Primary content area */}
      <main
        className='relative z-20 min-h-0 flex-1'
        role='main'
        aria-label='Portfolio Content'
      >
        {/* Hidden h1 for SEO - only one per page */}
        <h1 className='sr-only'>
          Yash Suthar - Full Stack Developer Portfolio | Interactive Terminal
          Experience
        </h1>

        {/* Content container that uses all available space */}
        <section
          className='h-full w-full bg-black'
          aria-label='Interactive Portfolio Interface'
        >
          {isMobile ? (
            // Mobile layout: Terminal only (full screen)
            <article
              className='h-full w-full overflow-hidden'
              aria-label='Mobile Terminal Interface'
            >
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
            </article>
          ) : isTablet ? (
            // Tablet layout: Stack vertically with divider
            <div className='flex h-full flex-col overflow-hidden'>
              {/* 3D Card - 35% height on tablet */}
              <article
                className='h-[35%] min-h-[280px] flex-shrink-0'
                aria-label='3D Interactive Card'
              >
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
              </article>

              {/* Divider */}
              <div
                className='h-px bg-green-500/30'
                role='separator'
                aria-hidden='true'
              ></div>

              {/* Terminal - 65% height on tablet */}
              <article
                className='h-[65%] min-h-[400px] flex-shrink-0 overflow-hidden'
                aria-label='Interactive Terminal'
              >
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
              </article>
            </div>
          ) : (
            // Desktop layout: Side by side with vertical divider
            <div className='flex h-full overflow-hidden'>
              {/* Left side - 3D Card (40% width on desktop) */}
              <article
                className='h-full w-[40%] overflow-hidden'
                aria-label='3D Interactive Experience'
              >
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
              </article>

              {/* Vertical Divider */}
              <div
                className='w-px bg-green-500/30'
                role='separator'
                aria-hidden='true'
              ></div>

              {/* Right side - Terminal (60% width on desktop) */}
              <article
                className='h-full w-[60%] overflow-hidden'
                aria-label='Interactive Terminal Interface'
              >
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
              </article>
            </div>
          )}
        </section>
      </main>

      {/* Footer - Semantic footer */}
      <footer className='relative z-50 flex-shrink-0' role='contentinfo'>
        <Footer />
      </footer>
    </div>
  );
}
