import type { AuthUser, Profile, User, UserData } from '@/types/users';
import type { Session } from '@supabase/supabase-js';
export declare function getOAuthRedirectUrl(): string;
export declare function signInWithOAuth(provider: 'google' | 'github'): Promise<void>;
export declare function finalizeOAuthSignIn(code: string): Promise<{
    session: Session;
    user: AuthUser;
}>;
export declare const saveUserDataToLocalStorage: (userData: UserData) => void;
export declare const getUserDataFromLocalStorage: () => UserData | null;
export declare const clearUserDataFromLocalStorage: () => void;
export interface PendingOAuthSignupData {
    firstname?: string;
    lastname?: string;
    phone?: string;
    address?: string;
    city?: string;
    zipcode?: string;
    [key: string]: any;
}
export declare const savePendingOAuthSignup: (formData: PendingOAuthSignupData) => void;
export declare const getPendingOAuthSignup: () => PendingOAuthSignupData | null;
export declare const clearPendingOAuthSignup: () => void;
export declare const saveRememberMePreference: (remember: boolean) => void;
export declare const shouldRememberUser: () => boolean;
export declare function ensureUserProfile(session: Session, formData?: Partial<User> | null): Promise<User>;
export declare function convertProfileToUser(profile: Profile | User): User;
export declare const saveUserIfRemember: (user: User) => void;
export declare const hasAdminDashboardAccess: (role: string, status?: string) => boolean;
export declare function getCurrentUser(): Promise<UserData | null>;
export declare function signOut(): Promise<void>;
export declare function isValidUserData(data: any): data is UserData;
export declare function getUserFullName(user: User | UserData): string;
