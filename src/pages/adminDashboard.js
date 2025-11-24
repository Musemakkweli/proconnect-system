import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonutChart from '../components/DonutChart';
import BarChart from '../components/BarChart';
import Card from '../components/Card';
import AdminBottomNav from '../components/AdminBottomNav';
import ThemeToggle from '../components/ThemeToggle';
import BASE_URL from '../config';

export default function AdminDashboard() {
  const [complaints] = useState([
    { id: 1, title: 'Complaint #1', customer: 'John Doe', employee: 'Jane Smith', status: 'Pending', created: '2025-11-10', private: true },
    { id: 2, title: 'Complaint #2', customer: 'Alice Blue', employee: 'Tom Green', status: 'Resolved', created: '2025-11-08', private: false },
    { id: 3, title: 'Complaint #3', customer: 'Bob Gray', employee: '', status: 'In Progress', created: '2025-11-12', private: false },
    { id: 4, title: 'Complaint #4', customer: 'Mary Major', employee: 'Sam White', status: 'Pending', created: '2025-11-09', private: true },
    { id: 5, title: 'Complaint #5', customer: 'Peter Pan', employee: '', status: 'Pending', created: '2025-11-11', private: false },
  ]);

  const total = complaints.length;
  const pending = complaints.filter(c => (c.status || '').toString().toLowerCase().includes('pending')).length;
  const inProgress = complaints.filter(c => (c.status || '').toString().toLowerCase().includes('in progress') || (c.status || '').toString().toLowerCase().includes('processing')).length;
  const resolved = complaints.filter(c => (c.status || '').toString().toLowerCase().includes('resolved')).length;
  const privateCount = complaints.filter(c => c.private).length;
  const commonCount = complaints.filter(c => !c.private).length;

  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');
  const [userCounts, setUserCounts] = useState([0, 0, 0]); // customers, employees, admins

  function handleLogout() {
    try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
    navigate('/');
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/users`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        const users = Array.isArray(data) ? data : (data.results || (data ? [data] : []));
        const counts = [0, 0, 0];
        users.forEach(u => {
          const role = ((u.role || u.type || u.user_type || '') + '').toString().toLowerCase();
          if (role.includes('customer')) counts[0]++;
          else if (role.includes('employee')) counts[1]++;
          else if (role.includes('admin')) counts[2]++;
        });
        if (mounted) setUserCounts(counts);
      } catch (err) {
        console.error('Failed to load users for dashboard', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-28">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">Overview of complaints and system status</div>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>

        {/* Charts row: Pie + Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1 flex items-center justify-center">
            <Card className="flex items-center justify-center" height="min-h-[60vh]">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full max-w-xs">
                  <DonutChart
                    data={userCounts}
                    labels={["Customers", "Employees", "Admins"]}
                    colors={["#f97316", "#06b6d4", "#6366f1"]}
                    size={220}
                    thickness={36}
                    responsive={true}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="col-span-2">
            <Card height="min-h-[60vh]">
              <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Complaints by Status</h2>
              <div className="h-full">
                <BarChart
                  labels={['Common','Private','Pending','Processing','Resolved']}
                  values={[
                    commonCount,
                    privateCount,
                    pending,
                    inProgress,
                    resolved,
                  ]}
                  colors={["#06b6d4", "#7c3aed", "#f59e0b", "#3b82f6", "#10b981"]}
                  height={240}
                />
              </div>
            </Card>
          </div>
        </div>

        {/* complaints table removed per request - dashboard shows charts only */}
      </div>

      <AdminBottomNav />

      
    </div>
  );
}
