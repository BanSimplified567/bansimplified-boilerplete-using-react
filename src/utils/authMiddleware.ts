// utils/authMiddleware.ts
import { supabase } from "@/lib/supabase";
import { redirectByRole } from "@/utils/redirect";
import { ensureUserProfile, saveUserIfRemember } from "@/utils/user";
import { redirect } from "@tanstack/react-router";

interface AuthSuccessResponse {
    token: string;
    role: string;
    [key: string]: any;
}

export const authMiddleware = async (pathname: string): Promise<AuthSuccessResponse | null> => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    // Define public paths that don't require authentication
    const publicPaths = ["/", "/register", "/auth/callback", "/privacy", "/terms"];

    const isPublicPath = publicPaths.includes(pathname) ||
                        pathname.startsWith('/privacy') ||
                        pathname.startsWith('/terms');

    if (sessionError || !session) {
        if (isPublicPath) return null;
        throw redirect({ to: "/" });
    }

    // Get or create user profile
const user = await ensureUserProfile(session);

if (user.status !== 'active') {
  await supabase.auth.signOut();
  throw redirect({ to: '/' });
}

const resolvedRole = user.role || 'customer';

saveUserIfRemember(user);

    const homePath = redirectByRole(resolvedRole);
    const isElevatedUser = ['admin', 'manager', 'staff'].includes(resolvedRole);

    // Handle root path redirects
    if (pathname === "/") {
        if (isElevatedUser) {
            throw redirect({ to: '/dashboard' });
        }
        return { token: session.access_token, role: resolvedRole, user };
    }

    // Handle dashboard paths
    if (pathname.startsWith("/dashboard")) {
        if (!isElevatedUser) {
            throw redirect({ to: homePath });
        }
        return { token: session.access_token, role: resolvedRole, user };
    }

    // If user is logged in and trying to access login/register, redirect to home
    if (pathname === "/" || pathname === "/register") {
        throw redirect({ to: homePath });
    }

    // For authenticated users accessing other pages
    return { token: session.access_token, role: resolvedRole, user };
};
