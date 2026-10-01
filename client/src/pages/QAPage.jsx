import React, { useState, useEffect } from 'react';
import {
  Search,
  HelpCircle,
  Plus,
  ThumbsUp,
  MessageSquare,
  Eye,
  CheckCircle2,
  Shield,
  Sparkles,
  Info,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function QAPage({ setActivePage, setSelectedQuestionId }) {
  const { currentUser, refreshUser } = useAuth();
  const { showToast } = useNotification();

  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [loading, setLoading] = useState(true);

  // Ask Question Modal State
  const [showAskModal, setShowAskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('React, JWT, Security');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [similarQuestions, setSimilarQuestions] = useState([]);
  const [checkingSimilar, setCheckingSimilar] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const tagsList = ['all', 'DSA', 'JWT', 'Security', 'React', 'Node.js', 'MongoDB', 'Algorithms', 'Theory'];

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await api.getQuestions({
        search,
        tag: selectedTag,
      });
      if (data.success) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Failed to load questions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [search, selectedTag]);

  // AI Similar Question Detection while typing title
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (newTitle.trim().length >= 5) {
        try {
          setCheckingSimilar(true);
          const res = await api.checkSimilarQuestions(newTitle);
          if (res.success) {
            setSimilarQuestions(res.similar);
          }
        } catch (e) {
          // ignore
        } finally {
          setCheckingSimilar(false);
        }
      } else {
        setSimilarQuestions([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [newTitle]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      showToast('Please provide a title and question details.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.askQuestion({
        title: newTitle,
        content: newContent,
        tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
        authorId: currentUser?.id,
        isAnonymous,
      });

      if (res.success) {
        showToast(
          isAnonymous
            ? 'Question posted anonymously! (+2 Reputation)'
            : 'Question posted to academic community! (+2 Reputation)',
          'success'
        );
        setShowAskModal(false);
        setNewTitle('');
        setNewContent('');
        setIsAnonymous(false);
        fetchQuestions();
        refreshUser();
      }
    } catch (err) {
      showToast(err.message || 'Failed to post question', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.1rem', marginBottom: '6px' }}>Academic Q&A Forum</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Ask without fear of judgment. Peer-reviewed answers, upvotes, and verified solutions.
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="btn btn-primary"
          id="ask-question-btn"
        >
          <Plus size={16} />
          <span>Ask Question</span>
        </button>
      </div>

      {/* Search & Tag Chips */}
      <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '42px' }}
            placeholder="Search questions by topic, algorithm, framework, or concept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tag Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {tagsList.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className="badge"
              style={{
                cursor: 'pointer',
                background: selectedTag === tag ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: selectedTag === tag ? '#fff' : 'var(--text-secondary)',
                border: selectedTag === tag ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                padding: '6px 14px',
                fontSize: '0.8rem',
              }}
            >
              {tag === 'all' ? 'All Topics' : `#${tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Feed */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading questions...
        </div>
      ) : questions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <HelpCircle size={42} style={{ margin: '0 auto 16px auto', color: 'var(--text-muted)' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No questions found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Be the first to ask an academic question on this topic!
          </p>
          <button onClick={() => setShowAskModal(true)} className="btn btn-primary btn-sm">
            Ask a Question
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map((q) => (
            <div
              key={q.id}
              className="card card-clickable"
              onClick={() => {
                setSelectedQuestionId(q.id);
                setActivePage('question_detail');
              }}
              style={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
                {/* Stats indicators (Stack Overflow style) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '70px', textAlign: 'center' }}>
                  <div
                    style={{
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{q.upvotes}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>votes</div>
                  </div>

                  <div
                    style={{
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      background: q.hasAcceptedAnswer ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
                      border: q.hasAcceptedAnswer ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: q.hasAcceptedAnswer ? '#34d399' : 'var(--text-secondary)' }}>
                      {q.answersCount} {q.hasAcceptedAnswer && '✓'}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: q.hasAcceptedAnswer ? '#34d399' : 'var(--text-muted)' }}>
                      answers
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.18rem', marginBottom: '8px', color: '#f8fafc' }}>
                    {q.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '14px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {q.content}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {q.tags?.map((t, idx) => (
                        <span key={idx} className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* Author & Meta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={13} />
                        <span>{q.views} views</span>
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {q.isAnonymous ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#a5b4fc',
                              background: 'rgba(99, 102, 241, 0.1)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                            }}
                          >
                            <Lock size={11} />
                            <span>Anonymous Student</span>
                          </div>
                        ) : (
                          <>
                            <img
                              src={q.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=qa'}
                              alt={q.authorName}
                              style={{ width: '22px', height: '22px', borderRadius: '50%' }}
                            />
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{q.authorName}</span>
                            <span>({q.authorInstitution})</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="modal-overlay" onClick={() => setShowAskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Ask an Academic Question</h3>
              <button
                onClick={() => setShowAskModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAskQuestion}>
              <div className="modal-body">
                {/* Title */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Question Title</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Be specific</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., How does JWT authentication work and where should tokens be stored?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                {/* AI Similar Question Suggestion Preview */}
                {similarQuestions.length > 0 && (
                  <div
                    style={{
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '8px' }}>
                      <Sparkles size={14} />
                      <span>Similar questions already solved on CampusLink:</span>
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {similarQuestions.map((sim) => (
                        <li
                          key={sim.id}
                          onClick={() => {
                            setSelectedQuestionId(sim.id);
                            setShowAskModal(false);
                            setActivePage('question_detail');
                          }}
                          style={{
                            fontSize: '0.84rem',
                            color: '#e0e7ff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span style={{ textDecoration: 'underline' }}>{sim.title}</span>
                          <span style={{ fontSize: '0.72rem', color: '#34d399' }}>
                            {sim.answersCount} answers {sim.hasAcceptedAnswer && '✓'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Question Details */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Question Details</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Include code snippets or problem context</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '120px' }}
                    placeholder="Provide full context, what you have tried, and where you are getting stuck..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                  />
                </div>

                {/* Tags */}
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., DSA, Binary Search, Algorithms"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                  />
                </div>

                {/* Anonymous Posting Option (USP Feature) */}
                <div
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <input
                    type="checkbox"
                    id="anonymous-checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    style={{ marginTop: '3px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <label
                      htmlFor="anonymous-checkbox"
                      style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', cursor: 'pointer' }}
                    >
                      Post anonymously
                    </label>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '2px' }}>
                      If enabled, your name and college will be displayed as <em>"Anonymous Student"</em> publicly.
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.72rem',
                        color: '#a5b4fc',
                        marginTop: '6px',
                      }}
                    >
                      <Info size={12} />
                      <span>
                        <strong>Privacy Notice:</strong> Hidden from peers, but platform maintains internal moderation ID to prevent abuse.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={submitting}
                  id="submit-question-btn"
                >
                  {submitting ? 'Posting...' : 'Post Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
