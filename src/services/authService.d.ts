export declare const getUserProfile: () => Promise<{
    user: null;
    profile: null;
    error: import("@supabase/auth-js").AuthError | null;
} | {
    user: import("@supabase/auth-js").User;
    profile: any;
    error: import("@supabase/postgrest-js").PostgrestError | null;
}>;
