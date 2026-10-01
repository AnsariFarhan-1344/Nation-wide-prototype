import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Menu, Layers, Sun, Moon, Bell } from 'lucide-react';

import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CreateProjectPage from './pages/CreateProjectPage';
import TeamsPage from './pages/TeamsPage';
import TeamWorkspacePage from './pages/TeamWorkspacePage';
import QAPage from './pages/QAPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import MentorsPage from './pages/MentorsPage';
import ResearchPage from './pages/ResearchPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import InstitutionAdminPage from './pages/InstitutionAdminPage';
import AuthPages from './pages/AuthPages';

function MainApp() {
  const { currentUser } = useAuth();
  const { unreadCount } = useNotification();
  const { toggleTheme, isDark } = useTheme();

  const [activePage, setActivePage] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState('proj_ai_learning');
  const [selectedQuestionId, setSelectedQuestionId] = useState('q_jwt_auth');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile Top Header (<= 900px) */}
      <header className="mobile-header mobile-only">
        <button
          onClick={() => setMobileOpen(true)}
          className="mobile-hamburger-btn"
          aria-label="Open Navigation Menu"
          id="mobile-hamburger-btn"
        >
          <Menu size={20} />
        </button>

        <div
          className="mobile-header-brand"
          onClick={() => setActivePage('landing')}
          role="button"
          tabIndex={0}
        >
          <div className="brand-icon" style={{ width: '30px', height: '30px' }}>
            <Layers size={16} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.12rem' }}>
            Campus<span style={{ color: '#818cf8' }}>Link</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleTheme}
            className="mobile-theme-btn"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={() => setActivePage('notifications')}
            className="mobile-theme-btn"
            style={{ position: 'relative' }}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="sidebar-notification-badge" style={{ top: '-3px', right: '-3px' }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Left Vertical Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Page Area */}
      <div className={`main-wrapper ${isCollapsed ? 'sidebar-is-collapsed' : ''}`}>
        <main className="content-area">
          {activePage === 'landing' && (
            <LandingPage setActivePage={setActivePage} />
          )}

          {activePage === 'dashboard' && (
            <DashboardPage
              setActivePage={setActivePage}
              setSelectedProjectId={setSelectedProjectId}
              setSelectedQuestionId={setSelectedQuestionId}
            />
          )}

          {activePage === 'projects' && (
            <ProjectsPage
              setActivePage={setActivePage}
              setSelectedProjectId={setSelectedProjectId}
            />
          )}

          {activePage === 'project_detail' && (
            <ProjectDetailPage
              projectId={selectedProjectId}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'create_project' && (
            <CreateProjectPage
              setActivePage={setActivePage}
              setSelectedProjectId={setSelectedProjectId}
            />
          )}

          {activePage === 'teams' && (
            <TeamsPage
              setActivePage={setActivePage}
              setSelectedProjectId={setSelectedProjectId}
            />
          )}

          {activePage === 'team_workspace' && (
            <TeamWorkspacePage
              projectId={selectedProjectId}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'qa' && (
            <QAPage
              setActivePage={setActivePage}
              setSelectedQuestionId={setSelectedQuestionId}
            />
          )}

          {activePage === 'question_detail' && (
            <QuestionDetailPage
              questionId={selectedQuestionId}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'mentors' && (
            <MentorsPage setActivePage={setActivePage} />
          )}

          {activePage === 'research' && (
            <ResearchPage setActivePage={setActivePage} />
          )}

          {activePage === 'opportunities' && (
            <OpportunitiesPage />
          )}

          {activePage === 'leaderboard' && (
            <LeaderboardPage />
          )}

          {activePage === 'profile' && (
            <ProfilePage
              setActivePage={setActivePage}
              setSelectedProjectId={setSelectedProjectId}
            />
          )}

          {activePage === 'notifications' && (
            <NotificationsPage
              setActivePage={setActivePage}
              setSelectedProjectId={setSelectedProjectId}
              setSelectedQuestionId={setSelectedQuestionId}
            />
          )}

          {activePage === 'admin' && (
            <InstitutionAdminPage />
          )}

          {activePage === 'auth' && (
            <DashboardPage
              setActivePage={setActivePage}
              setSelectedProjectId={setSelectedProjectId}
              setSelectedQuestionId={setSelectedQuestionId}
            />
          )}
        </main>

        {/* Global Footer */}
        <Footer setActivePage={setActivePage} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppWithNotifications />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppWithNotifications() {
  const { currentUser, loading } = useAuth();

  return (
    <NotificationProvider currentUserId={currentUser?.id}>
      {loading ? (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary, #0b0f19)',
            color: '#f8fafc',
            fontFamily: 'var(--font-sans, sans-serif)',
          }}
        >
          <div
            className="brand-icon"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--primary, #6366f1)',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
              marginBottom: '16px',
            }}
          >
            <Layers size={28} color="#ffffff" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Campus<span style={{ color: '#818cf8' }}>Link</span>
          </div>
          <div
            style={{
              fontSize: '0.86rem',
              color: 'var(--text-secondary, #94a3b8)',
              marginTop: '8px',
            }}
          >
            Checking authentication session...
          </div>
        </div>
      ) : !currentUser ? (
        <div
          style={{
            minHeight: '100vh',
            background: 'var(--bg-primary, #0b0f19)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '24px 16px',
          }}
        >
          <AuthPages />
        </div>
      ) : (
        <MainApp />
      )}
    </NotificationProvider>
  );
}
