import React, { useContext } from 'react';
import { ToastContext } from '../App';
import UserProfile from '../components/UserProfile';

export default function EmployeeProfile() {
  const toast = useContext(ToastContext);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-28">
      <UserProfile toast={toast} userType="employee" />
    </div>
  );
}