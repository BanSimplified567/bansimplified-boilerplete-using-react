import { supabase } from "@/lib/supabase";

export const getUserProfile = async () => {
    // Get authenticated user
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return {
            user: null,
            profile: null,
            error: authError
        };
    }

    // Get user profile
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return {
        user,
        profile,
        error
    };
};
