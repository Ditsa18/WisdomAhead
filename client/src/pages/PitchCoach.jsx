import React, { useEffect, useState, useRef } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { Send, Sparkles, AlertCircle, Award, Compass, Mic, Volume2, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const PitchCoach = () => {
  const { user, token } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [report, setReport] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recording, setRecording] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [recordError, setRecordError] = useState('');
  const [lastAssistantText, setLastAssistantText] = useState('');
  const [mounted, setMounted] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0]?.transcript)
          .join(' ');
        setInput(transcript);
        setRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        setRecordError('Speech recognition failed. Please try again.');
        console.error('Speech recognition error:', event.error);
        setRecording(false);
      };

      recognitionRef.current.onend = () => {
        setRecording(false);
      };
    }
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/pitch-coach/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          setReport(data.feedbackReport || null);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };
    if (token) {
      fetchHistory();
    }
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e, customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    setInput('');
    setErrorMsg('');
    
    // Optimistic update
    const userMessage = { role: 'user', content: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/pitch-coach/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: textToSend })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to communicate with the Pitch Coach');
      }

      setMessages(data.session.messages);
      const lastAssistant = data.session.messages.slice().reverse().find(msg => msg.role === 'assistant');
      if (lastAssistant) {
        setLastAssistantText(lastAssistant.content.replace(/<feedback_report>[\s\S]*?<\/feedback_report>/g, '').trim());
        speakText(lastAssistant.content.replace(/<feedback_report>[\s\S]*?<\/feedback_report>/g, '').trim());
      }
      if (data.feedbackReport) {
        setReport(data.feedbackReport);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Connection lost. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis || !text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const playLastAssistantReply = () => {
    if (lastAssistantText) {
      speakText(lastAssistantText);
    }
  };

  const startRecording = () => {
    setRecordError('');
    if (!recognitionRef.current) {
      setRecordError('Voice recording is not supported in this browser.');
      return;
    }
    try {
      setRecording(true);
      recognitionRef.current.start();
    } catch (err) {
      setRecordError('Unable to start voice recording. Please refresh and try again.');
      console.error(err);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRecording(false);
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const triggerFeedbackRequest = () => {
    handleSend(null, "Please generate a Pitch Feedback Report based on our full conversation and the responses I have given so far.");
  };

  const downloadReportPDF = () => {
    if (!report) return;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const margin = 40;
    const lineHeight = 18;
    let y = margin;

    doc.setFontSize(18);
    doc.text('Pitch Coach Feedback Report', margin, y);
    y += 28;

    doc.setFontSize(11);
    doc.text(`Generated for: ${user?.email || user?.username || 'Startup Founder'}`, margin, y);
    y += 18;
    doc.text(`Category: ${user?.category || 'Not specified'}`, margin, y);
    y += 18;
    doc.text(`Idea snapshot: ${user?.startupIdea ? user.startupIdea.substring(0, 150) : 'No startup idea provided.'}`, margin, y, { maxWidth: 520 });
    y += 36;

    const addSection = (title, text) => {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, y);
      y += 20;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(text, 520);
      doc.text(splitText, margin, y);
      y += splitText.length * lineHeight + 12;
      if (y > 720) {
        doc.addPage();
        y = margin;
      }
    };

    addSection('Overall Score', `${report.scores?.overall}/10`);
    addSection('Clarity', `${report.scores?.clarity}/10`);
    addSection('Market Understanding', `${report.scores?.marketUnderstanding}/10`);
    addSection('Value Proposition', `${report.scores?.valueProposition}/10`);
    addSection('Storytelling', `${report.scores?.storytelling}/10`);
    addSection('Key Strength', report.keyStrength || 'N/A');
    addSection('Critical Gap', report.criticalGap || 'N/A');

    if (Array.isArray(report.actionItems) && report.actionItems.length) {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Action Items', margin, y);
      y += 20;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      report.actionItems.forEach((item, idx) => {
        const bullet = `${idx + 1}. ${item}`;
        const splitText = doc.splitTextToSize(bullet, 520);
        doc.text(splitText, margin, y);
        y += splitText.length * lineHeight + 6;
        if (y > 720) {
          doc.addPage();
          y = margin;
        }
      });
    }

    doc.save('Pitch-Coach-Feedback-Report.pdf');
  };

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

        .pitch-container {
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
          display: flex;
          align-items: center;
          gap: 0.5rem;
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
        
        .context-card {
          background: rgba(22, 33, 62, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .context-text {
          font-size: 0.85rem;
          color: #8B8AA8;
        }
        
        .context-text strong { color: #F0EFF8; }
        
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
        
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(123, 92, 245, 0.4);
          color: #9D7DFF;
        }
        
        .btn-outline:hover {
          background: rgba(123, 92, 245, 0.1);
          border-color: #7B5CF5;
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
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .report-card {
          border: 2px solid rgba(245, 166, 35, 0.4);
          background: rgba(26, 26, 46, 0.95);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .report-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #F0EFF8;
        }
        
        .score-badge {
          background: linear-gradient(135deg, #F5A623, #FFD166);
          color: #04040C;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
        }
        
        .scores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 1rem;
        }
        
        .score-item {
          background: rgba(0, 0, 0, 0.3);
          padding: 0.75rem;
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .score-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #F5A623;
        }
        
        .score-label {
          font-size: 0.75rem;
          color: #8B8AA8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .report-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .report-section h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .report-section h4.success { color: #06D6A0; }
        .report-section h4.danger { color: #FF6B6B; }
        .report-section h4.default { color: #F0EFF8; }
        
        .report-section p {
          font-size: 0.9rem;
          color: #8B8AA8;
          line-height: 1.6;
        }
        
        .report-section ul {
          padding-left: 1.25rem;
          font-size: 0.9rem;
          color: #8B8AA8;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        
        .alert {
          padding: 1rem 1.25rem;
          border-radius: 12px;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          animation: slideDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .alert-error {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #FF6B6B;
        }
        
        .chat-card {
          height: 500px;
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .empty-state {
          margin: auto;
          max-width: 400px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          color: #8B8AA8;
        }
        
        .empty-icon {
          margin: 0 auto;
          color: #7B5CF5;
          opacity: 0.6;
        }
        
        .empty-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #F0EFF8;
        }
        
        .empty-desc {
          font-size: 0.85rem;
          line-height: 1.6;
        }
        
        .message {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 75%;
        }
        
        .message.user { align-self: flex-end; }
        .message.assistant { align-self: flex-start; }
        
        .message-bubble {
          padding: 0.85rem 1.15rem;
          border-radius: 12px;
          borderTopRightRadius: 2px;
          border-top-left-radius: 12px;
          font-size: 0.95rem;
          line-height: 1.5;
          white-space: pre-wrap;
          position: relative;
        }
        
        .message.user .message-bubble {
          background: linear-gradient(135deg, #F5A623, #FFD166);
          color: #04040C;
          font-weight: 500;
          border: none;
        }
        
        .message.assistant .message-bubble {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #F0EFF8;
          font-weight: 400;
          border-top-right-radius: 12px;
          border-top-left-radius: 2px;
        }
        
        .message-timestamp {
          font-size: 0.7rem;
          color: #8B8AA8;
          opacity: 0.7;
        }
        
        .message.user .message-timestamp { align-self: flex-end; }
        .message.assistant .message-timestamp { align-self: flex-start; }
        
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #8B8AA8;
          font-size: 0.85rem;
        }
        
        .typing-dot {
          width: 6px;
          height: 6px;
          background: #7B5CF5;
          border-radius: 50%;
          animation: bounce 0.6s infinite alternate;
        }
        
        @keyframes bounce {
          to { transform: translateY(-4px); }
        }
        
        .chat-input-pane {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.2);
        }
        
        .button-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        
        .voice-hint {
          font-size: 0.85rem;
          color: #8B8AA8;
        }
        
        .record-error {
          color: #FF6B6B;
          font-size: 0.85rem;
        }
        
        .chat-input-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .chat-input {
          flex: 1;
          min-width: 0;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #F0EFF8;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          transition: all 0.3s;
        }
        
        .chat-input::placeholder {
          color: #5A5872;
        }
        
        .chat-input:focus {
          outline: none;
          border-color: #7B5CF5;
          background: rgba(123, 92, 245, 0.08);
        }
        
        .chat-input:disabled {
          opacity: 0.6;
        }
        
        @media (max-width: 768px) {
          .pitch-container { padding: 1.5rem; }
          .page-title { font-size: 1.75rem; }
          .context-card { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .report-header { flex-direction: column; align-items: flex-start; }
          .scores-grid { grid-template-columns: 1fr 1fr; }
          .button-row { flex-direction: column; align-items: flex-start; }
          .chat-input-row { flex-wrap: wrap; }
        }
      `}</style>
      
      <div className="floating-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      
      <div className="pitch-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            Pitch Coach <Sparkles size={24} style={{ color: '#F5A623' }} />
          </h1>
          <p className="page-subtitle">Stress-test your business assumptions, refine your storytelling, and unlock investor feedback.</p>
        </div>

        {/* Startup context reminder */}
        <div className="card context-card">
          <div className="context-text">
            <strong>Startup Profile context:</strong> ({user?.category}) {user?.startupIdea ? `"${user.startupIdea.substring(0, 80)}..."` : 'No idea described yet.'}
          </div>
          <button
            onClick={triggerFeedbackRequest}
            className="btn btn-secondary"
          >
            <Award size={12} /> Get Pitch Report
          </button>
        </div>

        {/* Feedback Report Panel */}
        {report && (
          <div className="card report-card">
            {/* Header */}
            <div className="report-header">
              <div className="report-title">
                <Award style={{ color: '#F5A623' }} />
                AI Pitch Feedback Report
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="score-badge">
                  Overall Score: {report.scores?.overall}/10
                </span>
                <button
                  type="button"
                  onClick={downloadReportPDF}
                  className="btn btn-outline"
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>

            {/* Scores grid */}
            <div className="scores-grid">
              {[
                { label: 'Clarity', val: report.scores?.clarity },
                { label: 'Market Depth', val: report.scores?.marketUnderstanding },
                { label: 'Value Prop', val: report.scores?.valueProposition },
                { label: 'Storytelling', val: report.scores?.storytelling }
              ].map((sc, idx) => (
                <div key={idx} className="score-item">
                  <div className="score-value">{sc.val}/10</div>
                  <span className="score-label">{sc.label}</span>
                </div>
              ))}
            </div>

            {/* Qualitative Details */}
            <div className="report-section">
              <div>
                <h4 className="success">Key Strength</h4>
                <p>{report.keyStrength}</p>
              </div>
              
              <div>
                <h4 className="danger">Critical Gap</h4>
                <p>{report.criticalGap}</p>
              </div>

              <div>
                <h4 className="default">Action Items</h4>
                <ul>
                  {report.actionItems?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="alert alert-error">
            {errorMsg}
          </div>
        )}

        {/* Chat Messages Frame */}
        <div className="card chat-card">
          {/* Messages list */}
          <div className="chat-messages">
            
            {messages.length === 0 && (
              <div className="empty-state">
                <Compass size={40} className="empty-icon" />
                <h3 className="empty-title">Start pitching your idea</h3>
                <p className="empty-desc">Introduce your startup idea, describe your customers, or ask the coach to evaluate your business logic. Let's make it investor-ready!</p>
              </div>
            )}

            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              
              // Clean feedback report tags from UI display
              const displayContent = msg.content.replace(/<feedback_report>[\s\S]*?<\/feedback_report>/g, '').trim();

              if (!displayContent) return null;

              return (
                <div key={idx} className={`message ${isUser ? 'user' : 'assistant'}`}>
                  <div className="message-bubble">
                    {displayContent}
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => speakText(displayContent)}
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    <Volume2 size={12} />
                    Listen
                  </button>
                  <span className="message-timestamp">
                    {isUser ? 'You' : 'Pitch Coach'}
                  </span>
                </div>
              );
            })}
            
            {loading && (
              <div className="typing-indicator">
                <div className="typing-dot" />
                <span>Coach is analyzing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input box */}
          <form onSubmit={handleSend} className="chat-input-pane">
            <div className="button-row">
              <button
                type="button"
                onClick={playLastAssistantReply}
                className="btn btn-outline"
                disabled={!lastAssistantText}
              >
                <Volume2 size={16} />
                Replay response
              </button>
              <span className="voice-hint">
                {recognitionSupported ? 'Tap the mic while typing to record your voice.' : 'Voice recording is not supported in this browser.'}
              </span>
            </div>
            {recordError && (
              <div className="record-error">{recordError}</div>
            )}
            <div className="chat-input-row">
              <button
                type="button"
                onClick={toggleRecording}
                className={recording ? 'btn btn-secondary' : 'btn btn-outline'}
              >
                <Mic size={16} />
                {recording ? 'Stop' : 'Record'}
              </button>
              <input
                type="text"
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message or pitch details here..."
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PitchCoach;
