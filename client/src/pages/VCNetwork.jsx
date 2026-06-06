import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MessageCircle, 
  Star, 
  DollarSign, 
  TrendingUp, 
  Users,
  Filter,
  Search,
  ChevronRight,
  Clock,
  CheckCircle2,
  X,
  Send,
  Video,
  Phone
} from 'lucide-react';

export default function VCNetwork() {
  const [selectedVC, setSelectedVC] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'vc', text: 'Hello! I reviewed your pitch deck and I\'m interested in learning more about your transportation startup.', time: '10:30 AM' },
  ]);

  const vcs = [
    { 
      id: 1, 
      name: 'Venture Capital Firm A', 
      type: 'Seed Stage', 
      focus: 'E-commerce, SaaS', 
      investments: 45, 
      avgInvestment: '$500K - $2M',
      portfolio: ['TechStartup A', 'EcomB', 'CloudX'],
      status: 'active',
      rating: 4.8,
      description: 'Specializing in early-stage technology companies with strong growth potential.',
    },
    { 
      id: 2, 
      name: 'Tech Growth Partners', 
      type: 'Series A', 
      focus: 'Transportation, Logistics', 
      investments: 32, 
      avgInvestment: '$2M - $10M',
      portfolio: ['LogiTech', 'TranspoX', 'FleetAI'],
      status: 'active',
      rating: 4.9,
      description: 'Focused on scaling transportation and logistics companies with proven business models.',
    },
    { 
      id: 3, 
      name: 'Global Innovation Fund', 
      type: 'Early Stage', 
      focus: 'All Sectors', 
      investments: 67, 
      avgInvestment: '$250K - $5M',
      portfolio: ['HomeBiz', 'HR Tech', 'EcomY'],
      status: 'active',
      rating: 4.7,
      description: 'Diversified investment fund supporting innovative startups across all sectors.',
    },
    { 
      id: 4, 
      name: 'Startup Accelerator VC', 
      type: 'Pre-Seed', 
      focus: 'Home Business', 
      investments: 28, 
      avgInvestment: '$100K - $500K',
      portfolio: ['HomeGrown', 'LocalBiz', 'Crafty'],
      status: 'pending',
      rating: 4.5,
      description: 'Accelerator program providing funding and mentorship to home-based businesses.',
    },
  ];

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  const dates = ['Today', 'Tomorrow', 'Mar 15', 'Mar 16', 'Mar 17', 'Mar 18'];

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { 
        id: chatMessages.length + 1, 
        sender: 'user', 
        text: message, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
      setMessage('');
    }
  };

  const handleScheduleMeeting = () => {
    if (selectedDate && selectedTime) {
      alert(`Meeting scheduled with ${selectedVC.name} on ${selectedDate} at ${selectedTime}`);
      setShowCalendar(false);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

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
            VC Network
          </h1>
          <p style={{ color: "#9896B2", fontSize: "0.9rem" }}>
            Connect with investors and get funding for your startup
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", color: "#5A5872" }} />
            <input
              type="text"
              placeholder="Search VCs..."
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
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#EEEDF5",
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

      <div style={{ padding: "2rem" }}>
        {/* VC Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem",
        }}>
          {vcs.map((vc, index) => (
            <motion.div
              key={vc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedVC(vc)}
              style={{
                background: "rgba(26,26,46,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
                padding: "2rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                }}>
                  {vc.name.charAt(0)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Star size={18} color="#F0A500" fill="#F0A500" />
                  <span style={{ fontSize: "1rem", fontWeight: 700 }}>{vc.rating}</span>
                </div>
              </div>

              <h3 style={{
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontSize: "1.3rem",
                fontWeight: 800,
                marginBottom: "0.5rem",
              }}>
                {vc.name}
              </h3>

              <p style={{ color: "#9896B2", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                {vc.description}
              </p>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "8px",
                  background: "rgba(124,92,245,0.15)",
                  border: "1px solid rgba(124,92,245,0.3)",
                  color: "#C4B5FD",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}>
                  {vc.type}
                </div>
                <div style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "8px",
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  color: "#6EE7B7",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}>
                  {vc.focus}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#5A5872", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <DollarSign size={14} />
                    Avg Investment
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{vc.avgInvestment}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#5A5872", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <TrendingUp size={14} />
                    Portfolio
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{vc.investments} companies</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVC(vc);
                    setShowChat(true);
                  }}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "rgba(124,92,245,0.15)",
                    border: "1px solid rgba(124,92,245,0.3)",
                    color: "#C4B5FD",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                >
                  <MessageCircle size={18} />
                  Chat
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVC(vc);
                    setShowCalendar(true);
                  }}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "rgba(16,185,129,0.15)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    color: "#6EE7B7",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                >
                  <Calendar size={18} />
                  Schedule
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* VC Detail Modal */}
      <AnimatePresence>
        {selectedVC && !showChat && !showCalendar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 200,
              padding: "2rem",
            }}
            onClick={() => setSelectedVC(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "700px",
                background: "rgba(26,26,46,0.98)",
                backdropFilter: "blur(30px)",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "2.5rem",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <button
                onClick={() => setSelectedVC(null)}
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#EEEDF5",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.2rem",
                  fontWeight: 800,
                }}>
                  {selectedVC.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{
                    fontFamily: "Bricolage Grotesque, sans-serif",
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    marginBottom: "0.3rem",
                  }}>
                    {selectedVC.name}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Star size={18} color="#F0A500" fill="#F0A500" />
                    <span style={{ fontSize: "1rem", fontWeight: 600 }}>{selectedVC.rating}</span>
                    <span style={{ color: "#9896B2", fontSize: "0.9rem" }}>• {selectedVC.type}</span>
                  </div>
                </div>
              </div>

              <p style={{ color: "#9896B2", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                {selectedVC.description}
              </p>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                }}>
                  Focus Areas
                </h3>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {selectedVC.focus.split(", ").map((focus, i) => (
                    <span key={i} style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "10px",
                      background: "rgba(124,92,245,0.15)",
                      border: "1px solid rgba(124,92,245,0.3)",
                      color: "#C4B5FD",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}>
                      {focus}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                }}>
                  Portfolio Companies
                </h3>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {selectedVC.portfolio.map((company, i) => (
                    <span key={i} style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "10px",
                      background: "rgba(16,185,129,0.15)",
                      border: "1px solid rgba(16,185,129,0.3)",
                      color: "#6EE7B7",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}>
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => {
                    setShowChat(true);
                  }}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  <MessageCircle size={20} />
                  Start Chat
                </button>
                <button
                  onClick={() => {
                    setShowCalendar(true);
                  }}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  <Calendar size={20} />
                  Schedule Meeting
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && selectedVC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 300,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                width: "90%",
                maxWidth: "600px",
                height: "80vh",
                background: "rgba(26,26,46,0.98)",
                backdropFilter: "blur(30px)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div style={{
                padding: "1.5rem 2rem",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: 800,
                  }}>
                    {selectedVC.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: "Bricolage Grotesque, sans-serif",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      marginBottom: "0.2rem",
                    }}>
                      {selectedVC.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#10B981", fontSize: "0.85rem" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }} />
                      Online
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#EEEDF5",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ flex: 1, padding: "1.5rem 2rem", overflowY: "auto" }}>
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    <div style={{
                      maxWidth: "70%",
                      padding: "1rem 1.25rem",
                      borderRadius: "16px",
                      background: msg.sender === "user" 
                        ? "linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%)"
                        : "rgba(255,255,255,0.05)",
                      border: msg.sender === "user" ? "none" : "1px solid rgba(255,255,255,0.1)",
                      color: msg.sender === "user" ? "#FFFFFF" : "#EEEDF5",
                    }}>
                      <div style={{ fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "0.4rem" }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: "1.5rem 2rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    style={{
                      flex: 1,
                      padding: "0.85rem 1.25rem",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#EEEDF5",
                      fontSize: "0.95rem",
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    style={{
                      padding: "0.85rem 1.25rem",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%)",
                      border: "none",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Modal */}
      <AnimatePresence>
        {showCalendar && selectedVC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 300,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                width: "90%",
                maxWidth: "500px",
                background: "rgba(26,26,46,0.98)",
                backdropFilter: "blur(30px)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "2.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <h2 style={{
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                }}>
                  Schedule Meeting
                </h2>
                <button
                  onClick={() => setShowCalendar(false)}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#EEEDF5",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#9896B2", marginBottom: "0.75rem", fontWeight: 500 }}>
                  Select Date
                </label>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {dates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      style={{
                        padding: "0.75rem 1.25rem",
                        borderRadius: "10px",
                        background: selectedDate === date 
                          ? "linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%)"
                          : "rgba(255,255,255,0.05)",
                        border: selectedDate === date ? "none" : "1px solid rgba(255,255,255,0.1)",
                        color: selectedDate === date ? "#FFFFFF" : "#EEEDF5",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        transition: "all 0.2s",
                      }}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#9896B2", marginBottom: "0.75rem", fontWeight: 500 }}>
                  Select Time
                </label>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      style={{
                        padding: "0.75rem 1.25rem",
                        borderRadius: "10px",
                        background: selectedTime === time 
                          ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                          : "rgba(255,255,255,0.05)",
                        border: selectedTime === time ? "none" : "1px solid rgba(255,255,255,0.1)",
                        color: selectedTime === time ? "#FFFFFF" : "#EEEDF5",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        transition: "all 0.2s",
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => setShowCalendar(false)}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#EEEDF5",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleMeeting}
                  disabled={!selectedDate || !selectedTime}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    borderRadius: "12px",
                    background: selectedDate && selectedTime
                      ? "linear-gradient(135deg, #7C5CF5 0%, #6144D8 100%)"
                      : "rgba(124,92,245,0.2)",
                    border: "none",
                    color: selectedDate && selectedTime ? "#FFFFFF" : "#9896B2",
                    cursor: selectedDate && selectedTime ? "pointer" : "not-allowed",
                    fontSize: "1rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Calendar size={20} />
                  Confirm Meeting
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
