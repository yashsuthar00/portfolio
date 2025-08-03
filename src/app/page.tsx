"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useResponsive from "@/hooks/useResponsive";

// Dynamic imports for better performance
const TerminalComponent = dynamic(
  () => import("@/components/terminal/TerminalComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-green-400/20 bg-black">
        <div className="text-green-400">Loading terminal...</div>
      </div>
    ),
  }
);

const ThreeDCard = dynamic(() => import("@/components/ThreeDCard"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-full w-full items-center justify-center rounded-lg border border-blue-400/20"
      style={{ backgroundColor: "var(--card-panel)" }}
    >
      <div className="text-blue-400">Loading 3D card...</div>
    </div>
  ),
});

export default function Home(): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { responsive, handleSwipe } = useResponsive();

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
          handleSwipe("down");
        } else {
          handleSwipe("up");
        }
      }

      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchend", handleTouchEnd);
  };

  if (isLoading) {
    return <Loader onComplete={handleLoaderComplete} />;
  }

  return (
    <div
      className="flex min-h-screen flex-col text-white"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content - fills space between navbar and footer */}
      <main
        className="relative flex-1"
        onTouchStart={handleTouchStart}
        style={{ height: "calc(100vh - 120px)" }} // Approximate navbar + footer height
      >
        {/* Desktop Layout */}
        <div className="hidden h-full md:flex">
          {/* Left Panel - 3D Card (40%) */}
          <div
            className="flex w-2/5 items-center justify-center p-6"
            style={{ backgroundColor: "var(--card-panel)" }}
          >
            <div className="h-full w-full">
              <ThreeDCard interactive={true} />
            </div>
          </div>

          {/* Divider */}
          <div className="my-0 w-px bg-gradient-to-b from-transparent via-blue-400/50 to-transparent transition-colors duration-300 hover:via-blue-400/80" />

          {/* Right Panel - Terminal (60%) */}
          <div
            className="w-3/5 p-6"
            style={{ backgroundColor: "var(--terminal-bg)" }}
          >
            <div className="h-full">
              <TerminalComponent />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="h-full md:hidden">
          {/* Mobile Content - full screen transitions only */}
          <div className="h-full">
            <div
              className={`h-full transition-transform duration-300 ease-in-out ${
                responsive.activePanel === "terminal"
                  ? "translate-y-0"
                  : "-translate-y-full"
              }`}
              style={{ backgroundColor: "var(--terminal-bg)" }}
            >
              {responsive.activePanel === "terminal" && (
                <div className="h-full p-4">
                  <TerminalComponent />
                </div>
              )}
            </div>

            <div
              className={`absolute inset-0 h-full transition-transform duration-300 ease-in-out ${
                responsive.activePanel === "card"
                  ? "translate-y-0"
                  : "translate-y-full"
              }`}
              style={{ backgroundColor: "var(--card-panel)" }}
            >
              {responsive.activePanel === "card" && (
                <div className="flex h-full items-center justify-center p-4">
                  <div className="h-full w-full">
                    <ThreeDCard interactive={true} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          {/* Gradient background */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "linear-gradient(135deg, var(--background) 0%, var(--terminal-bg) 50%, var(--background) 100%)",
            }}
          />

          {/* Animated grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(33, 150, 243, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(33, 150, 243, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-blue-400/5 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-400/3 blur-3xl delay-1000" />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
