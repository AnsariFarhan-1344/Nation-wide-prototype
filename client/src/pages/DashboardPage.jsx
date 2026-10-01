import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Briefcase,
  HelpCircle,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function DashboardPage({ setActivePage, setSelectedProjectId, setSelectedQuestionId }) {
  const { currentUser } = useAuth();
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [trendingQuestions, setTrendingQuestions] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!currentUser) return;
      try {
        setLoading(true);
        const [projRes, qaRes, mentorRes] = await Promise.all([
          api.getProjects({ userId: currentUser.id }),
          api.getQuestions(),
          api.getMentors(),
        ]);

        if (projRes.success) {
          // Sort by match score descending
          const sorted = [...projRes.projects].sort((a, b) => b.matchScore - a.matchScore);
          setRecommendedProjects(sorted.slice(0, 2));
        }

        if (qaRes.success) {
          setTrendingQuestions(qaRes.questions.slice(0, 3));
        }

        if (mentorRes.success) {
          setRecommendedMentors(mentorRes.mentors.slice(0, 2));
        }
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'var(--bg-gradient-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.8rem' }}>👋</span>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>
              Good morning, {currentUser.name.split(' ')[0]}
            </h1>
            {currentUser.verified && (
              <span className="badge badge-success" style={{ marginLeft: '6px' }}>
                <ShieldCheck size={13} />
                <span>{currentUser.role === 'faculty' ? 'Verified Faculty 🎓' : 'Verified Student ✓'}</span>
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {currentUser.department} · {currentUser.institution}
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActivePage('create_project')}
            className="btn btn-primary btn-sm"
          >
            <Briefcase size={15} />
            <span>Post a Project</span>
          </button>
          <button
            onClick={() => setActivePage('qa')}
            className="btn btn-outline btn-sm"
          >
            <HelpCircle size={15} />
            <span>Ask Q&A</span>
          </button>
        </div>
      </div>

      {/* Grid: Main Left Column (Projects & Q&A) + Right Column (Progress & Mentors) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left: Recommended Projects & Trending Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section: Recommended Projects */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#818cf8" />
                <h2 style={{ fontSize: '1.25rem' }}>Recommended Projects For You</h2>
              </div>
              <button
                onClick={() => setActivePage('projects')}
                style={{ background: 'none', border: 'none', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                View All Projects →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recommendedProjects.map((p) => (
                <div key={p.id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-primary">{p.domain}</span>
                        <span className="badge badge-info">{p.stage}</span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{p.title}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Led by {p.ownerName} ({p.ownerInstitution})
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="badge badge-match" style={{ padding: '6px 12px', fontSize: '0.88rem' }}>
                      <Sparkles size={14} />
                      <span>{p.matchScore}% Match</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {p.description}
                  </p>

                  {/* Tech stack chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {p.techStack.map((tech, idx) => {
                      const isMatched = p.matchedSkills?.includes(tech);
                      return (
                        <span
                          key={idx}
                          className="badge"
                          style={{
                            background: isMatched ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
                            color: isMatched ? '#34d399' : 'var(--text-secondary)',
                            border: isMatched ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                            fontSize: '0.75rem',
                          }}
                        >
                          {isMatched ? `✓ ${tech}` : tech}
                        </span>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 600 }}>
                      {p.openRoles?.length || 2} roles open
                    </span>
                    <button
                      onClick={() => {
                        setSelectedProjectId(p.id);
                        setActivePage('project_detail');
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <span>View Project & Apply</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Trending Questions */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#f59e0b" />
                <h2 style={{ fontSize: '1.25rem' }}>Trending Academic Questions</h2>
              </div>
              <button
                onClick={() => setActivePage('qa')}
                style={{ background: 'none', border: 'none', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Explore Q&A →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trendingQuestions.map((q) => (
                <div
                  key={q.id}
                  className="card card-clickable"
                  onClick={() => {
                    setSelectedQuestionId(q.id);
                    setActivePage('question_detail');
                  }}
                  style={{ padding: '16px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    {/* Vote box */}
                    <div
                      style={{
                        minWidth: '45px',
                        textAlign: 'center',
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)',
                        background: q.hasAcceptedAnswer ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
                        border: q.hasAcceptedAnswer ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: q.hasAcceptedAnswer ? '#34d399' : '#fff' }}>
                        {q.upvotes}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>votes</div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.98rem', marginBottom: '6px', color: '#f8fafc' }}>
                        {q.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {q.tags.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                            {t}
                          </span>
                        ))}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {q.answersCount} answers {q.hasAcceptedAnswer && '✓ accepted'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: User Progress & Recommended Mentors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Your Progress Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Award size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.15rem' }}>Your Academic Progress</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reputation</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
                  {currentUser.reputation}
                </div>
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Projects</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                  {currentUser.stats?.projectsCount || 0}
                </div>
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Answers</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818cf8', fontFamily: 'var(--font-heading)' }}>
                  {currentUser.stats?.answersCount || 0}
                </div>
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accepted</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                  {currentUser.stats?.acceptedAnswersCount || 0} ✓
                </div>
              </div>
            </div>

            {/* Badges Earned */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', marginBottom: '10px' }}>
                Earned Badges
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentUser.badges?.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(99, 102, 241, 0.08)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{b.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{b.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActivePage('profile')}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', marginTop: '16px' }}
            >
              <span>View Full Evidence Portfolio</span>
            </button>
          </div>

          {/* Recommended Mentors */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#10b981" />
                <h3 style={{ fontSize: '1.15rem' }}>Recommended Mentors</h3>
              </div>
              <button
                onClick={() => setActivePage('mentors')}
                style={{ background: 'none', border: 'none', color: '#a5b4fc', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                All Mentors →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {recommendedMentors.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <img
                    src={m.avatar}
                    alt={m.name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>{m.name}</span>
                      <span className="badge badge-success" style={{ padding: '2px 6px', fontSize: '0.68rem' }}>
                        Verified 🎓
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      {m.department} · {m.institution.split('(')[0]}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {m.expertise.slice(0, 2).map((exp, idx) => (
                        <span key={idx} className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
