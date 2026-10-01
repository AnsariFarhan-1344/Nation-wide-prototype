import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Layers,
  CheckSquare,
  MessageSquare,
  FileText,
  Users,
  Plus,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function TeamWorkspacePage({ projectId, setActivePage }) {
  const { currentUser, refreshUser } = useAuth();
  const { showToast } = useNotification();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kanban'); // 'overview' | 'kanban' | 'chat' | 'files' | 'members'

  // Kanban Task Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskColumn, setTaskColumn] = useState('TODO');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');

  // Team Chat State
  const [chatInput, setChatInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const data = await api.getTeamWorkspace(projectId);
      if (data.success) {
        setWorkspace(data.workspace);
      }
    } catch (err) {
      console.error('Failed to load workspace', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchWorkspace();
    }
  }, [projectId]);

  // Move Kanban task to a new column
  const handleMoveColumn = async (taskId, newColumn) => {
    try {
      const res = await api.updateTaskColumn(projectId, taskId, newColumn);
      if (res.success) {
        setWorkspace((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, column: newColumn } : t)),
        }));
        showToast(`Task moved to ${newColumn.replace('_', ' ')}`, 'info');
      }
    } catch (err) {
      showToast('Failed to update task column', 'danger');
    }
  };

  // Add new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const res = await api.addTask(projectId, {
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        column: taskColumn,
        assignedTo: taskAssignee || currentUser?.name,
        assignedUserId: currentUser?.id,
        deadline: taskDeadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      });

      if (res.success) {
        setWorkspace((prev) => ({
          ...prev,
          tasks: [...prev.tasks, res.task],
        }));
        showToast('Task added to Kanban board!', 'success');
        setShowTaskModal(false);
        setTaskTitle('');
        setTaskDescription('');
      }
    } catch (err) {
      showToast('Failed to create task', 'danger');
    }
  };

  // Send team chat message
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try {
      setSendingMsg(true);
      const res = await api.sendChatMessage(projectId, {
        senderId: currentUser?.id,
        content: chatInput,
      });

      if (res.success) {
        setWorkspace((prev) => ({
          ...prev,
          chatMessages: [...prev.chatMessages, res.messageItem],
        }));
        setChatInput('');
      }
    } catch (err) {
      showToast('Failed to send message', 'danger');
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading team workspace...</div>;
  }

  if (!workspace) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3>Workspace not found</h3>
        <button onClick={() => setActivePage('teams')} className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
          Back to Teams
        </button>
      </div>
    );
  }

  const columns = [
    { id: 'TODO', label: 'To Do', color: '#6366f1' },
    { id: 'IN_PROGRESS', label: 'In Progress', color: '#f59e0b' },
    { id: 'REVIEW', label: 'In Review', color: '#38bdf8' },
    { id: 'DONE', label: 'Done', color: '#10b981' },
  ];

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => setActivePage('teams')}
        className="btn-outline btn-sm"
        style={{ marginBottom: '16px', gap: '6px' }}
      >
        <ArrowLeft size={16} />
        <span>Back to My Teams</span>
      </button>

      {/* Workspace Header */}
      <div
        className="card"
        style={{
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Layers size={20} color="#818cf8" />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{workspace.projectTitle}</h1>
            <span className="badge badge-success">Active Workspace</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Collaborative team space for cross-campus members · {workspace.members?.length || 0} Members
          </p>
        </div>

        {/* Quick Add Task Button */}
        <button
          onClick={() => setShowTaskModal(true)}
          className="btn btn-primary btn-sm"
          id="add-task-btn"
        >
          <Plus size={15} />
          <span>Add Kanban Task</span>
        </button>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="tabs-nav">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`tab-btn ${activeTab === 'kanban' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckSquare size={16} />
            <span>Kanban Board</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={16} />
            <span>Team Chat ({workspace.chatMessages?.length || 0})</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`tab-btn ${activeTab === 'files' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={16} />
            <span>Shared Files ({workspace.files?.length || 0})</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} />
            <span>Members ({workspace.members?.length || 0})</span>
          </div>
        </button>
      </div>

      {/* TAB 1: KANBAN BOARD */}
      {activeTab === 'kanban' && (
        <div className="kanban-board">
          {columns.map((col) => {
            const colTasks = workspace.tasks?.filter((t) => t.column === col.id) || [];
            return (
              <div key={col.id} className="kanban-col">
                <div className="kanban-col-header">
                  <div className="kanban-col-title" style={{ color: col.color }}>
                    <span>{col.label}</span>
                    <span
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        fontSize: '0.72rem',
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-full)',
                        color: '#fff',
                      }}
                    >
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '120px' }}>
                  {colTasks.map((task) => (
                    <div key={task.id} className="kanban-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span
                          className={`badge ${
                            task.priority === 'High'
                              ? 'badge-danger'
                              : task.priority === 'Medium'
                              ? 'badge-warning'
                              : 'badge-info'
                          }`}
                          style={{ fontSize: '0.68rem', padding: '2px 6px' }}
                        >
                          {task.priority}
                        </span>

                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Calendar size={12} />
                          <span>{task.deadline}</span>
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.92rem', marginBottom: '6px', color: '#f8fafc' }}>
                        {task.title}
                      </h4>

                      {task.description && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.4 }}>
                          {task.description}
                        </p>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.76rem', color: '#a5b4fc', fontWeight: 600 }}>
                          👤 {task.assignedTo}
                        </span>

                        {/* Move Column Dropdown */}
                        <select
                          value={task.column}
                          onChange={(e) => handleMoveColumn(task.id, e.target.value)}
                          style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.72rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="REVIEW">In Review</option>
                          <option value="DONE">Done</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', fontSize: '0.8rem', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                      No tasks in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: TEAM CHAT */}
      {activeTab === 'chat' && (
        <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '620px' }}>
          {/* Chat Messages Stream */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {workspace.chatMessages?.map((msg) => {
              const isMe = msg.senderId === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    maxWidth: '80%',
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    flexDirection: isMe ? 'row-reverse' : 'row',
                  }}
                >
                  <img
                    src={msg.senderAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=chat'}
                    alt={msg.senderName}
                    style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0 }}
                  />
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                        justifyContent: isMe ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isMe ? '#a5b4fc' : '#f8fafc' }}>
                        {msg.senderName}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      style={{
                        background: isMe ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-input)',
                        border: isMe ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 14px',
                        fontSize: '0.88rem',
                        color: '#f8fafc',
                        lineHeight: 1.5,
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Quick Demo Replies */}
          <div style={{ padding: '8px 24px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Quick replies:</span>
            {["Backend API completed.", "I'll connect the frontend.", "I'll work on dashboard UI."].map((text, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setChatInput(text)}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.74rem', padding: '3px 8px' }}
              >
                "{text}"
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChat} style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="form-input"
              placeholder={`Message #${workspace.projectTitle} (use @mentions)...`}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={sendingMsg}
              id="send-chat-btn"
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SHARED FILES */}
      {activeTab === 'files' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Project Repository & Documents</h3>
            <button
              onClick={() => showToast('Simulated upload: Architecture_v2.pdf added', 'success')}
              className="btn btn-outline btn-sm"
            >
              <Paperclip size={14} />
              <span>Upload Document</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {workspace.files?.map((file) => (
              <div
                key={file.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#818cf8" />
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{file.name}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {file.size} · Uploaded by {file.uploadedBy} on {file.date}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Downloading ${file.name}...`, 'info')}
                  className="btn btn-secondary btn-sm"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MEMBERS ROSTER */}
      {activeTab === 'members' && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Project Collaborators ({workspace.members?.length || 0})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {workspace.members?.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img
                  src={m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=member'}
                  alt={m.name}
                  style={{ width: '42px', height: '42px', borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 700 }}>{m.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 500 }}>
                    {m.role || m.roleTitle}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {m.institution}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>Add Kanban Task</h3>
              <button
                onClick={() => setShowTaskModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Build Login & Role-Based UI"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Task details and acceptance criteria..."
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Initial Column</label>
                    <select
                      className="form-select"
                      value={taskColumn}
                      onChange={(e) => setTaskColumn(e.target.value)}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">In Review</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Assignee</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Farhan Ansari"
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input
                      type="date"
                      className="form-input"
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" id="submit-task-btn">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
