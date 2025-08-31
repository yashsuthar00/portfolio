'use client';

import { useResponsive } from '@/hooks';
import { Box, Environment, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

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
      <Environment preset='night' />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color='#00ff00' />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color='#0080ff' />

      <Box
        ref={meshRef}
        args={[2, 2, 2]}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <meshPhongMaterial
          color={hovered ? '#00ff00' : '#003300'}
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
  const { isMobile } = useResponsive();

  return (
    <motion.div
      className='relative h-full w-full overflow-hidden bg-black/20 backdrop-blur-sm'
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <div className='h-full w-full'>
        <Canvas
          camera={{
            position: [0, 0, isMobile ? 6 : 8],
            fov: isMobile ? 50 : 45,
          }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Overlay content */}
      <div className='absolute right-4 bottom-4'>
        <div className='rounded-lg bg-black/50 px-3 py-2 backdrop-blur-sm'>
          <span className='font-mono text-xs text-green-400'>
            [ 3d interactive card ]
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreeDCard;
