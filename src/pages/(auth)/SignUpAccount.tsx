import { supabase } from '@/lib/supabase';
import { buildRedirect } from '@/utils/redirect';
import { Link } from '@tanstack/react-router';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const validateForm = (): boolean => {
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
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
        email: email.trim(),
        options: {
          emailRedirectTo: buildRedirect('/auth/callback'),
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess('Magic link sent! Please check your email to complete registration.');
      setTimeout(() => {
        setEmail('');
        setAcceptTerms(false);
      }, 3000);
    } catch (err) {
      setError(
        (err as Error).message || 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || Boolean(success);

  return (
    // Background container with the exact Dot Pattern
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 font-sans text-slate-900 overflow-hidden">

      {/*
        The Dot Pattern Background
        We use a radial-gradient for the dots, and an optional mask to create the soft vignette fade
        seen in the edges of your reference image.
      */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)'
        }}
      />

      {/* Main Content Container */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center z-10">

        {/* Top Pill */}
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-slate-900 animate-pulse" />
          Now in public beta
        </div>

        {/* Hero Typography */}
        <div className="text-center mb-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-6 text-balance">
            Sign up today.
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-xl mx-auto text-balance">
            Enter your email to receive a secure magic link and get started instantly.
          </p>
        </div>

        {/* Alerts */}
        {success && (
          <div
            role="status"
            className="w-full max-w-md mb-8 flex items-start justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {error && !success && (
          <div
            role="alert"
            className="w-full max-w-md mb-8 flex items-start justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Area */}
        <form onSubmit={handleMagicLinkSignup} className="w-full max-w-md flex flex-col items-center space-y-6" noValidate>

          <div className="w-full space-y-2">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-full border border-slate-300 bg-white/80 backdrop-blur-sm px-6 py-4 text-center text-base text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:cursor-not-allowed disabled:bg-slate-50"
              disabled={isDisabled}
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 w-full px-2">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 focus:ring-offset-0 disabled:cursor-not-allowed"
              disabled={isDisabled}
            />
            <label htmlFor="terms" className="text-sm text-slate-500 leading-relaxed text-left">
              I agree to the{' '}
              <a href="/terms" className="font-medium text-slate-900 hover:underline">
                Terms &amp; Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="font-medium text-slate-900 hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isDisabled}
            className="group w-full flex items-center justify-center gap-2 rounded-full bg-slate-900 py-4 text-base font-medium text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 mt-2"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
            {loading ? 'Sending magic link...' : 'Create account'}
            {!loading && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />}
          </button>

        </form>

        {/* Footer Links */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/" className="font-medium text-slate-900 hover:underline">
              Sign in here
            </Link>
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="/terms" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="/contact" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignupForm;
