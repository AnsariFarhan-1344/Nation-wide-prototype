import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const NotificationContext = createContext();

export function NotificationProvider({ children, currentUserId }) {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchNotifications = async () => {
    if (!currentUserId) return;
    try {
      const data = await api.getNotifications(currentUserId);
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const markAsRead = async (notifId) => {
    try {
      await api.markNotificationRead(notifId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUserId]);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        notifications,
        unreadCount,
        markAsRead,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
      {/* Toast Render */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast-item"
            style={{
              borderColor:
                toast.type === 'success'
                  ? 'var(--success)'
                  : toast.type === 'danger'
                  ? 'var(--danger)'
                  : toast.type === 'warning'
                  ? 'var(--warning)'
                  : 'var(--primary)',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>
              {toast.type === 'success' && '✅'}
              {toast.type === 'danger' && '❌'}
              {toast.type === 'warning' && '⚠️'}
              {toast.type === 'info' && '💡'}
            </span>
            <div style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1.1rem',
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      toasts: [],
      showToast: (msg, type) => console.log(`[Toast ${type || 'info'}]:`, msg),
      removeToast: () => {},
      notifications: [],
      unreadCount: 0,
      markAsRead: () => {},
      refreshNotifications: () => {},
    };
  }
  return context;
};
