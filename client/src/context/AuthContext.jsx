import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import {
  supabase,
  signUpUser,
  signInUser,
  signInWithGoogle,
  signOutUser,
  fetchUserProfile,
  updateUserProfile,
} from '../services/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [session, setSession] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to construct normalized user object from Supabase user & profile
  const buildUserFromSupabase = useCallback(async (sbUser) => {
    if (!sbUser) return null;
    let profile = null;
    try {
      profile = await fetchUserProfile(sbUser.id);
    } catch (err) {
      console.warn('[AuthContext] fetchUserProfile error:', err);
    }

    const meta = sbUser.user_metadata || {};
    const normalized = {
      id: sbUser.id,
      name:
        profile?.full_name ||
        meta.full_name ||
        meta.name ||
        sbUser.email?.split('@')[0] ||
        'Academic User',
      email: sbUser.email,
      college: profile?.college || meta.college || meta.institution || 'Academic Institution',
      institution: profile?.college || meta.college || meta.institution || 'Academic Institution',
      department: profile?.department || meta.department || 'Engineering',
      year: profile?.year || meta.year || '1st Year',
      skills: Array.isArray(profile?.skills)
        ? profile.skills
        : Array.isArray(meta.skills)
        ? meta.skills
        : ['React', 'Python'],
      avatar:
        profile?.profile_photo ||
        meta.avatar_url ||
        meta.picture ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sbUser.email || 'user')}`,
      profile_photo: profile?.profile_photo || meta.avatar_url || meta.picture || '',
      role: profile?.role || meta.role || 'student',
      verified: true,
      bio: profile?.bio || meta.bio || '',
      github: profile?.github || meta.github || '',
      portfolio: profile?.portfolio || meta.portfolio || '',
      isSupabase: true,
    };

    // Safely sync to local server in-memory store so portal features work smoothly
    try {
      await api.syncSupabaseUser(normalized);
    } catch (syncErr) {
      console.debug('[AuthContext] syncSupabaseUser fallback note:', syncErr.message);
    }

    return normalized;
  }, []);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        // 1. Fetch personas for demo switcher
        const personasData = await api.getPersonas().catch(() => null);
        if (personasData?.success && Array.isArray(personasData.personas)) {
          if (isMounted) setPersonas(personasData.personas);
        }

        // 2. Check active Supabase session
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (initialSession?.user) {
          if (isMounted) setSession(initialSession);
          const fullUser = await buildUserFromSupabase(initialSession.user);
          if (isMounted) setCurrentUser(fullUser);
        } else {
          // If no active Supabase session, user is strictly unauthenticated
          if (isMounted) {
            setSession(null);
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error('[AuthContext] Failed to initialize auth', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    // 3. Listen to Supabase Auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (newSession?.user) {
          const userObj = await buildUserFromSupabase(newSession.user);
          if (isMounted) setCurrentUser(userObj);
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('campuslink_demo_persona');
        if (isMounted) setCurrentUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [buildUserFromSupabase]);

  // Sign In with Supabase Email & Password
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await signInUser({ email, password });
      if (data?.user) {
        const fullUser = await buildUserFromSupabase(data.user);
        setCurrentUser(fullUser);
        localStorage.removeItem('campuslink_demo_persona');
        return { success: true, user: fullUser, session: data.session };
      }
      return { success: false, message: 'Login failed. Please check credentials.' };
    } finally {
      setLoading(false);
    }
  };

  // Sign Up with Supabase Email & Password + Academic Profile
  const register = async ({
    email,
    password,
    name,
    college,
    department,
    year,
    skills,
    role = 'student',
  }) => {
    setLoading(true);
    try {
      const data = await signUpUser({
        email,
        password,
        fullName: name,
        college,
        department,
        year,
        skills,
        role,
      });

      if (data?.user) {
        const fullUser = await buildUserFromSupabase(data.user);
        setCurrentUser(fullUser);
        if (data.session) {
          setSession(data.session);
        }
        return {
          success: true,
          user: fullUser,
          session: data.session,
        };
      }
      return { success: false, message: 'Registration failed.' };
    } finally {
      setLoading(false);
    }
  };

  // Sign in / Sign up with Google OAuth
  const loginWithGoogle = async () => {
    return await signInWithGoogle();
  };

  // Sign Out / Logout
  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('campuslink_demo_persona');
      await signOutUser();
      setCurrentUser(null);
      setSession(null);
    } catch (err) {
      console.warn('[AuthContext] Sign out error:', err);
      setCurrentUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  // Switch demo persona (for hackathon story demonstration)
  const switchPersona = async (personaId) => {
    setLoading(true);
    try {
      // If signed into Supabase, sign out from Supabase first
      if (session) {
        await signOutUser().catch(() => {});
      }
      const res = await api.login({ personaId });
      if (res?.success) {
        setCurrentUser(res.user);
        localStorage.setItem('campuslink_demo_persona', personaId);
      }
    } catch (err) {
      console.error('[AuthContext] Failed to switch persona', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user profile
  const refreshUser = async () => {
    if (!currentUser) return;
    try {
      if (currentUser.isSupabase && session?.user) {
        const fullUser = await buildUserFromSupabase(session.user);
        setCurrentUser(fullUser);
      } else {
        const res = await api.getUserProfile(currentUser.id);
        if (res?.success) {
          setCurrentUser(res.user);
        }
      }
    } catch (err) {
      console.error('[AuthContext] Failed to refresh user', err);
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
    if (!currentUser) return;
    try {
      if (currentUser.isSupabase) {
        // Update in Supabase PostgreSQL profiles table
        await updateUserProfile(currentUser.id, {
          full_name: updates.name || currentUser.name,
          college: updates.college || updates.institution || currentUser.college,
          department: updates.department || currentUser.department,
          year: updates.year || currentUser.year,
          skills: updates.skills || currentUser.skills,
          profile_photo: updates.avatar || currentUser.avatar,
        });

        // Sync with local backend
        await api.syncSupabaseUser({
          id: currentUser.id,
          ...currentUser,
          ...updates,
        });

        const refreshed = {
          ...currentUser,
          ...updates,
        };
        setCurrentUser(refreshed);
        return { success: true, user: refreshed };
      } else {
        const res = await api.updateProfile({ userId: currentUser.id, ...updates });
        if (res?.success) {
          setCurrentUser(res.user);
        }
        return res;
      }
    } catch (err) {
      console.error('[AuthContext] Failed to update profile', err);
      throw err;
    }
  };

  // Compatibility helper for legacy OTP step
  const verifyOtp = async (otp) => {
    if (!currentUser) return;
    const res = await api.verifyOtp(currentUser.id, otp);
    if (res?.success) {
      setCurrentUser(res.user);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        session,
        personas,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        switchPersona,
        refreshUser,
        updateProfile,
        verifyOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
