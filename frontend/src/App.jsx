import React, { useState } from 'react';
import { Sparkles, FileText, Cpu, Target, Award, BarChart3, ChevronRight, Bot } from 'lucide-react';
import ResumeUploader from './components/resume/ResumeUploader';
import AnalysisResult from './components/resume/AnalysisResult';
import AIAssistantWidget from './components/common/AIAssistantWidget';

function App() {
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <header style={{
        padding: '1.25rem 2rem',
        borderBottom: '1px solid var(--border-glass)',
        background: 'rgba(10, 13, 20, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-purple-lg)'
            }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }} className="text-gradient">
              AI Resume Analyzer
            </span>
          </div>

          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#analyzer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Analyzer</a>
            <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Features</a>
            <button className="btn-gradient" onClick={() => {
              const el = document.getElementById('analyzer-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>
              Analyze Now <ChevronRight size={16} />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>
        {/* Hero Section */}
        <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid var(--border-purple-glow)',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={14} color="#8B5CF6" />
            <span style={{ fontSize: '0.85rem', color: '#A855F7', fontWeight: 600 }}>Placement Preparation Suite</span>
          </div>

          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem' }}>
            AI-Powered Resume Analysis & <br />
            <span className="text-gradient">ATS Optimization</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            Elevate your placement readiness. Instant PDF parsing, NLP skill extraction, ATS score breakdown, domain classification, and suggestions.
          </p>
        </section>

        {/* Interactive Analyzer Section */}
        <section id="analyzer-section" style={{ marginBottom: '5rem' }}>
          {!analysisData ? (
            <ResumeUploader onAnalysisComplete={(data) => setAnalysisData(data)} />
          ) : (
            <AnalysisResult result={analysisData} onReset={() => setAnalysisData(null)} />
          )}
        </section>

        {/* Feature Architecture Cards Grid */}
        <section id="features" style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '2.5rem' }}>
            Core Feature Modules
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: FileText, title: 'PDF Text Extraction', desc: 'PyMuPDF based extraction parsing layout, structure, and text cleanly.' },
              { icon: Cpu, title: 'NLP Skill Extractor', desc: 'Extracts programming languages, frameworks, cloud, and soft skills.' },
              { icon: Target, title: 'ATS Score Engine', desc: 'Evaluates formatting, word count, section coverage, and action verbs.' },
              { icon: Award, title: 'Category Classifier', desc: 'Detects domain (Web Dev, Data Science/AI, DevOps, Core Engineering).' },
              { icon: BarChart3, title: 'Job Matching & Gaps', desc: 'Measures similarity score against job descriptions and identifies missing skills.' },
              { icon: Bot, title: 'AI Resume Assistant', desc: 'Interactive chat guidance on resume structure, ATS rules, and bullet points.' }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid var(--border-purple-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Icon size={22} color="#8B5CF6" />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{feat.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        borderTop: '1px solid var(--border-glass)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        © 2026 AI-Resume-Analyzer. Built for Placement Preparation.
      </footer>

      {/* Floating AI Assistant Widget */}
      <AIAssistantWidget analysisData={analysisData} />
    </div>
  );
}

export default App;

