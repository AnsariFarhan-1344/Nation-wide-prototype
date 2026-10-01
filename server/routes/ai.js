import express from 'express';
import {
  findSimilarQuestions,
  generateAIDescription,
  calculateSkillMatch,
  getUserById,
  getProjectById,
} from '../data/db.js';

const router = express.Router();

// Real-time similar questions detector
router.post('/similar-questions', (req, res) => {
  const { title } = req.body;
  const similar = findSimilarQuestions(title);
  res.json({ success: true, similar });
});

// Project Description Assistant
router.post('/generate-project', (req, res) => {
  const { prompt } = req.body;
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ success: false, message: 'Please provide a short project idea prompt.' });
  }

  const generated = generateAIDescription(prompt);
  res.json({ success: true, generated });
});

// AI Match Explanation
router.post('/match-explanation', (req, res) => {
  const { userId, projectId } = req.body;
  const user = getUserById(userId);
  const project = getProjectById(projectId);

  if (!user || !project) {
    return res.status(404).json({ success: false, message: 'User or project not found' });
  }

  const match = calculateSkillMatch(user.skills, project.requiredSkills);
  const matchedStr = match.matchedSkills.join(', ') || 'none yet';
  const missingStr = match.missingSkills.join(', ') || 'none';

  let narrative = `You have a **${match.matchScore}% Skill Match** for this project.`;
  if (match.matchedSkills.length > 0) {
    narrative += ` Your expertise in **${matchedStr}** aligns directly with the core architecture.`;
  }
  if (match.missingSkills.length > 0) {
    narrative += ` To maximize your contribution, you can rapidly upskill in **${missingStr}** during team onboarding.`;
  }

  res.json({
    success: true,
    matchScore: match.matchScore,
    matchedSkills: match.matchedSkills,
    missingSkills: match.missingSkills,
    narrative,
  });
});

export default router;
