import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Building2,
  BookOpen,
  GraduationCap,
  Calendar,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function AuthPages({ setActivePage }) {
  const { currentUser, login, register, loginWithGoogle, logout } = useAuth();
  const { showToast } = useNotification();

  const [mode, setMode] = useState('signup'); // 'signup' | 'signin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile fields for Signup
  const [name, setName] = useState('');
  const [college, setCollege] = useState('IIT Bombay');
  const [department, setDepartment] = useState('Computer Engineering');
  const [year, setYear] = useState('3rd Year');
  const [skills, setSkills] = useState('React, Python, PostgreSQL, Machine Learning');
  const [role, setRole] = useState('student');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [googleHelpOpen, setGoogleHelpOpen] = useState(false);

  // Handle Email & Password Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        if (setActivePage) setActivePage('dashboard');
      } else {
        setErrorMsg(res.message || 'Login failed. Please verify your credentials.');
      }
    } catch (err) {
      console.error('[Sign In Error]:', err);
      const msg = err.message || 'Invalid email or password.';
      setErrorMsg(msg);
      showToast(msg, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email & Password Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!college.trim()) {
      setErrorMsg('Please enter your college / university name.');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        email,
        password,
        name: name.trim(),
        college: college.trim(),
        department: department.trim(),
        year,
        skills,
        role,
      });

      if (res.success) {
        if (res.requiresConfirmation) {
          setSuccessMsg(
            '🎉 Account created! A confirmation email has been sent. Check your inbox to activate your account, or sign in.'
          );
          showToast('Account created! Please check your email.', 'info');
        } else {
          setSuccessMsg('🎉 Account created successfully! Profile stored in Supabase PostgreSQL.');
          showToast(`Welcome to CampusLink, ${res.user.name}!`, 'success');
          if (setActivePage) setActivePage('dashboard');
        }
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('[Sign Up Error]:', err);
      let msg = err.message || 'Registration failed.';
      if (msg.includes('already registered')) {
        msg = 'This email is already registered. Please switch to Sign In.';
      }
      setErrorMsg(msg);
      showToast(msg, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
    } catch (err) {
      console.error('[Google OAuth Error]:', err);
      const raw = err.message || '';
      if (
        raw.includes('provider is not enabled') ||
        raw.includes('Unsupported provider') ||
        raw.includes('validation_failed')
      ) {
        setErrorMsg(
          'Google OAuth is not yet enabled in your Supabase Dashboard. Follow the setup instructions below to enable it.'
        );
        setGoogleHelpOpen(true);
      } else {
        setErrorMsg(raw || 'Failed to initialize Google authentication.');
      }
      showToast(err.message || 'Google Auth Error', 'warning');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      showToast('Logged out successfully.', 'info');
      setSuccessMsg('You have been logged out.');
      setErrorMsg('');
    } catch (err) {
      showToast('Logout failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '40px auto', padding: '0 16px' }}>
      {/* Current User Signed In Card */}
      {currentUser && (
        <div
          className="card"
          style={{
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            background: 'rgba(99, 102, 241, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '46px', height: '46px', borderRadius: '50%', border: '2px solid var(--primary)' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {currentUser.email}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#a5b4fc', marginTop: '2px' }}>
                  {currentUser.college || currentUser.institution} • {currentUser.role === 'faculty' ? '🎓 Faculty' : 'Student'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActivePage && setActivePage('dashboard')}
                className="btn btn-primary btn-sm"
                id="auth-go-dashboard-btn"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                id="auth-logout-btn"
                title="Log out"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Authentication Card */}
      <div className="card" style={{ padding: '36px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            className="brand-icon"
            style={{ width: '52px', height: '52px', margin: '0 auto 16px auto', borderRadius: '16px' }}
          >
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
            {mode === 'signup' ? 'Create Academic Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            {mode === 'signup'
              ? 'Join students and professors across India with Supabase Auth'
              : 'Sign in to access your projects, teams, and research'}
          </p>
        </div>

        {/* Tab Toggle: Sign Up vs Sign In */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-input)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: 'none',
              borderRadius: '6px',
              background: mode === 'signup' ? 'var(--primary)' : 'transparent',
              color: mode === 'signup' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            id="tab-signup"
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: 'none',
              borderRadius: '6px',
              background: mode === 'signin' ? 'var(--primary)' : 'transparent',
              color: mode === 'signin' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            id="tab-signin"
          >
            Sign In
          </button>
        </div>

        {/* Inline Alerts */}
        {errorMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-sm)',
              color: '#f87171',
              fontSize: '0.86rem',
              marginBottom: '20px',
              lineHeight: 1.45,
            }}
            id="auth-error-alert"
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-sm)',
              color: '#34d399',
              fontSize: '0.86rem',
              marginBottom: '20px',
              lineHeight: 1.45,
            }}
            id="auth-success-alert"
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{successMsg}</div>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={mode === 'signup' ? handleSignUp : handleSignIn}>
          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} />
              <span>Email</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. farhan.ansari@vjti.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="auth-email-input"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} />
              <span>Password</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                id="auth-password-input"
                style={{ paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {mode === 'signup' && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Securely handled by Supabase Auth. Never stored in plain-text.
              </span>
            )}
          </div>

          {/* PROFILE FIELDS (SIGN UP ONLY) */}
          {mode === 'signup' && (
            <>
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Farhan Ansari"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  id="auth-name-input"
                />
              </div>

              {/* College & Department */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={14} />
                    <span>College</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. IIT Bombay / VJTI"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    required
                    id="auth-college-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={14} />
                    <span>Department</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Computer Engg"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    id="auth-department-input"
                  />
                </div>
              </div>

              {/* Year & Role */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>Year of Study</span>
                  </label>
                  <select
                    className="form-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    id="auth-year-select"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Post Graduate / PhD">Post Graduate / PhD</option>
                    <option value="Faculty / Postdoc">Faculty / Postdoc</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={14} />
                    <span>Role</span>
                  </label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    id="auth-role-select"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} />
                  <span>Skills (comma separated)</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="React, Python, PostgreSQL, Machine Learning"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  id="auth-skills-input"
                />
              </div>
            </>
          )}

          {/* Primary Action Button: [ Sign Up ] or [ Sign In ] */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 700,
            }}
            disabled={loading}
            id={mode === 'signup' ? 'auth-signup-btn' : 'auth-signin-btn'}
          >
            <span>
              {loading
                ? mode === 'signup'
                  ? 'Creating Account...'
                  : 'Signing in...'
                : mode === 'signup'
                ? 'Sign Up'
                : 'Sign In'}
            </span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Visual Divider: OR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '22px 0',
            gap: '12px',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            OR
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Google OAuth Button: [ Continue with Google ] */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '11px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            background: '#ffffff',
            color: '#1f2937',
            fontSize: '0.94rem',
            fontWeight: 600,
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
          id="auth-google-btn"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          <span>{googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
        </button>

        {/* Toggle Mode Footer */}
        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a5b4fc',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                id="switch-to-signin"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a5b4fc',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                id="switch-to-signup"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Google OAuth Help Collapsible Box */}
        {googleHelpOpen && (
          <div
            style={{
              marginTop: '20px',
              padding: '14px',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontWeight: 700, color: '#a5b4fc', marginBottom: '6px' }}>
              🔧 How to enable Google OAuth in Supabase:
            </div>
            <ol style={{ paddingLeft: '18px', margin: '4px 0' }}>
              <li>
                Open{' '}
                <a
                  href="https://supabase.com/dashboard/project/bhkccrglfrkiynryobsy/auth/providers"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#818cf8', textDecoration: 'underline' }}
                >
                  Supabase Dashboard &gt; Auth &gt; Providers
                </a>
              </li>
              <li>Expand the <strong>Google</strong> provider toggle.</li>
              <li>
                Enter your Google Cloud <strong>Client ID</strong> and <strong>Client Secret</strong>.
              </li>
              <li>
                In Google Cloud Console, add this Authorized Redirect URI:
                <br />
                <code
                  style={{
                    background: '#0b0f19',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: '#34d399',
                    display: 'inline-block',
                    marginTop: '4px',
                    wordBreak: 'break-all',
                  }}
                >
                  https://bhkccrglfrkiynryobsy.supabase.co/auth/v1/callback
                </code>
              </li>
              <li>Click Save in Supabase.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
