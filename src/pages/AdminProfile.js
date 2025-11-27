import React, { useContext } from 'react';
import { ToastContext } from '../App';
import UserProfile from '../components/UserProfile';
import AdminBottomNav from '../components/AdminBottomNav';

export default function AdminProfile() {
  const toast = useContext(ToastContext);

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900 pb-28">
      <div className="max-w-3xl mx-auto">
       

        <UserProfile toast={toast} userType="admin" />
      </div>
      <AdminBottomNav />
    </div>
  );
}
