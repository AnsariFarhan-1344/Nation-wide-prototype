import React from 'react';
import {
  Bell,
  CheckCircle2,
  ExternalLink,
  Check,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function NotificationsPage({ setActivePage, setSelectedProjectId, setSelectedQuestionId }) {
  const { notifications, markAsRead } = useNotification();

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    if (notif.link?.includes('/teams/')) {
      const projId = notif.link.split('/teams/')[1];
      setSelectedProjectId(projId);
      setActivePage('team_workspace');
    } else if (notif.link?.includes('/projects/')) {
      const projId = notif.link.split('/projects/')[1];
      setSelectedProjectId(projId);
      setActivePage('project_detail');
    } else if (notif.link?.includes('/qa/')) {
      const qId = notif.link.split('/qa/')[1];
      setSelectedQuestionId(qId);
      setActivePage('question_detail');
    } else if (notif.link?.includes('/profile')) {
      setActivePage('profile');
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.1rem', marginBottom: '6px' }}>Notifications Center</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time updates on your project applications, team task assignments, and accepted answers.
        </p>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={42} style={{ margin: '0 auto 16px auto', color: 'var(--text-muted)' }} />
            <h3>No notifications yet</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '18px 24px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: notif.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.06)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ flex: 1, marginRight: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '1rem', color: notif.isRead ? 'var(--text-primary)' : '#fff', fontWeight: notif.isRead ? 600 : 700 }}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    {new Date(notif.timestamp).toLocaleString()}
                  </div>
                </div>

                {!notif.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notif.id);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                    title="Mark as read"
                  >
                    <Check size={14} />
                    <span>Mark Read</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
