// src/utils/user.ts
import { supabase } from '@/lib/supabase';
import type { AuthUser, Profile, User, UserData } from '@/types/users';
import type { Session } from '@supabase/supabase-js';

/* --------------------------- OAuth Helpers --------------------------- */
export function getOAuthRedirectUrl(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/auth/callback`;
}

export async function signInWithOAuth(provider: 'google' | 'github'): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getOAuthRedirectUrl(),
      queryParams: provider === 'google' ? { access_type: 'offline', prompt: 'consent' } : undefined,
    },
  });

  if (error) throw error;
}

export async function finalizeOAuthSignIn(code: string): Promise<{ session: Session; user: AuthUser }> {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;

  if (!data.session || !data.user) {
    throw new Error('Invalid session data returned');
  }

  return {
    session: data.session,
    user: data.user as AuthUser,
  };
}

/* --------------------------- LocalStorage Helpers --------------------------- */
const STORAGE_KEYS = {
  USER_DATA: 'userData',
  PENDING_OAUTH_SIGNUP: 'pendingOAuthSignup',
  REMEMBER_ME: 'rememberMe',
} as const;

const isBrowser = (): boolean => typeof window !== 'undefined';

export const saveUserDataToLocalStorage = (userData: UserData): void => {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

export const getUserDataFromLocalStorage = (): UserData | null => {
  if (!isBrowser()) return null;

  const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);

    // Validate the structure
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'id' in parsed &&
      'email' in parsed &&
      'role' in parsed &&
      'status' in parsed
    ) {
      return parsed as UserData;
    }

    // Invalid structure, clean up
    clearUserDataFromLocalStorage();
    return null;
  } catch {
    // Invalid JSON, clean up
    clearUserDataFromLocalStorage();
    return null;
  }
};

export const clearUserDataFromLocalStorage = (): void => {
  if (!isBrowser()) return;

  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export interface PendingOAuthSignupData {
  firstname?: string;
  lastname?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipcode?: string;
  [key: string]: any;
}

export const savePendingOAuthSignup = (formData: PendingOAuthSignupData): void => {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.PENDING_OAUTH_SIGNUP, JSON.stringify(formData));
};

export const getPendingOAuthSignup = (): PendingOAuthSignupData | null => {
  if (!isBrowser()) return null;

  const data = localStorage.getItem(STORAGE_KEYS.PENDING_OAUTH_SIGNUP);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    clearPendingOAuthSignup();
    return null;
  }
};

export const clearPendingOAuthSignup = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.PENDING_OAUTH_SIGNUP);
};

export const saveRememberMePreference = (remember: boolean): void => {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, remember.toString());
};

export const shouldRememberUser = (): boolean => {
  if (!isBrowser()) return false;
  return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
};

/* --------------------------- Profile Helpers --------------------------- */

export async function ensureUserProfile(
  session: Session,
  formData: Partial<User> | null = null
): Promise<User> {
  if (!session?.user?.id) {
    throw new Error('Invalid session: No user ID found');
  }

  const userId = session.user.id;
  const metadata = session.user.user_metadata ?? {};

  // Check existing profile
  const { data: existing, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    return {
      ...existing,
      firstname: existing.firstname ?? '',
      lastname: existing.lastname ?? '',
      email: existing.email ?? session.user.email ?? '',
      phone: existing.phone_number ?? null,
    } as User;
  }

  // Extract name information
  const fullName =
    metadata.full_name ??
    metadata.name ??
    '';

  const nameParts = fullName.split(' ');
  const firstname =
    formData?.firstname ??
    metadata.firstname ??
    nameParts[0] ??
    'User';

  const lastname =
    formData?.lastname ??
    metadata.lastname ??
    nameParts.slice(1).join(' ') ??
    '';

  const profile = {
    id: userId,
    username: metadata.username ?? null,
    firstname,
    lastname,
    full_name: `${firstname} ${lastname}`.trim(),
    email: session.user.email ?? '',
    avatar_url: metadata.avatar_url ?? metadata.picture ?? null,
    phone_number: formData?.phone ?? metadata.phone ?? null,
    address: formData?.address ?? metadata.address ?? null,
    city: formData?.city ?? metadata.city ?? null,
    zipcode: formData?.zipcode ?? metadata.zipcode ?? null,
    role: 'customer',
    status: 'active',
  };

  const { data: inserted, error: insertError } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (insertError) {
    console.error('Error creating user profile:', insertError);
    throw insertError;
  }

  return {
    ...inserted,
    phone: inserted.phone_number,
  } as User;
}


export function convertProfileToUser(profile: Profile | User): User {
  const phone = (profile as Profile).phone_number ?? (profile as User).phone ?? null;
  return {
    id: profile.id,
    username: profile.username ?? null,

    firstname: profile.firstname ?? null,
    lastname: profile.lastname ?? null,
    full_name: profile.full_name ?? null,

    email: profile.email ?? '',

    avatar_url: profile.avatar_url ?? null,
    phone: phone,

    address: profile.address ?? null,
    city: profile.city ?? null,
    zipcode: profile.zipcode ?? null,

    role: profile.role,
    status: profile.status,

    created_at: profile.created_at ?? undefined,
    updated_at: profile.updated_at ?? undefined,
  };
}
export const saveUserIfRemember = (user: User): void => {
  if (shouldRememberUser() && user) {
    saveUserDataToLocalStorage(convertProfileToUser(user));
  }
};

export const hasAdminDashboardAccess = (
  role: string,
  status: string = 'active'
): boolean => {
  const adminRoles = ['admin', 'manager', 'staff'];
  return adminRoles.includes(role) && status === 'active';
};

/* --------------------------- Current User --------------------------- */
export async function getCurrentUser(): Promise<UserData | null> {
  // Try to get from localStorage first
  const saved = getUserDataFromLocalStorage();
  if (saved) return saved;

  // No saved data, check session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Error getting session:', sessionError);
    return null;
  }

  if (!session?.user?.id) {
    return null;
  }

  try {
    // Fetch user profile from database
    const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('id, firstname, lastname, email, role, status, phone_number')
  .eq('id', session.user.id)
  .single();

 if (profileError || !profile) {
  console.error('Error fetching user profile:', profileError);
  return null;
}

    const userData = convertProfileToUser(profile as Profile);

    // Save to localStorage if remember me is enabled
    if (shouldRememberUser()) {
      saveUserDataToLocalStorage(userData);
    }

    return userData;
  } catch (error) {
    console.error('Unexpected error in getCurrentUser:', error);
    return null;
  }
}

/* --------------------------- Logout Helper --------------------------- */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }

  clearUserDataFromLocalStorage();
}

/* --------------------------- User Validation --------------------------- */
export function isValidUserData(data: any): data is UserData {
  return (
    data &&
    typeof data === 'object' &&
    'id' in data &&
    'email' in data &&
    typeof data.email === 'string' &&
    'role' in data &&
    'status' in data
  );
}

export function getUserFullName(user: User | UserData): string {
  const parts = [user.firstname, user.lastname].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : user.email;
}
