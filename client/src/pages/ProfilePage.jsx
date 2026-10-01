import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  Github,
  Globe,
  Briefcase,
  HelpCircle,
  CheckCircle2,
  Edit3,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function ProfilePage({ setActivePage, setSelectedProjectId }) {
  const { currentUser, updateProfile, refreshUser, logout } = useAuth();
  const { showToast } = useNotification();

  const [repHistory, setRepHistory] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [skillsStr, setSkillsStr] = useState(currentUser?.skills?.join(', ') || '');
  const [github, setGithub] = useState(currentUser?.github || '');
  const [portfolio, setPortfolio] = useState(currentUser?.portfolio || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfileData() {
      if (!currentUser) return;
      try {
        setLoading(true);
        const [histRes, teamsRes] = await Promise.all([
          api.getReputationHistory(currentUser.id),
          api.getUserTeams(currentUser.id),
        ]);

        if (histRes.success) {
          setRepHistory(histRes.history);
        }
        if (teamsRes.success) {
          setUserTeams(teamsRes.teams);
        }
      } catch (err) {
        console.error('Failed to load profile details', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
    if (currentUser) {
      setBio(currentUser.bio || '');
      setSkillsStr(currentUser.skills?.join(', ') || '');
      setGithub(currentUser.github || '');
      setPortfolio(currentUser.portfolio || '');
    }
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const skillsArray = skillsStr.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await updateProfile({
        bio,
        skills: skillsArray,
        github,
        portfolio,
      });

      if (res?.success) {
        showToast('Profile updated successfully!', 'success');
        setShowEditModal(false);
        refreshUser();
      }
    } catch (err) {
      showToast('Failed to update profile', 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div>
      {/* Profile Header Card */}
      <div
        className="card"
        style={{
          padding: '32px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary)',
                boxShadow: 'var(--shadow-glow)',
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '2.1rem' }}>{currentUser.name}</h1>
                {currentUser.verified && (
                  <span className="badge badge-success" style={{ padding: '4px 10px', fontSize: '0.82rem' }}>
                    <ShieldCheck size={14} />
                    <span>{currentUser.role === 'faculty' ? 'Verified Faculty 🎓' : 'Verified Student ✓'}</span>
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.96rem', color: '#a5b4fc', fontWeight: 600, marginBottom: '4px' }}>
                {currentUser.department} · {currentUser.institution}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
                {currentUser.github && (
                  <a
                    href={currentUser.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.84rem', color: '#e2e8f0' }}
                  >
                    <Github size={15} />
                    <span>GitHub</span>
                  </a>
                )}
                {currentUser.portfolio && (
                  <a
                    href={currentUser.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.84rem', color: '#e2e8f0' }}
                  >
                    <Globe size={15} />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowEditModal(true)}
              className="btn btn-secondary btn-sm"
              id="edit-profile-btn"
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={async () => {
                await logout();
                showToast('Logged out successfully', 'info');
                if (setActivePage) setActivePage('auth');
              }}
              className="btn btn-outline btn-sm"
              id="profile-logout-btn"
              title="Log out"
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        {currentUser.bio && (
          <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.94rem' }}>
              {currentUser.bio}
            </p>
          </div>
        )}

        {/* Verified Skills */}
        <div style={{ marginTop: '18px' }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Verified Skills & Technologies
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {currentUser.skills?.map((s, idx) => (
              <span key={idx} className="badge badge-primary" style={{ padding: '4px 12px', fontSize: '0.82rem' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Evidence Portfolio Left + Badges & Reputation Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Evidence-Based Portfolio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Portfolio Metrics Box */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={18} color="#34d399" />
              <h2 style={{ fontSize: '1.25rem' }}>Evidence-Based Academic Portfolio</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Automatically compiled evidence of your cross-campus project collaborations and technical answers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
                  {currentUser.reputation}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Reputation</div>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                  {currentUser.stats?.projectsCount || userTeams.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Projects</div>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#818cf8', fontFamily: 'var(--font-heading)' }}>
                  {currentUser.stats?.answersCount || 0}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Answers</div>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                  {currentUser.stats?.acceptedAnswersCount || 0} ✓
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Accepted</div>
              </div>
            </div>
          </div>

          {/* Active Teams & Projects */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>Active Project Collaborations ({userTeams.length})</h3>
            {userTeams.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No active project memberships yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {userTeams.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{p.title}</h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {p.domain} · {p.stage} · {p.members?.length || 1} Collaborators
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProjectId(p.id);
                        setActivePage('team_workspace');
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      <span>Workspace</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Badges & Reputation Audit Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Badges */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Award size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.15rem' }}>Earned Badges</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentUser.badges?.map((b) => (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{b.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reputation Audit Log */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Reputation History</h3>
            {repHistory.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No reputation events recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {repHistory.map((e) => (
                  <div
                    key={e.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-input)',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div style={{ flex: 1, marginRight: '12px' }}>
                      <div style={{ color: '#f8fafc' }}>{e.description}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(e.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      style={{
                        color: e.points >= 0 ? '#34d399' : '#ef4444',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                      }}
                    >
                      {e.points >= 0 ? `+${e.points}` : e.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Edit Academic Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Bio / Academic Interests</label>
                  <textarea
                    className="form-textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Skills & Frameworks (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Portfolio URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
