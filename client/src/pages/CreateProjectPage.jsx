import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Briefcase,
  Layers,
  Code,
  Users,
  Clock,
  Send,
  Wand2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function CreateProjectPage({ setActivePage, setSelectedProjectId }) {
  const { currentUser, refreshUser } = useAuth();
  const { showToast } = useNotification();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [domain, setDomain] = useState('AI/ML');
  const [stage, setStage] = useState('Prototype');
  const [techStack, setTechStack] = useState('React, Node.js, Python, MongoDB');
  const [lookingFor, setLookingFor] = useState('Frontend Developer, ML Engineer');
  const [duration, setDuration] = useState('3 Months');
  const [goals, setGoals] = useState('Build MVP canvas\nConduct cross-campus testing\nPublish documentation');
  const [facultyMentorName, setFacultyMentorName] = useState('');

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleAIAssist = async () => {
    if (!aiPrompt.trim()) {
      showToast('Please enter a brief idea prompt for the AI assistant.', 'warning');
      return;
    }

    try {
      setGeneratingAI(true);
      const res = await api.generateProjectDescription(aiPrompt);
      if (res.success && res.generated) {
        const g = res.generated;
        setTitle(g.suggestedTitle || title);
        setDomain(g.domain || domain);
        setProblemStatement(g.problemStatement || problemStatement);
        setDescription(g.solution || description);
        setTechStack(g.techStack ? g.techStack.join(', ') : techStack);
        setGoals(g.goals ? g.goals.join('\n') : goals);
        setDuration(g.duration || duration);
        if (g.requiredRoles) {
          setLookingFor(g.requiredRoles.map((r) => r.title).join(', '));
        }
        showToast('✨ AI generated project framework applied!', 'success');
      }
    } catch (err) {
      showToast('Failed to generate project with AI', 'danger');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !problemStatement) {
      showToast('Please fill in title, description, and problem statement.', 'warning');
      return;
    }

    try {
      setPublishing(true);
      const techArray = techStack.split(',').map((s) => s.trim()).filter(Boolean);
      const goalsArray = goals.split('\n').map((s) => s.trim()).filter(Boolean);

      const rolesArray = lookingFor
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean)
        .map((roleTitle, idx) => ({
          id: `role_${Date.now()}_${idx}`,
          title: roleTitle,
          openings: 1,
          skills: techArray.slice(0, 3),
          description: `Contribute to ${roleTitle} tasks on ${title}.`,
        }));

      const payload = {
        title,
        description,
        problemStatement,
        domain,
        stage,
        techStack: techArray,
        requiredSkills: techArray,
        lookingFor,
        openRoles: rolesArray,
        duration,
        goals: goalsArray,
        facultyMentorName: facultyMentorName || null,
        ownerId: currentUser?.id,
      };

      const res = await api.createProject(payload);
      if (res.success) {
        showToast('🎉 Project published successfully! (+30 Reputation)', 'success');
        refreshUser();
        setSelectedProjectId(res.project.id);
        setActivePage('project_detail');
      }
    } catch (err) {
      showToast(err.message || 'Failed to publish project', 'danger');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Back button */}
      <button
        onClick={() => setActivePage('projects')}
        className="btn-outline btn-sm"
        style={{ marginBottom: '20px', gap: '6px' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Projects</span>
      </button>

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Publish a Nationwide Project</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Connect with students and faculty across India to build verified, production-style projects.
          </p>
        </div>

        {/* AI Project Description Assistant Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="#818cf8" />
            <h3 style={{ fontSize: '1rem', color: '#fff' }}>AI Project Framework Generator</h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Enter a short project idea (e.g. <em>"An app for finding college events"</em> or <em>"Edge AI crop disease detection"</em>) and let AI draft your problem statement, goals, tech stack, and roles.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., A collaborative tool for students to visualize algorithms..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAIAssist}
              className="btn btn-primary btn-sm"
              disabled={generatingAI}
              style={{ whiteSpace: 'nowrap' }}
            >
              <Wand2 size={14} />
              <span>{generatingAI ? 'Generating...' : 'Generate with AI'}</span>
            </button>
          </div>
        </div>

        {/* Project Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <span>Project Title</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Required</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., AI Learning Platform"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Domain</label>
              <select
                className="form-select"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              >
                <option value="AI/ML">AI/ML</option>
                <option value="Web Development">Web Development</option>
                <option value="IoT">IoT</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Core Engineering">Core Engineering</option>
                <option value="Research">Academic Research</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Current Stage</label>
              <select
                className="form-select"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                <option value="Idea">Idea</option>
                <option value="Prototype">Prototype</option>
                <option value="MVP">MVP</option>
                <option value="Deployment">Deployment</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Problem Statement</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Required</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="What specific challenge or academic disparity does this project address?"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Project Overview & Description</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Required</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="Describe your proposed architecture, key features, and collaboration goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tech Stack (comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., React, Python, Node.js, MongoDB, PyTorch"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Looking For (Required Roles, comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Frontend Developer, ML Engineer, UI/UX Designer"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Expected Duration</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., 3 Months"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Optional Faculty Mentor</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Dr. Arvind Sharma"
                value={facultyMentorName}
                onChange={(e) => setFacultyMentorName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Key Milestones & Goals (one per line)</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '80px' }}
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setActivePage('projects')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={publishing}
              id="publish-project-btn"
            >
              <Send size={16} />
              <span>{publishing ? 'Publishing...' : 'Publish Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
