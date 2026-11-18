import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { buildRedirect } from '@/utils/redirect';
import { useEffect, useState } from 'react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Load saved email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: buildRedirect('/auth/callback'),
        shouldCreateUser: false, // if registration is separate
      },
    });
    if (error) throw error;
    // show "Check your email" state instead of alert
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
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: buildRedirect('/auth/callback'),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: false,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError((err as Error).message);
    } finally {
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
        redirectTo: buildRedirect('/reset-password'),
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
    <div className="min-h-screen w-full bg-[#f2f1f3] relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(203,199,209,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(203,199,209,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Dual Gradient Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle 500px at 20% 100%, rgba(150,144,162,0.25), transparent),
            radial-gradient(circle 500px at 100% 80%, rgba(124,116,139,0.2), transparent),
            radial-gradient(circle 400px at 0% 0%, rgba(203,199,209,0.15), transparent)
          `,
        }}
      />

      {/* Two Container Layout */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-center gap-6">
        {/* LEFT CONTAINER - Branding Panel (hidden on mobile) */}
        <div className="hidden md:flex flex-col justify-between w-full max-w-sm h-[540px] relative">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-[#322e38]/40 via-transparent to-[#9690a2]/30 rounded-3xl blur-xl opacity-60" />
          <div className="relative h-full bg-[#322e38]/95 backdrop-blur-xl rounded-2xl p-8 shadow-[0_25px_80px_-20px_rgba(25,23,28,0.25)] border border-[#4a4653]/50 flex flex-col justify-between overflow-hidden">
            {/* Decorative gradient */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  radial-gradient(circle 300px at 20% 100%, rgba(150,144,162,0.6), transparent),
                  radial-gradient(circle 300px at 100% 0%, rgba(124,116,139,0.5), transparent)
                `,
              }}
            />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#f2f1f3]/10 mb-6 ring-1 ring-[#f2f1f3]/20">
                <svg className="w-5 h-5 text-[#f2f1f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-[#f2f1f3] tracking-tight leading-snug">
                Welcome back to your dashboard
              </h1>
              <p className="text-sm text-[#cbc7d1] mt-3 leading-relaxed">
                Sign in to manage your projects, track progress, and collaborate with your team.
              </p>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#cbc7d1]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9690a2]" />
                Secure authentication
              </div>
              <div className="flex items-center gap-3 text-xs text-[#cbc7d1]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9690a2]" />
                Trusted by thousands
              </div>
              <div className="flex items-center gap-3 text-xs text-[#cbc7d1]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9690a2]" />
                24/7 support
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTAINER - Login Form */}
        <div className="w-full max-w-sm">
          {/* Card Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-[#cbc7d1]/50 via-transparent to-[#9690a2]/30 rounded-3xl blur-xl opacity-60" />

          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-[0_25px_80px_-20px_rgba(25,23,28,0.12)] border border-[#e5e3e8]/80">
            {/* Header */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#322e38] mb-4 shadow-lg shadow-[#322e38]/20 ring-1 ring-[#19171c]/10 md:hidden">
                <svg className="w-5 h-5 text-[#f2f1f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#19171c] tracking-tight">Welcome back</h2>
              <p className="text-xs text-[#7c748b] mt-1.5">Sign in to continue to your dashboard</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-[#322e38]/5 border border-[#cbc7d1]/60 text-[#4a4653] rounded-xl px-4 py-2.5 text-xs flex items-start gap-2 animate-in">
                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-[11px] font-medium text-[#635d6f] uppercase tracking-wider mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-xl border border-[#e5e3e8] bg-white/60 px-4 py-2.5 text-sm text-[#19171c] placeholder:text-[#b0acb9] focus:outline-none focus:ring-2 focus:ring-[#9690a2]/30 focus:border-[#9690a2] focus:bg-white transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#635d6f] border-[#cbc7d1] rounded focus:ring-[#9690a2]/40 focus:ring-2 transition"
                  />
                  <span className="ml-2 text-xs text-[#7c748b] group-hover:text-[#4a4653] transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-[#7c748b] hover:text-[#322e38] transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full bg-[#322e38] hover:bg-[#19171c] active:bg-[#111013] text-[#f2f1f3] font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-[#322e38]/20 hover:shadow-[#322e38]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send confirmation email'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#cbc7d1] to-transparent" />
              <span className="text-[10px] uppercase tracking-widest text-[#b0acb9] font-medium">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#cbc7d1] to-transparent" />
            </div>

            {/* OAuth */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => handleOAuthLogin('github')}
                disabled={loading}
                className="w-full border border-[#e5e3e8] bg-white/60 text-[#4a4653] rounded-xl py-2.5 hover:bg-[#f2f1f3] hover:border-[#cbc7d1] active:bg-[#e5e3e8] transition-all duration-200 text-sm flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0.5C5.37 0.5 0 5.87 0 12.5c0 5.28 3.438 9.75 8.205 11.325.6.113.82-.262.82-.58 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61C4.42 18.07 3.633 17.7 3.633 17.7c-1.086-.743.083-.728.083-.728 1.204.085 1.837 1.237 1.837 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.311.469-2.381 1.237-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.48 11.48 0 0 1 3.004-.404c1.02.005 2.047.138 3.004.404 2.291-1.552 3.297-1.23 3.297-1.23.656 1.652.244 2.873.12 3.176.77.84 1.235 1.91 1.235 3.221 0 4.61-2.807 5.623-5.48 5.921.43.372.816 1.103.816 2.222 0 1.604-.014 2.898-.014 3.293 0 .321.216.699.825.58C20.565 22.246 24 17.776 24 12.5 24 5.87 18.627 0.5 12 0.5z" />
                </svg>
                Continue with GitHub
              </button>

              <button
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
                className="w-full border border-[#e5e3e8] bg-white/60 text-[#4a4653] rounded-xl py-2.5 hover:bg-[#f2f1f3] hover:border-[#cbc7d1] active:bg-[#e5e3e8] transition-all duration-200 text-sm flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Footer */}
            <p className="text-center text-xs text-[#9690a2] mt-6">
              New here?{' '}
              <a href="/register" className="text-[#4a4653] font-semibold hover:text-[#19171c] transition-colors underline-offset-2 hover:underline">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
