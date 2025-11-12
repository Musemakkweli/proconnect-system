import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

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
      const res = await fetch("http://localhost:8000/register", {
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
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Network Error");
    }
  };

  return (
    <div className="login-page">
      {/* LEFT IMAGE */}
      <div className="login-left">
        <div className="login-overlay">
          <h1>Welcome!</h1>
          <p>Create your Customer Complaint account</p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="login-right">
        <div className="login-form-box">
          {/* Step indicator */}
          <div className="step-indicator">
            <span className={step === 1 ? "dot active" : "dot"}></span>
            <span className={step === 2 ? "dot active" : "dot"}></span>
          </div>

          <h2>Create Account</h2>

          <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}>
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Enter your full name"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button type="button" className="step-btn next" onClick={nextStep}>
                    Next
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button type="button" className="step-btn back" onClick={prevStep}>
                    Back
                  </button>
                  <button type="submit" className="step-btn next">
                    Register
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <span className="auth-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
