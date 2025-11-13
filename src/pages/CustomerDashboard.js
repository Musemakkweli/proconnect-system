import React, { useState } from "react";
import "../styles/customerDashboard.css";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [complaints, setComplaints] = useState([
    { id: 1, title: "Leaky faucet", status: "Pending", assigned: "John", created: "2025-11-10" },
    { id: 2, title: "Room cleaning request", status: "Resolved", assigned: "Jane", created: "2025-11-08" },
  ]);

  return (
    <div className="customer-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo">My Complaints</div>
        <div className="menu">
          <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}>Dashboard</button>
          <button onClick={() => setActiveTab("myComplaints")} className={activeTab === "myComplaints" ? "active" : ""}>My Complaints</button>
          <button onClick={() => setActiveTab("addComplaint")} className={activeTab === "addComplaint" ? "active" : ""}>Add Complaint</button>
          <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active" : ""}>Profile</button>
        </div>
        <button className="sidebar-logout">Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="content-area">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <div className="top-header">
              <h2>Dashboard</h2>
              <span>Customer</span>
            </div>
            <div className="stats-section">
              <div className="stat-card">
                <h3>Total Complaints</h3>
                <p>{complaints.length}</p>
              </div>
              <div className="stat-card">
                <h3>Pending</h3>
                <p>{complaints.filter(c => c.status === "Pending").length}</p>
              </div>
              <div className="stat-card">
                <h3>Resolved</h3>
                <p>{complaints.filter(c => c.status === "Resolved").length}</p>
              </div>
              <div className="stat-card">
                <h3>In Progress</h3>
                <p>{complaints.filter(c => c.status === "In Progress").length}</p>
              </div>
            </div>
            <div className="table-section">
              <h2>Recent Activity</h2>
              <ul>
                {complaints.map(c => (
                  <li key={c.id}>{c.title} - {c.status}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* MY COMPLAINTS */}
        {activeTab === "myComplaints" && (
          <div className="table-section">
            <h2>My Complaints</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Assigned</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.title}</td>
                    <td>{c.status}</td>
                    <td>{c.assigned}</td>
                    <td>{c.created}</td>
                    <td><button className="auth-btn">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ADD COMPLAINT */}
        {activeTab === "addComplaint" && (
          <div className="table-section">
            <h2>Add Complaint</h2>
            <form className="profile-form">
              <div className="form-group">
                <label>Title</label>
                <input type="text" placeholder="Complaint title" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select>
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Cleaning</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Describe the issue"></textarea>
              </div>
              <button className="auth-btn">Submit Complaint</button>
            </form>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="table-section">
            <h2>Profile</h2>
            <form className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your Name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" placeholder="Phone number" />
              </div>
              <button className="auth-btn">Update Profile</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
