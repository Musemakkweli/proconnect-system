import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSun, faMoon, faEye, faEyeSlash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function LoginBox({ compact, centered = true } = {}) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
      localStorage.setItem("theme", theme);
    } catch (e) {
      // ignore (e.g., during SSR)
    }
  }, [theme]);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const [infoVisible, setInfoVisible] = useState(false);

  const Card = (
    <div className="w-full max-w-md">
      <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300">
        {/* Theme toggle inside card (top-right) */}
        <button
          type="button"
          onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-sm shadow hover:shadow-md transition-colors flex items-center justify-center"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <FontAwesomeIcon icon={faSun} />
          ) : (
            <FontAwesomeIcon icon={faMoon} />
          )}
        </button>

        {/* Brand mark */}
        <div className="flex justify-center mb-8">
         
        </div>

        {/* Info icon (left of theme toggle area) */}
        <div
          className="absolute top-4 left-4"
          onMouseEnter={() => setInfoVisible(true)}
          onMouseLeave={() => setInfoVisible(false)}
        >
          <button
            type="button"
            aria-label="About this system"
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow hover:shadow-md transition-colors"
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </button>
          {infoVisible && (
            <div className="absolute left-0 mt-12 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-lg p-3 shadow-lg z-50">
              <strong className="block mb-1">How the complaints system works</strong>
              <div className="leading-tight">
                Customers submit complaints about products or services here. Each complaint becomes a support request that the company can view and update. You can track progress and live updates in your dashboard until the issue is resolved.
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Email address"
                className="w-full pl-11 pr-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Password"
                className="w-full pl-11 pr-16 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </button>
            </div>
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
              <input 
                type="checkbox" 
                className="mr-3 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2" 
              /> 
              Remember me
            </label>
            <button 
              type="button" 
              onClick={handleForgotPassword} 
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
            <div className="text-center mt-4 text-sm text-slate-600 dark:text-slate-300">
              Don't have an account?
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="ml-2 text-blue-600 hover:underline font-medium"
              >
                Sign up
              </button>
            </div>
        </form>
      </div>
    </div>
  );

  if (centered) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        {Card}
      </div>
    );
  }

  return Card;
}
