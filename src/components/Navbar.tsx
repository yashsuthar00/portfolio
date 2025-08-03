"use client";

import React, { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [isAnimated, setIsAnimated] = useState<boolean>(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <nav
      className={`relative z-40 border-b border-green-400/20 bg-black/90 backdrop-blur-sm ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold text-green-400">
              {isAnimated ? (
                <TypeAnimation
                  sequence={[
                    "Y",
                    100,
                    "Ya",
                    100,
                    "Yas",
                    100,
                    "Yash",
                    200,
                    "Yash ",
                    100,
                    "Yash S",
                    100,
                    "Yash Su",
                    100,
                    "Yash Sut",
                    100,
                    "Yash Suth",
                    100,
                    "Yash Sutha",
                    100,
                    "Yash Suthar",
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={0}
                />
              ) : (
                "Yash Suthar"
              )}
            </div>
            <div className="hidden text-sm text-green-400/80 sm:block">
              Software Developer
            </div>
          </div>

          {/* Simple branding - no navigation buttons */}
          <div className="text-sm text-green-400/60">
            Code Enthusiast&apos;s Playground
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
