import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Briefcase,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock,
  BarChart3,
  TrendingUp,
  Check,
  X,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function InstitutionAdminPage() {
  const { showToast } = useNotification();
  const [stats, setStats] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, queueRes] = await Promise.all([
        api.getAdminStats(),
        api.getModerationQueue(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (queueRes.success) setQueue(queueRes.queue);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleResolveReport = async (reportId, action) => {
    try {
      const res = await api.resolveModeration(reportId, action);
      if (res.success) {
        showToast(`Report ${action === 'dismiss' ? 'dismissed' : 'action enforced'}`, 'success');
        fetchAdminData();
      }
    } catch (err) {
      showToast('Failed to resolve report', 'danger');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading administrator dashboard...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Building2 size={24} color="#818cf8" />
          <h1 style={{ fontSize: '2.1rem' }}>Institution & Moderation Dashboard</h1>
          <span className="badge badge-primary">Administrator View</span>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Aggregate cross-institutional collaboration metrics & community safety queue.
        </p>
      </div>

      {/* Privacy Notice Banner */}
      <div
        style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.86rem',
          color: '#7dd3fc',
        }}
      >
        <Lock size={18} style={{ flexShrink: 0 }} />
        <span>
          <strong>Student Privacy Guarantee:</strong> In accordance with national academic collaboration guidelines, this dashboard displays aggregate university metrics only. Individual student grades or confidential inquiries remain strictly private.
        </span>
      </div>

      {/* Aggregate Statistics Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Connected Students</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', fontFamily: 'var(--font-heading)' }}>
              {stats.totalStudents.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#34d399', marginTop: '4px' }}>Across 140+ Institutions</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verified Faculty</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-heading)' }}>
              {stats.totalFaculty.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>Active Mentors</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Projects</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
              {stats.activeProjects}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#fbbf24', marginTop: '4px' }}>{stats.completedProjects} Completed</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Questions Answered</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
              {stats.questionsAnswered.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#34d399', marginTop: '4px' }}>92% Resolution Rate</div>
          </div>
        </div>
      )}

      {/* Grid: Top Domains & Top Institutions */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '36px' }}>
          {/* Top Domains */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Top Collaboration Domains</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {stats.topDomains?.map((dom, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{dom.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{dom.count} Projects ({dom.percentage}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${dom.percentage}%`,
                        height: '100%',
                        background: 'var(--secondary-gradient)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Institutions */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Most Active Campuses</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.topInstitutions?.map((inst, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    fontSize: '0.86rem',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{inst.name}</span>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>{inst.students} Students</span>
                    <span>·</span>
                    <span style={{ color: '#818cf8' }}>{inst.projects} Projects</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Moderation Safety Queue */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ShieldAlert size={20} color="#f59e0b" />
          <h3 style={{ fontSize: '1.25rem' }}>Community Moderation Queue ({queue.length})</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Reported community content under review. Platform policies require human oversight on final enforcement.
        </p>

        {queue.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No pending moderation reports.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {queue.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-danger">{item.reason}</span>
                    <span className="badge badge-secondary">{item.contentType}</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Reported on {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#f8fafc' }}>
                    "{item.title}"
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {item.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleResolveReport(item.id, 'take_action')}
                        className="btn btn-danger btn-sm"
                      >
                        <X size={14} />
                        <span>Remove Content</span>
                      </button>
                      <button
                        onClick={() => handleResolveReport(item.id, 'dismiss')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Check size={14} />
                        <span>Dismiss Report</span>
                      </button>
                    </>
                  ) : (
                    <span className="badge badge-info">{item.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
