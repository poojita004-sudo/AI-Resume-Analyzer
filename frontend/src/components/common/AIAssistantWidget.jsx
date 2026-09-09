import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, Trash2, Copy, Check, ChevronDown, MessageSquare, HelpCircle, ArrowRight } from 'lucide-react';

export default function AIAssistantWidget({ analysisData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "👋 Hi! I'm your **AI Resume Assistant**. Ask me anything about:\n\n• Ideal Resume Structure & Section Ordering\n• Writing high-impact ATS bullet points\n• Project section formatting & Action verbs\n• Any doubts about your resume analysis!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followups: [
        "What is the ideal resume structure?",
        "How to write strong ATS bullet points?",
        "What sections are mandatory on a resume?",
        "How to format the Projects section?"
      ]
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMsg;
    if (!textToSend || !textToSend.strip ? !textToSend.trim() : false) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputMsg('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          context: analysisData || null
        })
      });

      if (!response.ok) {
        throw new Error('Server response error');
      }

      const data = await response.json();
      
      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: data.response,
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followups: data.suggested_followups || []
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      // Fallback assistant response if backend endpoint is unavailable
      const fallbackResponse = getFallbackResponse(textToSend, analysisData);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: fallbackResponse.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followups: fallbackResponse.followups
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackResponse = (query, context) => {
    const q = query.toLowerCase();

    if (context && (q.includes('my') || q.includes('score') || q.includes('skill') || q.includes('analysis'))) {
      return {
        text: `📊 **Analysis Overview for ${context.filename || 'Your Resume'}**:\n\n` +
              `• **ATS Score**: ${context.ats_report?.ats_score || 85}/100\n` +
              `• **Detected Domain**: ${context.category?.primary_category || 'Software Development'}\n` +
              `• **Skills Found**: ${context.skills?.all_skills?.slice(0, 5).join(', ') || 'Python, React, SQL'}\n\n` +
              `💡 **Top Action**: Ensure each project bullet starts with a strong action verb (e.g. Engineered, Spearheaded, Optimized) and quantifiable metric.`,
        followups: ["What is ideal resume structure?", "How to write ATS bullet points?", "Top Action Verbs for resumes?"]
      };
    }

    if (q.includes('structure') || q.includes('format') || q.includes('layout')) {
      return {
        text: "📌 **Standard Resume Structure for Freshers & Students**:\n\n" +
              "1. **Header**: Full Name, Email, Mobile, LinkedIn, GitHub, Portfolio\n" +
              "2. **Summary**: 2-3 lines of domain skills & placement objective\n" +
              "3. **Technical Skills**: Programming Languages, Frameworks, Databases, Tools\n" +
              "4. **Key Projects**: 2-3 projects with title, tech stack & bullet points\n" +
              "5. **Education**: Degree, Specialization, College, Year, CGPA\n" +
              "6. **Certifications & Achievements**: Relevant certifications and hackathon ratings",
        followups: ["How to write bullet points using STAR method?", "Top ATS optimization rules?", "How to write Projects section?"]
      };
    }

    if (q.includes('ats') || q.includes('pass') || q.includes('scan')) {
      return {
        text: "🎯 **Top 4 ATS Optimization Rules**:\n\n" +
              "1. **Clean Single-Column Layout**: Avoid tables, graphics, and text boxes.\n" +
              "2. **Standard Section Headers**: Use clear headers like 'Work Experience', 'Education', 'Projects', 'Skills'.\n" +
              "3. **Exact Tech Keywords**: Align your skill keywords with job descriptions.\n" +
              "4. **PDF Format**: Always export as a standard text-based PDF.",
        followups: ["What is the ideal resume structure?", "How to write strong ATS bullet points?", "How to format the Projects section?"]
      };
    }

    if (q.includes('bullet') || q.includes('star') || q.includes('action verb')) {
      return {
        text: "✍️ **STAR Method Bullet Point Formula**:\n\n" +
              "**[Action Verb] + [Task / Tool Used] + [Quantified Result]**\n\n" +
              "• ❌ Weak: *Created a web app in React.*\n" +
              "• ✅ Strong: *Engineered a responsive web application in React and Node.js, cutting load times by 35% for 2,000 users.*",
        followups: ["How to format the Projects section?", "What is the ideal resume structure?", "Top ATS optimization rules?"]
      };
    }

    return {
      text: "💡 **General Resume Advice**:\n\n" +
            "• Keep your resume strictly to 1 page if you are a fresher.\n" +
            "• Use standard fonts like Inter, Arial, or Calibri (10-12pt).\n" +
            "• Highlight technical skills and quantifiable project outcomes.\n\n" +
            "Ask me specific questions like: *'How to write Projects section?'* or *'What is ideal resume structure?'*",
      followups: ["What is the ideal resume structure?", "How to write strong ATS bullet points?", "What sections are mandatory on a resume?"]
    };
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatMarkdown = (text) => {
    if (!text) return '';
    
    // Convert bold text **word** to <strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert code backticks `code` to <code>
    formatted = formatted.replace(/`(.*?)`/g, '<code style="background: rgba(139, 92, 246, 0.2); color: #A855F7; padding: 2px 6px; borderRadius: 4px; fontSize: 0.85em;">$1</code>');
    
    return formatted.split('\n').map((line, idx) => (
      <React.Fragment key={idx}>
        <span dangerouslySetInnerHTML={{ __html: line }} />
        {idx !== formatted.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 9999,
          background: 'var(--gradient-primary)',
          color: '#ffffff',
          border: '1px solid var(--border-purple-glow)',
          borderRadius: 'var(--radius-full)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: 'var(--shadow-purple-lg)',
          cursor: 'pointer',
          transition: 'var(--transition-normal)',
          transform: isOpen ? 'scale(0.95)' : 'scale(1)'
        }}
        className="assistant-trigger-btn"
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Bot size={22} />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 8px #10B981'
          }} />
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.2px' }}>
          AI Assistant
        </span>
        <Sparkles size={16} color="#FFE600" />
      </button>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '28px',
            width: '420px',
            maxWidth: 'calc(100vw - 40px)',
            height: '580px',
            maxHeight: 'calc(100vh - 120px)',
            zIndex: 9999,
            background: 'rgba(11, 15, 25, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-purple-glow)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeInUp 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)'
              }}>
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  AI Resume Advisor
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', fontWeight: 600 }}>Active</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Resume Structure & Placement Doubts
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setMessages([{
                  id: Date.now(),
                  sender: 'assistant',
                  text: "Chat cleared. What else would you like to ask about resume structure or ATS guidelines?",
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  followups: [
                    "What is the ideal resume structure?",
                    "How to write strong ATS bullet points?",
                    "What sections are mandatory on a resume?"
                  ]
                }])}
                title="Clear Chat"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Trash2 size={16} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Analysis Context Notification Badge (If user analyzed a resume) */}
          {analysisData && (
            <div style={{
              background: 'rgba(139, 92, 246, 0.12)',
              borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
              padding: '6px 12px',
              fontSize: '0.78rem',
              color: '#A855F7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} /> Loaded Context: <strong>{analysisData.filename}</strong> (ATS: {analysisData.ats_report?.ats_score || 85}/100)
              </span>
            </div>
          )}

          {/* Messages Container */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div key={msg.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isAssistant ? 'flex-start' : 'flex-end'
                }}>
                  <div style={{
                    maxWidth: '88%',
                    padding: '0.85rem 1rem',
                    borderRadius: isAssistant ? '4px 16px 16px 16px' : '16px 16px 4px 16px',
                    background: isAssistant
                      ? 'rgba(17, 24, 39, 0.85)'
                      : 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
                    border: isAssistant ? '1px solid var(--border-glass)' : 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    boxShadow: isAssistant ? '0 4px 15px rgba(0, 0, 0, 0.2)' : '0 4px 15px rgba(124, 58, 237, 0.3)',
                    position: 'relative'
                  }}>
                    {formatMarkdown(msg.text)}

                    {isAssistant && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <span>{msg.timestamp}</span>
                        <button
                          onClick={() => handleCopyText(msg.text, msg.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedId === msg.id ? '#10B981' : 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.7rem'
                          }}
                        >
                          {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                          {copiedId === msg.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Followup suggestions for assistant messages */}
                  {isAssistant && msg.followups && msg.followups.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px', maxWidth: '90%' }}>
                      {msg.followups.map((fText, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(fText)}
                          style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            color: '#A855F7',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)',
                            textAlign: 'left'
                          }}
                          onMouseOver={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.25)'}
                          onMouseOut={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.1)'}
                        >
                          ⚡ {fText}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A855F7', fontSize: '0.82rem' }}>
                <Bot className="spin" size={16} />
                <span>AI Assistant is formulating recommendations...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Questions Toolbar */}
          <div style={{
            padding: '8px 12px',
            background: 'rgba(10, 13, 20, 0.9)',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {[
              { label: '📐 Ideal Structure', query: 'What is the ideal resume structure?' },
              { label: '🎯 ATS Rules', query: 'What are top ATS optimization rules?' },
              { label: '✍️ STAR Bullet Method', query: 'How to write bullet points using STAR method?' },
              { label: '🛠️ Projects Format', query: 'How to format the Projects section?' }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.query)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-secondary)',
                  padding: '4px 10px',
                  borderRadius: '14px',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div style={{
            padding: '0.85rem 1rem',
            background: 'rgba(15, 20, 32, 0.95)',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about resume structure or doubts..."
              style={{
                flex: 1,
                background: 'rgba(10, 13, 20, 0.7)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMsg.trim() || loading}
              style={{
                background: inputMsg.trim() && !loading ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: inputMsg.trim() && !loading ? '#fff' : 'var(--text-muted)',
                cursor: inputMsg.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: inputMsg.trim() && !loading ? '0 4px 12px rgba(139, 92, 246, 0.4)' : 'none'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
