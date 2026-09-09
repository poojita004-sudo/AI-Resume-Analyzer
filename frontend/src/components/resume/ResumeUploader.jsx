import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Loader2, Play } from 'lucide-react';

export default function ResumeUploader({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file (.pdf format).');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/resume/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server response error: ${response.statusText}`);
      }

      const data = await response.json();
      setLoading(false);
      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }
    } catch (err) {
      setLoading(false);
      setError('Backend API is connecting or offline. Starting FastAPI server on port 8000...');
    }
  };

  const handleDemoAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAnalysisComplete({
        filename: file ? file.name : "sample_resume.pdf",
        page_count: 1,
        contact_info: {
          email: "candidate@example.com",
          phone: "+91 9876543210",
          linkedin: "https://linkedin.com/in/sample-candidate",
          github: "https://github.com/sample-candidate"
        },
        skills: {
          programming_languages: ["Python", "JavaScript", "C++", "SQL"],
          web_frameworks: ["React", "FastAPI", "Node.js", "TailwindCSS"],
          ai_ml_data: ["Machine Learning", "Pandas", "Scikit-Learn", "NLP"],
          database_cloud: ["MongoDB", "Docker", "Git", "AWS"],
          soft_skills: ["Problem Solving", "Team Leadership", "Communication"],
          all_skills: ["Python", "JavaScript", "C++", "SQL", "React", "FastAPI", "Node.js", "MongoDB", "Docker", "Machine Learning", "Git"]
        },
        category: {
          primary_category: "Full-Stack & AI Engineering",
          confidence_score: 92,
          category_scores: { "Full-Stack & AI Engineering": 92, "Data Science": 75 }
        },
        ats_report: {
          ats_score: 85,
          word_count: 420,
          breakdown: {
            contact_info: { score: 15, max: 15 },
            section_structure: { score: 25, max: 25 },
            skill_diversity: { score: 25, max: 25 },
            action_verbs_metrics: { score: 10, max: 20 },
            formatting_length: { score: 10, max: 15 }
          },
          suggestions: [
            "Use strong action verbs like 'Engineered', 'Optimized', 'Spearheaded' at the beginning of bullet points.",
            "Quantify your project metrics with measurable achievements (e.g., 'Improved speed by 35%').",
            "Ensure certifications section includes issue dates and credential links."
          ]
        }
      });
    }, 1200);
  };

  return (
    <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Upload Your Resume
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Select or drag your PDF resume to extract skills, compute ATS score & receive AI advice.
        </p>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: isDragOver ? '2px dashed #8B5CF6' : '2px dashed var(--border-purple-glow)',
          background: isDragOver ? 'rgba(139, 92, 246, 0.1)' : 'rgba(10, 13, 20, 0.5)',
          borderRadius: 'var(--radius-md)',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'var(--transition-fast)'
        }}
      >
        <input
          type="file"
          accept=".pdf"
          id="resume-input"
          style={{ display: 'none' }}
          onChange={(e) => handleFileChange(e.target.files[0])}
        />
        <label htmlFor="resume-input" style={{ cursor: 'pointer', display: 'block' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: 'var(--shadow-purple-lg)'
          }}>
            <UploadCloud size={30} color="#fff" />
          </div>

          <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            {file ? file.name : 'Drag & drop your PDF resume here'}
          </p>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Supports PDF files up to 10MB
          </span>
        </label>
      </div>

      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '12px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.88rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <AlertCircle size={18} />
            {error}
          </div>
          <button
            onClick={handleDemoAnalysis}
            style={{
              alignSelf: 'flex-start',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid var(--border-purple-glow)',
              color: '#A855F7',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '4px'
            }}
          >
            <Play size={14} /> Preview Instant Analysis Demo
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="btn-gradient"
          style={{
            flex: 1,
            padding: '14px',
            justifyContent: 'center',
            opacity: (!file || loading) ? 0.6 : 1,
            cursor: (!file || loading) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <>
              <Loader2 className="spin" size={20} />
              Analyzing Resume...
            </>
          ) : (
            <>
              Analyze Resume <Sparkles size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
