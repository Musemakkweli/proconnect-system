import React, { useState } from 'react';
import AdminBottomNav from '../components/AdminBottomNav';
import ThemeToggle from '../components/ThemeToggle';

export default function AdminProfile(){
  const [user] = useState({ name: 'Admin User', email: 'admin@example.com', phone: '+123456789' });

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900 pb-28">
      <div className="max-w-3xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Admin — Profile</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">Manage your administrator profile information.</p>
          </div>
          <ThemeToggle />
        </header>

        <section className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-indigo-200 dark:bg-indigo-600 flex items-center justify-center text-2xl text-white">A</div>
            <div>
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">{user.name}</div>
              <div className="text-sm text-slate-500 dark:text-slate-300">{user.email}</div>
              <div className="text-sm text-slate-500 dark:text-slate-300">{user.phone}</div>
            </div>
          </div>
        </section>
      </div>
      <AdminBottomNav />
    </div>
  );
}
