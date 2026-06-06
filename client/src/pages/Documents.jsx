import React, { useEffect, useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { FileDown, Lock, CheckCircle, FileText, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType
} from 'docx';

const Documents = () => {
  const { user, token } = useAuth();
  
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDocumentsData = async () => {
      try {
        const res = await fetch(`${API_URL}/modules`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setModules(data);
          setCompletedCount(data.filter(m => m.status === 'completed').length);
        }
      } catch (err) {
        console.error('Error fetching modules for document downloads:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchDocumentsData();
    }
  }, [token]);

  // Generate individual Module PDF
  const downloadModulePDF = (mod) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`MindLaunch Deliverable: ${mod.title}`, 20, 25);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(108, 99, 255);
    doc.text(`Module ${mod.moduleId} | Track: ${mod.trackName} | Founder: ${user.name} | Region: ${user.region}`, 20, 32);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 37, 190, 37);

    let y = 47;
    const pageHeight = doc.internal.pageSize.height;

    mod.deliverableSchema.forEach((schema) => {
      const answerVal = mod.deliverableAnswers?.[schema.fieldKey] || "No answer provided.";

      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 60);
      const splitLabel = doc.splitTextToSize(`${schema.label}:`, 160);
      doc.text(splitLabel, 20, y);
      y += (splitLabel.length * 5) + 1;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 30);
      const splitAns = doc.splitTextToSize(answerVal, 160);
      doc.text(splitAns, 22, y);
      y += (splitAns.length * 5) + 8;
    });

    doc.save(`module_${mod.moduleId}_${mod.title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  };

  // Generate Individual Module Word (.docx)
  const downloadModuleWord = async (mod) => {
    const tableRows = [];

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: "Deliverable Question", bold: true, color: "FFFFFF" })] })],
            shading: { fill: "6C63FF" }
          }),
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: "Founder Response", bold: true, color: "FFFFFF" })] })],
            shading: { fill: "6C63FF" }
          })
        ]
      })
    );

    mod.deliverableSchema.forEach((schema) => {
      const answerVal = mod.deliverableAnswers?.[schema.fieldKey] || "No response provided.";
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: schema.label, bold: true })] })],
              shading: { fill: "F0F0F5" }
            }),
            new TableCell({
              children: [new Paragraph({ text: answerVal })]
            })
          ]
        })
      );
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: `MindLaunch: ${mod.title}`, bold: true, size: 36 }),
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Module ${mod.moduleId} | Track: ${mod.trackName} | Founder: ${user.name}`, italics: true }),
            ]
          }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            },
            rows: tableRows
          })
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `module_${mod.moduleId}_${mod.title.toLowerCase().replace(/\s+/g, '_')}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate aggregate Startup Brief Word (.docx)
  const downloadBriefWord = async () => {
    const completedModules = modules.filter(m => m.status === 'completed');
    if (completedModules.length === 0) return;

    const sections = [];

    const titleParagraph = new Paragraph({
      children: [
        new TextRun({ text: "MINDLAUNCH STARTUP BRIEF", bold: true, size: 40, color: "0F0F1A" })
      ]
    });

    const metaParagraph = new Paragraph({
      children: [
        new TextRun({ text: `Founder: ${user.name} | Category: ${user.category} | Region: ${user.region}`, bold: true }),
      ]
    });

    const ideaParagraph = new Paragraph({
      children: [
        new TextRun({ text: `Initial Concept: "${user.startupIdea}"`, italics: true })
      ]
    });

    const spaceParagraph = new Paragraph({ text: "" });

    const docElements = [
      titleParagraph,
      metaParagraph,
      ideaParagraph,
      spaceParagraph,
      new Paragraph({ text: "Compiled Business Deliverables:", bold: true, size: 24 }),
      spaceParagraph
    ];

    completedModules.forEach((mod) => {
      docElements.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Module ${mod.moduleId}: ${mod.title} (${mod.trackName})`, bold: true, size: 26, color: "6C63FF" })
          ]
        })
      );
      docElements.push(spaceParagraph);

      const rows = [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: "Deliverable Key", bold: true, color: "FFFFFF" })] })],
              shading: { fill: "6C63FF" }
            }),
            new TableCell({
              width: { size: 65, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: "Founder Response", bold: true, color: "FFFFFF" })] })],
              shading: { fill: "6C63FF" }
            })
          ]
        })
      ];

      mod.deliverableSchema.forEach((schema) => {
        const answer = mod.deliverableAnswers?.[schema.fieldKey] || "No answer provided.";
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: schema.label, bold: true })] })],
                shading: { fill: "F0F0F5" }
              }),
              new TableCell({
                children: [new Paragraph({ text: answer })]
              })
            ]
          })
        );
      });

      docElements.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
          },
          rows: rows
        })
      );

      docElements.push(spaceParagraph);
      docElements.push(spaceParagraph);
    });

    const doc = new Document({
      sections: [{
        children: docElements
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.name.toLowerCase().replace(/\s+/g, '_')}_startup_brief.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate PDF Brief wrapper
  const downloadBriefPDF = () => {
    const completedModules = modules.filter(m => m.status === 'completed');
    if (completedModules.length === 0) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageHeight = doc.internal.pageSize.height;
    let y = 20;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("MINDLAUNCH STARTUP BRIEF", 20, y);
    y += 10;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(108, 99, 255);
    doc.text(`Founder: ${user.name} | Category: ${user.category} | Region: ${user.region}`, 20, y);
    y += 15;

    completedModules.forEach((mod) => {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 15, 26);
      doc.text(`Module ${mod.moduleId}: ${mod.title}`, 20, y);
      y += 6;

      doc.line(20, y, 190, y);
      y += 6;

      mod.deliverableSchema.forEach((schema) => {
        const answer = mod.deliverableAnswers?.[schema.fieldKey] || "No response.";
        
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(80, 80, 95);
        const splitLabel = doc.splitTextToSize(`${schema.label}:`, 45);
        doc.text(splitLabel, 22, y);

        doc.setFont("Helvetica", "normal");
        doc.setTextColor(20, 20, 30);
        const splitAns = doc.splitTextToSize(answer, 115);
        doc.text(splitAns, 70, y);

        const lHeight = splitLabel.length * 4.5;
        const aHeight = splitAns.length * 4.5;
        y += Math.max(lHeight, aHeight) + 4;

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
          <p className="loading-text">Loading document registry...</p>
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

        .documents-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .page-header { margin-bottom: 2rem; }
        
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
        
        .highlight-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border: 2px solid rgba(245, 166, 35, 0.3);
          background: rgba(26, 26, 46, 0.95);
        }
        
        .highlight-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .highlight-badge {
          background: linear-gradient(135deg, #F5A623, #FFD166);
          color: #04040C;
          padding: 0.35rem 0.85rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }
        
        .highlight-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #F0EFF8;
        }
        
        .highlight-desc {
          font-size: 0.95rem;
          color: #8B8AA8;
          line-height: 1.6;
          margin-top: 0.25rem;
        }
        
        .button-group {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 0.6rem 1.25rem;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          text-decoration: none;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #7B5CF5, #5B3CC5);
          border: none;
          color: #fff;
          box-shadow: 0 4px 15px rgba(123, 92, 245, 0.3);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(123, 92, 245, 0.4);
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(123, 92, 245, 0.4);
          color: #9D7DFF;
        }
        
        .btn-outline:hover {
          background: rgba(123, 92, 245, 0.1);
          border-color: #7B5CF5;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #8B8AA8;
        }
        
        .status-text {
          font-size: 0.85rem;
          color: #8B8AA8;
        }
        
        .status-text strong { color: #F0EFF8; }
        
        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #F0EFF8;
        }
        
        .table-card {
          padding: 0;
          overflow: hidden;
        }
        
        .table-wrapper {
          overflow-x: auto;
        }
        
        .modules-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        
        .modules-table th {
          text-align: left;
          padding: 1rem;
          color: #8B8AA8;
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
        }
        
        .modules-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        
        .modules-table tr { transition: background 0.2s; }
        .modules-table tr:hover { background: rgba(255, 255, 255, 0.02); }
        
        .module-name {
          font-weight: 600;
          color: #F0EFF8;
        }
        
        .track-name {
          color: #8B8AA8;
        }
        
        .status-completed {
          color: #06D6A0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 500;
        }
        
        .status-locked {
          color: #8B8AA8;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .download-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }
        
        .download-btn {
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .no-downloads {
          font-size: 0.8rem;
          color: #8B8AA8;
        }
        
        .row-locked { opacity: 0.6; }
        
        @media (max-width: 768px) {
          .documents-container { padding: 1.5rem; }
          .page-title { font-size: 1.75rem; }
          .highlight-header { flex-direction: column; align-items: flex-start; }
          .button-group { width: 100%; }
          .btn { flex: 1; justify-content: center; }
          .modules-table { font-size: 0.85rem; }
          .modules-table th, .modules-table td { padding: 0.75rem 0.5rem; }
          .download-actions { flex-direction: column; }
        }
      `}</style>
      
      <div className="floating-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      
      <div className="documents-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Document Hub</h1>
          <p className="page-subtitle">Download individual module worksheets or your aggregated startup briefing document.</p>
        </div>

        {/* Top Card: Compile Startup Brief */}
        <div className="card highlight-card">
          <div className="highlight-header">
            <div>
              <span className="highlight-badge">
                <Sparkles size={12} /> Aggregate Dossier
              </span>
              <h2 className="highlight-title">Complete Startup Brief</h2>
              <p className="highlight-desc">
                Consolidates all answers from your completed modules into one unified plan for review by investors.
              </p>
            </div>
            
            <div className="button-group">
              {completedCount > 0 ? (
                <>
                  <button onClick={downloadBriefPDF} className="btn btn-outline">
                    <FileDown size={16} /> Download PDF
                  </button>
                  <button onClick={downloadBriefWord} className="btn btn-primary">
                    <FileDown size={16} /> Download Word (DOCX)
                  </button>
                </>
              ) : (
                <button className="btn" disabled>
                  <Lock size={16} /> Complete Modules to Download
                </button>
              )}
            </div>
          </div>
          
          <div className="status-text">
            Status: <strong>{completedCount}/30 Modules Completed</strong>
          </div>
        </div>

        {/* Module Documents List */}
        <div>
          <h3 className="section-title">Module Worksheets</h3>
          
          <div className="card table-card">
            <div className="table-wrapper">
              <table className="modules-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Track</th>
                    <th>Status</th>
                    <th>Available Downloads</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((mod) => {
                    const isCompleted = mod.status === 'completed';
                    return (
                      <tr key={mod.moduleId} className={!isCompleted ? 'row-locked' : ''}>
                        <td className="module-name">
                          Module {mod.moduleId}: {mod.title}
                        </td>
                        <td className="track-name">
                          {mod.trackName}
                        </td>
                        <td>
                          {isCompleted ? (
                            <span className="status-completed">
                              <CheckCircle size={14} /> Completed
                            </span>
                          ) : (
                            <span className="status-locked">
                              <Lock size={14} /> Locked / Incomplete
                            </span>
                          )}
                        </td>
                        <td>
                          {isCompleted ? (
                            <div className="download-actions">
                              <button
                                onClick={() => downloadModulePDF(mod)}
                                className="btn btn-outline download-btn"
                              >
                                <FileDown size={12} /> PDF
                              </button>
                              <button
                                onClick={() => downloadModuleWord(mod)}
                                className="btn btn-primary download-btn"
                              >
                                <FileDown size={12} /> Word
                              </button>
                            </div>
                          ) : (
                            <span className="no-downloads">
                              No deliverables
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Documents;
