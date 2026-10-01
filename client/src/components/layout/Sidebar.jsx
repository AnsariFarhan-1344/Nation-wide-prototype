import React from 'react';
import {
  Home,
  LayoutDashboard,
  Rocket,
  Users,
  MessageSquare,
  GraduationCap,
  FlaskConical,
  Briefcase,
  Trophy,
  Building2,
  Sun,
  Moon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  ShieldCheck,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Sidebar({
  activePage,
  setActivePage,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const { currentUser, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  const mainNavItems = [
    { id: 'landing', label: 'Home', icon: Home, badge: null },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'projects', label: 'Projects', icon: Rocket, badge: null },
    { id: 'teams', label: 'My Teams', icon: Users, badge: null },
    { id: 'qa', label: 'Q&A', icon: MessageSquare, badge: null },
    { id: 'mentors', label: 'Mentors', icon: GraduationCap, badge: null },
    { id: 'research', label: 'Research', icon: FlaskConical, badge: null },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase, badge: null },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: null },
    ...(currentUser?.role === 'faculty' || currentUser?.id === 'user_admin'
      ? [{ id: 'admin', label: 'Institution Admin', icon: Building2, badge: 'Faculty' }]
      : []),
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    if (mobileOpen && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Vertical Left Sidebar */}
      <aside
        className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} ${
          mobileOpen ? 'sidebar-mobile-open' : ''
        }`}
        id="app-vertical-sidebar"
        aria-label="Sidebar navigation"
      >
        {/* BRAND */}
        <div className="sidebar-header">
          <div
            className="sidebar-brand-wrapper"
            onClick={() => handleNavClick('landing')}
            title="CampusLink Home"
            role="button"
            tabIndex={0}
          >
            <div className="brand-icon">
              <Layers size={18} />
            </div>
            {!isCollapsed && (
              <div className="sidebar-brand-text">
                <div className="sidebar-brand-title">
                  Campus<span className="brand-accent">Link</span>
                </div>
                <div className="brand-pill">PAN-INDIA</div>
              </div>
            )}
          </div>

          {/* Desktop Collapse/Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="sidebar-collapse-btn desktop-only"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* PLATFORM Navigation */}
        <nav className="sidebar-nav-container">
          <div className="sidebar-nav-group">
            {!isCollapsed && <div className="sidebar-nav-heading">PLATFORM</div>}
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                  id={`nav-item-${item.id}`}
                >
                  <div className="sidebar-nav-icon">
                    <Icon size={18} />
                  </div>
                  {!isCollapsed && (
                    <span className="sidebar-nav-label">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="sidebar-item-badge">{item.badge}</span>
                  )}
                  {isCollapsed && (
                    <div className="sidebar-tooltip">{item.label}</div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM SECTION: Appearance, Settings, Divider, Profile */}
        <div className="sidebar-footer">
          {/* ☀️ / 🌙 Appearance Toggle */}
          <div className="sidebar-appearance-row" title={`Theme: ${isDark ? 'Dark Mode' : 'Light Mode'}`}>
            {!isCollapsed ? (
              <div className="theme-toggle-compact-bar">
                <span className="theme-compact-label">
                  {isDark ? <Moon size={15} /> : <Sun size={15} />}
                  <span>Appearance</span>
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="theme-saas-pill-btn"
                  title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
                  aria-label="Toggle theme"
                >
                  <span className={`pill-opt ${!isDark ? 'active' : ''}`}>
                    <Sun size={12} />
                    <span>Light</span>
                  </span>
                  <span className={`pill-opt ${isDark ? 'active' : ''}`}>
                    <Moon size={12} />
                    <span>Dark</span>
                  </span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={toggleTheme}
                className="theme-toggle-compact"
                title={`Theme: ${isDark ? 'Dark Mode (click for Light)' : 'Light Mode (click for Dark)'}`}
                aria-label="Toggle theme"
              >
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
                <div className="sidebar-tooltip">
                  {isDark ? 'Switch to Light' : 'Switch to Dark'}
                </div>
              </button>
            )}
          </div>

          {/* ⚙ Settings */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`sidebar-nav-item sidebar-footer-nav ${activePage === 'settings' ? 'active' : ''}`}
            id="nav-item-settings"
            title={isCollapsed ? 'Settings' : undefined}
          >
            <div className="sidebar-nav-icon">
              <Settings size={18} />
            </div>
            {!isCollapsed && <span className="sidebar-nav-label">Settings</span>}
            {isCollapsed && <div className="sidebar-tooltip">Settings</div>}
          </button>

          {/* Divider */}
          <div className="sidebar-divider" />

          {/* 👤 Profile: Circular Avatar + User Name + Role + Logout */}
          {currentUser ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
              }}
            >
              <div
                className={`sidebar-profile-card ${activePage === 'profile' ? 'active' : ''}`}
                onClick={() => handleNavClick('profile')}
                role="button"
                tabIndex={0}
                id="nav-item-profile"
                style={{ flex: 1 }}
                title={isCollapsed ? `${currentUser.name} (${currentUser.role === 'faculty' ? 'Faculty' : 'Student'})` : undefined}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="sidebar-profile-avatar"
                />
                {!isCollapsed && (
                  <div className="sidebar-profile-text">
                    <span className="sidebar-profile-name">{currentUser.name}</span>
                    <span className="sidebar-profile-role">
                      {currentUser.role === 'faculty' ? 'Faculty' : 'Student'}
                    </span>
                  </div>
                )}
                {isCollapsed && (
                  <div className="sidebar-tooltip">
                    {currentUser.name} ({currentUser.role === 'faculty' ? 'Faculty' : 'Student'})
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await logout();
                    setActivePage('auth');
                  }}
                  title="Log Out"
                  aria-label="Log Out"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.15s',
                  }}
                  id="sidebar-logout-btn"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('auth')}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
              id="sidebar-signin-btn"
            >
              <LogIn size={15} />
              {!isCollapsed && <span>Sign In</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
