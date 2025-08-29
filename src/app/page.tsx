"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThreeDCard from '@/components/ThreeDCard';
import TerminalComponent from '@/components/TerminalComponent';
import MatrixRain from '@/components/MatrixRain';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-green-400 overflow-hidden relative">
      {/* Matrix Rain Background */}
      <MatrixRain />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-20 pb-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto h-[calc(100vh-144px)]">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-full">
            {/* Left side - 3D Card (40% width on desktop) */}
            <div className="lg:col-span-4 h-full">
              <ThreeDCard />
            </div>
            
            {/* Right side - Terminal (60% width on desktop) */}
            <div className="lg:col-span-6 h-full">
              <TerminalComponent />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
