import { supabase } from '@/lib/supebase';
import { buildRedirect } from '@/utils/redirect';
import { redirectByRole } from '@/utils/redirectByRole';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';


const SignupForm: React.FC = () => {
  // Form states matching your users table structure
  const [email, setEmail] = useState<string>('');
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');


  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        navigate(redirectByRole(data?.role), { replace: true });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  // Handle OAuth callback
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setError('OAuth registration failed. Please try again.');
      navigate('/signup', { replace: true });
      return;
    }

    if (code) {
      setLoading(true);
      supabase.auth.exchangeCodeForSession(code).finally(() => setLoading(false));
    }
  }, [searchParams, navigate]);

  const validateForm = (): boolean => {
    setError(null);

    if (!email || !firstname || !lastname) {
      setError('Please fill in all required fields (marked with *).');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!acceptTerms) {
      setError('Please accept the Terms & Conditions to continue.');
      return false;
    }

    return true;
  };

  const handleMagicLinkSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            firstname,
            lastname,

            role: 'customer',
          },
          emailRedirectTo: buildRedirect('/auth/callback')
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess('Magic link sent! Please check your email to complete registration.');

      setTimeout(() => {
        setEmail('');
        setFirstname('');
        setLastname('');

        setAcceptTerms(false);
      }, 3000);

    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);

    const formData = {
      firstname,
      lastname,
    };

    localStorage.setItem('pendingOAuthSignup', JSON.stringify(formData));

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        localStorage.removeItem('pendingOAuthSignup');
        throw error;
      }

    } catch (err) {
      localStorage.removeItem('pendingOAuthSignup');
      setError((err as Error).message);
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-sm text-gray-600">
            Sign up to get started with your account
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && !success && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleMagicLinkSignup} className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                id="firstname"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                placeholder="John"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                id="lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                placeholder="Doe"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50"
              disabled={loading}
            />
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              disabled={loading}
            />
            <label htmlFor="terms" className="text-sm text-gray-700 leading-tight">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-3.5 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Sending...' : 'Sign Up with Email'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-4 text-sm text-gray-500">or continue with</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleOAuthSignup('github')}
            disabled={loading}
            className="w-full border border-gray-300 text-gray-700 rounded-lg py-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition text-sm flex items-center justify-center gap-3 disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0.5C5.37 0.5 0 5.87 0 12.5c0 5.28 3.438 9.75 8.205 11.325.6.113.82-.262.82-.58 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61C4.42 18.07 3.633 17.7 3.633 17.7c-1.086-.743.083-.728.083-.728 1.204.085 1.837 1.237 1.837 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.311.469-2.381 1.237-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.48 11.48 0 0 1 3.004-.404c1.02.005 2.047.138 3.004.404 2.291-1.552 3.297-1.23 3.297-1.23.656 1.652.244 2.873.12 3.176.77.84 1.235 1.91 1.235 3.221 0 4.61-2.807 5.623-5.48 5.921.43.372.816 1.103.816 2.222 0 1.604-.014 2.898-.014 3.293 0 .321.216.699.825.58C20.565 22.246 24 17.776 24 12.5 24 5.87 18.627 0.5 12 0.5z"/>
            </svg>
            Continue with GitHub
          </button>

          <button
            onClick={() => handleOAuthSignup('google')}
            disabled={loading}
            className="w-full border border-gray-300 text-gray-700 rounded-lg py-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition text-sm flex items-center justify-center gap-3 disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-4">
            Already have an account?{' '}
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
              Sign in here
            </Link>
          </p>

          <div className="flex justify-center space-x-5">
            <a href="/terms" className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors">
              Terms
            </a>
            <a href="/privacy" className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors">
              Privacy
            </a>
            <a href="/contact" className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
