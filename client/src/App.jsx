import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import MyModules from './pages/MyModules';
import ModuleDetail from './pages/ModuleDetail';
import PitchCoach from './pages/PitchCoach';
import StartupBrief from './pages/StartupBrief';
import Documents from './pages/Documents';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import SegmentDeepDive from './pages/SegmentDeepDive';
import AdminDashboard from './pages/AdminDashboard';
import VCNetwork from './pages/VCNetwork';

// Layout for authenticated routes
const AuthenticatedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="main-content">
        <button
          type="button"
          className="mobile-sidebar-toggle"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/segment/:segment" element={<SegmentDeepDive />} />

      {/* Onboarding Route (requires login but not onboarded state) */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireOnboarded={false}>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes (requires onboarding complete) */}
      <Route element={
        <ProtectedRoute requireOnboarded={true}>
          <AuthenticatedLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/modules" element={<MyModules />} />
        <Route path="/modules/:id" element={<ModuleDetail />} />
        <Route path="/pitch-coach" element={<PitchCoach />} />
        <Route path="/startup-brief" element={<StartupBrief />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/vc-network" element={<VCNetwork />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
