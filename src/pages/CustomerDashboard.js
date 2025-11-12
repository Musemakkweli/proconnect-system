import React, { useState } from "react";
import "../styles/adminDashboard.css"; // reuse same CSS

export default function CustomerDashboard() {
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
            My Complaints
          </button>
          <button
            onClick={() => setActiveTab("addComplaint")}
            className={activeTab === "addComplaint" ? "active" : ""}
          >
            Add Complaint
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
              <span>Customer</span>
            </div>
            <div className="stats-section">
              <div className="stat-card">
                <h3>Total Complaints</h3>
                <p>5</p>
              </div>
              <div className="stat-card">
                <h3>Pending</h3>
                <p>2</p>
              </div>
              <div className="stat-card">
                <h3>Resolved</h3>
                <p>3</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "viewComplaints" && (
          <div className="table-section">
            <h2>My Complaints</h2>
            <p>Your submitted complaints will appear here...</p>
          </div>
        )}

        {activeTab === "addComplaint" && (
          <div className="table-section">
            <h2>Add Complaint</h2>
            <form className="profile-form">
              <div className="form-group">
                <label>Complaint Title</label>
                <input type="text" placeholder="Enter complaint title" />
              </div>
              <div className="form-group">
                <label>Complaint Details</label>
                <textarea placeholder="Enter complaint details"></textarea>
              </div>
              <button className="auth-btn">Submit Complaint</button>
            </form>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="table-section">
            <h2>Update Profile</h2>
            <form className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Customer Name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="customer@example.com" />
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
