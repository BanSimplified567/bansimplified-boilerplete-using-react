// src/components/NavbarMain.tsx
import {
  Close as CloseIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { Link } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import { useLogout } from '@/hooks/useLogout';
import { supabase } from '@/lib/supabase';
import type { UserData } from '@/types/users';

import {
  clearUserDataFromLocalStorage
} from '@/utils/user';
import IsladelCafeLogo from '@/assets/IslaDelCafeLogoText.png';

const NAV_LINKS = [
  { path: '/index', label: 'HOME' },
  { path: '/menu', label: 'MENU' },
  { path: '/about', label: 'ABOUT US' },
  { path: '/contact', label: 'CONTACT US' },
] as const;

// Add elevated user roles constant
const ELEVATED_ROLES = ['admin', 'manager', 'staff'] as const;

const NavbarMain = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? !window.matchMedia('(min-width: 1024px)').matches : false
  );
  const [user, setUser] = useState<UserData | null>(null);
  const [cartItemsCount] = useState(0);
  const logout = useLogout();

  // Check scroll position
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  // Auth state change handler - UPDATED
  const handleAuthStateChange = useCallback(async (event: string, session: any) => {
    if (event === 'SIGNED_OUT') {
      clearUserDataFromLocalStorage();
      setUser(null);
    } else if (session?.user) {
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('firstname, email, role, status')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (userProfile) {
        const userData: UserData = {
          id: session.user.id,
          firstname: userProfile.firstname,
          email: userProfile.email,
          role: userProfile.role,
          status: userProfile.status,
        };

        // Only set user if active and not elevated
        if (userProfile.status === 'active' && !ELEVATED_ROLES.includes(userProfile.role as any)) {
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        } else {
          // Clear if user is elevated or inactive
          clearUserDataFromLocalStorage();
          setUser(null);

          // Redirect elevated users
          if (ELEVATED_ROLES.includes(userProfile.role as any)) {
            window.location.href = '/dashboard';
          }
        }
      }
    }
  }, []);

  const handleResize = useCallback(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    setIsMobile(!isDesktop);
    if (isDesktop) setMenuOpen(false);
  }, []);

  // Initialize user and listeners - UPDATED
  useEffect(() => {
    // First, check for session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        handleAuthStateChange('SIGNED_IN', session);
      } else {
        // No session, clear local storage
        clearUserDataFromLocalStorage();
        setUser(null);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    handleScroll(); // Initialize scroll state
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      authListener?.subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleAuthStateChange, handleScroll, handleResize]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to log out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#92400e',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      await logout();
      clearUserDataFromLocalStorage();
      setUser(null);
      setMenuOpen(false);

      Swal.fire({
        title: 'Logged out!',
        text: 'Session successfully terminated.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Memoized navbar classes
  const navbarClasses = useMemo(() => {
    const baseClasses = 'fixed top-0 left-0 w-full z-50 transition-all duration-300';

    if (isScrolled) {
      return `${baseClasses} bg-[#2C1B0E] shadow-lg backdrop-blur-sm bg-opacity-95`;
    }

    return `${baseClasses} bg-[#2C1B0E] lg:bg-transparent`;
  }, [isScrolled]);

  // Memoized mobile menu classes
  const mobileMenuClasses = useMemo(() => {
    const baseClasses = 'fixed inset-x-0 top-16 bg-[#2C1B0E] shadow-xl border-t border-amber-900/30 transition-all duration-300 ease-in-out overflow-hidden';

    return menuOpen
      ? `${baseClasses} max-h-[80vh] opacity-100 translate-y-0`
      : `${baseClasses} max-h-0 opacity-0 -translate-y-4`;
  }, [menuOpen]);

  // Don't render if user is elevated (they should be redirected)
  if (user && ELEVATED_ROLES.includes(user.role as any)) {
    return null;
  }

  return (
    <header className={ navbarClasses }>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */ }
          <div className="flex items-center flex-shrink-0">
            <Link
              to="/"
              className="flex items-center space-x-2 group"
              onClick={ closeMenu }
            >
              <img
                src={ IsladelCafeLogo }
                alt="Isla Del Café"
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="font-bold text-white text-lg sm:text-xl md:text-2xl tracking-wider font-serif">
                ISLA DEL CAFÉ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */ }
          { !isMobile && (
            <nav className="flex flex-1 justify-center mx-8">
              <ul className="flex items-center space-x-1">
                { NAV_LINKS.map(({ path, label }) => (
                  <li key={ path }>
                    <Link
                      to={ path }
                      className="relative px-4 py-2 mx-1 text-sm font-medium rounded-lg transition-all duration-200 text-white hover:text-white hover:bg-amber-900/10 hover:font-semibold"
                      activeProps={ {
                        className: 'text-white bg-amber-800/20',
                      } }
                      activeOptions={ { exact: path === '/index' } }
                    >
                      { ({ isActive }) => (
                        <>
                          { label }
                          { isActive && (
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full" />
                          ) }
                        </>
                      ) }
                    </Link>
                  </li>
                )) }
              </ul>
            </nav>
          ) }

          {/* Desktop Right Section */ }
          { !isMobile && (
            <div className="flex items-center space-x-4">
              <Link
                to="/cart"
                className="relative p-2 text-amber-100 hover:text-amber-300 hover:bg-amber-900/10 rounded-lg transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCartIcon />
                { cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    { cartItemsCount }
                  </span>
                ) }
              </Link>

              { user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-amber-100 hover:text-amber-300 hover:bg-amber-900/10 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
                      <PersonIcon className="text-white text-sm" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">
                        Hi, { user.firstname || 'User' }!
                      </p>
                      <p className="text-xs text-amber-200/70 capitalize">
                        { user.role.toLowerCase() }
                      </p>
                    </div>
                  </button>

                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#2C1B0E] rounded-lg shadow-xl border border-amber-900/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-amber-100 hover:bg-amber-900/30 transition-colors rounded-t-lg"
                    >
                      <PersonIcon fontSize="small" />
                      My Profile
                    </Link>
                    <button
                      onClick={ handleLogout }
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-amber-100 hover:bg-red-900/30 hover:text-red-300 transition-colors rounded-b-lg text-left"
                    >
                      <LogoutIcon fontSize="small" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/"
                    className="px-4 py-2 text-sm font-medium text-amber-100 hover:text-amber-300 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 rounded-full text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              ) }
            </div>
          ) }

          {/* Mobile Menu Button */ }
          { isMobile && (
            <div className="flex items-center">
              <Link
                to="/cart"
                className="relative p-2 mr-3 text-amber-100 hover:text-amber-300"
              >
                <ShoppingCartIcon />
                { cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    { cartItemsCount }
                  </span>
                ) }
              </Link>

              <button
                onClick={ () => setMenuOpen(!menuOpen) }
                className="p-2 text-amber-100 hover:text-amber-300 hover:bg-amber-900/10 rounded-lg transition-colors"
                aria-label={ menuOpen ? "Close menu" : "Open menu" }
              >
                { menuOpen ? <CloseIcon /> : <MenuIcon /> }
              </button>
            </div>
          ) }
        </div>

        {/* Mobile Menu Dropdown */ }
        { isMobile && (
          <div className={ mobileMenuClasses }>
            <div className="px-4 py-2 space-y-6">
              {/* Mobile Nav Links */ }
              <nav className="space-y-2">
                { NAV_LINKS.map(({ path, label }) => (
                  <Link
                    key={ path }
                    to={ path }
                    onClick={ closeMenu }
                    className="block w-full text-left py-3 px-4 rounded-lg text-base font-medium text-amber-100 hover:bg-amber-900/20 hover:text-amber-300 transition-colors"
                    activeProps={ {
                      className: 'bg-amber-900/30 text-amber-400 border-l-4 border-amber-400',
                    } }
                    activeOptions={ { exact: path === '/index' } }
                  >
                    { label }
                  </Link>
                )) }
              </nav>

              { user ? (
                <div className="space-y-4 border-t border-amber-900/30 pt-6">
                  <div className="flex items-center gap-4 px-4 py-3 bg-amber-900/10 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center">
                      <PersonIcon className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-medium text-amber-100">
                        Hi, { user.firstname || 'User' }!
                      </p>
                      <p className="text-sm text-amber-200/70 capitalize">
                        { user.role.toLowerCase() }
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={ closeMenu }
                    className="flex items-center gap-3 py-3 px-4 text-amber-100 hover:bg-amber-900/20 rounded-lg transition-colors"
                  >
                    <PersonIcon />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={ handleLogout }
                    className="w-full flex items-center gap-3 py-3 px-4 text-amber-100 hover:bg-red-900/30 hover:text-red-300 rounded-lg transition-colors text-left"
                  >
                    <LogoutIcon />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 border-t border-amber-900/30 pt-6">
                  <Link
                    to="/" // Changed from '/index' to '/'
                    onClick={ closeMenu }
                    className="block w-full text-center py-3 px-4 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={ closeMenu }
                    className="block w-full text-center py-3 px-4 border-2 border-amber-600 text-amber-100 rounded-lg font-medium hover:bg-amber-600/20 transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              ) }
            </div>
          </div>
        ) }
      </div>
    </header>
  );
};

export default NavbarMain;
