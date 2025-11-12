import React, { useState } from "react";
import "../styles/employeeDashboard.css";

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="employee-container">
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
            onClick={() => setActiveTab("myTasks")}
            className={activeTab === "myTasks" ? "active" : ""}
          >
            My Tasks
          </button>
          <button
            onClick={() => setActiveTab("updateStatus")}
            className={activeTab === "updateStatus" ? "active" : ""}
          >
            Update Status
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
              <span>Employee</span>
            </div>
            <div className="stats-section">
              <div className="stat-card">
                <h3>Total Tasks</h3>
                <p>20</p>
              </div>
              <div className="stat-card">
                <h3>Pending</h3>
                <p>5</p>
              </div>
              <div className="stat-card">
                <h3>In Progress</h3>
                <p>10</p>
              </div>
              <div className="stat-card">
                <h3>Completed</h3>
                <p>5</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "myTasks" && (
          <div className="table-section">
            <h2>My Assigned Tasks</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Complaint</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>Internet not working</td>
                  <td>In Progress</td>
                  <td>2025-11-11</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "updateStatus" && (
          <div className="table-section">
            <h2>Update Task Status</h2>
            <form className="profile-form">
              <div className="form-group">
                <label>Select Task</label>
                <select>
                  <option>Task 1</option>
                  <option>Task 2</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <button className="auth-btn">Update Status</button>
            </form>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="table-section">
            <h2>Update Profile</h2>
            <form className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Employee Name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="employee@example.com" />
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
