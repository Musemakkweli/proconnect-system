import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faListAlt, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function BottomNav({ active = 'home' }) {
  const navigate = useNavigate();

  const items = [
    { key: 'home', label: 'Home', icon: faHome, to: '/' },
    { key: 'complaints', label: 'Complaints', icon: faListAlt, to: '/customer/complaints' },
    { key: 'notifications', label: 'Alerts', icon: faBell, to: '/customer/alerts' },
    { key: 'profile', label: 'Profile', icon: faUser, to: '/customer/profile' },
  ];

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 bottom-4 z-40">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-full px-3 py-2 flex space-x-2 items-center" style={{ minWidth: 320 }}>
        {items.map((it) => {
          const isActive = it.key === active;
          return (
            <button
              key={it.key}
              onClick={() => navigate(it.to)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-md focus:outline-none transition-all duration-150 ${
                isActive ? 'bg-purple-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ width: 64 }}
            >
              <FontAwesomeIcon icon={it.icon} className={`text-sm`} />
              <span className="text-[10px] mt-1">{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
