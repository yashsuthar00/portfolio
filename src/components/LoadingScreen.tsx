'use client';

import { useEffect, useState } from 'react';

// A brief, deliberate boot splash so the first paint never flickers a bare
// "Loading terminal…" for a fraction of a second. It's a decorative overlay:
// the real page (metadata, headings, semantic content) stays in the DOM
// beneath it, so crawlers/LLMs are unaffected and there's no layout shift.
// By the time it fades, the terminal has mounted and is already booting.
const MIN_VISIBLE_MS = 1000; // deliberate floor so it never blinks
const FADE_MS = 450;

const LoadingScreen = () => {
  const [hidden, setHidden] = useState(false); // triggers the fade-out
  const [removed, setRemoved] = useState(false); // unmounts after the fade

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const fade = reduceMotion ? 0 : FADE_MS;

    let removeTimer: ReturnType<typeof setTimeout>;
    // Show for a fixed minimum, then fade — predictable regardless of how fast
    // the device or network is. We intentionally don't wait on the window
    // 'load' event (heavy 3D/terminal assets) so the splash never lingers.
    const minTimer = setTimeout(() => {
      setHidden(true);
      removeTimer = setTimeout(() => setRemoved(true), fade);
    }, MIN_VISIBLE_MS);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden='true'
      role='presentation'
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity ease-out ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className='loading-glow font-mono text-xl font-bold tracking-[0.35em] text-green-400 sm:text-2xl'>
        YASH SUTHAR
      </div>
      <div className='mt-3 font-mono text-xs tracking-[0.2em] text-green-500/60'>
        initializing shell
      </div>
      <div className='mt-6 h-px w-44 overflow-hidden bg-green-500/15'>
        <div className='loading-bar h-full w-1/3 bg-green-400' />
      </div>
    </div>
  );
};

export default LoadingScreen;
