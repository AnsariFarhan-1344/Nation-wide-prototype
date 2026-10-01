import React, { useState, useEffect } from 'react';
import {
  Layers,
  ArrowRight,
  Users,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function TeamsPage({ setActivePage, setSelectedProjectId }) {
  const { currentUser } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserTeams() {
      if (!currentUser) return;
      try {
        setLoading(true);
        const data = await api.getUserTeams(currentUser.id);
        if (data.success) {
          setTeams(data.teams);
        }
      } catch (err) {
        console.error('Failed to load user teams', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserTeams();
  }, [currentUser]);

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.1rem', marginBottom: '6px' }}>My Project Teams</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Active collaborative workspaces with cross-campus teammates, Kanban task boards, and team chat.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading your teams...
        </div>
      ) : teams.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Layers size={42} style={{ margin: '0 auto 16px auto', color: 'var(--text-muted)' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>You are not in any project teams yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Apply to open projects in the Project Hub or publish your own project to form a team.
          </p>
          <button onClick={() => setActivePage('projects')} className="btn btn-primary btn-sm">
            Explore Open Projects
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {teams.map((proj) => {
            const myMembership = proj.members?.find((m) => m.userId === currentUser?.id);
            return (
              <div key={proj.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-primary">{proj.domain}</span>
                  <span className="badge badge-success">{proj.status}</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{proj.title}</h3>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Your Role: <strong style={{ color: '#a5b4fc' }}>{myMembership?.roleTitle || 'Team Member'}</strong>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px', flex: 1 }}>
                  {proj.description}
                </p>

                {/* Team members preview */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Collaborators ({proj.members?.length || 0})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {proj.members?.map((m, idx) => (
                      <img
                        key={idx}
                        src={m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar'}
                        alt={m.name}
                        title={`${m.name} (${m.institution})`}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--border-subtle)' }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setActivePage('team_workspace');
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={16} />
                    <span>Enter Team Workspace</span>
                  </div>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
