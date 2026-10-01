import React from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Users,
  Briefcase,
  HelpCircle,
  Award,
  Sparkles,
  GitBranch,
  Layers,
  GraduationCap,
  TrendingUp,
  MessageSquare,
  Lock,
} from 'lucide-react';

export default function LandingPage({ setActivePage }) {
  const stats = [
    { label: 'Verified Students', value: '10,400+', icon: Users, color: '#6366f1' },
    { label: 'Faculty Mentors', value: '1,280+', icon: GraduationCap, color: '#10b981' },
    { label: 'Active Projects', value: '860+', icon: Briefcase, color: '#38bdf8' },
    { label: 'Questions Solved', value: '15,400+', icon: HelpCircle, color: '#f59e0b' },
  ];

  const features = [
    {
      icon: Users,
      title: 'Find Teammates Beyond Campus',
      desc: 'Break college silos. Discover developers, designers, and researchers with complementary skills from IITs, NITs, BITS, and State Universities.',
      badge: 'Smart Matching',
    },
    {
      icon: Lock,
      title: 'Learn Without Fear of Judgment',
      desc: 'Ask foundational or complex academic questions in our Stack Overflow-style Q&A with optional anonymous posting while keeping platform moderation safe.',
      badge: 'Anonymous Mode',
    },
    {
      icon: GraduationCap,
      title: 'Verified Faculty Mentorship',
      desc: 'Directly request guidance from verified professors and heads of departments across India for project reviews and research advice.',
      badge: 'Verified Faculty 🎓',
    },
    {
      icon: Sparkles,
      title: 'Funded Research Opportunities',
      desc: 'Apply directly to faculty-led research initiatives in AI, IoT, agriculture informatics, and quantum computing with stipends and co-authorships.',
      badge: 'Research Grants',
    },
    {
      icon: Layers,
      title: 'Dedicated Team Workspaces',
      desc: 'Built-in Kanban task boards, private team chat, file exchange, and deadline tracking keep accepted teammates aligned from idea to deployment.',
      badge: 'Kanban + Chat',
    },
    {
      icon: Award,
      title: 'Evidence-Based Academic Portfolio',
      desc: 'Transform peer answers, merged pull requests, and completed cross-campus projects into an undeniable verified portfolio with badges and reputation.',
      badge: 'Verified Evidence',
    },
  ];

  const steps = [
    { num: '01', title: 'Verify Profile', desc: 'Authenticate with institutional email (.ac.in / .edu) + OTP.' },
    { num: '02', title: 'Showcase Skills', desc: 'Add tech stack, GitHub repository link, and research interests.' },
    { num: '03', title: 'Smart Match', desc: 'Algorithm calculates skill match % and highlights missing skills.' },
    { num: '04', title: 'Apply to Teams', desc: 'Submit pitch and portfolio directly to student project leads.' },
    { num: '05', title: 'Collaborate', desc: 'Private workspace with Kanban task boards and team chat.' },
    { num: '06', title: 'Q&A & Peer Help', desc: 'Exchange solutions, vote on answers, and learn fearlessly.' },
    { num: '07', title: 'Earn Reputation', desc: 'Gain points (+20 for accepted solutions) and unlock badges.' },
    { num: '08', title: 'Build Portfolio', desc: 'Dynamic portfolio auto-generates proof of real contributions.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          padding: '16px 0 70px 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '920px',
            margin: '0 auto 20px auto',
          }}
        >
          Build Beyond <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Campus.</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '740px',
            margin: '0 auto 36px auto',
            lineHeight: 1.6,
          }}
        >
          Connect with students and faculty across India, build meaningful projects, find mentors, exchange knowledge, and grow your academic reputation.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
          <button
            onClick={() => setActivePage('auth')}
            className="btn btn-primary btn-lg"
            id="hero-auth-btn"
            style={{ boxShadow: 'var(--shadow-glow)' }}
          >
            <ShieldCheck size={18} />
            <span>Sign In / Sign Up</span>
          </button>
          <button
            onClick={() => setActivePage('projects')}
            className="btn btn-secondary btn-lg"
            id="hero-explore-btn"
          >
            <span>Explore Projects</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => setActivePage('dashboard')}
            className="btn btn-outline btn-lg"
            id="hero-dashboard-btn"
          >
            <span>Personalized Dashboard</span>
          </button>
        </div>

        {/* Ecosystem Flow Diagram Card */}
        <div
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            background: 'var(--bg-lifecycle)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 20px',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            THE VERIFIED ACADEMIC LIFECYCLE
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            <span className="badge badge-primary" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>Students + Faculty</span>
            <span style={{ color: 'var(--text-muted)' }}>➔</span>
            <span className="badge badge-info" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>Projects + Q&A + Mentors</span>
            <span style={{ color: 'var(--text-muted)' }}>➔</span>
            <span className="badge badge-warning" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>Teams + Workspaces</span>
            <span style={{ color: 'var(--text-muted)' }}>➔</span>
            <span className="badge badge-success" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>Contributions & Rep (+20)</span>
            <span style={{ color: 'var(--text-muted)' }}>➔</span>
            <span className="badge badge-match" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>Verified Portfolio</span>
          </div>
        </div>
      </section>

      {/* Demo Statistics */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: `${s.color}1a`,
                    border: `1px solid ${s.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: s.color,
                  }}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          * Nationwide prototype statistics reflecting connected Indian institutions
        </div>
      </section>

      {/* Why This Platform? */}
      <section style={{ marginBottom: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.1rem', marginBottom: '12px' }}>Why CampusLink?</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Converting academic collaboration from a college-local activity into a verified nationwide ecosystem.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#a5b4fc',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <span className="badge badge-primary">{f.badge}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, flex: 1 }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ marginBottom: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.1rem', marginBottom: '12px' }}>How It Works</h2>
          <p style={{ color: 'var(--text-secondary)' }}>From initial onboarding to verified academic evidence.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {steps.map((step) => (
            <div
              key={step.num}
              className="card"
              style={{ padding: '20px', borderTop: '3px solid var(--primary)' }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
                {step.num}
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '6px' }}>{step.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '50px 30px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '2.2rem', marginBottom: '14px' }}>Ready to build beyond your campus?</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 28px auto' }}>
          Join thousands of students and faculty collaborating across India on real-world projects, research papers, and peer learning.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => setActivePage('projects')} className="btn btn-primary btn-lg">
            <span>Find a Project</span>
            <ArrowRight size={18} />
          </button>
          <button onClick={() => setActivePage('qa')} className="btn btn-secondary btn-lg">
            <span>Ask a Question</span>
          </button>
        </div>
      </section>
    </div>
  );
}
