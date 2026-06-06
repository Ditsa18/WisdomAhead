import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { TransportModule3D } from '../components/SegmentDoor3D';
import { ArrowLeft, CheckCircle2, Circle, Calendar, MessageCircle, TrendingUp, Users, DollarSign } from 'lucide-react';

const segmentData = {
  'ecommerce': {
    title: 'E-Commerce',
    description: 'Build your online business from scratch',
    color: '#7C5CF5',
    modules: [
      { id: 'store-setup', label: 'Store Setup', isMarked: true, moduleType: 'logistics' },
      { id: 'product-catalog', label: 'Product Catalog', isMarked: false, moduleType: 'fleet' },
      { id: 'payment-gateway', label: 'Payment Gateway', isMarked: true, moduleType: 'delivery' },
      { id: 'shipping', label: 'Shipping & Logistics', isMarked: false, moduleType: 'tracking' },
      { id: 'marketing', label: 'Digital Marketing', isMarked: true, moduleType: 'tracking' },
    ]
  },
  'home-business': {
    title: 'Home Business',
    description: 'Start and scale your home-based venture',
    color: '#10B981',
    modules: [
      { id: 'business-plan', label: 'Business Plan', isMarked: true, moduleType: 'logistics' },
      { id: 'legal-setup', label: 'Legal Setup', isMarked: false, moduleType: 'fleet' },
      { id: 'workspace', label: 'Workspace Setup', isMarked: true, moduleType: 'delivery' },
      { id: 'time-management', label: 'Time Management', isMarked: false, moduleType: 'tracking' },
      { id: 'scaling', label: 'Scaling Strategy', isMarked: true, moduleType: 'tracking' },
    ]
  },
  'transportation': {
    title: 'Transportation',
    description: 'Optimize your transportation and logistics',
    color: '#F0A500',
    modules: [
      { id: 'logistics', label: 'Logistics', isMarked: true, moduleType: 'logistics' },
      { id: 'fleet', label: 'Fleet Management', isMarked: false, moduleType: 'fleet' },
      { id: 'delivery', label: 'Delivery Systems', isMarked: true, moduleType: 'delivery' },
      { id: 'tracking', label: 'Real-time Tracking', isMarked: false, moduleType: 'tracking' },
      { id: 'route', label: 'Route Optimization', isMarked: true, moduleType: 'tracking' },
    ]
  },
  'human-resource': {
    title: 'Human Resource',
    description: 'Build and manage your dream team',
    color: '#EF4444',
    modules: [
      { id: 'recruitment', label: 'Recruitment', isMarked: true, moduleType: 'logistics' },
      { id: 'onboarding', label: 'Onboarding', isMarked: false, moduleType: 'fleet' },
      { id: 'training', label: 'Training & Development', isMarked: true, moduleType: 'delivery' },
      { id: 'performance', label: 'Performance Management', isMarked: false, moduleType: 'tracking' },
      { id: 'compliance', label: 'Compliance & Policies', isMarked: true, moduleType: 'tracking' },
    ]
  }
};

export function Segment3DScene({ segment, onModuleClick, completedModules }) {
  const data = segmentData[segment] || segmentData['transportation'];

  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
      <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2.2} />
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color={data.color} />

      {data.modules.map((module, index) => {
        const x = (index % 3 - 1) * 2.5;
        const y = Math.floor(index / 3) * 2 - 1;
        const z = index * 0.5;
        return (
          <TransportModule3D
            key={module.id}
            position={[x, y, z]}
            label={module.label}
            isMarked={module.isMarked}
            onClick={() => onModuleClick(module.id)}
            moduleType={module.moduleType}
          />
        );
      })}
    </Canvas>
  );
}

