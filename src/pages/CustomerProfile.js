import React, { useContext } from 'react';
import { ToastContext } from '../App';
import UserProfile from '../components/UserProfile';
import BottomNav from '../components/BottomNav';

export default function CustomerProfile() {
  const toast = useContext(ToastContext);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-28">
      <UserProfile toast={toast} userType="customer" />
      <BottomNav active="profile" />
    </div>
  );
}