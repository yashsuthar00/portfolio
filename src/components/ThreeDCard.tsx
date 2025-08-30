"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Environment, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks';
import { portfolioData } from '@/data';

// 3D Scene Component
function Scene() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meshRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ff00" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0080ff" />
      
      <Box
        ref={meshRef}
        args={[2, 2, 2]}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <meshPhongMaterial 
          color={hovered ? "#00ff00" : "#003300"} 
          wireframe={true}
          transparent={true}
          opacity={0.8}
        />
      </Box>
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={2}
      />
    </>
  );
}

const ThreeDCard = () => {
  const { isMobile, isTablet } = useResponsive();
  
  const getFontSize = () => {
    if (isMobile) return 'text-base';
    if (isTablet) return 'text-lg';
    return 'text-lg';
  };

  const getPadding = () => {
    if (isMobile) return 'p-3';
    if (isTablet) return 'p-4';
    return 'p-4';
  };

  return (
    <motion.div 
      className="w-full h-full bg-black/20 backdrop-blur-sm border border-green-500/30 rounded-lg overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <div className="h-full w-full">
        <Canvas 
          camera={{ 
            position: [0, 0, isMobile ? 6 : 8], 
            fov: isMobile ? 50 : 45 
          }}
        >
          <Scene />
        </Canvas>
      </div>
      
      {/* Overlay content */}
      <div className={`absolute ${isMobile ? 'bottom-2 left-2 right-2' : 'bottom-4 left-4 right-4'}`}>
        <div className={`bg-black/50 backdrop-blur-sm border border-green-500/50 rounded ${getPadding()}`}>
          <h3 className={`text-green-400 font-mono ${getFontSize()} mb-2`}>$ whoami</h3>
          <p className={`text-green-300 font-mono ${isMobile ? 'text-sm' : 'text-sm'} leading-relaxed`}>
            {isMobile 
              ? "Passionate developer crafting digital experiences." 
              : portfolioData.description
            }
          </p>
          {!isMobile && (
            <div className="mt-2 text-green-400 font-mono text-xs">
              <span>Specialized in React, Node.js, and cloud architecture.</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ThreeDCard;
