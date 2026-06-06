import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Float } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MainDoor3D, SegmentDoor3D, TransportModule3D } from './SegmentDoor3D';
import * as THREE from 'three';

export function ThreeScene({ scrollProgress, activeSegment, onSegmentClick, onModuleClick, openedDoors }) {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} />
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7C5CF5" />
      
      {/* Main Door - appears on scroll */}
      <motion.group
        animate={{
          opacity: scrollProgress > 0.05 ? 1 : 0,
          scale: scrollProgress > 0.05 ? 1 : 0.8,
        }}
        transition={{ duration: 0.8 }}
      >
        <MainDoor3D 
          position={[0, 0, 0]} 
          onClick={() => onSegmentClick('main')}
          isOpen={openedDoors.main}
        />
      </motion.group>

      {/* Segment Doors - appear after main door opens */}
      {openedDoors.main && (
        <>
          <SegmentDoor3D 
            position={[-3, 0, 1]} 
            segment="ecommerce" 
            onClick={() => onSegmentClick('ecommerce')}
            isOpen={openedDoors.ecommerce}
          />
          <SegmentDoor3D 
            position={[-1, 0, 1]} 
            segment="home-business" 
            onClick={() => onSegmentClick('home-business')}
            isOpen={openedDoors.homeBusiness}
          />
          <SegmentDoor3D 
            position={[1, 0, 1]} 
            segment="transportation" 
            onClick={() => onSegmentClick('transportation')}
            isOpen={openedDoors.transportation}
          />
          <SegmentDoor3D 
            position={[3, 0, 1]} 
            segment="human-resource" 
            onClick={() => onSegmentClick('human-resource')}
            isOpen={openedDoors.humanResource}
          />
        </>
      )}

      {/* Transport Modules - appear when transportation door opens */}
      {openedDoors.transportation && (
        <>
          <TransportModule3D 
            position={[-2, 1.5, 2]} 
            label="Logistics" 
            isMarked={true}
            onClick={() => onModuleClick('logistics')}
            moduleType="logistics"
          />
          <TransportModule3D 
            position={[0, 1.5, 2]} 
            label="Fleet Management" 
            isMarked={false}
            onClick={() => onModuleClick('fleet')}
            moduleType="fleet"
          />
          <TransportModule3D 
            position={[2, 1.5, 2]} 
            label="Delivery Systems" 
            isMarked={true}
            onClick={() => onModuleClick('delivery')}
            moduleType="delivery"
          />
          <TransportModule3D 
            position={[-1, -0.5, 2]} 
            label="Real-time Tracking" 
            isMarked={false}
            onClick={() => onModuleClick('tracking')}
            moduleType="tracking"
          />
          <TransportModule3D 
            position={[1, -0.5, 2]} 
            label="Route Optimization" 
            isMarked={true}
            onClick={() => onModuleClick('route')}
            moduleType="tracking"
          />
        </>
      )}
    </Canvas>
  );
}

export default function ThreeDLandingExperience({ onNavigateToSegment, onNavigateToModule }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSegment, setActiveSegment] = useState(null);
  const [openedDoors, setOpenedDoors] = useState({
    main: false,
    ecommerce: false,
    homeBusiness: false,
    transportation: false,
    humanResource: false,
  });
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);

      // Auto-open main door on scroll
      if (progress > 0.1 && !openedDoors.main) {
        setOpenedDoors(prev => ({ ...prev, main: true }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [openedDoors.main]);

  const handleSegmentClick = (segment) => {
    setActiveSegment(segment);
    setOpenedDoors(prev => ({ ...prev, [segment]: !prev[segment] }));
    
    if (segment !== 'main') {
      setTimeout(() => {
        onNavigateToSegment(segment);
      }, 500);
    }
  };

  const handleModuleClick = (module) => {
    onNavigateToModule(module);
  };

  return (
    <motion.div 
      ref={containerRef}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100vh',
        zIndex: 0,
        scale,
        opacity,
      }}
    >
      <ThreeScene 
        scrollProgress={scrollProgress}
        activeSegment={activeSegment}
        onSegmentClick={handleSegmentClick}
        onModuleClick={handleModuleClick}
        openedDoors={openedDoors}
      />
    </motion.div>
  );
}
