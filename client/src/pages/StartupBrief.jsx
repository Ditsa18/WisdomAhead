import React, { useEffect, useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { FileDown, Calendar, FileText, User as UserIcon, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';

const StartupBrief = () => {
  const { user, token } = useAuth();
  const [briefData, setBriefData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        const res = await fetch(`${API_URL}/documents/brief`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBriefData(data);
        }
      } catch (err) {
        console.error('Error fetching brief data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchBrief();
    }
  }, [token]);

  const generatePDF = () => {
    if (briefData.length === 0) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageHeight = doc.internal.pageSize.height;
    let y = 20;

    // Cover Title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(15, 15, 26);
    doc.text("MINDLAUNCH STARTUP BRIEF", 20, y);
    y += 10;

    // Subheader
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(108, 99, 255);
    doc.text(`Generated on ${new Date().toLocaleDateString()} | Target Region: ${user.region}`, 20, y);
    y += 12;

    // Metadata Block
    doc.setFillColor(240, 240, 245);
    doc.rect(20, y, 170, 30, "F");
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 60);
    doc.setFont("Helvetica", "bold");
    doc.text("Founder name:", 25, y + 8);
    doc.text("Business Category:", 25, y + 16);
    doc.text("Initial Idea:", 25, y + 24);

    doc.setFont("Helvetica", "normal");
    doc.text(user.name, 60, y + 8);
    doc.text(user.category, 60, y + 16);
    
    const splitIdea = doc.splitTextToSize(user.startupIdea || "Not described yet.", 120);
    doc.text(splitIdea, 60, y + 24);
    y += 40;

    // Loop through completed modules
    briefData.forEach((mod) => {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 15, 26);
      doc.text(`Module ${mod.moduleId}: ${mod.title} (${mod.trackName})`, 20, y);
      y += 6;

      doc.setDrawColor(220, 220, 230);
      doc.line(20, y, 190, y);
      y += 6;

      doc.setFontSize(9.5);
      mod.answers.forEach((ans) => {
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(80, 80, 95);
        const splitLabel = doc.splitTextToSize(`${ans.label}:`, 45);
        doc.text(splitLabel, 22, y);

        doc.setFont("Helvetica", "normal");
        doc.setTextColor(20, 20, 30);
        const splitAns = doc.splitTextToSize(ans.answer || "No response provided.", 115);
        doc.text(splitAns, 70, y);

        const labelHeight = splitLabel.length * 4.5;
        const ansHeight = splitAns.length * 4.5;
        y += Math.max(labelHeight, ansHeight) + 4;

        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
      });

      y += 8;
    });

    doc.save(`${user.name.toLowerCase().replace(/\s+/g, '_')}_startup_brief.pdf`);
  };

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #04040C; color: #F0EFF8; }
          .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; gap: 1rem; }
          .loading-spinner { width: 48px; height: 48px; border: 3px solid rgba(123, 92, 245, 0.2); border-top-color: #7B5CF5; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .loading-text { color: #8B8AA8; font-size: 0.95rem; }
        `}</style>
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading startup brief deliverables...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #04040C; color: #F0EFF8; min-height: 100vh; }
        
        .floating-particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(123, 92, 245, 0.3);
          border-radius: 50%;
          animation: floatParticle 15s infinite linear;
        }

        .particle:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; animation-duration: 18s; }
        .particle:nth-child(2) { left: 20%; top: 60%; animation-delay: 2s; animation-duration: 20s; }
        .particle:nth-child(3) { left: 30%; top: 40%; animation-delay: 4s; animation-duration: 22s; }
        .particle:nth-child(4) { left: 40%; top: 80%; animation-delay: 6s; animation-duration: 16s; }
        .particle:nth-child(5) { left: 50%; top: 10%; animation-delay: 8s; animation-duration: 24s; }
        .particle:nth-child(6) { left: 60%; top: 70%; animation-delay: 10s; animation-duration: 19s; }
        .particle:nth-child(7) { left: 70%; top: 30%; animation-delay: 12s; animation-duration: 21s; }
        .particle:nth-child(8) { left: 80%; top: 50%; animation-delay: 14s; animation-duration: 17s; }
        .particle:nth-child(9) { left: 90%; top: 90%; animation-delay: 16s; animation-duration: 23s; }
        .particle:nth-child(10) { left: 15%; top: 85%; animation-delay: 18s; animation-duration: 25s; }
        .particle:nth-child(11) { left: 25%; top: 15%; animation-delay: 20s; animation-duration: 20s; background: rgba(245, 166, 35, 0.2); }
        .particle:nth-child(12) { left: 35%; top: 55%; animation-delay: 22s; animation-duration: 18s; background: rgba(245, 166, 35, 0.2); }
        .particle:nth-child(13) { left: 45%; top: 25%; animation-delay: 24s; animation-duration: 22s; background: rgba(245, 166, 35, 0.2); }
        .particle:nth-child(14) { left: 55%; top: 75%; animation-delay: 26s; animation-duration: 19s; background: rgba(245, 166, 35, 0.2); }
        .particle:nth-child(15) { left: 65%; top: 45%; animation-delay: 28s; animation-duration: 21s; background: rgba(245, 166, 35, 0.2); }

        @keyframes floatParticle {
          0% {
            transform: translateY(100vh) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(80vh) translateX(20px) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(10vh) translateX(-20px) scale(1);
          }
          100% {
            transform: translateY(-10vh) translateX(0) scale(0);
            opacity: 0;
          }
        }

        .brief-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .page-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #F0EFF8, #9D7DFF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .page-subtitle {
          font-size: 1rem;
          color: #8B8AA8;
          line-height: 1.6;
        }
        
        .card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .card:hover {
          border-color: rgba(123, 92, 245, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(123, 92, 245, 0.1);
        }
        
        .meta-card {
          background: rgba(22, 33, 62, 0.3);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .meta-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(123, 92, 245, 0.15);
          color: #7B5CF5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .meta-info { flex: 1; }
        
        .meta-label {
          font-size: 0.8rem;
          color: #8B8AA8;
          margin-bottom: 0.25rem;
        }
        
        .meta-value {
          font-weight: 600;
          color: #F0EFF8;
        }
        
        .idea-section {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 1rem;
          margin-top: 0.5rem;
        }
        
        .idea-label {
          font-size: 0.85rem;
          color: #8B8AA8;
          margin-bottom: 0.5rem;
        }
        
        .idea-text {
          font-style: italic;
          color: #F0EFF8;
          line-height: 1.6;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          text-decoration: none;
        }
        
        .btn-secondary {
          background: linear-gradient(135deg, #F5A623, #FFD166);
          border: none;
          color: #04040C;
          box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
        }
        
        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 166, 35, 0.4);
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #8B8AA8;
        }
        
        .empty-state {
          text-align: center;
          padding: 3.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: center;
        }
        
        .empty-icon {
          color: #F5A623;
          opacity: 0.7;
          margin: 0 auto;
        }
        
        .empty-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #F0EFF8;
        }
        
        .empty-desc {
          max-width: 450px;
          margin: 0 auto;
          font-size: 0.9rem;
          color: #8B8AA8;
          line-height: 1.6;
        }
        
        .modules-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .module-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .module-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #F0EFF8;
        }
        
        .track-badge {
          background: rgba(123, 92, 245, 0.15);
          border: 1px solid rgba(123, 92, 245, 0.3);
          color: #9D7DFF;
          padding: 0.35rem 0.85rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .answers-table {
          border-collapse: collapse;
          font-size: 0.9rem;
          width: 100%;
        }
        
        .answers-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          color: #8B8AA8;
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .answers-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        
        .answers-table td.field-label {
          font-weight: 600;
          color: #F0EFF8;
          width: 35%;
        }
        
        .answers-table td.answer {
          color: #8B8AA8;
          white-space: pre-wrap;
          line-height: 1.6;
        }
        
        .answers-table td.answer span.empty {
          font-style: italic;
          opacity: 0.5;
        }
        
        @media (max-width: 768px) {
          .brief-container { padding: 1.5rem; }
          .page-header { flex-direction: column; }
          .page-title { font-size: 1.75rem; }
          .meta-grid { grid-template-columns: 1fr; }
          .module-header { flex-direction: column; align-items: flex-start; }
          .answers-table { font-size: 0.85rem; }
          .answers-table td { padding: 0.5rem; }
        }
      `}</style>
      
      <div className="floating-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      
      <div className="brief-container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">My Startup Brief</h1>
            <p className="page-subtitle">This aggregates all your completed deliverables into a singular business profile.</p>
          </div>
          
          {briefData.length > 0 ? (
            <button onClick={generatePDF} className="btn btn-secondary">
              <FileDown size={18} /> Download Brief PDF
            </button>
          ) : (
            <button className="btn" disabled>
              <FileDown size={18} /> No Deliverables to Download
            </button>
          )}
        </div>

        {/* Brief Meta Summary */}
        <div className="card meta-card">
          <div className="meta-grid">
            
            <div className="meta-item">
              <div className="meta-icon">
                <UserIcon size={20} />
              </div>
              <div className="meta-info">
                <div className="meta-label">Founder Name</div>
                <div className="meta-value">{user?.name}</div>
              </div>
            </div>

            <div className="meta-item">
              <div className="meta-icon">
                <Calendar size={20} />
              </div>
              <div className="meta-info">
                <div className="meta-label">Region</div>
                <div className="meta-value">{user?.region}</div>
              </div>
            </div>

            <div className="meta-item">
              <div className="meta-icon">
                <FileText size={20} />
              </div>
              <div className="meta-info">
                <div className="meta-label">Completed Deliverables</div>
                <div className="meta-value">{briefData.length} modules finished</div>
              </div>
            </div>

          </div>

          <div className="idea-section">
            <div className="idea-label">Core Startup Idea</div>
            <p className="idea-text">"{user?.startupIdea}"</p>
          </div>
        </div>

        {/* List of deliverables per module */}
        {briefData.length === 0 ? (
          <div className="card empty-state">
            <Sparkles size={36} className="empty-icon" />
            <h3 className="empty-title">Brief is currently empty</h3>
            <p className="empty-desc">
              Complete your first module's deliverables under <strong>My Modules</strong> to populate this sheet and build your investor briefing documents!
            </p>
          </div>
        ) : (
          <div className="modules-list">
            {briefData.map((mod) => (
              <div key={mod.moduleId} className="card module-card">
                <div className="module-header">
                  <h3 className="module-title">
                    Module {mod.moduleId}: {mod.title}
                  </h3>
                  <span className="track-badge">
                    {mod.trackName}
                  </span>
                </div>
                
                <table className="answers-table">
                  <thead>
                    <tr>
                      <th>Deliverable Field</th>
                      <th>My Answers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mod.answers.map((ans) => (
                      <tr key={ans.fieldKey}>
                        <td className="field-label">{ans.label}</td>
                        <td className="answer">
                          {ans.answer || <span className="empty">Not answered</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StartupBrief;
