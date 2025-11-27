import React, { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import DonutChart from "../components/DonutChart";

export default function EmployeeDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      try {
        // read logged-in user and extract employee id
        let empId = null;
        try {
          const u = JSON.parse(localStorage.getItem('user') || 'null');
          empId = u?.employee_id || u?.emp_id || u?.employeeId || u?.id || null;
        } catch (e) {
          empId = null;
        }

        if (!empId) {
          console.warn('EmployeeDashboard: no logged-in employee id found in localStorage.user');
          setIsLoading(false);
          return;
        }

        const url = `https://arlande-api.mababa.app/complaints/employee/${empId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch employee complaints (${res.status})`);
        const data = await res.json();

        // API may return object or array; normalize
        const arr = Array.isArray(data) ? data : (data.results || (data ? [data] : []));
        const mapped = arr.map(item => ({
          id: item.id,
          user_fullname: item.user_fullname || '',
          title: item.title,
          description: item.description,
          complaint_type: item.complaint_type,
          address: item.address,
          status: item.status || '',
          assigned_to: item.assigned_to || null,
          created: item.created_at ? new Date(item.created_at).toLocaleString() : (item.created || '')
        }));

        if (mounted) setComplaints(mapped);
      } catch (err) {
        console.error('Failed to load employee complaints', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const total = complaints.length;
  const pending = complaints.filter(c => (c.status || '').toLowerCase() === 'pending').length;
  const inProgress = complaints.filter(c => ['in progress','in_progress','processing'].includes((c.status||'').toLowerCase())).length;
  const completed = complaints.filter(c => (c.status || '').toLowerCase() === 'completed' || (c.status || '').toLowerCase() === 'resolved').length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-28">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Assigned Complaints</h2>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full">Employee</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{isLoading ? '—' : total}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Pending</h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{isLoading ? '—' : pending}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">In Progress</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{isLoading ? '—' : inProgress}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Completed</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{isLoading ? '—' : completed}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 col-span-1 h-64 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full max-w-xs">
                <DonutChart
                  data={isLoading ? [0,0] : [complaints.filter(c => (c.complaint_type||'').toLowerCase() === 'private').length, complaints.filter(c => (c.complaint_type||'').toLowerCase() !== 'private').length]}
                  labels={["Private", "Common"]}
                  colors={["#7c3aed", "#06b6d4"]}
                  size={220}
                  thickness={36}
                  responsive={true}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 col-span-2">
            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Recent Activity</h2>
            {complaints.length === 0 ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-300">No assigned complaints yet.</div>
            ) : (
              <ul className="space-y-2">
                {complaints.map((c) => {
                  const s = (c.status || '').toString().toLowerCase();
                  const label = s ? (s.charAt(0).toUpperCase() + s.slice(1)) : '';
                  const cls = s === 'resolved' || s === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    s === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                    (s === 'in progress' || s === 'in_progress' || s === 'processing') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                    'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200';

                  return (
                    <li key={c.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                      <div>
                        <div className="text-gray-800 dark:text-gray-100 font-medium">{c.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{c.user_fullname} • {c.address}</div>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded text-xs ${cls}`}>{label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{c.created}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
