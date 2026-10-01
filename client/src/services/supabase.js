import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://bhkccrglfrkiynryobsy.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoa2NjcmdsZnJraXlucnlvYnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MTMyODQsImV4cCI6MjEwNjE4OTI4NH0.n-II5PdQoN6TuefF3wJQglCHLTM5ahMpnubAMD9rp1g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Sign up a user with email and password, plus profile metadata
 */
export async function signUpUser({ email, password, fullName, college, department, year, skills, role = 'student' }) {
  const skillsArray = Array.isArray(skills)
    ? skills
    : (skills || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        college,
        department,
        year,
        skills: skillsArray,
        role,
      },
    },
  });

  if (error) throw error;

  let session = data?.session;
  let user = data?.user;

  // If session is not immediately returned in signUp, auto sign-in to guarantee an active session
  if (!session && user && password) {
    try {
      const signInRes = await supabase.auth.signInWithPassword({ email, password });
      if (signInRes?.data?.session) {
        session = signInRes.data.session;
        user = signInRes.data.user;
      }
    } catch (signInErr) {
      console.debug('[signUpUser auto-signIn notice]:', signInErr.message);
    }
  }

  // If user object returned, also ensure profile record is synced in public.profiles
  if (user) {
    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName || user.email?.split('@')[0],
        email: user.email,
        college: college || '',
        department: department || '',
        year: year || '',
        skills: skillsArray,
        role,
        updated_at: new Date().toISOString(),
      });
    } catch (upsertErr) {
      console.warn('[Supabase Profile Upsert Warning]:', upsertErr);
    }
  }

  return { user, session };
}

/**
 * Sign in user with email and password
 */
export async function signInUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in / Sign up with Google OAuth
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out user
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Fetch profile from public.profiles table
 */
export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('[Supabase Fetch Profile Error]:', error);
    return null;
  }
  return data;
}

/**
 * Update user profile in public.profiles table
 */
export async function updateUserProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
