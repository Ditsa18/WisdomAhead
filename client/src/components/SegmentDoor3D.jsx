import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

const segments = [
  { id: 'ecommerce', label: 'E-Commerce', color: '#7C5CF5', icon: '🛒' },
  { id: 'home-business', label: 'Home Business', color: '#10B981', icon: '🏠' },
  { id: 'transportation', label: 'Transportation', color: '#F0A500', icon: '🚚' },
  { id: 'human-resource', label: 'Human Resource', color: '#EF4444', icon: '👥' },
];

export function SegmentDoor3D({ position, segment, onClick, isOpen }) {
  const doorRef = useRef();
  const [hovered, setHovered] = useState(false);
  const segmentData = segments.find(s => s.id === segment) || segments[0];

  useFrame((state) => {
    if (doorRef.current) {
      const targetRotation = isOpen ? -Math.PI / 2 : 0;
      doorRef.current.rotation.y = THREE.MathUtils.lerp(
        doorRef.current.rotation.y,
        targetRotation,
        0.08
      );
      doorRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
  });

  return (
    <group position={position}>
      {/* Door Frame */}
      <Box args={[1.8, 2.8, 0.15]} position={[0, 0, -0.08]}>
        <meshStandardMaterial color="#1A1A2E" metalness={0.7} roughness={0.3} />
      </Box>
      
      {/* Door */}
      <group ref={doorRef}>
        <Box 
          args={[1.6, 2.6, 0.1]} 
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial 
            color={hovered ? '#FFFFFF' : segmentData.color} 
            metalness={0.5} 
            roughness={0.4}
            emissive={segmentData.color}
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </Box>
        
        {/* Icon Circle */}
        <Sphere args={[0.3]} position={[0, 0.5, 0.1]}>
          <meshStandardMaterial color="#FFFFFF" metalness={0.3} roughness={0.5} />
        </Sphere>
        
        {/* Door Label */}
        <Text
          position={[0, -0.3, 0.12]}
          fontSize={0.18}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {segmentData.label}
        </Text>
      </group>
      
      {/* Glow */}
      <pointLight position={[0, 0, 0.8]} intensity={hovered ? 2 : 0.5} color={segmentData.color} distance={2.5} />
    </group>
  );
}

export function TransportModule3D({ position, label, isMarked, onClick, moduleType }) {
  const moduleRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const moduleColors = {
    logistics: '#3B82F6',
    fleet: '#8B5CF6',
    delivery: '#10B981',
    tracking: '#F59E0B',
  };
  
  const color = moduleColors[moduleType] || '#3B82F6';

  useFrame((state) => {
    if (moduleRef.current) {
      moduleRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      moduleRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group position={position} ref={moduleRef}>
      {/* Main Module */}
      <Box 
        args={[1, 1, 1]} 
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={hovered ? '#60A5FA' : color} 
          metalness={0.4} 
          roughness={0.5}
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.25}
        />
      </Box>
      
      {/* Mark Indicator */}
      {isMarked && (
        <Torus args={[0.2, 0.04, 16, 32]} position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1} />
        </Torus>
      )}
      
      {/* Label */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.12}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      
      {/* Glow */}
      <pointLight position={[0, 0, 1.2]} intensity={hovered ? 2.5 : 0.6} color={color} distance={3} />
    </group>
  );
}

export function MainDoor3D({ position, onClick, isOpen }) {
  const doorRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (doorRef.current) {
      const targetRotation = isOpen ? -Math.PI / 2.5 : 0;
      doorRef.current.rotation.y = THREE.MathUtils.lerp(
        doorRef.current.rotation.y,
        targetRotation,
        0.06
      );
      doorRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Door Frame */}
      <Box args={[3, 4.5, 0.25]} position={[0, 0, -0.15]}>
        <meshStandardMaterial color="#0D0D1A" metalness={0.9} roughness={0.1} />
      </Box>
      
      {/* Decorative Frame */}
      <Box args={[3.1, 4.6, 0.05]} position={[0, 0, -0.2]}>
        <meshStandardMaterial color="#7C5CF5" metalness={0.8} roughness={0.2} emissive="#7C5CF5" emissiveIntensity={0.3} />
      </Box>
      
      {/* Main Door */}
      <group ref={doorRef}>
        <Box 
          args={[2.8, 4.3, 0.15]} 
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial 
            color={hovered ? '#A78BFA' : '#6144D8'} 
            metalness={0.6} 
            roughness={0.3}
            emissive="#7C5CF5"
            emissiveIntensity={hovered ? 0.6 : 0.3}
          />
        </Box>
        
        {/* Door Handle */}
        <Sphere args={[0.12]} position={[1.1, 0, 0.2]}>
          <meshStandardMaterial color="#F0A500" metalness={0.95} roughness={0.05} emissive="#F0A500" emissiveIntensity={0.4} />
        </Sphere>
        
        {/* Door Label */}
        <Text
          position={[0, 1.2, 0.15]}
          fontSize={0.35}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          Describe Your Idea
        </Text>
        
        {/* Subtitle */}
        <Text
          position={[0, 0.6, 0.15]}
          fontSize={0.15}
          color="#C4B5FD"
          anchorX="center"
          anchorY="middle"
        >
          Click to explore segments
        </Text>
      </group>
      
      {/* Ambient Glow */}
      <pointLight position={[0, 0, 1.5]} intensity={hovered ? 3 : 1} color="#7C5CF5" distance={5} />
      <pointLight position={[0, 2, 1]} intensity={0.5} color="#F0A500" distance={3} />
    </group>
  );
}
