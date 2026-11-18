import { createClient } from '@supabase/supabase-js';

// Pull Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'auth',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  },
});

console.log('Supabase URL:', supabaseUrl);
console.log('Publishable Key exists:', !!supabaseAnonKey);

