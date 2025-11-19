import React, { useState } from "react";

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-purple-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-purple-700">Customer Complaints</div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left px-4 py-2 rounded hover:bg-purple-700 ${
              activeTab === "dashboard" ? "bg-purple-600" : ""
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("myTasks")}
            className={`w-full text-left px-4 py-2 rounded hover:bg-purple-700 ${
              activeTab === "myTasks" ? "bg-purple-600" : ""
            }`}
          >
            My Tasks
          </button>
          <button
            onClick={() => setActiveTab("updateStatus")}
            className={`w-full text-left px-4 py-2 rounded hover:bg-purple-700 ${
              activeTab === "updateStatus" ? "bg-purple-600" : ""
            }`}
          >
            Update Status
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2 rounded hover:bg-purple-700 ${
              activeTab === "profile" ? "bg-purple-600" : ""
            }`}
          >
            Profile
          </button>
        </nav>
        <div className="p-4">
          <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "dashboard" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Employee</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
                <p className="text-3xl font-bold text-gray-900">20</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-3xl font-bold text-orange-600">5</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                <p className="text-3xl font-bold text-blue-600">10</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="text-3xl font-bold text-green-600">5</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "myTasks" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium">My Assigned Tasks</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Internet not working</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">In Progress</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-11-11</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "updateStatus" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Update Task Status</h2>
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Task</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Task 1</option>
                  <option>Task 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">Update Status</button>
            </form>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Update Profile</h2>
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" placeholder="Employee Name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="employee@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" placeholder="Enter new password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" placeholder="Phone number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">Update Profile</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
