import React from 'react';
import { Award, CheckCircle2, AlertTriangle, Cpu, Layers, User, Mail, Phone, Linkedin, Github, RefreshCw } from 'lucide-react';

export default function AnalysisResult({ result, onReset }) {
  if (!result) return null;

  const { ats_report, category, skills, contact_info, filename } = result;
  const { ats_score, breakdown, suggestions } = ats_report;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'; // Emerald Green
    if (score >= 60) return '#F59E0B'; // Amber Yellow
    return '#EF4444'; // Red
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Bar */}
      <div className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Analyzed Resume</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{filename}</h2>
        </div>
        <button
          onClick={onReset}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-primary)',
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          <RefreshCw size={16} /> Upload Another
        </button>
      </div>

      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* ATS Score Card */}
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '1rem' }}>
            Overall ATS Score
          </span>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: `6px solid ${getScoreColor(ats_score)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: getScoreColor(ats_score),
            boxShadow: `0 0 25px ${getScoreColor(ats_score)}33`,
            marginBottom: '1rem'
          }}>
            {ats_score}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>out of 100 points</span>
        </div>

        {/* Category Detection Card */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} color="#8B5CF6" />
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Detected Category</span>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }} className="text-gradient">
            {category.primary_category}
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Confidence Match: <strong style={{ color: '#3B82F6' }}>{category.confidence_score}%</strong>
          </span>
        </div>
      </div>

      {/* Skills Extraction Grid */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <Cpu size={22} color="#3B82F6" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Extracted Skills & Taxonomy</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {Object.entries(skills).map(([cat, list]) => {
            if (cat === 'all_skills' || !list || list.length === 0) return null;
            const categoryNames = {
              programming_languages: 'Programming Languages',
              web_frameworks: 'Web & Frameworks',
              ai_ml_data: 'AI / ML & Data Science',
              database_cloud: 'Database, Cloud & DevOps',
              soft_skills: 'Soft Skills & Leadership'
            };
            return (
              <div key={cat}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                  {categoryNames[cat] || cat}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {list.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(59, 130, 246, 0.12)',
                        border: '1px solid var(--border-blue-glow)',
                        color: '#60A5FA',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <AlertTriangle size={22} color="#F59E0B" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>ATS Improvement Suggestions</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((sug, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  color: '#FCD34D',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
                {sug}
              </div>
            ))
          ) : (
            <p style={{ color: '#10B981', fontSize: '0.95rem' }}>Great job! Your resume passes essential ATS criteria cleanly.</p>
          )}
        </div>
      </div>
    </div>
  );
}
