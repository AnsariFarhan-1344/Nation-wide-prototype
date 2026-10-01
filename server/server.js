import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import teamRoutes from './routes/teams.js';
import qaRoutes from './routes/qa.js';
import mentorRoutes from './routes/mentors.js';
import reputationRoutes from './routes/reputation.js';
import aiRoutes from './routes/ai.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), message: 'CampusLink Collaboration Portal API running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/reputation', reputationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global JSON error handler - ensures all server errors always return valid JSON
app.use((err, req, res, next) => {
  console.error('[CampusLink API Server Error]:', err);
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`[CampusLink API] Server running on http://localhost:${PORT}`);
});
