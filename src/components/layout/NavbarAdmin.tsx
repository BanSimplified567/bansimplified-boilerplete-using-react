import { supabase } from '@/lib/supabase';
import { clearUserDataFromLocalStorage, getUserDataFromLocalStorage, saveUserDataToLocalStorage } from '@/utils/user';

import type { UserData } from '@/types/users';
import {
  ChevronLeft as ChevronLeftIcon,
  Coffee as CoffeeIcon,
  Feedback as FeedbackIcon,
  Home as HomeIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  MenuBook as MenuIcon,
  Menu as MenuIconMobile,
  Person as PersonIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// Define role-based permissions for navigation
const rolePermissions = {
  admin: [
    'dashboard',
    'products',
    'inventory',
    'inventoryreport',
    'orders',
    'order-history',
    'reports',
    'users',
    'feedback',
    'settings',
  ],
  manager: [
    'dashboard',
    'products',
    'inventory',
    'inventoryreport',
    'orders',
    'order-history',
    'reports',
    'users',
    'feedback',
    'settings',
  ],
  staff: ['dashboard', 'orders', 'order-history', 'settings'],
  // ADD customer if they should have any dashboard access
  // customer: ['dashboard'] // Optional: if customers should see dashboard
};

interface NavbarAdminProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  isMobile: boolean;
}

