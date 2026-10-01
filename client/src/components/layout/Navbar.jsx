import React, { useState } from 'react';
import {
  Compass,
  Briefcase,
  HelpCircle,
  Users,
  Award,
  Bell,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Building2,
  LayoutDashboard,
  Layers,
  Menu,
  X,
  User,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function Navbar({ activePage, setActivePage }) {
  const { currentUser, personas, switchPersona, logout } = useAuth();
  const { unreadCount } = useNotification();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Compass, public: true },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'teams', label: 'My Teams', icon: Layers },
    { id: 'qa', label: 'Q&A', icon: HelpCircle },
    { id: 'mentors', label: 'Mentors', icon: Users },
    { id: 'research', label: 'Research', icon: Sparkles },
    { id: 'opportunities', label: 'Opportunities', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award },
    ...(currentUser?.role === 'faculty' || currentUser?.id === 'user_admin'
      ? [{ id: 'admin', label: 'Institution Admin', icon: Building2 }]
      : []),
  ];

  return (
    <header className="navbar">
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setActivePage('landing')}
          className="navbar-brand"
          style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <div className="brand-icon">
            <Layers size={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>Campus<span style={{ color: '#818cf8' }}>Link</span></span>
            <span className="brand-pill">Pan-India</span>
          </div>
        </button>
      </div>

      {/* Main Nav Links (Desktop) */}
      <nav className="navbar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setMobileMenuOpen(false);
              }}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Actions & Persona Switcher */}
      <div className="navbar-actions">
        {/* Notifications Icon */}
        <button
          onClick={() => setActivePage('notifications')}
          className="btn-outline btn-sm"
          style={{ position: 'relative', padding: '8px', borderRadius: '50%' }}
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: '700',
                minWidth: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Persona Switcher Dropdown */}
        {currentUser && (
          <div style={{ position: 'relative' }}>
            <div
              className="persona-switcher"
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              title="Click to switch demo persona"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="persona-avatar" />
              <div className="persona-info">
                <span className="persona-name">{currentUser.name}</span>
                <span className="persona-role">
                  {currentUser.role === 'faculty' ? '🎓 Verified Faculty' : '✓ Student'}
                </span>
              </div>
              <ChevronDown size={14} color="#94a3b8" />
            </div>

            {/* Dropdown Menu */}
            {showPersonaMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: '280px',
                  background: '#131b2e',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '8px',
                  zIndex: 250,
                }}
              >
                <div
                  style={{
                    padding: '8px 10px',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    color: '#a5b4fc',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  ⚡ Switch Demo Persona (Hackathon Story)
                </div>

                {personas.map((p) => {
                  const isCurrent = p.id === currentUser.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        switchPersona(p.id);
                        setShowPersonaMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        background: isCurrent ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                        border: isCurrent ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                        transition: 'background 0.15s',
                        marginBottom: '4px',
                      }}
                    >
                      <img
                        src={p.avatar}
                        alt={p.name}
                        style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#fff' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          {p.role === 'faculty' ? '🎓 Faculty' : 'Student'} · {p.institution.split('(')[0]}
                        </div>
                      </div>
                      {isCurrent && <CheckCircle2 size={16} color="#34d399" />}
                    </div>
                  );
                })}

                <div
                  style={{
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <button
                    onClick={() => {
                      setActivePage('profile');
                      setShowPersonaMenu(false);
                    }}
                    className="btn-outline btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', gap: '8px' }}
                  >
                    <User size={14} />
                    <span>View Evidence Portfolio</span>
                  </button>
                  <button
                    onClick={async () => {
                      setShowPersonaMenu(false);
                      await logout();
                      setActivePage('auth');
                    }}
                    className="btn-outline btn-sm"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: '8px',
                      color: '#f87171',
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                    }}
                    id="navbar-logout-btn"
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setActivePage('auth')}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
            id="navbar-signin-btn"
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
        )}

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn-secondary btn-sm"
          style={{ display: 'none', padding: '8px' }}
          id="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '68px',
            left: 0,
            right: 0,
            background: '#0b0f19',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 150,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`nav-link ${activePage === item.id ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
