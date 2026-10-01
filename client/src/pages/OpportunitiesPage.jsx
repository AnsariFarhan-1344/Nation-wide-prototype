import React, { useState, useEffect } from 'react';
import {
  Award,
  ExternalLink,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'Hackathon', label: '🔥 Hackathons' },
    { id: 'Fellowship', label: '🚀 Fellowships' },
    { id: 'Internship', label: '💼 Internships' },
    { id: 'Scholarship', label: '🎓 Scholarships' },
    { id: 'Workshop', label: '📚 Workshops' },
  ];

  useEffect(() => {
    async function loadOpportunities() {
      try {
        setLoading(true);
        const data = await api.getOpportunities(selectedType);
        if (data.success) {
          setOpportunities(data.opportunities);
        }
      } catch (err) {
        console.error('Failed to load opportunities', err);
      } finally {
        setLoading(false);
      }
    }
    loadOpportunities();
  }, [selectedType]);

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.1rem', marginBottom: '6px' }}>Academic Opportunities Board</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Curated nationwide hackathons, open-source fellowships, summer research internships, and government STEM grants.
        </p>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedType(c.id)}
            className="badge"
            style={{
              cursor: 'pointer',
              background: selectedType === c.id ? 'var(--primary)' : 'var(--bg-card)',
              color: selectedType === c.id ? '#fff' : 'var(--text-secondary)',
              border: selectedType === c.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              padding: '8px 16px',
              fontSize: '0.84rem',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading opportunities...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {opportunities.map((opp) => (
            <div key={opp.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="badge badge-primary">
                  <span>{opp.icon}</span>
                  <span>{opp.type}</span>
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.74rem' }}>
                  {opp.tag}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{opp.title}</h3>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Organized by <strong>{opp.organization}</strong>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                {opp.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#fbbf24' }}>
                  <Calendar size={14} />
                  <span>Deadline: {opp.deadline}</span>
                </div>

                <a
                  href={opp.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px' }}
                >
                  <span>Apply / Info</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
