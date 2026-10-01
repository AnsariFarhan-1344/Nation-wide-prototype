import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ThumbsUp,
  CheckCircle2,
  Check,
  Lock,
  Eye,
  Send,
  Sparkles,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function QuestionDetailPage({ questionId, setActivePage }) {
  const { currentUser, refreshUser } = useAuth();
  const { showToast, refreshNotifications } = useNotification();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const data = await api.getQuestionById(questionId);
      if (data.success) {
        setQuestion(data.question);
      }
    } catch (err) {
      console.error('Failed to load question', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  const handleUpvoteQuestion = async () => {
    try {
      const res = await api.upvoteQuestion(question.id);
      if (res.success) {
        setQuestion((prev) => ({ ...prev, upvotes: res.upvotes }));
        showToast('Upvoted question!', 'info');
      }
    } catch (err) {
      showToast('Failed to upvote', 'danger');
    }
  };

  const handleUpvoteAnswer = async (answerId) => {
    try {
      const res = await api.upvoteAnswer(question.id, answerId);
      if (res.success) {
        setQuestion((prev) => ({
          ...prev,
          answers: prev.answers.map((a) => (a.id === answerId ? { ...a, upvotes: res.upvotes } : a)),
        }));
        showToast('Upvoted answer!', 'info');
      }
    } catch (err) {
      showToast('Failed to upvote answer', 'danger');
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    try {
      const res = await api.acceptAnswer(question.id, answerId);
      if (res.success) {
        setQuestion(res.question);
        showToast('✓ Answer marked as accepted! +20 Reputation awarded to contributor.', 'success');
        refreshUser();
        refreshNotifications();
      }
    } catch (err) {
      showToast('Failed to mark answer as accepted', 'danger');
    }
  };

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!answerContent.trim()) {
      showToast('Please type your solution.', 'warning');
      return;
    }

    try {
      setSubmittingAnswer(true);
      const res = await api.addAnswer(question.id, {
        content: answerContent,
        authorId: currentUser?.id,
      });

      if (res.success) {
        showToast('Answer posted! You earned +5 reputation points.', 'success');
        setAnswerContent('');
        fetchQuestion();
        refreshUser();
      }
    } catch (err) {
      showToast(err.message || 'Failed to post answer', 'danger');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading question...</div>;
  }

  if (!question) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3>Question not found</h3>
        <button onClick={() => setActivePage('qa')} className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
          Back to Q&A
        </button>
      </div>
    );
  }

  const isQuestionAuthor = question.authorId === currentUser?.id;

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => setActivePage('qa')}
        className="btn-outline btn-sm"
        style={{ marginBottom: '20px', gap: '6px' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Q&A Forum</span>
      </button>

      {/* Main Question Card */}
      <div className="card" style={{ padding: '32px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          {/* Upvote Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleUpvoteQuestion}
              className="btn btn-secondary btn-sm"
              style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)' }}
              title="Upvote this question"
              id="upvote-question-btn"
            >
              <ThumbsUp size={18} />
            </button>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{question.upvotes}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>votes</span>
          </div>

          {/* Question Details */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '14px', lineHeight: 1.3 }}>{question.title}</h1>

            <div
              style={{
                fontSize: '0.98rem',
                color: '#e2e8f0',
                lineHeight: 1.7,
                marginBottom: '20px',
                whiteSpace: 'pre-line',
              }}
            >
              {question.content}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {question.tags?.map((t, idx) => (
                <span key={idx} className="badge badge-primary" style={{ padding: '4px 10px' }}>
                  #{t}
                </span>
              ))}
            </div>

            {/* Meta & Author */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.84rem',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={14} />
                  <span>{question.views} views</span>
                </span>
                <span>Asked on {new Date(question.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Author badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {question.isAnonymous ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      color: '#a5b4fc',
                    }}
                  >
                    <Lock size={12} />
                    <span>Anonymous Student (Identity masked)</span>
                  </div>
                ) : (
                  <>
                    <img
                      src={question.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=author'}
                      alt={question.authorName}
                      style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                    />
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{question.authorName}</span>
                    <span>({question.authorInstitution})</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
          {question.answers?.length || 0} Solution{question.answers?.length !== 1 ? 's' : ''}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {question.answers?.map((ans) => (
            <div
              key={ans.id}
              className="card"
              style={{
                borderColor: ans.isAccepted ? 'rgba(16, 185, 129, 0.5)' : 'var(--border-subtle)',
                background: ans.isAccepted ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card)',
                padding: '24px',
              }}
            >
              {ans.isAccepted && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#34d399',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    marginBottom: '14px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Accepted Solution ✓ (+20 Reputation)</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                {/* Answer Upvote & Accept Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleUpvoteAnswer(ans.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}
                    title="Upvote this answer"
                  >
                    <ThumbsUp size={16} />
                  </button>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{ans.upvotes}</span>

                  {/* Accept Answer Button (Only visible if question has not been accepted or author is accepting) */}
                  {!ans.isAccepted && (
                    <button
                      onClick={() => handleAcceptAnswer(ans.id)}
                      className="btn btn-outline btn-sm"
                      style={{
                        borderColor: '#10b981',
                        color: '#34d399',
                        padding: '6px 8px',
                        fontSize: '0.72rem',
                      }}
                      title="Mark as accepted answer (+20 rep to author)"
                      id={`accept-answer-btn-${ans.id}`}
                    >
                      <Check size={14} />
                      <span>Accept</span>
                    </button>
                  )}
                </div>

                {/* Answer Content */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.94rem',
                      color: '#e2e8f0',
                      lineHeight: 1.65,
                      marginBottom: '18px',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {ans.content}
                  </div>

                  {/* Answer Author */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '10px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>Answered by</span>
                    <img
                      src={ans.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=ans'}
                      alt={ans.authorName}
                      style={{ width: '26px', height: '26px', borderRadius: '50%' }}
                    />
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>{ans.authorName}</span>
                    <span>({ans.authorInstitution})</span>
                    {ans.isFaculty && (
                      <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                        Verified Faculty 🎓
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Submission Form */}
      <div className="card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Your Solution</h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Provide clear, reproducible explanations or code snippets. Helpful answers earn +5 reputation and +20 if accepted.
        </p>

        <form onSubmit={handlePostAnswer}>
          <div className="form-group">
            <textarea
              className="form-textarea"
              style={{ minHeight: '140px' }}
              placeholder="Write your detailed explanation, code solution, or algorithmic proof..."
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingAnswer}
              id="submit-answer-btn"
            >
              <Send size={16} />
              <span>{submittingAnswer ? 'Posting...' : 'Post Solution (+5 Rep)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
