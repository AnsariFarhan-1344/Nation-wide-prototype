import express from 'express';
import {
  getUserNotifications,
  markNotificationRead,
} from '../data/db.js';

const router = express.Router();

// Get current user notifications
router.get('/user/:userId', (req, res) => {
  const list = getUserNotifications(req.params.userId);
  res.json({ success: true, count: list.length, notifications: list });
});

// Mark notification as read
router.patch('/:id/read', (req, res) => {
  const notif = markNotificationRead(req.params.id);
  if (!notif) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }
  res.json({ success: true, notification: notif });
});

export default router;
