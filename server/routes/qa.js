import express from 'express';
import {
  getQuestions,
  getQuestionById,
  askQuestion,
  addAnswer,
  upvoteQuestion,
  upvoteAnswer,
  acceptAnswer,
} from '../data/db.js';

const router = express.Router();

// Get questions list
router.get('/', (req, res) => {
  const { search, tag } = req.query;
  const list = getQuestions({ search, tag });
  res.json({ success: true, count: list.length, questions: list });
});

// Get question detail
router.get('/:id', (req, res) => {
  const question = getQuestionById(req.params.id);
  if (!question) {
    return res.status(404).json({ success: false, message: 'Question not found' });
  }
  res.json({ success: true, question });
});

// Ask question (with anonymous posting option)
router.post('/', (req, res) => {
  const { title, content, tags, authorId, isAnonymous } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }

  const question = askQuestion({
    title,
    content,
    tags: tags || ['General'],
    authorId: authorId || 'user_farhan',
    isAnonymous: Boolean(isAnonymous),
  });

  res.status(201).json({
    success: true,
    message: isAnonymous
      ? 'Question posted anonymously. (Your identity is protected publicly while retaining internal moderation traceability).'
      : 'Question posted successfully!',
    question,
  });
});

// Add answer to question
router.post('/:id/answers', (req, res) => {
  const { content, authorId } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: 'Answer content is required' });
  }

  const answer = addAnswer({
    questionId: req.params.id,
    content,
    authorId: authorId || 'user_farhan',
  });

  if (!answer) {
    return res.status(404).json({ success: false, message: 'Question not found' });
  }

  res.status(201).json({
    success: true,
    message: 'Answer posted! You earned +5 reputation points.',
    answer,
  });
});

// Upvote question
router.post('/:id/upvote', (req, res) => {
  const q = upvoteQuestion(req.params.id);
  if (!q) {
    return res.status(404).json({ success: false, message: 'Question not found' });
  }
  res.json({ success: true, upvotes: q.upvotes });
});

// Upvote answer
router.post('/:id/answers/:answerId/upvote', (req, res) => {
  const ans = upvoteAnswer(req.params.id, req.params.answerId);
  if (!ans) {
    return res.status(404).json({ success: false, message: 'Answer not found' });
  }
  res.json({ success: true, upvotes: ans.upvotes });
});

// Mark answer as accepted (awards +20 rep)
router.post('/:id/answers/:answerId/accept', (req, res) => {
  const q = acceptAnswer(req.params.id, req.params.answerId);
  if (!q) {
    return res.status(404).json({ success: false, message: 'Question or answer not found' });
  }

  res.json({
    success: true,
    message: '✓ Answer marked as accepted! The contributor has been awarded +20 reputation points.',
    question: q,
  });
});

export default router;