function NavbarAdmin({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen, isMobile }: NavbarAdminProps) {
  const navigate = useNavigate();
  const [hasAccessToDashboard, setHasAccessToDashboard] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role from Supabase on component mount
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // Try to get user data from localStorage first
        const savedUserData = getUserDataFromLocalStorage();
        if (savedUserData) {
          const allowedRoles = ['admin', 'manager', 'staff']; // Only these roles get admin dashboard
          const isActive = savedUserData.status === 'active';
          const hasAccess = isActive && allowedRoles.includes(savedUserData.role);
          setUserRole(savedUserData.role);
          setUserData(savedUserData);
          setHasAccessToDashboard(hasAccess);
          if (!hasAccess || !isActive) {
            setLoading(false);
            navigate({ to: '/' });; // Redirect to home if not admin/manager/staff
            return;
          }
        }

        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setHasAccessToDashboard(false);
          setLoading(false);
          clearUserDataFromLocalStorage();
          navigate({ to: '/' });;
          return;
        }

        // Fetch user profile with full details
        const { data: profile, error } = await supabase
          .from('users')
          .select('id, firstname, lastname, email, role, status')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setHasAccessToDashboard(false);
          setLoading(false);
          navigate({ to: '/' });;
        } else {
          // Check if user role is admin, manager, or staff AND status is active
          const allowedRoles = ['admin', 'manager', 'staff'];
          const role = profile?.role;
          const status = profile?.status;
          const isActive = status === 'active';
          const hasAccess = isActive && allowedRoles.includes(role);

          setUserRole(role);
          setHasAccessToDashboard(hasAccess);

          // Save user data
          if (profile) {
            const userDataToSave: UserData = {
              id: profile.id,
              firstname: profile.firstname,
              lastname: profile.lastname,
              email: profile.email,
              role: profile.role,
              status: profile.status,
            };
            setUserData(userDataToSave);
            saveUserDataToLocalStorage(userDataToSave);
          }

          // If no access or not active, redirect to appropriate page
          if (!hasAccess || !isActive) {
            setLoading(false);
            navigate({ to: '/' });;
          }
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setHasAccessToDashboard(false);
        setLoading(false);
        navigate({ to: '/' });;
      }
    };

    checkUserRole();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('id, firstname, lastname, email, role, status')
            .eq('id', session.user.id)
            .single();

          const allowedRoles = ['admin', 'manager', 'staff'];
          const role = profile?.role;
          const status = profile?.status;
          const isActive = status === 'active';
          const hasAccess = isActive && allowedRoles.includes(role);

          setUserRole(role);
          setHasAccessToDashboard(hasAccess);

          // Save user data
          if (profile) {
            const userDataToSave: UserData = {
              id: profile.id,
              firstname: profile.firstname,
              lastname: profile.lastname,
              email: profile.email,
              role: profile.role,
              status: profile.status,
            };
            setUserData(userDataToSave);
            saveUserDataToLocalStorage(userDataToSave);
          }

          if (!hasAccess || !isActive) {
            navigate({ to: '/' });;
          }
        } else {
          setHasAccessToDashboard(false);
          setUserRole(null);
          setUserData(null);
          clearUserDataFromLocalStorage();
          navigate({ to: '/' });;
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout',
    });

    if (result.isConfirmed) {
      try {
        // Sign out from Supabase
        await supabase.auth.signOut();
        // Clear user data from localStorage
        clearUserDataFromLocalStorage();
        setUserData(null);
        setUserRole(null);
        navigate({ to: '/' });;
      } catch (error) {
        console.error('Logout error:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to logout. Please try again.',
          icon: 'error',
        });
      }
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleOverlayClick = () => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  };

  const hasAccess = (section: string): boolean => {
    if (!userRole) return false;
    return rolePermissions[userRole as keyof typeof rolePermissions]?.includes(section) || false;
  };

  // Show loading state or nothing if user doesn't have access
  if (loading) {
    return (
      <div className="navbaradmin-loading">
        <div className="spinner"></div>
        <span>Checking access permissions...</span>
      </div>
    );
  }

  // Don't render the navbar if user doesn't have access to dashboard
  if (!hasAccessToDashboard) {
    return null;
  }

  return (
    <>
      <nav
        className={ `navbaradmin ${isCollapsed && !mobileOpen ? 'navbaradmin-collapsed' : ''} ${isMobile && mobileOpen ? 'navbaradmin-mobile-open' : ''
          }` }
        role="navigation"
        aria-label="Admin Navigation"
      >
        <div className="navbaradmin-brand">
          <div className="icon">
            <CoffeeIcon fontSize="small" />
          </div>
          <div className={ isCollapsed && !mobileOpen ? 'hidden' : 'flex flex-col' }>
            <h2>Isla Del Cafe</h2>
            { userData && (
              <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                <PersonIcon fontSize="inherit" />
                <span className="capitalize">{ userData.role }</span>
                { userData.firstname && (
                  <span className="text-gray-500">• { userData.firstname }</span>
                ) }
              </div>
            ) }
          </div>
        </div>

        { !isMobile && (
          <button
            className={ `navbaradmin-toggle ${isCollapsed ? 'collapsed' : ''}` }
            onClick={ toggleSidebar }
            aria-label={ isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar' }
          >
            <ChevronLeftIcon />
          </button>
        ) }

        <div className="navbaradmin-menu">
          <ul>
            {/* Main Navigation */ }
            { hasAccess('dashboard') && <li className="nav-section-label">Main Navigation</li> }
            { hasAccess('dashboard') && (
              <li data-tooltip="Dashboard">
                <Link
                  to="/dashboard"
                  className="navbaradmin-item"
                  onClick={ () => isMobile && setMobileOpen(false) }
                  aria-label="Dashboard"
                >
                  <HomeIcon fontSize="small" />
                  <span className={ `nav-label ${isCollapsed && !mobileOpen ? 'hidden' : ''}` }>
                    Dashboard
                  </span>
                </Link>
              </li>
            ) }

            {/* Product & Inventory Management */ }
            { (hasAccess('products') || hasAccess('inventory')) && (
              <li className="nav-section-label">Product & Inventory Management</li>
            ) }
            { hasAccess('products') && (
              <li data-tooltip="Products">
                <Link
                  to="/products"
                  className="navbaradmin-item"
                  onClick={ () => isMobile && setMobileOpen(false) }
                  aria-label="Products"
                >
                  <MenuIcon fontSize="small" />
                  <span className={ `nav-label ${isCollapsed && !mobileOpen ? 'hidden' : ''}` }>
                    Products
                  </span>
                </Link>
              </li>
            ) }
            { hasAccess('inventory') && (
              <li data-tooltip="Inventory">
                <Link
                  to="/inventory"
                  className="navbaradmin-item"
                  onClick={ () => isMobile && setMobileOpen(false) }
                  aria-label="Inventory"
                >
                  <InventoryIcon fontSize="small" />
                  <span className={ `nav-label ${isCollapsed && !mobileOpen ? 'hidden' : ''}` }>
                    Inventory
                  </span>
                </Link>
              </li>
            ) }

            {/* Order Management */ }
            { (hasAccess('orders') || hasAccess('order-history')) && (
              <li className="nav-section-label">Order Management</li>
            ) }
            { hasAccess('orders') && (
              <li data-tooltip="Orders">
                <Link
                  to="/orders"
                  className="navbaradmin-item"
                  onClick={ () => isMobile && setMobileOpen(false) }
                  aria-label="Orders"
                >
                  <ShoppingBagIcon fontSize="small" />
                  <span className={ `nav-label ${isCollapsed && !mobileOpen ? 'hidden' : ''}` }>
                    Orders
                  </span>
                </Link>
              </li>
            ) }
            { hasAccess('order-history') && (
              <li data-tooltip="Order History">
                <Link
                  to="/order-history"
                  className="navbaradmin-item"
                  onClick={ () => isMobile && setMobileOpen(false) }
                  aria-label="Order History"
                >
                  <ShoppingBagIcon fontSize="small" />
                  <span className={ `nav-label ${isCollapsed && !mobileOpen ? 'hidden' : ''}` }>
                    Order History
                  </span>
                </Link>
              </li>
            ) }

            {/* Reports & Analytics */ }
            { (hasAccess('reports') || hasAccess('inventoryreport')) && (
              <li className="nav-section-label">Reports</li>
            ) }
            { hasAccess('reports') && (
              <li data-tooltip="Sales Reports">
                <Link
                  to="/reports"
                  className="navbaradmin-item"
                  onClick={ () => isMobile && setMobileOpen(false) }
                  aria-label="Sales Reports"
                >
                  <ReportsIcon fontSize="small" />
                  <span className={ `nav-label ${isCollapsed && !mobileOpen ? 'hidden' : ''}` }>
                    Sales Reports
                  </span>
                </Link>
              </li>
            ) }
            { hasAccess('inventoryreport') && (
              <li data-tooltip="Inventory Report">
                <Link
                  to="/inventoryreport"
                  className="navbaradmin-item"
                  onClick={ () => isMobile && setMobileOpen(false) }
                  aria-label="Inventory Report"
                >
                  <ReportsIcon fontSize="small" />
                  <span className={ `nav-label ${isCollapsed && !mobileOpen ? 'hidden' : ''}` }>
                    Inventory Reports
                  </span>
                </Link>
              </li>
            ) }

            {/* User Management */ }
            { (hasAccess('users') || hasAccess('feedback')) && (
              <li className="nav-section-label">User Dashboard</li>
            ) }
            { hasAccess('users') && (
              <li data-tooltip="Users">
                <Link
                  to="/users"
                  className="navbaradmin-item"
                  onClick={ () => isMobile && setMobileOpen(false) }
                  aria-label="Users"
                >
                  <PersonIcon fontSize="small" />
                  <span className={ `nav-label ${isCollapsed && !mobileOpen ? 'hidden' : ''}` }>
                    Users
                  </span>
                </Link>
              </li>
            ) }
            { hasAccess('feedback') && (
              <li data-tooltip="Feedback">
                <Link
                  to="/feedback"
                  className="navbaradmin-item"
                  onClick={ () => isMobile && setMobileOpen(false) }
                  aria-label="Feedback"
                >
                  <FeedbackIcon fontSize="small" />
                  <span className={ `nav-label ${isCollapsed && !mobileOpen ? 'hidden' : ''}` }>
                    Feedback
                  </span>
                </Link>
              </li>
            ) }

            {/* System Settings */ }
            { hasAccess('settings') && (
              <>
                <li className="nav-section-label">System</li>
                <li data-tooltip="Settings">
                  <Link
                    to="/settings"
                    className="navbaradmin-item"
                    onClick={ () => isMobile && setMobileOpen(false) }
                    aria-label="Settings"
                  >
                    <SettingsIcon fontSize="small" />
                    <span className={ `nav-label ${isCollapsed && !mobileOpen ? 'hidden' : ''}` }>
                      Settings
                    </span>
                  </Link>
                </li>
              </>
            ) }

            {/* Logout */ }
            <li data-tooltip="Logout">
              <button
                onClick={ handleLogout }
                className="navbaradmin-item logoutBtn"
                aria-label="Logout"
              >
                <LogoutIcon fontSize="small" />
                <span className={ `nav-label ${isCollapsed && !mobileOpen ? 'hidden' : ''}` }>
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      { isMobile && (
        <>
          <button
            className={ `mobile-menu-button ${mobileOpen ? 'hidden' : ''}` }
            onClick={ () => setMobileOpen(true) }
            aria-label="Open Mobile Menu"
          >
            <MenuIconMobile />
          </button>
          <div
            className={ `navbaradmin-overlay ${mobileOpen ? 'navbaradmin-mobile-open' : ''}` }
            onClick={ handleOverlayClick }
            aria-hidden="true"
          ></div>
        </>
      ) }
    </>
  );
}

export default NavbarAdmin;
