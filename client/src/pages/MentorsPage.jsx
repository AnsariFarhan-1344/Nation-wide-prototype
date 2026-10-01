import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function MentorsPage({ setActivePage }) {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mentorship Request Modal State
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [message, setMessage] = useState('');
  const [expectedGuidance, setExpectedGuidance] = useState('Architecture review & research methodology');
  const [duration, setDuration] = useState('3 Months');
  const [submitting, setSubmitting] = useState(false);

  const domains = ['all', 'IoT & Hardware', 'AI/ML & Vision', 'Distributed Systems & Security'];

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const data = await api.getMentors({ search, domain });
      if (data.success) {
        setMentors(data.mentors);
      }
    } catch (err) {
      console.error('Failed to load mentors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [search, domain]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim() || !message.trim()) {
      showToast('Please provide your project title and a message.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.requestMentorship(selectedMentor.id, {
        studentId: currentUser?.id,
        projectTitle,
        message,
        expectedGuidance,
        duration,
      });

      if (res.success) {
        showToast(`Mentorship request sent to ${selectedMentor.name}!`, 'success');
        setSelectedMentor(null);
        setProjectTitle('');
        setMessage('');
      }
    } catch (err) {
      showToast('Failed to send request', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.1rem', marginBottom: '6px' }}>Find a Faculty Mentor</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Connect directly with verified professors and research guides from premier Indian institutions.
        </p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '20px', marginBottom: '28px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '42px' }}
            placeholder="Search by mentor name, expertise (e.g. Edge AI, OpenCV), or institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '200px' }}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        >
          {domains.map((d) => (
            <option key={d} value={d}>
              {d === 'all' ? 'All Specializations' : d}
            </option>
          ))}
        </select>
      </div>

      {/* Mentors Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading mentors...</div>
      ) : mentors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Users size={42} style={{ margin: '0 auto 16px auto', color: 'var(--text-muted)' }} />
          <h3>No mentors found matching criteria</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {mentors.map((m) => (
            <div key={m.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                <img
                  src={m.avatar}
                  alt={m.name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>{m.name}</h3>
                    <span className="badge badge-success">
                      <ShieldCheck size={13} />
                      <span>Verified Faculty 🎓</span>
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    {m.department} · {m.institution}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#fbbf24' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={14} fill="#fbbf24" />
                      <span>{m.rating} Rating</span>
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>·</span>
                    <span style={{ color: '#38bdf8' }}>{m.menteesGuided} Teams Guided</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                {m.bio}
              </p>

              {/* Expertise chips */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Areas of Expertise
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {m.expertise.map((exp, idx) => (
                    <span key={idx} className="badge badge-primary" style={{ fontSize: '0.74rem' }}>
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer: Availability & Request Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 600 }}>
                  ● {m.availability}
                </span>

                <button
                  onClick={() => setSelectedMentor(m)}
                  className="btn btn-primary btn-sm"
                  id={`request-mentor-${m.id}`}
                >
                  <GraduationCap size={15} />
                  <span>Request Mentorship</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mentorship Request Modal */}
      {selectedMentor && (
        <div className="modal-overlay" onClick={() => setSelectedMentor(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Request Mentorship</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  To: <strong>{selectedMentor.name}</strong> ({selectedMentor.institution})
                </div>
              </div>
              <button
                onClick={() => setSelectedMentor(null)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSendRequest}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Project Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Smart Attendance & Campus Flow Analytics"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Project Brief</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Introduce your team, describe your current prototype, and explain why you're seeking guidance from this faculty member..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Expected Guidance</label>
                    <input
                      type="text"
                      className="form-input"
                      value={expectedGuidance}
                      onChange={(e) => setExpectedGuidance(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-input"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={submitting}
                  id="submit-mentor-request-btn"
                >
                  <Send size={15} />
                  <span>{submitting ? 'Sending...' : 'Send Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
