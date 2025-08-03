"use client";

import React, { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';

interface LoaderProps {
  onComplete: () => void;
}

interface BootStep {
  text: string;
  delay: number;
  typing?: boolean;
}

const bootSteps: BootStep[] = [
  { text: "BIOS Version 2.1.0", delay: 50 },
  { text: "Initializing system...", delay: 80, typing: true },
  { text: "Memory Test: 16384MB OK", delay: 120 },
  { text: "CPU: Intel Core i7-12700K @ 3.60GHz", delay: 60 },
  { text: "Detecting hardware...", delay: 1000, typing: true },
  { text: "Loading portfolio modules...", delay: 80, typing: true },
  { text: "┌─────────────────────────────────────────┐", delay: 30 },
  { text: "│ Yash Suthar Portfolio System v1.0       │", delay: 40 },
  { text: "│ Loading resources...                    │", delay: 50 },
  { text: "└─────────────────────────────────────────┘", delay: 30 },
];

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [showStartButton, setShowStartButton] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Audio tick effect
  const playTick = (): void => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAzqA1O/TgC8HI3u+8N+SRQ0PVqzn7q9cFgUzm9fvzEUpBii+z+WgXxgEIG/A7+OKTg8NUabr8LdmGCKEzfKABAA=');
      audio.volume = 0.1;
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    } catch {
      // Ignore audio creation errors
    }
  };

  useEffect(() => {
    if (currentStep < bootSteps.length) {
      const timer = setTimeout(() => {
        playTick();
        setCompletedSteps(prev => [...prev, bootSteps[currentStep]!.text]);
        setCurrentStep(prev => prev + 1);
      }, bootSteps[currentStep]!.delay);

      return () => clearTimeout(timer);
    } else if (!showProgress) {
      setShowProgress(true);
    }

    return undefined;
  }, [currentStep, showProgress]);

  useEffect(() => {
    if (showProgress && progress < 100) {
      const timer = setTimeout(() => {
        playTick();
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15 + 5;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 150 + Math.random() * 200);

      return () => clearTimeout(timer);
    } else if (progress >= 100 && !isComplete) {
      const completionTimer = setTimeout(() => {
        setIsComplete(true);
        const buttonTimer = setTimeout(() => {
          setShowStartButton(true);
        }, 1000);
        
        return () => clearTimeout(buttonTimer);
      }, 500);
      
      return () => clearTimeout(completionTimer);
    }

    return undefined;
  }, [showProgress, progress, isComplete]);

  const handleStart = (): void => {
    playTick();
    setTimeout(onComplete, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-green-400 font-mono overflow-hidden">
      <div className="h-full w-full p-8 flex flex-col">
        {/* BIOS Header */}
        <div className="text-center mb-8">
          <div className="text-xl font-bold mb-2">
            PORTFOLIO BIOS SETUP UTILITY
          </div>
          <div className="text-sm opacity-80">
            Copyright (C) 2025 Yash Suthar Systems
          </div>
        </div>

        {/* Boot Steps */}
        <div className="flex-1 space-y-2">
          {completedSteps.map((step, index) => (
            <div key={index} className="text-sm">
              {step.includes('┌') || step.includes('│') || step.includes('└') ? (
                <div className="text-yellow-400">{step}</div>
              ) : (
                <div>
                  <span className="text-gray-500">[</span>
                  <span className="text-green-400">OK</span>
                  <span className="text-gray-500">]</span>
                  <span className="ml-2">{step}</span>
                </div>
              )}
            </div>
          ))}

          {/* Current typing step */}
          {currentStep < bootSteps.length && bootSteps[currentStep]?.typing && (
            <div className="text-sm">
              <span className="text-gray-500">[</span>
              <span className="text-yellow-400">...</span>
              <span className="text-gray-500">]</span>
              <span className="ml-2">
                <TypeAnimation
                  sequence={[bootSteps[currentStep]!.text]}
                  wrapper="span"
                  speed={75}
                  repeat={0}
                />
              </span>
            </div>
          )}

          {/* Progress Bar */}
          {showProgress && (
            <div className="mt-8 space-y-4">
              <div className="text-center text-yellow-400">
                Loading Portfolio Resources...
              </div>
              <div className="w-full bg-gray-800 rounded">
                <div 
                  className="bg-green-400 text-xs font-medium text-black text-center p-0.5 leading-none rounded transition-all duration-300"
                  style={{ width: `${progress}%` }}
                >
                  {Math.round(progress)}%
                </div>
              </div>
              <div className="text-center text-sm opacity-80">
                {progress < 30 && "Initializing terminal interface..."}
                {progress >= 30 && progress < 60 && "Loading 3D components..."}
                {progress >= 60 && progress < 90 && "Configuring command handlers..."}
                {progress >= 90 && "Finalizing setup..."}
              </div>
            </div>
          )}

          {/* Completion Message */}
          {isComplete && (
            <div className="mt-8 text-center space-y-4">
              <div className="text-xl text-yellow-400 font-bold">
                System Ready!
              </div>
              <div className="text-lg">
                Yash Suthar Portfolio Showcase
              </div>
              <div className="text-sm opacity-80">
                Click START to begin your journey
              </div>
            </div>
          )}
        </div>

        {/* Start Button */}
        {showStartButton && (
          <div className="text-center mt-8">
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-green-400 text-black font-bold text-lg rounded hover:bg-green-300 transition-colors duration-200 animate-pulse"
            >
              START
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto text-center text-xs opacity-60">
          Press F1 for help • F2 for setup • ESC to skip
        </div>
      </div>
    </div>
  );
};

export default Loader;
