import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';

export default function Notifications() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'System Update', message: 'The system will be updated tonight at 11pm.', time: '2h ago', unread: true },
    { id: 2, title: 'New Response', message: 'Support replied to your complaint #23.', time: '1d ago', unread: true },
    { id: 3, title: 'Welcome', message: 'Thanks for joining ProConnect — get started by submitting a complaint.', time: '3d ago', unread: false },
  ]);

  function markAllRead() {
    setNotes(prev => prev.map(n => ({ ...n, unread: false })));
  }

  function toggleRead(id) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-28">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Recent updates and alerts</div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={markAllRead} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">Mark all read</button>
          </div>
        </div>

        <div className="space-y-2">
          {notes.map(n => (
            <div key={n.id} className={`p-4 rounded-lg shadow-sm bg-white dark:bg-slate-800 flex items-start justify-between ${n.unread ? 'ring-1 ring-indigo-200 dark:ring-indigo-900/30' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-white ${n.unread ? 'bg-indigo-600' : 'bg-gray-400'}`}>
                  {n.title.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{n.message}</div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">{n.time}</div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => toggleRead(n.id)} className="text-sm text-indigo-600 dark:text-indigo-300">{n.unread ? 'Mark read' : 'Mark unread'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="notifications" />
    </div>
  );
}
