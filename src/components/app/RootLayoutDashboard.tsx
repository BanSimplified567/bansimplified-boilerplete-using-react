
import { supabase } from "@/lib/supabase";
import { Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface UserData {
  role: string | null;
  status: string | null;
  id: string | null;
}

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData>({
    role: null,
    status: null,
    id: null,
  });

  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (mounted) {
            setHasSession(false);
            setUserData({ role: null, status: null, id: null });
          }
          return;
        }

        const { data, error } = await supabase
          .from("users")
          .select("role, status, id")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (mounted) {
          setHasSession(true);
          setUserData({
            role: data?.role ?? null,
            status: data?.status ?? null,
            id: session.user.id,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);

        if (mounted) {
          setHasSession(false);
          setUserData({ role: null, status: null, id: null });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { userData, hasSession, isLoading };
};

export default function RootLayoutDashboard() {
  const { userData, hasSession, isLoading } = useUserData();

  const isActive = userData.status === "active";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-600" />
      </div>
    );
  }

  if (!hasSession || !isActive) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
