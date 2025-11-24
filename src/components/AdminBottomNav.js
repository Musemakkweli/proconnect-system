import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminBottomNav(){
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: 'home', label: 'Home', to: '/admin/dashboard', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M9 21V9h6v12" /></svg>
    )},
    { key: 'users', label: 'Users', to: '/admin/users', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    )},
    { key: 'complaints', label: 'Complains', to: '/admin/complaints', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h10zM7 16h10v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2z" /></svg>
    )},
    { key: 'notifications', label: 'Notifications', to: '/admin/alerts', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    )},
    { key: 'profile', label: 'Profile', to: '/admin/profile', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.63 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
  ];

  const handleLogout = () => {
    try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
    navigate('/');
  };

  const path = location.pathname || '';

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-full px-3 py-2 flex items-center space-x-2">
        {items.map(it => (
          <button key={it.key} onClick={()=> navigate(it.to)} aria-label={it.label} className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2 ${path.startsWith(it.to) ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-200'}`}>
            {it.icon}
            <span className="text-sm">{it.label}</span>
          </button>
        ))}

        <button onClick={handleLogout} aria-label="Logout" className="px-3 py-1 rounded-full text-sm flex items-center space-x-2 bg-red-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m0-8V7a2 2 0 114 0v1" /></svg>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
