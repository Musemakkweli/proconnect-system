import React from 'react';
import AdminBottomNav from '../components/AdminBottomNav';

const sample = [
  { id:1, text: 'New user registered: Cecilia', time: '2h' },
  { id:2, text: 'Complaint #5 marked resolved', time: '1d' },
  { id:3, text: 'System maintenance scheduled', time: '3d' },
];

export default function AdminNotifications(){
  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900 pb-28">
      <div className="max-w-4xl mx-auto">
        <header className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Admin — Notifications</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">System and user notifications for administrators.</p>
        </header>

        <section className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <ul>
            {sample.map(n=> (
              <li key={n.id} className="py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="text-slate-800 dark:text-slate-100">{n.text}</div>
                <div className="text-sm text-slate-500 dark:text-slate-300">{n.time}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <AdminBottomNav />
    </div>
  );
}
