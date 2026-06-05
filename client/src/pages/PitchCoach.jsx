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

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Pitch Coach <Sparkles size={24} style={{ color: 'var(--accent-secondary)' }} />
        </h1>
        <p>Stress-test your business assumptions, refine your storytelling, and unlock investor feedback.</p>
      </div>

      {/* Startup context reminder */}
      <div className="card" style={{
        padding: '1rem',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(22, 33, 62, 0.3)'
      }}>
        <div style={{ fontSize: '0.85rem' }}>
          <strong>Startup Profile context:</strong> <span style={{ color: 'var(--text-secondary)' }}>({user?.category}) {user?.startupIdea ? `"${user.startupIdea.substring(0, 80)}..."` : 'No idea described yet.'}</span>
        </div>
        <button
          onClick={triggerFeedbackRequest}
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <Award size={12} /> Get Pitch Report
        </button>
      </div>

      {/* Feedback Report Panel (Shown above chat if generated) */}
      {report && (
        <div className="card" style={{
          border: '2px solid var(--accent-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          backgroundColor: 'rgba(26, 26, 46, 0.95)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award style={{ color: 'var(--accent-secondary)' }} />
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>AI Pitch Feedback Report</h2>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge badge-amber" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                Overall Score: {report.scores?.overall}/10
              </span>
              <button
                type="button"
                onClick={downloadReportPDF}
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>

          {/* Scores grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { label: 'Clarity', val: report.scores?.clarity },
              { label: 'Market Depth', val: report.scores?.marketUnderstanding },
              { label: 'Value Prop', val: report.scores?.valueProposition },
              { label: 'Storytelling', val: report.scores?.storytelling }
            ].map((sc, idx) => (
              <div key={idx} style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{sc.val}/10</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sc.label}</span>
              </div>
            ))}
          </div>

          {/* Qualitative Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h4 style={{ color: 'var(--success)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Key Strength</h4>
              <p style={{ fontSize: '0.9rem' }}>{report.keyStrength}</p>
            </div>
            
            <div>
              <h4 style={{ color: '#FF6B6B', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Critical Gap</h4>
              <p style={{ fontSize: '0.9rem' }}>{report.criticalGap}</p>
            </div>

            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Action Items</h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
        <div style={{
          backgroundColor: 'rgba(255, 107, 107, 0.15)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem',
          color: '#FF6B6B',
          fontSize: '0.85rem'
        }}>
          {errorMsg}
        </div>
      )}

      {/* Chat Messages Frame */}
      <div className="card" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '500px',
        padding: 0,
        overflow: 'hidden'
      }}>
        {/* Messages list */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          
          {messages.length === 0 && (
            <div style={{
              margin: 'auto',
              maxWidth: '400px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              <Compass size={40} style={{ margin: '0 auto', color: 'var(--accent-primary)', opacity: 0.6 }} />
              <h3>Start pitching your idea</h3>
              <p style={{ fontSize: '0.85rem' }}>Introduce your startup idea, describe your customers, or ask the coach to evaluate your business logic. Let's make it investor-ready!</p>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            
            // Clean feedback report tags from UI display
            const displayContent = msg.content.replace(/<feedback_report>[\s\S]*?<\/feedback_report>/g, '').trim();

            if (!displayContent) return null;

            return (
              <div
                key={idx}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                {/* bubble */}
                <div style={{
                  padding: '0.85rem 1.15rem',
                  borderRadius: '12px',
                  borderTopRightRadius: isUser ? '2px' : '12px',
                  borderTopLeftRadius: isUser ? '12px' : '2px',
                  backgroundColor: isUser ? 'var(--accent-secondary)' : 'var(--bg-deep)',
                  border: isUser ? 'none' : '1px solid var(--border-subtle)',
                  color: isUser ? 'var(--bg-deep)' : 'var(--text-primary)',
                  fontWeight: isUser ? 500 : 400,
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap'
                }}>
                  {displayContent}
                </div>
                
                {/* timestamp */}
                <span style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)',
                  opacity: 0.7
                }}>
                  {isUser ? 'You' : 'Pitch Coach'}
                </span>
              </div>
            );
          })}
          
          {loading && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: 'var(--accent-primary)',
                borderRadius: '50%',
                animation: 'bounce 0.6s infinite alternate'
              }} />
              <span>Coach is analyzing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} style={{
          display: 'flex',
          flexDirection: 'column',
          borderTop: '1px solid var(--border-subtle)',
          padding: '1rem',
          backgroundColor: 'rgba(0,0,0,0.1)',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={toggleRecording}
              className={recording ? 'btn btn-secondary' : 'btn btn-outline'}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', borderRadius: '8px' }}
            >
              <Mic size={16} />
              {recording ? 'Stop recording' : 'Record voice'}
            </button>
            <button
              type="button"
              onClick={playLastAssistantReply}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', borderRadius: '8px' }}
              disabled={!lastAssistantText}
            >
              <Volume2 size={16} />
              Replay response
            </button>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {recognitionSupported ? 'Speak your pitch and the coach will transcribe it automatically.' : 'Voice recording is not supported in this browser.'}
            </span>
          </div>
          {recordError && (
            <div style={{ color: '#FF6B6B', fontSize: '0.85rem' }}>{recordError}</div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message or pitch details here..."
              style={{
                flex: 1,
                border: 'none',
                backgroundColor: 'transparent',
                padding: '0.75rem',
                color: '#FFFFFF'
              }}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.25rem', borderRadius: '8px' }}
              disabled={loading}
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default PitchCoach;
