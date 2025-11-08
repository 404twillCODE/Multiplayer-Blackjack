import { createClient } from '@supabase/supabase-js';

// These should be set as environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || !supabaseUrl.startsWith('http')) {
  console.error('❌ REACT_APP_SUPABASE_URL is not set or invalid. Please check your .env file.');
  throw new Error('Supabase URL is not configured. Please set REACT_APP_SUPABASE_URL in your .env file.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  console.error('❌ REACT_APP_SUPABASE_ANON_KEY is not set or invalid. Please check your .env file.');
  throw new Error('Supabase anon key is not configured. Please set REACT_APP_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'sb-auth-token'
  }
});

