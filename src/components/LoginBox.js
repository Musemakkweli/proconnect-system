import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function LoginBox({ centered = true, toast }) {
  const navigate = useNavigate();
  // Fixed professional design: no theme state or toggle
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleForgotPassword = () => {
    if (toast?.info) {
      toast.info("Please contact support to reset your password.");
    } else {
      alert("Please contact support to reset your password.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors([]);
    setFieldErrors({});
    
    // Client-side validation
    const newErrors = [];
    const newFieldErrors = {};
    

    
    if (!formData.password?.trim()) {
      newErrors.push("Password is required");
      newFieldErrors.password = "Password is required";
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setFieldErrors(newFieldErrors);
      if (toast?.error) toast.error(newErrors[0]);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.detail || "Login failed";
        setErrors([errorMsg]);
        if (toast?.error) toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      if (toast?.success) toast.success("Login successful!");

      if (data.user.role === "admin") navigate("/admin/dashboard");
      else if (data.user.role === "employee") navigate("/employee/dashboard");
      else navigate("/customer/dashboard");
    } catch (err) {
      console.error(err);
      const errorMsg = "Network error. Please check your connection.";
      setErrors([errorMsg]);
      if (toast?.error) toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const [infoVisible, setInfoVisible] = useState(false);

  const Card = (
    <div className="w-full max-w-md">
      <div className="relative bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200 transition-all duration-300">
        {/* Brand / Info */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Welcome back</h3>
            <p className="text-sm text-blue-600">Sign in to manage complaints and view your dashboard.</p>
          </div>
          <div className="relative" onMouseEnter={() => setInfoVisible(true)} onMouseLeave={() => setInfoVisible(false)}>
            <button type="button" aria-label="About this system" className="p-2 rounded-full bg-slate-100 text-slate-600 shadow-sm">
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
            {infoVisible && (
              <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-200 text-slate-800 text-sm rounded-lg p-3 shadow-lg z-50">
                <strong className="block mb-1">How the complaints system works</strong>
                <div className="leading-tight text-sm text-slate-600">
                  Customers submit complaints here. Each complaint becomes a support request the company can update. Track progress in your dashboard until resolution.
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-red-400 text-sm" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                  <div className="mt-2">
                    <ul className="list-disc list-inside text-sm text-red-700">
                      {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faEnvelope} className={`${fieldErrors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-600'} transition-colors`} />
              </div>
              <input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                
                disabled={isLoading}
                placeholder="Email address"
                className={`w-full pl-11 pr-4 py-2 rounded-xl border-2 ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'} text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 transition-all duration-200 disabled:opacity-50`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className={`${fieldErrors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-600'} transition-colors`} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                
                disabled={isLoading}
                placeholder="Password"
                className={`w-full pl-11 pr-16 py-2 rounded-xl border-2 ${fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'} text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 transition-all duration-200 disabled:opacity-50`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors p-2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-slate-600 cursor-pointer">
              <input 
                type="checkbox" 
                className="mr-3 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 focus:ring-2" 
              /> 
              Remember me
            </label>
            <button 
              type="button" 
              onClick={handleForgotPassword} 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            <div className="text-center mt-4 text-sm text-slate-600">
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        {Card}
      </div>
    );
  }

  return Card;
}
