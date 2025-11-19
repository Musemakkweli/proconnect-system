import React, { useState } from "react";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [complaints] = useState([
    { id: 1, title: "Leaky faucet", status: "Pending", assigned: "John", created: "2025-11-10" },
    { id: 2, title: "Room cleaning request", status: "Resolved", assigned: "Jane", created: "2025-11-08" },
  ]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-green-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-green-700">My Complaints</div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full text-left px-4 py-2 rounded hover:bg-green-700 ${activeTab === "dashboard" ? "bg-green-600" : ""}`}>Dashboard</button>
          <button onClick={() => setActiveTab("myComplaints")} className={`w-full text-left px-4 py-2 rounded hover:bg-green-700 ${activeTab === "myComplaints" ? "bg-green-600" : ""}`}>My Complaints</button>
          <button onClick={() => setActiveTab("addComplaint")} className={`w-full text-left px-4 py-2 rounded hover:bg-green-700 ${activeTab === "addComplaint" ? "bg-green-600" : ""}`}>Add Complaint</button>
          <button onClick={() => setActiveTab("profile")} className={`w-full text-left px-4 py-2 rounded hover:bg-green-700 ${activeTab === "profile" ? "bg-green-600" : ""}`}>Profile</button>
        </nav>
        <div className="p-4">
          <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-auto">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Customer</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Complaints</h3>
                <p className="text-3xl font-bold text-gray-900">{complaints.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-3xl font-bold text-orange-600">{complaints.filter(c => c.status === "Pending").length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
                <p className="text-3xl font-bold text-green-600">{complaints.filter(c => c.status === "Resolved").length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                <p className="text-3xl font-bold text-blue-600">{complaints.filter(c => c.status === "In Progress").length}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
              <ul className="space-y-2">
                {complaints.map(c => (
                  <li key={c.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span>{c.title}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      c.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>{c.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* MY COMPLAINTS */}
        {activeTab === "myComplaints" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium">My Complaints</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complaints.map(c => (
                    <tr key={c.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.assigned}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.created}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADD COMPLAINT */}
        {activeTab === "addComplaint" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Add Complaint</h2>
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" placeholder="Complaint title" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Cleaning</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea placeholder="Describe the issue" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24"></textarea>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">Submit Complaint</button>
            </form>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Profile</h2>
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" placeholder="Your Name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="your@email.com" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" placeholder="Enter new password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" placeholder="Phone number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">Update Profile</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
