import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export function Door3D({ position, label, onClick, isOpen, color = '#7C5CF5' }) {
  const doorRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (doorRef.current) {
      // Smooth door opening animation
      const targetRotation = isOpen ? -Math.PI / 2 : 0;
      doorRef.current.rotation.y = THREE.MathUtils.lerp(
        doorRef.current.rotation.y,
        targetRotation,
        0.1
      );
      
      // Subtle floating animation
      doorRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Door Frame */}
      <Box args={[2.2, 3.5, 0.2]} position={[0, 0, -0.1]}>
        <meshStandardMaterial color="#1A1A2E" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Door */}
      <group ref={doorRef} position={[0, 0, 0]}>
        <Box 
          args={[2, 3.2, 0.15]} 
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial 
            color={hovered ? '#9B7FFF' : color} 
            metalness={0.6} 
            roughness={0.3}
            emissive={color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        </Box>
        
        {/* Door Handle */}
        <Cylinder args={[0.08, 0.08, 0.3, 16]} position={[0.7, 0, 0.15]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#F0A500" metalness={0.9} roughness={0.1} />
        </Cylinder>
        
        {/* Door Label */}
        <Text
          position={[0, 0.8, 0.1]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        >
          {label}
        </Text>
      </group>
      
      {/* Glow effect behind door */}
      <pointLight position={[0, 0, 1]} intensity={hovered ? 2 : 0.5} color={color} distance={3} />
    </group>
  );
}

export function Window3D({ position, label, onClick, color = '#10B981' }) {
  const windowRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (windowRef.current) {
      // Subtle floating animation
      windowRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7 + position[1]) * 0.05;
    }
  });

  return (
    <group position={position} ref={windowRef}>
      {/* Window Frame */}
      <Box 
        args={[1.5, 1.5, 0.2]} 
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={hovered ? '#34D399' : color} 
          metalness={0.5} 
          roughness={0.4}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.15}
          transparent
          opacity={0.8}
        />
      </Box>
      
      {/* Window Label */}
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.18}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      
      {/* Glow effect */}
      <pointLight position={[0, 0, 0.5]} intensity={hovered ? 1.5 : 0.3} color={color} distance={2} />
    </group>
  );
}

export function Module3D({ position, label, isMarked, onClick, color = '#F0A500' }) {
  const moduleRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (moduleRef.current) {
      // Rotating animation
      moduleRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      moduleRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position} ref={moduleRef}>
      {/* Module Box */}
      <Box 
        args={[1.2, 1.2, 1.2]} 
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={hovered ? '#FCD34D' : color} 
          metalness={0.4} 
          roughness={0.5}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </Box>
      
      {/* Mark indicator */}
      {isMarked && (
        <Sphere args={[0.15]} position={[0, 0.8, 0]}>
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
        </Sphere>
      )}
      
      {/* Module Label */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.15}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      
      {/* Glow effect */}
      <pointLight position={[0, 0, 1]} intensity={hovered ? 2 : 0.5} color={color} distance={2.5} />
    </group>
  );
}

function Sphere({ args, position, children }) {
  return <sphereGeometry args={args} position={position}>{children}</sphereGeometry>;
}
