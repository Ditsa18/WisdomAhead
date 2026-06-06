import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  MessageCircle, 
  Activity,
  BarChart3,
  Settings,
  Search,
  Filter,
  Eye,
  ChevronRight,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in production, this would come from API
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalVCs: 45,
    activeConnections: 234,
    totalFunding: 12500000,
    completedModules: 3421,
  };

  const users = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', segment: 'ecommerce', progress: 75, status: 'active', joined: '2024-01-15', lastActive: '2 hours ago' },
    { id: 2, name: 'Michael Chen', email: 'michael@example.com', segment: 'transportation', progress: 45, status: 'active', joined: '2024-02-01', lastActive: '1 day ago' },
    { id: 3, name: 'Emily Davis', email: 'emily@example.com', segment: 'home-business', progress: 90, status: 'completed', joined: '2023-12-10', lastActive: '3 hours ago' },
    { id: 4, name: 'James Wilson', email: 'james@example.com', segment: 'human-resource', progress: 30, status: 'active', joined: '2024-02-20', lastActive: '5 hours ago' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa@example.com', segment: 'ecommerce', progress: 60, status: 'active', joined: '2024-01-28', lastActive: '1 hour ago' },
  ];

  const vcs = [
    { id: 1, name: 'Venture Capital Firm A', type: 'Seed Stage', focus: 'E-commerce, SaaS', investments: 45, connected: 12, status: 'active' },
    { id: 2, name: 'Tech Growth Partners', type: 'Series A', focus: 'Transportation, Logistics', investments: 32, connected: 8, status: 'active' },
    { id: 3, name: 'Global Innovation Fund', type: 'Early Stage', focus: 'All Sectors', investments: 67, connected: 15, status: 'active' },
    { id: 4, name: 'Startup Accelerator VC', type: 'Pre-Seed', focus: 'Home Business', investments: 28, connected: 6, status: 'pending' },
  ];

  const connections = [
    { id: 1, entrepreneur: 'Sarah Johnson', vc: 'Venture Capital Firm A', status: 'scheduled', meetingDate: '2024-03-15', meetingTime: '14:00' },
    { id: 2, entrepreneur: 'Emily Davis', vc: 'Tech Growth Partners', status: 'completed', meetingDate: '2024-03-10', meetingTime: '10:00' },
    { id: 3, entrepreneur: 'Michael Chen', vc: 'Global Innovation Fund', status: 'pending', meetingDate: null, meetingTime: null },
    { id: 4, entrepreneur: 'Lisa Anderson', vc: 'Startup Accelerator VC', status: 'scheduled', meetingDate: '2024-03-18', meetingTime: '16:30' },
  ];

  const activities = [
    { id: 1, user: 'Sarah Johnson', action: 'Completed E-Commerce module', time: '2 hours ago', type: 'completion' },
    { id: 2, user: 'Emily Davis', action: 'Scheduled meeting with Tech Growth Partners', time: '3 hours ago', type: 'connection' },
    { id: 3, user: 'Michael Chen', action: 'Started Transportation segment', time: '5 hours ago', type: 'progress' },
    { id: 4, user: 'James Wilson', action: 'Updated profile information', time: '1 day ago', type: 'profile' },
    { id: 5, user: 'Lisa Anderson', action: 'Completed AI Q&A session', time: '6 hours ago', type: 'completion' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Entrepreneurs', icon: Users },
    { id: 'vcs', label: 'VC Network', icon: DollarSign },
    { id: 'connections', label: 'Connections', icon: MessageCircle },
    { id: 'activities', label: 'Activities', icon: Activity },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#08080F", color: "#EEEDF5", fontFamily: "DM Sans, sans-serif" }}>
      {/* Header */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(8,8,15,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <h1 style={{
            fontFamily: "Bricolage Grotesque, sans-serif",
            fontSize: "1.8rem",
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: "0.2rem",
          }}>
            Admin Dashboard
          </h1>
          <p style={{ color: "#9896B2", fontSize: "0.9rem" }}>
            Monitor platform activity, user progress, and VC connections
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#EEEDF5",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}>
            <Settings size={18} />
            Settings
          </button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 80px)" }}>
        {/* Sidebar */}
        <div style={{
          width: "260px",
          background: "rgba(26,26,46,0.5)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          padding: "1.5rem 1rem",
          position: "sticky",
          top: "80px",
          height: "calc(100vh - 80px)",
        }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "10px",
                  background: activeTab === tab.id ? "rgba(124,92,245,0.15)" : "transparent",
                  border: activeTab === tab.id ? "1px solid rgba(124,92,245,0.3)" : "1px solid transparent",
                  color: activeTab === tab.id ? "#C4B5FD" : "#9896B2",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stats Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}>
                {[
                  { label: "Total Users", value: stats.totalUsers, icon: Users, color: "#7C5CF5", change: "+12%" },
                  { label: "Active Users", value: stats.activeUsers, icon: Activity, color: "#10B981", change: "+8%" },
                  { label: "VC Partners", value: stats.totalVCs, icon: DollarSign, color: "#F0A500", change: "+3" },
                  { label: "Active Connections", value: stats.activeConnections, icon: MessageCircle, color: "#EF4444", change: "+15%" },
                  { label: "Total Funding", value: `$${(stats.totalFunding / 1000000).toFixed(1)}M`, icon: TrendingUp, color: "#3B82F6", change: "+22%" },
                  { label: "Completed Modules", value: stats.completedModules, icon: CheckCircle2, color: "#8B5CF6", change: "+18%" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      background: "rgba(26,26,46,0.8)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "16px",
                      padding: "1.5rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: `${stat.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <stat.icon size={24} color={stat.color} />
                      </div>
                      <span style={{ color: "#10B981", fontSize: "0.85rem", fontWeight: 600 }}>
                        {stat.change}
                      </span>
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Bricolage Grotesque, sans-serif", marginBottom: "0.3rem" }}>
                      {stat.value}
                    </div>
                    <div style={{ color: "#9896B2", fontSize: "0.9rem" }}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div style={{
                background: "rgba(26,26,46,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                padding: "2rem",
              }}>
                <h2 style={{
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  marginBottom: "1.5rem",
                }}>
                  Recent Activity
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {activities.slice(0, 5).map(activity => (
                    <div
                      key={activity.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: activity.type === "completion" ? "rgba(16,185,129,0.2)" :
                                   activity.type === "connection" ? "rgba(124,92,245,0.2)" :
                                   activity.type === "progress" ? "rgba(240,165,0,0.2)" :
                                   "rgba(59,130,246,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        {activity.type === "completion" && <CheckCircle2 size={20} color="#10B981" />}
                        {activity.type === "connection" && <MessageCircle size={20} color="#7C5CF5" />}
                        {activity.type === "progress" && <TrendingUp size={20} color="#F0A500" />}
                        {activity.type === "profile" && <Users size={20} color="#3B82F6" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 500, marginBottom: "0.2rem" }}>
                          {activity.user}
                        </div>
                        <div style={{ color: "#9896B2", fontSize: "0.85rem" }}>
                          {activity.action}
                        </div>
                      </div>
                      <div style={{ color: "#5A5872", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <h2 style={{
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                }}>
                  Entrepreneurs
                </h2>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}>
                    <Search size={18} style={{ position: "absolute", left: "12px", color: "#5A5872" }} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        padding: "0.6rem 1rem 0.6rem 2.5rem",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#EEEDF5",
                        fontSize: "0.9rem",
                        width: "280px",
                      }}
                    />
                  </div>
                  <button style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "8px",
                    background: "rgba(124,92,245,0.15)",
                    border: "1px solid rgba(124,92,245,0.3)",
                    color: "#C4B5FD",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}>
                    <Filter size={18} />
                    Filter
                  </button>
                </div>
              </div>

              <div style={{
                background: "rgba(26,26,46,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                overflow: "hidden",
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", color: "#9896B2", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        User
                      </th>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", color: "#9896B2", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Segment
                      </th>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", color: "#9896B2", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Progress
                      </th>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", color: "#9896B2", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Status
                      </th>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", color: "#9896B2", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Last Active
                      </th>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "right", fontSize: "0.85rem", color: "#9896B2", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <div>
                            <div style={{ fontSize: "0.95rem", fontWeight: 500, marginBottom: "0.2rem" }}>
                              {user.name}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#9896B2" }}>
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <span style={{
                            padding: "0.3rem 0.7rem",
                            borderRadius: "100px",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            background: "rgba(124,92,245,0.15)",
                            color: "#C4B5FD",
                            textTransform: "capitalize",
                          }}>
                            {user.segment}
                          </span>
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden", width: "80px" }}>
                              <div style={{ width: `${user.progress}%`, height: "100%", background: "linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%)", borderRadius: "3px" }} />
                            </div>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                              {user.progress}%
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <span style={{
                            padding: "0.3rem 0.7rem",
                            borderRadius: "100px",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            background: user.status === "completed" ? "rgba(16,185,129,0.15)" : "rgba(124,92,245,0.15)",
                            color: user.status === "completed" ? "#6EE7B7" : "#C4B5FD",
                            textTransform: "capitalize",
                          }}>
                            {user.status}
                          </span>
                        </td>
                        <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "#9896B2" }}>
                          {user.lastActive}
                        </td>
                        <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                          <button style={{
                            padding: "0.5rem",
                            borderRadius: "6px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#EEEDF5",
                            cursor: "pointer",
                          }}>
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "vcs" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <h2 style={{
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                }}>
                  VC Network
                </h2>
                <button style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%)",
                  border: "none",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontWeight: 600,
                }}>
                  Add New VC
                </button>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}>
                {vcs.map(vc => (
                  <motion.div
                    key={vc.id}
                    whileHover={{ y: -4 }}
                    style={{
                      background: "rgba(26,26,46,0.8)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "16px",
                      padding: "1.5rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        fontWeight: 800,
                      }}>
                        {vc.name.charAt(0)}
                      </div>
                      <span style={{
                        padding: "0.3rem 0.7rem",
                        borderRadius: "100px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: vc.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(240,165,0,0.15)",
                        color: vc.status === "active" ? "#6EE7B7" : "#FDE68A",
                        textTransform: "capitalize",
                      }}>
                        {vc.status}
                      </span>
                    </div>
                    <h3 style={{
                      fontFamily: "Bricolage Grotesque, sans-serif",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      marginBottom: "0.5rem",
                    }}>
                      {vc.name}
                    </h3>
                    <p style={{ color: "#9896B2", fontSize: "0.9rem", marginBottom: "1rem" }}>
                      {vc.focus}
                    </p>
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "#5A5872", marginBottom: "0.2rem" }}>Type</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{vc.type}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "#5A5872", marginBottom: "0.2rem" }}>Investments</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{vc.investments}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "#5A5872", marginBottom: "0.2rem" }}>Connected</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{vc.connected}</div>
                      </div>
                    </div>
                    <button style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#EEEDF5",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}>
                      View Details
                      <ChevronRight size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'connections' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 style={{
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontSize: "1.8rem",
                fontWeight: 800,
                marginBottom: "2rem",
              }}>
                VC-Entrepreneur Connections
              </h2>

              <div style={{
                background: "rgba(26,26,46,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                overflow: "hidden",
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", color: "#9896B2", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Entrepreneur
                      </th>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", color: "#9896B2", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        VC Partner
                      </th>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", color: "#9896B2", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Status
                      </th>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", color: "#9896B2", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Meeting
                      </th>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "right", fontSize: "0.85rem", color: "#9896B2", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {connections.map(connection => (
                      <tr key={connection.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "1rem 1.5rem", fontSize: "0.95rem", fontWeight: 500 }}>
                          {connection.entrepreneur}
                        </td>
                        <td style={{ padding: "1rem 1.5rem", fontSize: "0.95rem" }}>
                          {connection.vc}
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <span style={{
                            padding: "0.3rem 0.7rem",
                            borderRadius: "100px",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            background: connection.status === "completed" ? "rgba(16,185,129,0.15)" :
                                       connection.status === "scheduled" ? "rgba(124,92,245,0.15)" :
                                       "rgba(240,165,0,0.15)",
                            color: connection.status === "completed" ? "#6EE7B7" :
                                   connection.status === "scheduled" ? "#C4B5FD" :
                                   "#FDE68A",
                            textTransform: "capitalize",
                          }}>
                            {connection.status}
                          </span>
                        </td>
                        <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "#9896B2" }}>
                          {connection.meetingDate ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <Calendar size={16} />
                              {connection.meetingDate} at {connection.meetingTime}
                            </div>
                          ) : (
                            "Not scheduled"
                          )}
                        </td>
                        <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                            <button style={{
                              padding: "0.5rem",
                              borderRadius: "6px",
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "#EEEDF5",
                              cursor: "pointer",
                            }}>
                              <MessageCircle size={16} />
                            </button>
                            <button style={{
                              padding: "0.5rem",
                              borderRadius: "6px",
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "#EEEDF5",
                              cursor: "pointer",
                            }}>
                              <Calendar size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "activities" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 style={{
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontSize: "1.8rem",
                fontWeight: 800,
                marginBottom: "2rem",
              }}>
                All Activities
              </h2>

              <div style={{
                background: "rgba(26,26,46,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                padding: "2rem",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {activities.map(activity => (
                    <div
                      key={activity.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: activity.type === "completion" ? "rgba(16,185,129,0.2)" :
                                   activity.type === "connection" ? "rgba(124,92,245,0.2)" :
                                   activity.type === "progress" ? "rgba(240,165,0,0.2)" :
                                   "rgba(59,130,246,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        {activity.type === "completion" && <CheckCircle2 size={20} color="#10B981" />}
                        {activity.type === "connection" && <MessageCircle size={20} color="#7C5CF5" />}
                        {activity.type === "progress" && <TrendingUp size={20} color="#F0A500" />}
                        {activity.type === "profile" && <Users size={20} color="#3B82F6" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 500, marginBottom: "0.2rem" }}>
                          {activity.user}
                        </div>
                        <div style={{ color: "#9896B2", fontSize: "0.85rem" }}>
                          {activity.action}
                        </div>
                      </div>
                      <div style={{ color: "#5A5872", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
