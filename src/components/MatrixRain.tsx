"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

interface MatrixRainProps {
  onExit: () => void;
}

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  trail: number[];
  iceCube?: {
    y: number;
    bounceHeight: number;
    bounceSpeed: number;
    size: number;
  } | null;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const columnsRef = useRef<MatrixColumn[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  const matrixChars =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01010110101";
  const fontSize = 16;
  const glowColors = useMemo(
    () => ["#00ff41", "#008f11", "#00ff88", "#40ff40"],
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Initialize columns
      const columns = Math.floor(canvas.width / fontSize);
      columnsRef.current = Array.from({ length: columns }, (_, i) => ({
        x: i * fontSize,
        y: Math.random() * canvas.height,
        speed: Math.random() * 3 + 2,
        chars: Array.from({ length: 20 }, () => {
          const randomChar =
            matrixChars[Math.floor(Math.random() * matrixChars.length)];
          return randomChar || "A";
        }),
        trail: Array.from({ length: 20 }, (_, j) => 1 - j * 0.05),
        iceCube:
          Math.random() > 0.7
            ? {
                y: canvas.height - 50,
                bounceHeight: Math.random() * 30 + 20,
                bounceSpeed: Math.random() * 0.1 + 0.05,
                size: Math.random() * 8 + 6,
              }
            : null,
      }));
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      // Background with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw columns
      columnsRef.current.forEach(column => {
        // Move column down
        column.y += column.speed;

        // Reset column if it goes off screen
        if (column.y > canvas.height + fontSize * 20) {
          column.y = -fontSize * 20;
          column.speed = Math.random() * 3 + 2;
          column.chars = Array.from({ length: 20 }, () => {
            const randomChar =
              matrixChars[Math.floor(Math.random() * matrixChars.length)];
            return randomChar || "A";
          });
        }

        // Draw character trail
        column.chars.forEach((char, i) => {
          const charY = column.y - i * fontSize;
          if (charY > -fontSize && charY < canvas.height + fontSize) {
            const alpha = column.trail[i] || 0;

            // Glow effect
            const glowColor =
              glowColors[Math.floor(Math.random() * glowColors.length)];
            ctx.shadowColor = glowColor || "#00ff41";
            ctx.shadowBlur = 20;

            // Character color with trail fade
            const green = Math.floor(255 * alpha);
            ctx.fillStyle = `rgba(${Math.floor(green * 0.2)}, ${green}, ${Math.floor(green * 0.3)}, ${alpha})`;
            const fontWeight = i === 0 ? "bold" : "normal";
            ctx.font = `${fontWeight} ${fontSize}px 'Courier New', monospace`;

            ctx.fillText(char, column.x, charY);

            // Reset shadow
            ctx.shadowBlur = 0;
          }
        });

        // Randomly change characters
        if (Math.random() > 0.98) {
          const randomIndex = Math.floor(Math.random() * column.chars.length);
          const newChar =
            matrixChars[Math.floor(Math.random() * matrixChars.length)];
          column.chars[randomIndex] = newChar || "A";
        }

        // Draw ice cube effect at bottom
        if (column.iceCube && column.y > canvas.height - 100) {
          const iceCube = column.iceCube;

          // Update bounce animation
          iceCube.y += Math.sin(Date.now() * iceCube.bounceSpeed) * 0.5;

          // Draw 3D ice cube effect
          ctx.save();

          // Cube glow
          ctx.shadowColor = "#40ff40";
          ctx.shadowBlur = 15;

          // Main cube
          ctx.fillStyle = "rgba(64, 255, 64, 0.8)";
          ctx.fillRect(
            column.x - iceCube.size / 2,
            iceCube.y - iceCube.size / 2,
            iceCube.size,
            iceCube.size
          );

          // Top face (3D effect)
          ctx.fillStyle = "rgba(128, 255, 128, 0.6)";
          ctx.beginPath();
          ctx.moveTo(column.x - iceCube.size / 2, iceCube.y - iceCube.size / 2);
          ctx.lineTo(column.x, iceCube.y - iceCube.size);
          ctx.lineTo(column.x + iceCube.size / 2, iceCube.y - iceCube.size / 2);
          ctx.lineTo(column.x, iceCube.y);
          ctx.closePath();
          ctx.fill();

          // Right face (3D effect)
          ctx.fillStyle = "rgba(32, 255, 32, 0.4)";
          ctx.beginPath();
          ctx.moveTo(column.x + iceCube.size / 2, iceCube.y - iceCube.size / 2);
          ctx.lineTo(column.x + iceCube.size, iceCube.y);
          ctx.lineTo(column.x + iceCube.size / 2, iceCube.y + iceCube.size / 2);
          ctx.lineTo(column.x, iceCube.y);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      });

      if (!isExiting) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    // Keyboard event handling
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "q" || e.key === "Q" || e.key === "Escape") {
        setIsExiting(true);
        setTimeout(onExit, 300);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyPress);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onExit, isExiting, glowColors]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 transition-opacity duration-300 ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Exit instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="font-mono text-sm text-green-400/80">
          Press Q, ESC, or type &apos;exit&apos; to return to terminal
        </p>
      </div>

      {/* 3D Matrix branding */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <h1 className="font-mono text-2xl font-bold text-green-400 drop-shadow-lg">
          [ 3D MATRIX RAIN ]
        </h1>
        <p className="mt-2 font-mono text-sm text-green-400/60">
          Enhanced with trailing ice cube effects
        </p>
      </div>
    </div>
  );
};

export default MatrixRain;
