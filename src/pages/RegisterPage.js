import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faEnvelope, faLock, faEye, faEyeSlash, faInfoCircle, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export default function RegisterPage({ toast }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  // ✅ REGISTER — send to FastAPI backend with validation and loading state
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors([]);
    setFieldErrors({});

    // client-side validation
    const nextErrors = [];
    const nextFieldErrors = {};
    const phoneDigits = (formData.phone || "").replace(/\D/g, "");
    
    if (!formData.fullname || formData.fullname.trim().length < 2) {
      nextErrors.push("Full name must be at least 2 characters");
      nextFieldErrors.fullname = "Full name must be at least 2 characters";
    }
    
    if (!formData.email?.trim()) {
      nextErrors.push("Email is required");
      nextFieldErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.push("Enter a valid email address");
      nextFieldErrors.email = "Enter a valid email address";
    }
    
    if (!formData.phone?.trim()) {
      nextErrors.push("Phone number is required");
      nextFieldErrors.phone = "Phone number is required";
    } else if (phoneDigits.length !== 10) {
      nextErrors.push("Phone must contain exactly 10 digits");
      nextFieldErrors.phone = "Phone must contain exactly 10 digits";
    }
    
    if (!formData.password?.trim()) {
      nextErrors.push("Password is required");
      nextFieldErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      nextErrors.push("Password must be at least 6 characters");
      nextFieldErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword?.trim()) {
      nextErrors.push("Please confirm your password");
      nextFieldErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.push("Passwords do not match");
      nextFieldErrors.confirmPassword = "Passwords do not match";
    }

    if (nextErrors.length) {
      setErrors(nextErrors);
      setFieldErrors(nextFieldErrors);
      // show first error as toast
      if (toast?.error) toast.error(nextErrors[0]);
      return;
    }

    setErrors([]);
    setFieldErrors({});
    setIsLoading(true);

    const payload = {
      fullname: formData.fullname,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      employee_id: "",
      role: "customer",
    };

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.detail || data.message || "Registration failed";
        setErrors([msg]);
        if (toast?.error) toast.error(msg);
        return;
      }

      const successMsg = data.message || "Registered successfully!";
      if (toast?.success) toast.success(successMsg);
      // navigate after a short delay so toast is visible
      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      console.error(err);
      const errorMsg = "Network error. Please check your connection.";
      setErrors([errorMsg]);
      if (toast?.error) toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Theme and UI helpers (match login look)
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
      // ignore
    }
  }, [theme]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-sm shadow hover:shadow-md transition-colors flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
          </button>

          {/* Info icon */}
          <div
            className="absolute top-4 left-4"
            onMouseEnter={() => setInfoVisible(true)}
            onMouseLeave={() => setInfoVisible(false)}
          >
            <button type="button" aria-label="About" className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow hover:shadow-md transition-colors">
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
            {infoVisible && (
              <div className="absolute left-0 mt-12 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-lg p-3 shadow-lg z-50">
                <strong className="block mb-1">How the complaints system works</strong>
                <div className="leading-tight">
                  Customers submit complaints here. Each complaint becomes a support request the company can update. Track live progress in your dashboard until resolution.
                </div>
              </div>
            )}
          </div>

          {/* Brand */}
          <div className="flex justify-center mb-6">
           
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

          <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} className="space-y-4">
            {errors && errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-red-400 text-sm" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Please fix the following errors:</h3>
                    <div className="mt-2">
                      <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
                        {errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faUser} className={`${fieldErrors.fullname ? 'text-red-400' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type="text"
                      name="fullname"
                      placeholder="Full name"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className={`w-full pl-11 pr-4 py-2 rounded-xl border-2 ${fieldErrors.fullname ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700'} text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`}
                    />
                  </div>
                  {fieldErrors.fullname && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.fullname}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Phone</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faPhone} className={`${fieldErrors.phone ? 'text-red-400' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      autoComplete="tel"
                      className={`w-full pl-11 pr-4 py-2 rounded-xl border-2 ${fieldErrors.phone ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700'} text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faEnvelope} className={`${fieldErrors.email ? 'text-red-400' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className={`w-full pl-11 pr-4 py-2 rounded-xl border-2 ${fieldErrors.email ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700'} text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={nextStep} disabled={isLoading} className="py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faLock} className={`${fieldErrors.password ? 'text-red-400' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      className={`w-full pl-11 pr-12 py-2 rounded-xl border-2 ${fieldErrors.password ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700'} text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`}
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute inset-y-0 right-3 flex items-center text-slate-500 p-2">
                      {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faLock} className={`${fieldErrors.confirmPassword ? 'text-red-400' : 'text-slate-400'}`} />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      className={`w-full pl-11 pr-12 py-2 rounded-xl border-2 ${fieldErrors.confirmPassword ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700'} text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(s => !s)} className="absolute inset-y-0 right-3 flex items-center text-slate-500 p-2">
                      {showConfirmPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button type="button" onClick={prevStep} disabled={isLoading} className="py-3 px-6 bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                    Back
                  </button>
                  <button type="submit" disabled={isLoading} className="py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                    {isLoading ? (
                      <span className="flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Registering...
                      </span>
                    ) : (
                      'Register'
                    )}
                  </button>
                </div>
              </>
            )}

            <div className="text-center mt-3 text-sm text-slate-600 dark:text-slate-300">
              Already have an account?
              <button type="button" onClick={() => navigate('/')} className="ml-2 text-blue-600 hover:underline font-medium">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
