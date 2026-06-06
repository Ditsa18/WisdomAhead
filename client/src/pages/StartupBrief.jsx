import React, { useEffect, useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { FileDown, Calendar, FileText, User as UserIcon, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';

const StartupBrief = () => {
  const { user, token } = useAuth();
  const [briefData, setBriefData] = useState([]);
  const [loading, setLoading] = useState(true);

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
    doc.setTextColor(15, 15, 26); // Deep navy
    doc.text("MINDLAUNCH STARTUP BRIEF", 20, y);
    y += 10;

    // Subheader
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(108, 99, 255); // Purple accent
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
      // Check if we need a new page
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }

      // Module Heading
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 15, 26);
      doc.text(`Module ${mod.moduleId}: ${mod.title} (${mod.trackName})`, 20, y);
      y += 6;

      // Draw thin separator line
      doc.setDrawColor(220, 220, 230);
      doc.line(20, y, 190, y);
      y += 6;

      // Print answers
      doc.setFontSize(9.5);
      mod.answers.forEach((ans) => {
        // Label
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(80, 80, 95);
        const splitLabel = doc.splitTextToSize(`${ans.label}:`, 45);
        doc.text(splitLabel, 22, y);

        // Answer
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(20, 20, 30);
        const splitAns = doc.splitTextToSize(ans.answer || "No response provided.", 115);
        doc.text(splitAns, 70, y);

        // Calculate heights
        const labelHeight = splitLabel.length * 4.5;
        const ansHeight = splitAns.length * 4.5;
        y += Math.max(labelHeight, ansHeight) + 4;

        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
      });

      y += 8; // spacing between modules
    });

    doc.save(`${user.name.toLowerCase().replace(/\s+/g, '_')}_startup_brief.pdf`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p>Loading startup brief deliverables...</p>
      </div>
    );
  }

  return (
    <div className="page-shell page-wrap">
      
      {/* Header */}
      <div className="split-row responsive-header" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>My Startup Brief</h1>
          <p>This aggregates all your completed deliverables into a singular business profile.</p>
        </div>
        
        {briefData.length > 0 ? (
          <button onClick={generatePDF} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileDown size={18} /> Download Brief PDF
          </button>
        ) : (
          <button className="btn btn-locked" disabled style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileDown size={18} /> No Deliverables to Download
          </button>
        )}
      </div>

      {/* Brief Meta Summary */}
      <div className="card" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        backgroundColor: 'rgba(22, 33, 62, 0.2)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: 'var(--accent-primary)' }}><UserIcon size={20} /></div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Founder Name</div>
              <div style={{ fontWeight: 600 }}>{user?.name}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: 'var(--accent-primary)' }}><Calendar size={20} /></div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Region</div>
              <div style={{ fontWeight: 600 }}>{user?.region}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: 'var(--accent-primary)' }}><FileText size={20} /></div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Completed Deliverables</div>
              <div style={{ fontWeight: 600 }}>{briefData.length} modules finished</div>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Core Startup Idea</div>
          <p style={{ fontStyle: 'italic', color: '#FFFFFF' }}>"{user?.startupIdea}"</p>
        </div>
      </div>

      {/* List of deliverables per module */}
      {briefData.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Sparkles size={36} style={{ color: 'var(--accent-secondary)', margin: '0 auto', opacity: 0.7 }} />
          <h3>Brief is currently empty</h3>
          <p style={{ maxWidth: '450px', margin: '0 auto', fontSize: '0.9rem' }}>
            Complete your first module's deliverables under <strong>My Modules</strong> to populate this sheet and build your investor briefing documents!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {briefData.map((mod) => (
            <div key={mod.moduleId} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>
                  Module {mod.moduleId}: {mod.title}
                </h3>
                <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                  {mod.trackName}
                </span>
              </div>
              
              <div className="responsive-table">
                <table style={{ borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', color: 'var(--text-secondary)', width: '35%' }}>Deliverable Field</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text-secondary)' }}>My Answers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mod.answers.map((ans) => (
                      <tr key={ans.fieldKey} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.75rem 1rem 0.75rem 0', fontWeight: 600, color: '#FFFFFF' }}>{ans.label}</td>
                        <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                          {ans.answer || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>Not answered</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default StartupBrief;
