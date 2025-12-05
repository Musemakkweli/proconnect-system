import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faList, faChartPie, faSignOutAlt, faBars, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  // Customer
  { key: 'customer_dashboard', label: 'Dashboard', to: '/customer/dashboard', icon: faHome, roles: ['customer'] },
  { key: 'customer_complaints', label: 'Complaints', to: '/customer/complaints', icon: faList, roles: ['customer'] },
  { key: 'customer_profile', label: 'Profile', to: '/customer/profile', icon: faUser, roles: ['customer'] },

  // Employee
  { key: 'employee_dashboard', label: 'Dashboard', to: '/employee/dashboard', icon: faHome, roles: ['employee'] },
  { key: 'employee_complaints', label: 'Complaints', to: '/employee/complaints', icon: faList, roles: ['employee'] },
  { key: 'employee_profile', label: 'Profile', to: '/employee/profile', icon: faUser, roles: ['employee'] },

  // Admin
  { key: 'admin_dashboard', label: 'Dashboard', to: '/admin/dashboard', icon: faChartPie, roles: ['admin'] },
  { key: 'admin_complaints', label: 'Complaints', to: '/admin/complaints', icon: faList, roles: ['admin'] },
  { key: 'admin_users', label: 'Users', to: '/admin/users', icon: faUser, roles: ['admin'] },
];

export default function NavLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(stored);
      
      // Fetch profile image if user exists
      if (stored?.id) {
        fetchProfileImage(stored.id);
      } else {
        setImageLoading(false);
      }
    } catch (e) {
      setUser(null);
      setImageLoading(false);
    }
  }, []);

  const fetchProfileImage = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.22.128.126:3000/user-profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle nested response structure
        const profile = data.profile || data;
        const user = data.user || {};
        
        // Get profile image from either profile or user object
        const imageUrl = profile.profile_image_url || user.profile_image_url || profile.profile_image || user.profile_image;
        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.error('Failed to fetch profile image:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const role = user?.role || 'customer';
  const title = useMemo(() => {
    if (!user) return 'Guest';
    return user.fullname || user.name || 'User';
  }, [user]);

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex">
        <aside className={`bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} shadow-lg`}> 
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-700">
            {!isCollapsed && <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">ProConnect</span>}
            <button onClick={() => setIsCollapsed(c => !c)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200">
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          <div className="mt-6 px-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                {imageLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full"></div>
                ) : profileImage ? (
                  <img src={profileImage} alt="avatar" className="w-full h-full object-cover" onError={() => setProfileImage(null)} />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="text-slate-400 dark:text-slate-500 text-lg" />
                )}
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{role?.toUpperCase()}</p>
                </div>
              )}
            </div>
          </div>
          <nav className="mt-8 space-y-1">
            {filteredItems.map(item => {
              const isActive = location.pathname.startsWith(item.to);
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.to)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  {!isCollapsed && item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto px-4 py-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500" />
              {!isCollapsed && 'Logout'}
            </button>
          </div>
        </aside>
        <div className="flex-1">
          <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back{title ? `, ${title}` : ''}</p>
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Operations Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
              </button>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{role || 'User'}</p>
              </div>
            </div>
          </header>
          <main className="p-6 bg-slate-50 dark:bg-slate-900 min-h-[calc(100vh-72px)]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
