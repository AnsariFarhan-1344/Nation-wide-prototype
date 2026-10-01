import express from 'express';
import {
  getLeaderboard,
  getUserReputationHistory,
  getUserById,
} from '../data/db.js';

const router = express.Router();

// Get leaderboard with filters
router.get('/leaderboard', (req, res) => {
  const { institution, domain, scope } = req.query;
  const list = getLeaderboard({ institution, domain, scope });
  res.json({ success: true, count: list.length, leaderboard: list });
});

// Get user reputation history audit log
router.get('/history/:userId', (req, res) => {
  const history = getUserReputationHistory(req.params.userId);
  const user = getUserById(req.params.userId);
  res.json({
    success: true,
    reputation: user ? user.reputation : 0,
    history,
  });
});

export default router;
