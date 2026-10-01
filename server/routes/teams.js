import express from 'express';
import {
  getUserTeams,
  getTeamWorkspace,
  addTaskToWorkspace,
  updateTaskColumn,
  addChatMessage,
} from '../data/db.js';

const router = express.Router();

// Get teams for current user
router.get('/user/:userId', (req, res) => {
  const teams = getUserTeams(req.params.userId);
  res.json({ success: true, teams });
});

// Get workspace for a project
router.get('/:projectId/workspace', (req, res) => {
  const workspace = getTeamWorkspace(req.params.projectId);
  if (!workspace) {
    return res.status(404).json({ success: false, message: 'Workspace not found' });
  }
  res.json({ success: true, workspace });
});

// Add task to Kanban
router.post('/:projectId/tasks', (req, res) => {
  const { title, description, column, priority, assignedTo, assignedUserId, deadline } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Task title is required' });
  }

  const task = addTaskToWorkspace(req.params.projectId, {
    title,
    description,
    column,
    priority,
    assignedTo,
    assignedUserId,
    deadline,
  });

  if (!task) {
    return res.status(404).json({ success: false, message: 'Workspace not found' });
  }

  res.status(201).json({ success: true, message: 'Task created', task });
});

// Update task column (TODO, IN_PROGRESS, REVIEW, DONE)
router.patch('/:projectId/tasks/:taskId/column', (req, res) => {
  const { column } = req.body;
  const validColumns = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

  if (!validColumns.includes(column)) {
    return res.status(400).json({ success: false, message: 'Invalid column' });
  }

  const task = updateTaskColumn(req.params.projectId, req.params.taskId, column);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task or workspace not found' });
  }

  res.json({ success: true, message: `Task moved to ${column}`, task });
});

// Send message to team chat
router.post('/:projectId/chat', (req, res) => {
  const { senderId, content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: 'Message content cannot be empty' });
  }

  const msg = addChatMessage(req.params.projectId, { senderId, content });
  if (!msg) {
    return res.status(404).json({ success: false, message: 'Workspace not found' });
  }

  res.status(201).json({ success: true, message: 'Message sent', messageItem: msg });
});

export default router;
