import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonutChart from '../components/DonutChart';
import BarChart from '../components/BarChart';
import Card from '../components/Card';
import AdminBottomNav from '../components/AdminBottomNav';
import BASE_URL from '../config';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userCounts, setUserCounts] = useState([0, 0, 0]); // customers, employees, admins
  const [complaintStats, setComplaintStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    assigned: 0,
    common: 0,
    private: 0,
    recent: 0
  });

  useEffect(() => {
    let mounted = true;
    
    // Fetch users for user counts
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

    // WebSocket connection for complaint stats
    const ws = new WebSocket('wss://arlande-api.mababa.app/complaints/stats/ws');
    
    ws.onopen = () => {
      console.log('WebSocket connected to complaint stats');
      // if (mounted) setWsConnected(true);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received complaint stats:', data);
        if (mounted) {
          setComplaintStats({
            total: data.total || 0,
            pending: data.pending || 0,
            in_progress: data.in_progress || 0,
            resolved: data.resolved || 0,
            assigned: data.assigned || 0,
            common: data.common || 0,
            private: data.private || 0,
            recent: data.recent || 0
          });
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // if (mounted) setWsConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      // if (mounted) setWsConnected(false);
    };

    return () => { 
      mounted = false;
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-28">
      <div className="max-w-6xl mx-auto p-6">
       

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
              <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
                Complaint Statistics
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  (Total: {complaintStats.total})
                </span>
              </h2>
              <div className="h-full">
                <BarChart
                  labels={['Common','Private','Pending','In Progress','Resolved','Assigned']}
                  values={[
                    complaintStats.common,
                    complaintStats.private,
                    complaintStats.pending,
                    complaintStats.in_progress,
                    complaintStats.resolved,
                    complaintStats.assigned,
                  ]}
                  colors={["#06b6d4", "#7c3aed", "#f59e0b", "#3b82f6", "#10b981", "#ef4444"]}
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
