import React, { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-blue-700">Customer Complaints</div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left px-4 py-2 rounded hover:bg-blue-700 ${
              activeTab === "dashboard" ? "bg-blue-600" : ""
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("viewComplaints")}
            className={`w-full text-left px-4 py-2 rounded hover:bg-blue-700 ${
              activeTab === "viewComplaints" ? "bg-blue-600" : ""
            }`}
          >
            View Complaints
          </button>
          <button
            onClick={() => setActiveTab("addComplaint")}
            className={`w-full text-left px-4 py-2 rounded hover:bg-blue-700 ${
              activeTab === "addComplaint" ? "bg-blue-600" : ""
            }`}
          >
            Add Complaint
          </button>
          <button
            onClick={() => setActiveTab("assignTask")}
            className={`w-full text-left px-4 py-2 rounded hover:bg-blue-700 ${
              activeTab === "assignTask" ? "bg-blue-600" : ""
            }`}
          >
            Assign Task
          </button>
          <button
            onClick={() => setActiveTab("manageEmployees")}
            className={`w-full text-left px-4 py-2 rounded hover:bg-blue-700 ${
              activeTab === "manageEmployees" ? "bg-blue-600" : ""
            }`}
          >
            Manage Employees
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2 rounded hover:bg-blue-700 ${
              activeTab === "profile" ? "bg-blue-600" : ""
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
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Admin</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Complaints</h3>
                <p className="text-3xl font-bold text-gray-900">50</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-3xl font-bold text-orange-600">12</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                <p className="text-3xl font-bold text-blue-600">25</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
                <p className="text-3xl font-bold text-green-600">13</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium">Recent Complaints</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jane Smith</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pending</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-11-10</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">Assign</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "viewComplaints" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">All Complaints</h2>
            <p className="text-gray-600">Table of all complaints will appear here...</p>
          </div>
        )}

        {activeTab === "addComplaint" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Add Complaint</h2>
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input type="text" placeholder="Enter customer name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Details</label>
                <textarea placeholder="Enter complaint details" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"></textarea>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Add Complaint</button>
            </form>
          </div>
        )}

        {activeTab === "assignTask" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Assign Complaint</h2>
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Complaint</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Complaint 1</option>
                  <option>Complaint 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Employee 1</option>
                  <option>Employee 2</option>
                </select>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Assign Task</button>
            </form>
          </div>
        )}

        {activeTab === "manageEmployees" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium">Manage Employees</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jane Smith</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">jane@example.com</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+250700000000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Update Profile</h2>
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" placeholder="Admin Name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="admin@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" placeholder="Enter new password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" placeholder="Phone number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Update Profile</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
