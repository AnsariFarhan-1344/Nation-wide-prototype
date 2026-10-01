import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Calendar,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function ResearchPage({ setActivePage }) {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('all');
  const [loading, setLoading] = useState(true);

  // Application Modal State
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [pitch, setPitch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const domains = ['all', 'AI & Agriculture', 'IoT & Telecommunications', 'Cybersecurity & Cryptography'];

  const fetchResearch = async () => {
    try {
      setLoading(true);
      const data = await api.getResearchOpportunities({ search, domain });
      if (data.success) {
        setOpportunities(data.opportunities);
      }
    } catch (err) {
      console.error('Failed to load research opportunities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, [search, domain]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!pitch.trim()) {
      showToast('Please provide a statement of interest.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.applyToResearch(selectedOpp.id, {
        studentId: currentUser?.id,
        pitch,
      });

      if (res.success) {
        showToast('Application submitted to Principal Investigator!', 'success');
        setSelectedOpp(null);
        setPitch('');
      }
    } catch (err) {
      showToast('Failed to submit application', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.1rem', marginBottom: '6px' }}>Faculty Research Positions</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Collaborate with professors on peer-reviewed research grants, funded stipends, and publication co-authorships.
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
            placeholder="Search research by title, faculty, or required skills..."
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
              {d === 'all' ? 'All Research Domains' : d}
            </option>
          ))}
        </select>
      </div>

      {/* Research Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading research positions...</div>
      ) : opportunities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3>No research positions match your filter</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {opportunities.map((opp) => (
            <div key={opp.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge badge-primary">{opp.domain}</span>
                <span className="badge badge-warning" style={{ fontSize: '0.74rem' }}>
                  Deadline: {opp.deadline}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{opp.title}</h3>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={opp.facultyAvatar}
                  alt={opp.facultyName}
                  style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                />
                <span>Supervised by <strong>{opp.facultyName}</strong> ({opp.facultyInstitution})</span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                {opp.description}
              </p>

              {/* Meta details */}
              <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Positions:</strong> {opp.positions} Student Researchers</div>
                <div><strong>Duration:</strong> {opp.duration}</div>
                <div><strong>Stipend/Benefits:</strong> <span style={{ color: '#34d399' }}>{opp.stipend}</span></div>
              </div>

              {/* Required Skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                {opp.requiredSkills.map((s, idx) => (
                  <span key={idx} className="badge" style={{ background: 'var(--bg-tertiary)', fontSize: '0.74rem' }}>
                    {s}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedOpp(opp)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <span>Apply for Research Position</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      {selectedOpp && (
        <div className="modal-overlay" onClick={() => setSelectedOpp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Apply for Research Position</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {selectedOpp.title} · {selectedOpp.facultyName}
                </div>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleApply}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Statement of Interest & Relevant Coursework</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Highlight your relevant research experience, algorithms knowledge, and motivation to work under this lab..."
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    required
                  />
                </div>
                <div
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    color: '#a5b4fc',
                  }}
                >
                  📄 Your verified GPA and academic profile will be forwarded to the Principal Investigator.
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setSelectedOpp(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={submitting}
                >
                  <Send size={15} />
                  <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
