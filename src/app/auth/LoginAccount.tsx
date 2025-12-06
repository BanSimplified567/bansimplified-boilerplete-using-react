import { supabase } from '@/lib/supebase';
import { buildRedirect } from '@/utils/redirect';
import { useState } from 'react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: buildRedirect('/auth/callback'),
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      alert('Check your email for the login link!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  const handleOAuthLogin = async (provider: 'google' | 'github') => {

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        },
      });
      if (error) throw error;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setError(null);
        alert('Password reset link sent to your email!');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-6 space-y-5">

        {/* Header */ }
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Error Message */ }
        { error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-md px-3 py-2 text-xs">
            { error }
          </div>
        ) }

        {/* Form */ }
        <form onSubmit={ handleEmailLogin } className="space-y-3">

          {/* Email */ }
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              value={ email }
              onChange={ (e) => setEmail(e.target.value) }
              placeholder="example@gmail.com...."
              required
              autoComplete="email"
            />
          </div>

          {/* Submit Button */ }

          <button
            type="submit"
            disabled={ loading }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            { loading ? 'Sending...' : 'Send Confirmation Email' }
          </button>


          {/* Forgot */ }
          <div className="flex justify-end">
            <button
              type="button"
              onClick={ handleForgotPassword }
              className="text-xs text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>


        </form>

        {/* Divider */ }
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* OAuth */ }
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={ () => handleOAuthLogin('github') }
            disabled={ loading }
           className="flex-1 border border-gray-300 text-gray-700 rounded-md py-2.5 hover:bg-gray-50 transition text-sm flex items-center justify-center gap-2"

          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0.5C5.37 0.5 0 5.87 0 12.5c0 5.28 3.438 9.75 8.205 11.325.6.113.82-.262.82-.58 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61C4.42 18.07 3.633 17.7 3.633 17.7c-1.086-.743.083-.728.083-.728 1.204.085 1.837 1.237 1.837 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.311.469-2.381 1.237-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.48 11.48 0 0 1 3.004-.404c1.02.005 2.047.138 3.004.404 2.291-1.552 3.297-1.23 3.297-1.23.656 1.652.244 2.873.12 3.176.77.84 1.235 1.91 1.235 3.221 0 4.61-2.807 5.623-5.48 5.921.43.372.816 1.103.816 2.222 0 1.604-.014 2.898-.014 3.293 0 .321.216.699.825.58C20.565 22.246 24 17.776 24 12.5 24 5.87 18.627 0.5 12 0.5z" />
            </svg>
            Continue with GitHub
          </button>

          <button
            onClick={ () => handleOAuthLogin('google') }
            disabled={ loading }
           className="flex-1 border border-gray-300 text-gray-700 rounded-md py-2.5 hover:bg-gray-50 transition text-sm flex items-center justify-center gap-2"

          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer */ }
        <p className="text-center text-xs text-gray-500">
          New here?{ ' ' }
          <a href="/signup" className="text-blue-600 font-medium hover:underline">
            Create an account
          </a>
        </p>

      </div>
    </div>
  );
};

export default LoginForm;
