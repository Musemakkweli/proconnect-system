import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";

export default function LoginBox({ compact } = {}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleForgotPassword = () => {
    alert("Please contact support to reset your password.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || "Login failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      if (data.user.role === "admin") navigate("/admin/dashboard");
      else if (data.user.role === "employee") navigate("/employee/dashboard");
      else navigate("/customer/dashboard");
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={compact ? "w-full max-w-md" : "w-full max-w-md"}>
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Sign In</h3>
          <p className="text-sm text-gray-500">Access your complaint management account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your registered email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <button type="button" onClick={handleForgotPassword} className="text-sm text-blue-600 hover:underline">Forgot Password?</button>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">or</div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          <button onClick={() => navigate("/register")} className="ml-2 text-blue-600 font-medium">Create Account</button>
        </p>
      </div>
    </div>
  );
}
