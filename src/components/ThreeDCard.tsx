"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Environment, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

// 3D Scene Component
function Scene() {
  const meshRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
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
  return (
    <motion.div 
      className="w-full h-full bg-black/20 backdrop-blur-sm border border-green-500/30 rounded-lg overflow-hidden card-content"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <div className="h-full w-full">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Scene />
        </Canvas>
      </div>
      
      {/* Overlay content */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/50 rounded p-4">
          <h3 className="text-green-400 font-mono text-lg mb-2">$ whoami</h3>
          <p className="text-green-300 font-mono text-sm leading-relaxed">
            Passionate developer crafting digital experiences with modern technologies.
            Specialized in React, Node.js, and cloud architecture.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreeDCard;
