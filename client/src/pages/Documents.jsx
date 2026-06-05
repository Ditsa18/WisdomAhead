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

    // Output answer keys
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
      y += (splitAns.length * 5) + 8; // Spacing between questions
    });

    doc.save(`module_${mod.moduleId}_${mod.title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  };

  // Generate Individual Module Word (.docx)
  const downloadModuleWord = async (mod) => {
    const tableRows = [];

    // Table Header
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

    // Populate rows
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
          new Paragraph({ text: "" }), // Spacing
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

    // Header paragraph
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

    // Add a table for each completed module
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
    // Collect all completed modules
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p>Loading document registry...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Document Hub</h1>
        <p>Download individual module worksheets or your aggregated startup briefing document.</p>
      </div>

      {/* Top Card: Compile Startup Brief */}
      <div className="card" style={{
        border: '2px solid var(--accent-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        backgroundColor: 'rgba(108, 99, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <Sparkles size={12} /> Aggregate Dossier
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Complete Startup Brief</h2>
            <p style={{ marginTop: '0.25rem' }}>
              Consolidates all answers from your completed modules into one unified plan for review by investors.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {completedCount > 0 ? (
              <>
                <button onClick={downloadBriefPDF} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileDown size={16} /> Download PDF
                </button>
                <button onClick={downloadBriefWord} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileDown size={16} /> Download Word (DOCX)
                </button>
              </>
            ) : (
              <button className="btn btn-locked" disabled style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={16} /> Complete Modules to Download
              </button>
            )}
          </div>
        </div>
        
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Status: <strong>{completedCount}/30 Modules Completed</strong>
        </div>
      </div>

      {/* Module Documents List */}
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Module Worksheets</h3>
        
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Module</th>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Track</th>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '1rem' }}>Available Downloads</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((mod) => {
                  const isCompleted = mod.status === 'completed';
                  return (
                    <tr key={mod.moduleId} style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      opacity: isCompleted ? 1 : 0.6
                    }}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>
                        Module {mod.moduleId}: {mod.title}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {mod.trackName}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {isCompleted ? (
                          <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <CheckCircle size={14} /> Completed
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Lock size={14} /> Locked / Incomplete
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {isCompleted ? (
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => downloadModulePDF(mod)}
                              className="btn btn-outline"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                              <FileDown size={12} /> PDF
                            </button>
                            <button
                              onClick={() => downloadModuleWord(mod)}
                              className="btn btn-primary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                              <FileDown size={12} /> Word
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
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
  );
};

export default Documents;
