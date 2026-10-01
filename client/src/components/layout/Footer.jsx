import React from 'react';
import { Layers, Shield, Heart, Award, Sparkles } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: '#090d16',
        padding: '48px 24px 32px 24px',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '40px',
        }}
      >
        {/* Col 1: Platform Mission */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div className="brand-icon" style={{ width: '30px', height: '30px' }}>
              <Layers size={16} />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
              Campus<span style={{ color: '#818cf8' }}>Link</span>
            </span>
          </div>
          <p style={{ lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '16px' }}>
            A verified nationwide academic collaboration ecosystem empowering students and faculty across India to build projects, exchange peer knowledge, and earn evidence-based reputation.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>
            <Shield size={14} />
            <span>Verified Institutional Ecosystem</span>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '0.02em' }}>
            COLLABORATION ECOSYSTEM
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <button
                onClick={() => setActivePage('projects')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
              >
                Project Hub & Smart Matching
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('qa')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
              >
                Academic Q&A & Anonymous Inquiries
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('mentors')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
              >
                Faculty Mentorship Discovery
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('research')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
              >
                Faculty Research Positions
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Student Tools */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '0.02em' }}>
            REPUTATION & TEAMS
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <button
                onClick={() => setActivePage('teams')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
              >
                Kanban Workspaces & Team Chat
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('leaderboard')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
              >
                All-India Academic Leaderboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('opportunities')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
              >
                Hackathons & Grants Board
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('profile')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
              >
                Dynamic Evidence Portfolio
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Problem Statement Info */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '0.02em' }}>
            PROBLEM STATEMENT PS004
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>
            "Convert academic collaboration from a college-local activity into a verified nationwide ecosystem."
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
          >
            <Sparkles size={14} />
            <span>IITs · NITs · BITS · State Universities</span>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
        }}
      >
        <div>
          © 2026 CampusLink (PS004). Designed for Nationwide Academic Excellence & Inter-Collegiate Collaboration.
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>LinkedIn + Stack Overflow + GitHub Projects + Team Chat</span>
        </div>
      </div>
    </footer>
  );
}
