import React, { useContext } from 'react';
import { ToastContext } from '../App';
import UserProfile from '../components/UserProfile';

export default function AdminProfile() {
  const toast = useContext(ToastContext);

  return (
    <div className="min-h-screen bg-slate-100 pb-28">
      <div className="max-w-3xl mx-auto space-y-8 py-10 px-4">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-2xl border border-blue-300 p-6">
          <h1 className="text-3xl font-semibold">Admin Profile</h1>
          <p className="text-sm text-blue-100 mt-2">
            Manage your personal details, location data, and profile assets in one secure place.
          </p>
        </div>
        <UserProfile toast={toast} userType="admin" />
      </div>
    </div>
  );
}
