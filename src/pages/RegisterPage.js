import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  // ✅ REGISTER — send to FastAPI backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = {
      fullname: formData.fullname,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
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
        alert(data.detail || "Registration failed");
        return;
      }

      alert("Registered successfully!");
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Network Error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-4 md:mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: branding */}
        <div className="hidden md:flex flex-col items-start justify-center p-10 rounded-lg text-white bg-gradient-to-br from-blue-600 to-cyan-400">
          <h1 className="text-4xl font-extrabold">Welcome!</h1>
          <p className="mt-3 text-lg">Create your Customer Complaint account</p>
        </div>

        {/* RIGHT: register form */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-xl p-6 shadow">
            {/* Step indicator */}
            <div className="flex justify-center mb-6">
              <div className={`w-3 h-3 rounded-full mr-2 ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

            <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}>
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Enter your full name"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md" onClick={nextStep}>
                    Next
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-between">
                  <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md" onClick={prevStep}>
                    Back
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                    Register
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button onClick={() => navigate("/")} className="text-blue-600 font-medium hover:underline">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
);
}
