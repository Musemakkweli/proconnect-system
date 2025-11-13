import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import BASE_URL from "../config";   // ✅ add this line

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      // Store JWT token + user info
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      alert("Login successful");

      // Redirect based on role
      if (data.user.role === "admin") navigate("/admin/dashboard");
      else if (data.user.role === "employee") navigate("/employee/dashboard");
      else navigate("/customer/dashboard");

    } catch (error) {
      console.error(error);
      alert("Network Error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-overlay">
          <h1>Welcome Back!</h1>
          <p>Login to your Customer Complaint account</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-box">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-btn">Login</button>
          </form>

          <p className="auth-footer">
            Don’t have an account?
            <span className="auth-link" onClick={() => navigate("/register")}>
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
