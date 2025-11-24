import React, { useState } from "react";
import BottomNav from "../components/BottomNav";
import DonutChart from "../components/DonutChart";

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [tasks] = useState([
    { id: 1, title: "Task #1", status: "Pending", created: "2025-11-10", private: true },
    { id: 2, title: "Task #2", status: "Completed", created: "2025-11-08", private: false },
    { id: 3, title: "Task #3", status: "In Progress", created: "2025-11-12", private: false },
    { id: 4, title: "Task #4", status: "Pending", created: "2025-11-09", private: true },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-28">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tasks Overview</h2>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full">Employee</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Tasks</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tasks.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Pending</h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{tasks.filter(t => t.status === "Pending").length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">In Progress</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{tasks.filter(t => t.status === "In Progress").length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Completed</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{tasks.filter(t => t.status === "Completed").length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 col-span-1 h-64 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full max-w-xs">
                <DonutChart
                  data={[
                    tasks.filter(t => t.private).length,
                    tasks.filter(t => !t.private).length,
                  ]}
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
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-300">No tasks yet.</div>
            ) : (
              <ul className="space-y-2">
                {tasks.map((t, idx) => (
                  <li key={t.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                    <span className="text-gray-800 dark:text-gray-100">{t.title}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      t.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      t.status === 'Pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    }`}>{t.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <BottomNav active={activeTab} />
    </div>
  );
}
