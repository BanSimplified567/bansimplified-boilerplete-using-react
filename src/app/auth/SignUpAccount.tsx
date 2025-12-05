import { supabase } from '@/lib/supebase';
import { Building, Hash, Loader2, Mail, MapPin, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const SignupForm: React.FC = () => {
  // Form states matching your users table structure
  const [email, setEmail] = useState<string>('');
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [zipcode, setZipcode] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/dashboard', { replace: true });
      }
    });
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
    // Clear previous errors
    setError(null);

    // Check required fields
    if (!email || !firstname || !lastname) {
      setError('Please fill in all required fields (marked with *).');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Validate phone if provided
    if (phone && phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number.');
      return false;
    }

    // Check terms acceptance
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
      // Sign up with magic link (passwordless) - creates user if not exists upon link click
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            firstname,
            lastname,
            phone: phone || null,
            address: address || null,
            city: city || null,
            zipcode: zipcode || null,
            role: 'customer', // Default role as per your table
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // Success - show confirmation message
      setSuccess('🎉 Magic link sent! Please check your email to complete registration.');

      // Auto-clear form after successful submission
      setTimeout(() => {
        setEmail('');
        setFirstname('');
        setLastname('');
        setPhone('');
        setAddress('');
        setCity('');
        setZipcode('');
        setAcceptTerms(false);
      }, 3000);

    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: 'google') => {
    setLoading(true);
    setError(null);
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
      if (error) throw error;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  // Auto-format phone number
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-black opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Glassmorphic Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Hotel Logo / Brand */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Ban<span className="text-amber-400"> State Of Hotel</span>
            </h1>
            <p className="text-white/70 mt-2 text-sm tracking-wider uppercase">Create Your Guest Account</p>
          </div>

          <h2 className="text-2xl font-light text-white text-center mb-6 tracking-wide">
            Join Our Luxury Experience
          </h2>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded-xl text-sm text-center backdrop-blur-sm animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">✨</span>
                {success}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !success && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleMagicLinkSignup} className="space-y-5">
            {/* Two-column layout for name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="relative">
                <User className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                <input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  placeholder="First Name *"
                  className="w-full pl-12 pr-5 py-3.5 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm"
                  disabled={loading}
                />
              </div>

              {/* Last Name */}
              <div className="relative">
                <User className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  placeholder="Last Name *"
                  className="w-full pl-12 pr-5 py-3.5 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-5 w-5 text-white/60" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address *"
                className="w-full pl-12 pr-5 py-3.5 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm"
                disabled={loading}
              />
            </div>

            {/* Contact Information Section */}
            <div className="pt-4 border-t border-white/20">
              <h3 className="text-white/80 font-medium mb-4 text-lg">Contact Information (Optional)</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    placeholder="Phone Number"
                    className="w-full pl-12 pr-5 py-3.5 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm"
                    disabled={loading}
                    maxLength={14}
                  />
                </div>

                {/* City */}
                <div className="relative">
                  <Building className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full pl-12 pr-5 py-3.5 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Address */}
                <div className="relative md:col-span-2">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Address"
                    className="w-full pl-12 pr-5 py-3.5 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm"
                    disabled={loading}
                  />
                </div>

                {/* Zip Code */}
                <div className="relative">
                  <Hash className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                  <input
                    id="zipcode"
                    type="text"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    placeholder="Zip/Postal Code"
                    className="w-full pl-12 pr-5 py-3.5 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm"
                    disabled={loading}
                    maxLength={10}
                  />
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/30 bg-white/10 text-amber-500 focus:ring-amber-400 focus:ring-offset-0"
                disabled={loading}
              />
              <label htmlFor="terms" className="text-sm text-white/80">
                I agree to the{' '}
                <a href="/terms" className="text-amber-400 hover:underline">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-amber-400 hover:underline">
                  Privacy Policy
                </a>
                . I understand that my data will be processed to manage my bookings and enhance my hotel experience.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending Magic Link...
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5" />
                  Sign Up with Email
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center justify-center">
            <div className="h-px bg-white/20 w-full"></div>
            <span className="px-4 text-white/50 text-sm">or sign up with</span>
            <div className="h-px bg-white/20 w-full"></div>
          </div>

          {/* Social Signup Buttons */}
          <div className="mt-6">
            <button
              onClick={() => handleOAuthSignup('google')}
              disabled={loading}
              className="w-full py-3.5 bg-white text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center justify-center gap-3 group"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>

          <p className="text-center text-white/60 text-xs mt-8">
            By creating an account, you'll enjoy:
            <br />
            <span className="text-amber-300/80">✓ Faster bookings • ✓ Exclusive offers • ✓ Personalized experiences</span>
          </p>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="/terms" className="text-white/40 hover:text-white/60 text-xs transition-colors">
              Terms
            </a>
            <a href="/privacy" className="text-white/40 hover:text-white/60 text-xs transition-colors">
              Privacy
            </a>
            <a href="/contact" className="text-white/40 hover:text-white/60 text-xs transition-colors">
              Contact
            </a>
            <a href="/help" className="text-white/40 hover:text-white/60 text-xs transition-colors">
              Help
            </a>
          </div>
          <p className="text-white/30 text-xs mt-4">
            © {new Date().getFullYear()} Ban State Of Hotel. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
