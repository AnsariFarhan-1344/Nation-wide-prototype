import express from 'express';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
} from '../data/db.js';

const router = express.Router();

// List all demo personas for quick 1-click switching during hackathon demo
router.get('/personas', (req, res) => {
  try {
    const rawUsers = getAllUsers();
    const users = Array.isArray(rawUsers) ? rawUsers : [];
    const personas = users.map((u) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      institution: u.institution,
      department: u.department,
      verified: !!u.verified,
      avatar: u.avatar || '',
      reputation: typeof u.reputation === 'number' ? u.reputation : 0,
      stats: u.stats || {},
    }));

    return res.status(200).json({
      success: true,
      personas,
    });
  } catch (error) {
    console.error('[Auth Error] /personas:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve personas',
      personas: [],
      error: error.message,
    });
  }
});

// Login by email or by demo persona ID
router.post('/login', (req, res) => {
  try {
    const { email, personaId } = req.body;
    let user = null;

    if (personaId) {
      user = getUserById(personaId);
    } else if (email) {
      user = getUserByEmail(email);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please register or select a demo persona.' });
    }

    return res.status(200).json({
      success: true,
      message: `Logged in as ${user.name}`,
      user,
      token: `jwt_mock_token_${user.id}`,
    });
  } catch (error) {
    console.error('[Auth Error] /login:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal error during login',
      error: error.message,
    });
  }
});

// Register new user
router.post('/register', (req, res) => {
  try {
    const { name, email, role, institution, department, skills, password } = req.body;

    if (!name || !email || !institution) {
      return res.status(400).json({ success: false, message: 'Name, email, and institution are required.' });
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const newUser = createUser({
      name,
      email,
      role: role || 'student',
      institution,
      department: department || 'Engineering',
      skills: Array.isArray(skills) ? skills : (skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      verified: false, // will become verified upon OTP completion
    });

    return res.status(201).json({
      success: true,
      message: 'Account created. Please verify your institution email with OTP.',
      user: newUser,
      token: `jwt_mock_token_${newUser.id}`,
    });
  } catch (error) {
    console.error('[Auth Error] /register:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal error during registration',
      error: error.message,
    });
  }
});

// Verify OTP for institutional email verification
router.post('/verify-otp', (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = getUserById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Any 6-digit OTP works for demo (e.g. 123456)
    if (!otp || otp.length < 4) {
      return res.status(400).json({ success: false, message: 'Please enter a valid OTP code (e.g., 123456)' });
    }

    const updated = updateUser(userId, {
      verified: true,
      verificationType: user.role === 'faculty' ? 'faculty_credential_verified' : 'institutional_email_otp',
    });

    return res.status(200).json({
      success: true,
      message: `Verification complete! ${user.name} is now a Verified ${user.role === 'faculty' ? 'Faculty 🎓' : 'Student ✓'}.`,
      user: updated,
    });
  } catch (error) {
    console.error('[Auth Error] /verify-otp:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal error during OTP verification',
      error: error.message,
    });
  }
});

// Get user profile
router.get('/user/:id', (req, res) => {
  try {
    const user = getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('[Auth Error] /user/:id:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal error fetching user profile',
      error: error.message,
    });
  }
});

// Update profile
router.put('/profile', (req, res) => {
  try {
    const { userId, bio, skills, github, portfolio } = req.body;
    const updated = updateUser(userId, {
      bio,
      skills: Array.isArray(skills) ? skills : (skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      github,
      portfolio,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'Profile updated successfully', user: updated });
  } catch (error) {
    console.error('[Auth Error] /profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal error updating profile',
      error: error.message,
    });
  }
});

// Sync Supabase authenticated user to in-memory store so portal features work seamlessly
// (Does NOT store or receive passwords - Supabase Auth handles authentication and passwords)
router.post('/sync-supabase', (req, res) => {
  try {
    const { id, name, email, role, institution, department, year, skills, avatar, bio, github, portfolio } = req.body;
    if (!id || !email) {
      return res.status(400).json({ success: false, message: 'id and email are required' });
    }

    let user = getUserById(id) || getUserByEmail(email);
    if (!user) {
      user = createUser({
        id,
        name: name || email.split('@')[0],
        email,
        role: role || 'student',
        institution: institution || 'Academic Institution',
        department: department || 'Engineering',
        year: year || '1st Year',
        skills: Array.isArray(skills) ? skills : [],
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        bio: bio || '',
        github: github || '',
        portfolio: portfolio || '',
        verified: true,
      });
    } else {
      user = updateUser(user.id, {
        name: name || user.name,
        role: role || user.role,
        institution: institution || user.institution,
        department: department || user.department,
        year: year || user.year,
        skills: Array.isArray(skills) ? skills : user.skills,
        avatar: avatar || user.avatar,
        bio: bio !== undefined ? bio : user.bio,
        github: github !== undefined ? github : user.github,
        portfolio: portfolio !== undefined ? portfolio : user.portfolio,
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('[Auth Error] /sync-supabase:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
