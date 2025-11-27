import React, { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import DonutChart from "../components/DonutChart";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total_complaints: 0,
    pending: 0,
    resolved: 0,
    in_progress: 0,
    assigned: 0,
    common: 0,
    private: 0,
    recent: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      try {
        let user_id = null;
        try {
          const u = JSON.parse(localStorage.getItem('user') || 'null');
          user_id = u?.id || u?.user_id || null;
        } catch (e) { user_id = null; }

        if (!user_id) {
          console.warn('CustomerDashboard: no logged-in user');
          setIsLoading(false);
          return;
        }

        const url = `https://arlande-api.mababa.app/complaints/stats/user/${user_id}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch stats (${res.status})`);
        const data = await res.json();
        if (!mounted) return;
        setStats({
          total_complaints: data.total_complaints ?? data.total ?? 0,
          pending: data.pending ?? 0,
          resolved: data.resolved ?? 0,
          in_progress: data.in_progress ?? data['in progress'] ?? 0,
          assigned: data.assigned ?? 0,
          common: data.common ?? 0,
          private: data.private ?? 0,
          recent: data.recent ?? 0
        });

        // optionally fetch individual complaints for recent activity
        try {
          const listRes = await fetch(`https://arlande-api.mababa.app/complaints/user/${user_id}`);
          if (listRes.ok) {
            const listData = await listRes.json();
            const arr = Array.isArray(listData) ? listData : (listData.results || (listData ? [listData] : []));
            const mapped = arr.map(item => ({
              id: item.id,
              title: item.title,
              status: item.status || '',
              created: item.created_at ? new Date(item.created_at).toLocaleString() : (item.created || '')
            }));
            if (mounted) setComplaints(mapped);
          }
        } catch (e) {
          console.warn('Failed to fetch user complaints list', e);
        }

      } catch (err) {
        console.error('Failed to load customer stats', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-28">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Complaints Overview</h2>
          <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full">Customer</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{isLoading ? '—' : stats.total_complaints}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Pending</h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{isLoading ? '—' : stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Resolved</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{isLoading ? '—' : stats.resolved}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">In Progress</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{isLoading ? '—' : stats.in_progress}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 col-span-1 h-64 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full max-w-xs">
                <DonutChart
                  data={isLoading ? [0, 0] : [stats.private || 0, stats.common || 0]}
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
              <div className="text-center py-12 text-gray-600 dark:text-gray-300">No complaints yet.</div>
            ) : (
              <ul className="space-y-2">
                {complaints.map((c, idx) => {
                  const s = (c.status || '').toString().toLowerCase();
                  const label = s ? (s.charAt(0).toUpperCase() + s.slice(1)) : '';
                  const cls = s === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    s === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                    (s === 'in progress' || s === 'in_progress' || s === 'processing') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                    'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200';

                  return (
                    <li key={c.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                      <span className="text-gray-800 dark:text-gray-100">{c.title}</span>
                      <span className={`px-2 py-1 rounded text-xs ${cls}`}>{label}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <BottomNav active={activeTab} />
    </div>
  );
}
