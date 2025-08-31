'use client';

import { useResponsive } from '@/hooks';
import Link from 'next/link';

const Navbar = () => {
  const { isMobile } = useResponsive();

  return (
    <nav
      className='w-full border-b border-green-500/20 bg-black backdrop-blur-md'
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='navbar-content w-full px-4 py-3 sm:px-6 sm:py-4'>
        {isMobile ? (
          // Mobile: Name and title left-aligned
          <div className='flex flex-col items-start justify-start'>
            <h2 className='font-mono text-lg font-bold text-green-400 sm:text-xl lg:text-2xl'>
              <Link
                href='/'
                className='hover:text-green-300 focus:text-green-300 focus:outline-none'
                aria-label='Yash Suthar - Home'
              >
                YASH SUTHAR
              </Link>
            </h2>
            <p className='mt-1 font-mono text-xs text-green-300 sm:text-sm lg:text-base'>
              Full Stack Developer & Software Engineer
            </p>
          </div>
        ) : (
          // Desktop: Name and title left-aligned
          <div className='flex flex-col items-start justify-start'>
            <h2 className='font-mono text-lg font-bold text-green-400 sm:text-xl lg:text-2xl'>
              <Link
                href='/'
                className='hover:text-green-300 focus:text-green-300 focus:outline-none'
                aria-label='Yash Suthar - Home'
              >
                YASH SUTHAR
              </Link>
            </h2>
            <p className='mt-1 font-mono text-sm text-green-300 sm:text-base lg:text-lg'>
              Full Stack Developer & Software Engineer
            </p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
