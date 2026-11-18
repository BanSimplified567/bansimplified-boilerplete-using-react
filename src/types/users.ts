
// =========================================
// USER TYPES
// =========================================

export type Username = string;

// =========================================
// USER ROLE AND STATUS
// =========================================

export type UserRole =
  | 'customer'
  | 'staff'
  | 'admin'
  | 'manager';

export type UserStatus =
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'pending';

// =========================================
// SUPABASE AUTH USER
// =========================================

export interface AuthUser {
  id: string;
  aud: string;
  role: string;
  email?: string | null;
  phone?: string | null;

  app_metadata: {
    provider?: string;
    providers?: string[];
    [key: string]: any;
  };

  user_metadata: {
    firstname?: string;
    lastname?: string;
    full_name?: string;
    name?: string;
    username?: string;
    avatar_url?: string;
    picture?: string;
    phone?: string;
    address?: string;
    city?: string;
    zipcode?: string;
    [key: string]: any;
  };

  created_at: string;
  updated_at?: string;
  last_sign_in_at?: string;
}

// =========================================
// SUPABASE DATABASE PROFILE
// Matches public.profiles
// =========================================

export interface Profile {
  id: string;
  username: string | null;

  firstname: string | null;
  lastname: string | null;
  full_name: string | null;

  email: string | null;
  avatar_url: string | null;

  phone_number: string | null;
  address: string | null;
  city: string | null;
  zipcode: string | null;

  role: UserRole;
  status: UserStatus;

  created_at: string;
  updated_at: string;
}

// =========================================
// APPLICATION USER
// Used throughout your React application
// =========================================

export interface User {
  id: string;
  username?: string | null;

  firstname?: string | null;
  lastname?: string | null;
  full_name?: string | null;

  email: string;

  avatar_url?: string | null;
  phone?: string | null;

  address?: string | null;
  city?: string | null;
  zipcode?: string | null;

  role: UserRole;
  status: UserStatus;

  created_at?: string;
  updated_at?: string;
}

// =========================================
// MINIMAL USER DATA
// Used for localStorage and authentication
// =========================================

export type UserData = Pick<
  User,
  | 'id'
  | 'firstname'
  | 'lastname'
  | 'email'
  | 'role'
  | 'status'
>;
