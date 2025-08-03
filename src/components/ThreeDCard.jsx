"use client";

import React from "react";

const ThreeDCard = ({
  className = "",
  children = null,
  interactive = true,
}) => {
  return (
    <div
      className={`relative h-full min-h-[400px] w-full rounded-lg border border-blue-400/20 bg-[var(--card-panel)] ${className}`}
      style={{ backgroundColor: "var(--card-panel)" }}
    >
      {/* Main content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-2 border-blue-400/30 bg-blue-400/10">
            <div className="text-4xl font-bold text-blue-400">YS</div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Yash Suthar</h3>
            <p className="text-blue-400">Software Developer</p>
          </div>

          <div className="max-w-xs text-sm text-gray-400">
            {interactive && <p>3D Interactive Portfolio Card</p>}
          </div>

          {/* Placeholder for 3D scene */}
          <div className="mt-8">
            <div className="font-mono text-xs text-blue-400/60">
              {/* TODO: Insert Three.js 3D card logic here */}
            </div>
            <div className="font-mono text-xs text-blue-400/60">
              {/* Ready for Three.js integration */}
            </div>
          </div>
        </div>
      </div>

      {/* Glowing border effect */}
      <div className="pointer-events-none absolute inset-0 rounded-lg border border-blue-400/20 transition-colors duration-300 hover:border-blue-400/40" />

      {/* Corner indicators */}
      <div className="absolute top-2 left-2 h-3 w-3 border-t-2 border-l-2 border-blue-400/30" />
      <div className="absolute top-2 right-2 h-3 w-3 border-t-2 border-r-2 border-blue-400/30" />
      <div className="absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-blue-400/30" />
      <div className="absolute right-2 bottom-2 h-3 w-3 border-r-2 border-b-2 border-blue-400/30" />

      {/* Required label as per NEWJSONPROMPT.md */}
      <div className="absolute right-4 bottom-4 font-mono text-sm font-bold text-[#18FF4D]">
        [ 3D interactive Card ]
      </div>

      {children}
    </div>
  );
};

export default ThreeDCard;
