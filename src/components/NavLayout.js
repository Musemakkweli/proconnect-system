import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faList, faChartPie, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';

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

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(stored);
    } catch (e) {
      setUser(null);
    }
  }, []);

  const role = user?.role || 'customer';
  const profilePic = user?.profile_image_url || user?.avatar || 'https://via.placeholder.com/64';
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
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} shadow-lg`}> 
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
            {!isCollapsed && <span className="text-lg font-semibold text-slate-800">ProConnect</span>}
            <button onClick={() => setIsCollapsed(c => !c)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800">
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          <div className="mt-6 px-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <img src={profilePic} alt="avatar" className="w-full h-full object-cover" />
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-semibold text-slate-800">{title}</p>
                  <p className="text-xs text-slate-500">{role?.toUpperCase()}</p>
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
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  {!isCollapsed && item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto px-4 py-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500" />
              {!isCollapsed && 'Logout'}
            </button>
          </div>
        </aside>
        <div className="flex-1">
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-slate-500">Welcome back{title ? `, ${title}` : ''}</p>
              <h1 className="text-2xl font-semibold text-slate-800">Operations Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <p className="text-xs text-slate-500">{role || 'User'}</p>
              </div>
            </div>
          </header>
          <main className="p-6 bg-slate-50 min-h-[calc(100vh-72px)]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
