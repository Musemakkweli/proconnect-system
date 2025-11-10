import React, { useState } from "react";
import "../styles/adminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo">Customer Complaints</div>
        <div className="menu">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={activeTab === "dashboard" ? "active" : ""}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("viewComplaints")}
            className={activeTab === "viewComplaints" ? "active" : ""}
          >
            View Complaints
          </button>
          <button
            onClick={() => setActiveTab("addComplaint")}
            className={activeTab === "addComplaint" ? "active" : ""}
          >
            Add Complaint
          </button>
          <button
            onClick={() => setActiveTab("assignTask")}
            className={activeTab === "assignTask" ? "active" : ""}
          >
            Assign Task
          </button>
          <button
            onClick={() => setActiveTab("manageEmployees")}
            className={activeTab === "manageEmployees" ? "active" : ""}
          >
            Manage Employees
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={activeTab === "profile" ? "active" : ""}
          >
            Profile
          </button>
        </div>
        <button className="sidebar-logout">Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="content-area">
        {activeTab === "dashboard" && (
          <>
            <div className="top-header">
              <h2>Dashboard</h2>
              <span>Admin</span>
            </div>
            <div className="stats-section">
              <div className="stat-card">
                <h3>Total Complaints</h3>
                <p>50</p>
              </div>
              <div className="stat-card">
                <h3>Pending</h3>
                <p>12</p>
              </div>
              <div className="stat-card">
                <h3>In Progress</h3>
                <p>25</p>
              </div>
              <div className="stat-card">
                <h3>Resolved</h3>
                <p>13</p>
              </div>
            </div>
            <div className="table-section">
              <h2>Recent Complaints</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Employee</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>John Doe</td>
                    <td>Jane Smith</td>
                    <td>Pending</td>
                    <td>2025-11-10</td>
                    <td>
                      <button className="assign-btn">Assign</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "viewComplaints" && (
          <div className="table-section">
            <h2>All Complaints</h2>
            <p>Table of all complaints will appear here...</p>
          </div>
        )}

        {activeTab === "addComplaint" && (
          <div className="table-section">
            <h2>Add Complaint</h2>
            <form className="profile-form">
              <div className="form-group">
                <label>Customer Name</label>
                <input type="text" placeholder="Enter customer name" />
              </div>
              <div className="form-group">
                <label>Complaint Details</label>
                <textarea placeholder="Enter complaint details"></textarea>
              </div>
              <button className="auth-btn">Add Complaint</button>
            </form>
          </div>
        )}

        {activeTab === "assignTask" && (
          <div className="table-section">
            <h2>Assign Complaint</h2>
            <form className="profile-form">
              <div className="form-group">
                <label>Select Complaint</label>
                <select>
                  <option>Complaint 1</option>
                  <option>Complaint 2</option>
                </select>
              </div>
              <div className="form-group">
                <label>Select Employee</label>
                <select>
                  <option>Employee 1</option>
                  <option>Employee 2</option>
                </select>
              </div>
              <button className="auth-btn">Assign Task</button>
            </form>
          </div>
        )}

        {activeTab === "manageEmployees" && (
          <div className="table-section">
            <h2>Manage Employees</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Jane Smith</td>
                  <td>jane@example.com</td>
                  <td>+250700000000</td>
                  <td>
                    <button className="assign-btn">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="table-section">
            <h2>Update Profile</h2>
            <form className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Admin Name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="admin@example.com" />
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
