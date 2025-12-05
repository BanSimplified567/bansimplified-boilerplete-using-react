// hooks/useLogout.ts
import { supabase } from '@/lib/supebase';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
      return;
    }

    // Success: redirect to login
    navigate('/', { replace: true });
  };

  return logout;
};
