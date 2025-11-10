import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    country: "",
    city: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    // Send data to backend
  };

  return (
    <div className="login-page">
      {/* LEFT IMAGE SIDE */}
      <div className="login-left">
        <div className="login-overlay">
          <h1>Welcome!</h1>
          <p>Create your Customer Complaint account</p>
        </div>
      </div>

      {/* RIGHT FORM SIDE */}
      <div className="login-right">
        <div className="login-form-box">
          {/* STEP INDICATOR */}
          <div className="step-indicator">
            <span className={step === 1 ? "dot active" : "dot"}></span>
            <span className={step === 2 ? "dot active" : "dot"}></span>
          </div>

          <h2>Create Account</h2>
          <p className="subtitle">
            {step === 1 ? "Step 1 — Personal Information" : "Step 2 — Location Information"}
          </p>

          <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}>
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    placeholder="Enter middle name"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
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
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City / Town</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>District</label>
                  <input
                    type="text"
                    name="district"
                    placeholder="Enter district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sector</label>
                  <input
                    type="text"
                    name="sector"
                    placeholder="Enter sector"
                    value={formData.sector}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Cell</label>
                  <input
                    type="text"
                    name="cell"
                    placeholder="Enter cell"
                    value={formData.cell}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Village</label>
                  <input
                    type="text"
                    name="village"
                    placeholder="Enter village"
                    value={formData.village}
                    onChange={handleChange}
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
            Already have an account?
            <span className="auth-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
