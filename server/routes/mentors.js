import express from 'express';
import {
  getFacultyMentors,
  getResearchOpportunities,
  getOpportunities,
  getUserById,
  createNotification,
} from '../data/db.js';

const router = express.Router();

// Get faculty mentors
router.get('/', (req, res) => {
  const { domain, search } = req.query;
  const mentors = getFacultyMentors({ domain, search });
  res.json({ success: true, mentors });
});

// Request mentorship
router.post('/:id/request', (req, res) => {
  const { studentId, message, projectTitle, expectedGuidance, duration } = req.body;
  const mentorId = req.params.id;
  const student = getUserById(studentId);

  if (!message || !projectTitle) {
    return res.status(400).json({ success: false, message: 'Message and project title are required.' });
  }

  createNotification({
    userId: mentorId,
    type: 'MENTOR_REQUEST',
    title: '🎓 New Mentorship Request',
    message: `${student ? student.name : 'A student'} requested mentorship for project "${projectTitle}".`,
    link: '/mentors',
  });

  res.status(201).json({
    success: true,
    message: 'Mentorship request sent! The faculty mentor will review your project brief.',
  });
});

// Get research opportunities
router.get('/research/all', (req, res) => {
  const { domain, search } = req.query;
  const opportunities = getResearchOpportunities({ domain, search });
  res.json({ success: true, count: opportunities.length, opportunities });
});

// Apply to research opportunity
router.post('/research/:id/apply', (req, res) => {
  const { studentId, pitch, resumeUrl } = req.body;
  const student = getUserById(studentId);

  if (!pitch) {
    return res.status(400).json({ success: false, message: 'Please provide a statement of interest.' });
  }

  res.status(201).json({
    success: true,
    message: 'Research application submitted! The principal investigator has been notified.',
  });
});

// Secondary opportunity board (Hackathons, Internships, Scholarships, Workshops)
router.get('/opportunities/all', (req, res) => {
  const { type } = req.query;
  const items = getOpportunities(type);
  res.json({ success: true, opportunities: items });
});

export default router;
