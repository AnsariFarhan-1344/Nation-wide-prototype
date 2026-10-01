import express from 'express';
import {
  getAggregateStats,
  getModerationQueue,
  resolveModerationReport,
} from '../data/db.js';

const router = express.Router();

// Aggregate Institution Dashboard statistics
router.get('/stats', (req, res) => {
  const stats = getAggregateStats();
  res.json({ success: true, stats });
});

// Moderation queue
router.get('/moderation', (req, res) => {
  const queue = getModerationQueue();
  res.json({ success: true, queue });
});

// Resolve moderation item
router.post('/moderation/:id/resolve', (req, res) => {
  const { action } = req.body; // 'dismiss' | 'take_action'
  const resolved = resolveModerationReport(req.params.id, action);
  if (!resolved) {
    return res.status(404).json({ success: false, message: 'Report item not found' });
  }
  res.json({ success: true, message: `Report marked as ${resolved.status}`, report: resolved });
});

export default router;
