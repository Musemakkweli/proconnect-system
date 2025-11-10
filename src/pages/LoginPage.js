import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer"); // default role

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo: redirect based on role
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "employee") navigate("/employee/dashboard");
    else navigate("/customer/dashboard");
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE IMAGE */}
      <div className="login-left">
        <div className="login-overlay">
          <h1>Welcome Back!</h1>
          <p>Login to your Customer Complaint account</p>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="login-right">
        <div className="login-form-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" required />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer">Customer</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="auth-btn">Login</button>
          </form>

          {/* ✅ Link to Register */}
          <div className="auth-footer">
            Don't have an account?
            <span
              className="auth-link"
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
