import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  getProjectApplications,
  createApplication,
  updateApplicationStatus,
  getUserApplications,
} from '../data/db.js';

const router = express.Router();

// Get all projects with filtering and match score
router.get('/', (req, res) => {
  const { search, domain, stage, status, userId } = req.query;
  const list = getProjects({
    search,
    domain,
    stage,
    status,
    currentUserId: userId,
  });
  res.json({ success: true, count: list.length, projects: list });
});

// Get project detail by ID
router.get('/:id', (req, res) => {
  const { userId } = req.query;
  const project = getProjectById(req.params.id, userId);

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  res.json({ success: true, project });
});

// Create new project
router.post('/', (req, res) => {
  const { title, description, problemStatement, domain, stage, techStack, lookingFor, duration, goals, facultyMentorId, facultyMentorName, ownerId } = req.body;

  if (!title || !description || !problemStatement) {
    return res.status(400).json({ success: false, message: 'Title, description, and problem statement are required.' });
  }

  const project = createProject(
    {
      title,
      description,
      problemStatement,
      domain,
      stage,
      techStack,
      lookingFor,
      duration,
      goals,
      facultyMentorId,
      facultyMentorName,
    },
    ownerId || 'user_farhan'
  );

  res.status(201).json({ success: true, message: 'Project published successfully!', project });
});

// Apply to a project
router.post('/:id/apply', (req, res) => {
  const { applicantId, roleId, roleTitle, pitch, github, portfolio } = req.body;

  if (!pitch) {
    return res.status(400).json({ success: false, message: 'Please provide a reason why you should be selected.' });
  }

  const application = createApplication({
    projectId: req.params.id,
    applicantId: applicantId || 'user_farhan',
    roleId,
    roleTitle,
    pitch,
    github,
    portfolio,
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully! The project owner has been notified.',
    application,
  });
});

// Get applications for a project (owner review)
router.get('/:id/applications', (req, res) => {
  const applications = getProjectApplications(req.params.id);
  res.json({ success: true, applications });
});

// Get applications made by a user
router.get('/user/:userId/applications', (req, res) => {
  const applications = getUserApplications(req.params.userId);
  res.json({ success: true, applications });
});

// Review application (Accept / Reject)
router.patch('/applications/:appId/status', (req, res) => {
  const { status, reviewerId } = req.body; // 'accepted' | 'rejected'

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be accepted or rejected.' });
  }

  const updated = updateApplicationStatus(req.params.appId, status, reviewerId);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  res.json({
    success: true,
    message: status === 'accepted' ? 'Application accepted! Applicant added to team workspace.' : 'Application rejected.',
    application: updated,
  });
});

export default router;