export default function SegmentDeepDive() {
  const { segment } = useParams();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [showAIChat, setShowAIChat] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const data = segmentData[segment] || segmentData['transportation'];

  useEffect(() => {
    const completed = data.modules.filter(m => completedModules.includes(m.id));
    setAllCompleted(completed.length === data.modules.length);
  }, [completedModules, data.modules]);

  const handleModuleClick = (moduleId) => {
    setSelectedModule(moduleId);
  };

  const handleCompleteModule = () => {
    if (selectedModule && !completedModules.includes(selectedModule)) {
      setCompletedModules([...completedModules, selectedModule]);
    }
    setSelectedModule(null);
  };

  const handleNavigateToAI = () => {
    setShowAIChat(true);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#08080F', color: '#EEEDF5', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(8,8,15,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: '#9896B2',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
          }}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#5A5872' }}>
            {completedModules.length}/{data.modules.length} Completed
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0 }}>
        <Segment3DScene segment={segment} onModuleClick={handleModuleClick} completedModules={completedModules} />
      </div>

      {/* Content Overlay */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
        {/* Title Section */}
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '2rem',
          maxWidth: '400px',
          pointerEvents: 'auto',
        }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '100px',
              border: '1px solid rgba(124,92,245,0.28)',
              background: 'rgba(124,92,245,0.08)',
              color: '#C4B5FD',
              fontSize: '0.75rem',
              fontWeight: 500,
              marginBottom: '1rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7C5CF5' }} />
              Interactive 3D Experience
            </div>
            <h1 style={{
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontSize: '2.5rem',
              fontWeight: 800,
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              marginBottom: '0.5rem',
              background: `linear-gradient(135deg, ${data.color} 0%, #FFFFFF 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {data.title}
            </h1>
            <p style={{ color: '#9896B2', fontSize: '1rem', lineHeight: 1.6, fontWeight: 300 }}>
              {data.description}
            </p>
          </motion.div>
        </div>

        {/* Module List Panel */}
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '2rem',
          width: '320px',
          background: 'rgba(26,26,46,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '1.5rem',
          pointerEvents: 'auto',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
        }}>
          <h3 style={{
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '1rem',
            letterSpacing: '-0.3px',
          }}>
            Learning Modules
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.modules.map((module) => {
              const isCompleted = completedModules.includes(module.id);
              const isSelected = selectedModule === module.id;
              return (
                <motion.div
                  key={module.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleModuleClick(module.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(124,92,245,0.15)' : 'rgba(255,255,255,0.03)',
                    border: isSelected ? '1px solid rgba(124,92,245,0.3)' : '1px solid rgba(255,255,255,0.07)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={18} color="#10B981" />
                  ) : (
                    <Circle size={18} color="#5A5872" />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.2rem' }}>
                      {module.label}
                    </div>
                    {module.isMarked && (
                      <div style={{ fontSize: '0.75rem', color: '#F0A500' }}>
                        ⭐ Essential
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* AI Chat Button */}
          {allCompleted && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNavigateToAI}
              style={{
                width: '100%',
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(124,92,245,0.3)',
              }}
            >
              <MessageCircle size={18} />
              Start AI Q&A Session
            </motion.button>
          )}
        </div>

        {/* Module Detail Modal */}
        <AnimatePresence>
          {selectedModule && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 200,
                pointerEvents: 'auto',
              }}
              onClick={() => setSelectedModule(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '90%',
                  maxWidth: '600px',
                  background: 'rgba(26,26,46,0.98)',
                  backdropFilter: 'blur(30px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '2.5rem',
                }}
              >
                <h2 style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  letterSpacing: '-1px',
                }}>
                  {data.modules.find(m => m.id === selectedModule)?.label}
                </h2>
                <p style={{ color: '#9896B2', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Dive deep into this module with interactive lessons, real-world examples, and practical exercises. Complete the deliverables to progress through your journey.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleCompleteModule}
                    disabled={completedModules.includes(selectedModule)}
                    style={{
                      flex: 1,
                      padding: '1rem 1.5rem',
                      borderRadius: '12px',
                      background: completedModules.includes(selectedModule)
                        ? 'rgba(16,185,129,0.2)'
                        : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: completedModules.includes(selectedModule) ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      opacity: completedModules.includes(selectedModule) ? 0.7 : 1,
                    }}
                  >
                    {completedModules.includes(selectedModule) ? (
                      <>
                        <CheckCircle2 size={18} />
                        Completed
                      </>
                    ) : (
                      'Mark as Complete'
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedModule(null)}
                    style={{
                      padding: '1rem 1.5rem',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#EEEDF5',
                      fontSize: '1rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Chat Modal */}
        <AnimatePresence>
          {showAIChat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 300,
                pointerEvents: 'auto',
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  width: '90%',
                  maxWidth: '800px',
                  height: '80vh',
                  background: 'rgba(26,26,46,0.98)',
                  backdropFilter: 'blur(30px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  padding: '1.5rem 2rem',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <h2 style={{
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      marginBottom: '0.3rem',
                    }}>
                      AI Q&A Session
                    </h2>
                    <p style={{ color: '#9896B2', fontSize: '0.9rem' }}>
                      Ask questions about your segment and get AI-powered insights
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAIChat(false)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#EEEDF5',
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#5A5872',
                  }}>
                    <MessageCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                      AI-powered Q&A coming soon
                    </p>
                    <p style={{ fontSize: '0.9rem' }}>
                      This feature will integrate with Anthropic Claude to provide intelligent answers to your questions about the {data.title} segment.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
