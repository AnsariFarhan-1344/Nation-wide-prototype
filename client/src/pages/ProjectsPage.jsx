import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Sparkles,
  ArrowRight,
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ProjectsPage({ setActivePage, setSelectedProjectId }) {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('all');
  const [stage, setStage] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'newest'
  const [loading, setLoading] = useState(true);

  const domains = ['all', 'AI/ML', 'Web Development', 'IoT', 'Cybersecurity', 'Core Engineering', 'Research'];
  const stages = ['all', 'Idea', 'Prototype', 'MVP', 'Deployment', 'Completed'];
  const statuses = ['all', 'Recruiting', 'In Progress', 'Completed'];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects({
        search,
        domain,
        stage,
        status,
        userId: currentUser?.id,
      });

      if (data.success) {
        let list = [...data.projects];
        if (sortBy === 'match') {
          list.sort((a, b) => b.matchScore - a.matchScore);
        } else {
          list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        setProjects(list);
      }
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, domain, stage, status, sortBy, currentUser]);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.1rem', marginBottom: '6px' }}>Project Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Discover nationwide cross-campus projects with verified skill matching.
          </p>
        </div>

        <button
          onClick={() => setActivePage('create_project')}
          className="btn btn-primary"
          id="create-project-btn"
        >
          <Plus size={16} />
          <span>Publish Project</span>
        </button>
      </div>

      {/* Filters & Search Controls */}
      <div
        className="card"
        style={{
          padding: '20px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '42px' }}
            placeholder="Search projects by title, technology, problem statement, or institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Dropdowns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
          }}
        >
          <div>
            <label className="form-label">Domain</label>
            <select
              className="form-select"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d === 'all' ? 'All Domains' : d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Project Stage</label>
            <select
              className="form-select"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Stages' : s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st === 'all' ? 'All Statuses' : st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Sort By</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="match">Smart Match % (Highest)</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading nationwide projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Briefcase size={42} style={{ margin: '0 auto 16px auto', color: 'var(--text-muted)' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No projects match your criteria</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Try adjusting your search terms or filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setDomain('all');
              setStage('all');
              setStatus('all');
            }}
            className="btn btn-secondary btn-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {projects.map((p) => (
            <div
              key={p.id}
              className="card card-clickable"
              onClick={() => {
                setSelectedProjectId(p.id);
                setActivePage('project_detail');
              }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {/* Header: Domain, Stage, Match % */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">{p.domain}</span>
                  <span className="badge badge-info">{p.stage}</span>
                  {p.status === 'Recruiting' && (
                    <span className="badge badge-success">Recruiting</span>
                  )}
                </div>

                <div className="badge badge-match">
                  <Sparkles size={13} />
                  <span>{p.matchScore}% Match</span>
                </div>
              </div>

              {/* Title & Owner */}
              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px', color: '#fff' }}>{p.title}</h3>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                {p.ownerInstitution} · Led by {p.ownerName}
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '16px', flex: 1 }}>
                {p.description}
              </p>

              {/* Tech Stack Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
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
                        fontSize: '0.74rem',
                      }}
                    >
                      {isMatched ? `✓ ${tech}` : tech}
                    </span>
                  );
                })}
              </div>

              {/* Footer: Open Roles & CTA */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#a5b4fc' }}>
                  <Users size={14} />
                  <span>{p.openRoles?.length || 2} Roles Open</span>
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProjectId(p.id);
                    setActivePage('project_detail');
                  }}
                >
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
