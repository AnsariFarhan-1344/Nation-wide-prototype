import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Briefcase,
  ExternalLink,
  Github,
  Check,
  X,
  Share2,
  Bookmark,
  Calendar,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function ProjectDetailPage({ projectId, setActivePage }) {
  const { currentUser, refreshUser } = useAuth();
  const { showToast, refreshNotifications } = useNotification();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Application Form State
  const [pitch, setPitch] = useState('');
  const [githubUrl, setGithubUrl] = useState(currentUser?.github || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser?.portfolio || '');
  const [submittingApp, setSubmittingApp] = useState(false);

  // Owner Applications Management State
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getProjectById(projectId, currentUser?.id);
      if (data.success) {
        setProject(data.project);
        if (data.project.openRoles?.length > 0) {
          setSelectedRole(data.project.openRoles[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load project detail', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!project) return;
    try {
      setLoadingApps(true);
      const data = await api.getProjectApplications(project.id);
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId, currentUser]);

  useEffect(() => {
    if (project && project.ownerId === currentUser?.id) {
      fetchApplications();
    }
  }, [project, currentUser]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!pitch.trim()) {
      showToast('Please provide a pitch on why you should be selected.', 'warning');
      return;
    }

    try {
      setSubmittingApp(true);
      const res = await api.applyToProject(project.id, {
        applicantId: currentUser?.id,
        roleId: selectedRole?.id,
        roleTitle: selectedRole?.title || 'Collaborator',
        pitch,
        github: githubUrl,
        portfolio: portfolioUrl,
      });

      if (res.success) {
        showToast('Application sent to project owner!', 'success');
        setShowApplyModal(false);
        setPitch('');
        fetchProjectDetails();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit application', 'danger');
    } finally {
      setSubmittingApp(false);
    }
  };

  const handleReviewApplication = async (appId, status) => {
    try {
      const res = await api.updateApplicationStatus(appId, status, currentUser?.id);
      if (res.success) {
        showToast(
          status === 'accepted'
            ? '🎉 Applicant accepted and added to the project team!'
            : 'Application marked as rejected.',
          status === 'accepted' ? 'success' : 'info'
        );
        fetchApplications();
        fetchProjectDetails();
        refreshUser();
        refreshNotifications();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update application', 'danger');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3>Project not found</h3>
        <button onClick={() => setActivePage('projects')} className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
          Back to Projects
        </button>
      </div>
    );
  }

  const isOwner = project.ownerId === currentUser?.id;
  const isMember = project.members?.some((m) => m.userId === currentUser?.id);

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => setActivePage('projects')}
        className="btn-outline btn-sm"
        style={{ marginBottom: '20px', gap: '6px' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Projects</span>
      </button>

      {/* Main Project Header */}
      <div
        className="card"
        style={{
          padding: '32px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span className="badge badge-primary">{project.domain}</span>
              <span className="badge badge-info">{project.stage}</span>
              <span className="badge badge-success">{project.status}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} />
                <span>{project.duration}</span>
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>{project.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              <img
                src={project.ownerAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner'}
                alt={project.ownerName}
                style={{ width: '28px', height: '28px', borderRadius: '50%' }}
              />
              <span>Led by <strong>{project.ownerName}</strong> ({project.ownerInstitution})</span>
              <span className="badge badge-success" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                <ShieldCheck size={12} />
                <span>Verified</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => showToast('Project link copied to clipboard!', 'info')}
              className="btn btn-secondary btn-sm"
              title="Share"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
            <button
              onClick={() => showToast('Project saved to your bookmarks!', 'info')}
              className="btn btn-secondary btn-sm"
              title="Save"
            >
              <Bookmark size={16} />
              <span>Save</span>
            </button>

            {isMember ? (
              <button
                onClick={() => setActivePage('teams')}
                className="btn btn-success"
                id="enter-workspace-btn"
              >
                <Layers size={16} />
                <span>Enter Team Workspace</span>
              </button>
            ) : (
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn btn-primary"
                id="apply-to-project-btn"
              >
                <span>Apply to Project</span>
                <Sparkles size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Why You're a Match Highlight Box (USP Feature) */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="#34d399" />
              <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Why you're a match</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.86rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>Matched skills:</span>
                {project.matchedSkills?.length > 0 ? (
                  project.matchedSkills.map((s, i) => (
                    <span key={i} className="badge badge-success" style={{ marginRight: '4px', fontSize: '0.76rem' }}>
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>None matched yet</span>
                )}
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>Missing skills:</span>
                {project.missingSkills?.length > 0 ? (
                  project.missingSkills.map((s, i) => (
                    <span key={i} className="badge badge-warning" style={{ marginRight: '4px', fontSize: '0.76rem' }}>
                      ○ {s}
                    </span>
                  ))
                ) : (
                  <span className="badge badge-success">All skills covered!</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
              {project.matchScore}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Skill Match Score
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Details Left + Sidebar Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Problem, Goals, Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Problem Statement & Description */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Problem Statement</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              {project.problemStatement}
            </p>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Project Goals</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {project.goals?.map((goal, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Required */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>Technologies & Dependencies</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.techStack?.map((t, idx) => (
                <span
                  key={idx}
                  className="badge"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '6px 14px',
                    fontSize: '0.84rem',
                    color: '#e2e8f0',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Owner View: Review Received Applications */}
          {isOwner && (
            <div className="card" style={{ borderColor: 'rgba(99, 102, 241, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#a5b4fc' }}>
                  Project Applications ({applications.length})
                </h3>
                <span className="badge badge-primary">Owner Review</span>
              </div>

              {loadingApps ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading applications...</div>
              ) : applications.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No applications received yet. Your project is currently visible to students across India.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      style={{
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={app.applicantAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=app'}
                            alt={app.applicantName}
                            style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{app.applicantName}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {app.applicantInstitution} · Applying for <strong>{app.roleTitle}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="badge badge-match" style={{ fontSize: '0.8rem' }}>
                          {app.matchScore}% Match
                        </div>
                      </div>

                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                        "{app.pitch}"
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          {app.github && (
                            <a
                              href={app.github}
                              target="_blank"
                              rel="noreferrer"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#a5b4fc' }}
                            >
                              <Github size={13} />
                              <span>GitHub</span>
                            </a>
                          )}
                          {app.portfolio && (
                            <a
                              href={app.portfolio}
                              target="_blank"
                              rel="noreferrer"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#a5b4fc' }}
                            >
                              <ExternalLink size={13} />
                              <span>Portfolio</span>
                            </a>
                          )}
                        </div>

                        {app.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleReviewApplication(app.id, 'accepted')}
                              className="btn btn-success btn-sm"
                              id={`accept-app-${app.id}`}
                            >
                              <Check size={14} />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleReviewApplication(app.id, 'rejected')}
                              className="btn btn-secondary btn-sm"
                            >
                              <X size={14} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`badge ${app.status === 'accepted' ? 'badge-success' : 'badge-danger'}`}
                          >
                            {app.status === 'accepted' ? 'Accepted ✓' : 'Rejected'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Roles & Team & Mentor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Open Roles */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>Open Positions ({project.openRoles?.length || 0})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {project.openRoles?.map((role) => (
                <div
                  key={role.id}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '0.98rem' }}>{role.title}</h4>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                      {role.openings} opening{role.openings > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    {role.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                    {role.skills?.map((s, idx) => (
                      <span key={idx} className="badge" style={{ background: 'var(--bg-tertiary)', fontSize: '0.7rem' }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {!isMember && (
                    <button
                      onClick={() => {
                        setSelectedRole(role);
                        setShowApplyModal(true);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%' }}
                    >
                      Apply for this role
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>Team Members ({project.members?.length || 0})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {project.members?.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                  }}
                >
                  <img
                    src={m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=member'}
                    alt={m.name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {m.roleTitle} · {m.institution}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Mentor Card */}
          {project.facultyMentorName && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <GraduationCap size={18} color="#10b981" />
                <h3 style={{ fontSize: '1.15rem' }}>Faculty Advisor</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34d399',
                  }}
                >
                  <GraduationCap size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{project.facultyMentorName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {project.facultyMentorInstitution}
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.68rem', marginTop: '4px' }}>
                    Verified Faculty 🎓
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply to Project Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Apply to {project.title}</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Applying for: <strong>{selectedRole?.title || 'Collaborator'}</strong>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleApply}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">
                    <span>Why should the team select you?</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Required</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe your relevant technical experience, what you would build, and your passion for the project..."
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub Profile URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://github.com/yourusername"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Portfolio / Demo Link</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://yourportfolio.dev"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    fontSize: '0.82rem',
                    color: '#a5b4fc',
                  }}
                >
                  ⚡ Your verified skills ({currentUser?.skills?.join(', ') || 'React, DSA'}) will be attached with your <strong>{project.matchScore}% Match Score</strong>.
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={submittingApp}
                  id="submit-application-btn"
                >
                  {submittingApp ? 'Submitting...' : 'Send Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
