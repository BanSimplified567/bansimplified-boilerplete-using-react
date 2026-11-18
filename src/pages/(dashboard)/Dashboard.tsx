import { getUserProfile } from "@services/authService";
import { useEffect, useState } from "react";

interface Profile {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    phone_number: string | null;
    role: "user" | "admin";
}

export default function Dashboard() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { profile, error } = await getUserProfile();

            if (error) {
                console.error(error);
            } else {
                setProfile(profile as Profile | null);
            }

            setLoading(false);
        };

        fetchProfile();
    }, []);

    if (loading) return <p>Loading...</p>;

    if (!profile) return <p>Profile not found.</p>;

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {profile.full_name || "User"}!</p>
            <p>Role: {profile.role}</p>
        </div>
    );
}
