import React, { useState, useEffect } from 'react';
import {
  Award,
  Trophy,
  Filter,
  ShieldCheck,
  Flame,
  Search,
} from 'lucide-react';
import { api } from '../services/api';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [institution, setInstitution] = useState('all');
  const [domain, setDomain] = useState('all');
  const [loading, setLoading] = useState(true);

  const institutionsList = [
    'all',
    'IIT Bombay',
    'IIT Delhi',
    'BITS Pilani',
    'NIT Trichy',
    'Anna University',
    'VJTI Mumbai',
  ];

  const domainsList = [
    'all',
    'Computer Engineering',
    'Computer Science & AI',
    'IoT & Embedded Systems',
    'Information Technology',
  ];

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await api.getLeaderboard({
        institution,
        domain,
      });
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [institution, domain]);

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.1rem', marginBottom: '6px' }}>All-India Academic Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Recognizing nationwide students and faculty for peer answers, cross-campus projects, and academic mentorship.
        </p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '20px', marginBottom: '28px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="form-label">Filter by Institution</label>
          <select
            className="form-select"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          >
            {institutionsList.map((inst) => (
              <option key={inst} value={inst}>
                {inst === 'all' ? 'All India (All Institutions)' : inst}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="form-label">Filter by Academic Domain</label>
          <select
            className="form-select"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            {domainsList.map((d) => (
              <option key={d} value={d}>
                {d === 'all' ? 'All Domains' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading leaderboard...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ background: '#0f1524', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px 20px', width: '80px' }}>Rank</th>
                  <th style={{ padding: '16px 20px' }}>Scholar / Contributor</th>
                  <th style={{ padding: '16px 20px' }}>Institution & Dept</th>
                  <th style={{ padding: '16px 20px' }}>Badges</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Reputation</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, idx) => {
                  const isTop3 = idx < 3;
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                        transition: 'background 0.15s',
                      }}
                    >
                      {/* Rank */}
                      <td style={{ padding: '16px 20px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {idx === 0 && <span style={{ fontSize: '1.2rem' }}>🥇</span>}
                          {idx === 1 && <span style={{ fontSize: '1.2rem' }}>🥈</span>}
                          {idx === 2 && <span style={{ fontSize: '1.2rem' }}>🥉</span>}
                          <span style={{ color: isTop3 ? '#fbbf24' : 'var(--text-muted)', fontSize: isTop3 ? '1.1rem' : '0.92rem' }}>
                            #{item.rank}
                          </span>
                        </div>
                      </td>

                      {/* User */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={item.avatar}
                            alt={item.name}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: 700, color: '#f8fafc' }}>{item.name}</span>
                              {item.verified && (
                                <span className="badge badge-success" style={{ padding: '1px 6px', fontSize: '0.68rem' }}>
                                  {item.role === 'faculty' ? 'Faculty 🎓' : '✓'}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                              {item.role === 'faculty' ? 'Faculty Mentor' : 'Student Innovator'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Institution */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ color: '#e2e8f0' }}>{item.institution.split('(')[0]}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{item.department}</div>
                      </td>

                      {/* Badges */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {item.badges?.slice(0, 3).map((b) => (
                            <span key={b.id} title={`${b.name}: ${b.description}`} style={{ fontSize: '1.1rem' }}>
                              {b.icon}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Reputation */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
                          {item.reputation.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>pts</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
