import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // registration logic here
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        <p className="subtitle">Join ProConnect today</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="auth-btn">
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?
          <span className="auth-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
