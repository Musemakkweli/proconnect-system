import React, { useState, useEffect, useMemo } from "react";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

// Import your hero images from assets
import hero1 from "../assets/img2.jpg";
import hero2 from "../assets/img3.jpg";
import hero3 from "../assets/img4.jpg";

export default function HomePage() {
  const navigate = useNavigate();
  const heroImages = [hero1, hero2, hero3];
  const [currentHero, setCurrentHero] = useState(0);
  const [activeSection, setActiveSection] = useState("home");

  // Rotate hero images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Memoize sections so they don't change on every render
  const sections = useMemo(() => ({
    home: document.getElementById("home"),
    about: document.getElementById("about"),
    services: document.getElementById("services"),
    how: document.getElementById("how"),
    stats: document.getElementById("stats"),
    contact: document.getElementById("contact")
  }), []);

  // Highlight active nav link based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120; // adjust for header height
      for (const [key, section] of Object.entries(sections)) {
        if (section && scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
          setActiveSection(key);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <div className="homepage" id="home">

      {/* HEADER */}
      <header className="header professional-header">
        <h1 className="logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ComplaintPortal
        </h1>

        <nav className="nav">
          {["home", "about", "services", "how", "stats", "contact"].map((sec) => (
            <span
              key={sec}
              className={activeSection === sec ? "active" : ""}
              onClick={() => sections[sec]?.scrollIntoView({ behavior: "smooth" })}
            >
              {sec.charAt(0).toUpperCase() + sec.slice(1)}
            </span>
          ))}
        </nav>
      </header>
{/* HERO */}
<section className="hero professional-hero">
  {/* Image container */}
  <div className="hero-images-container">
    <img
      src={heroImages[currentHero]}
      alt="Hero"
      className="hero-image"
    />
  </div>

  {/* Text content below the image */}
  <div className="hero-content">
    <h2>Enhancing Customer Service Through Fast & Transparent Complaints Handling</h2>
    <p>
      A reliable and secure digital platform that enables organizations and customers 
      to manage complaints efficiently, ensuring clarity, responsiveness, and trust.
    </p>
    <button className="cta" onClick={() => navigate("/login")}>
      Submit a Complaint
    </button>
  </div>
</section>

      {/* ABOUT */}
      <section id="about" className="about professional-about">
        <div className="about-content">
          <h3>About ComplaintPortal</h3>
          <p>
            ComplaintPortal is a structured, organization-ready complaint management system 
            that allows customers to report issues while enabling institutions to track, 
            categorize, and resolve complaints efficiently.
          </p>
          <p>
            With its simplified interface and centralized tracking, the platform boosts 
            response efficiency, strengthens accountability, and ensures a better customer experience.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services professional-services">
        <h3>Key Complaint Categories</h3>
        <div className="services-grid">
          <div className="service-box">
            <h4>Service Delivery</h4>
            <p>Issues related to delays, quality of service, or unmet expectations.</p>
          </div>

          <div className="service-box">
            <h4>Billing & Payments</h4>
            <p>Concerns about incorrect charges, unclear billing, or refund requests.</p>
          </div>

          <div className="service-box">
            <h4>Technical Issues</h4>
            <p>System failures, outages, or interruptions in service.</p>
          </div>

          <div className="service-box">
            <h4>Customer Support</h4>
            <p>Unresolved queries, poor communication, or slow responses.</p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="how" className="how-it-works professional-process">
        <h3>How The System Works</h3>
        <div className="steps">
          <div className="step">
            <h4>1. Register</h4>
            <p>Create an account to access complaint services.</p>
          </div>

          <div className="step">
            <h4>2. Submit</h4>
            <p>Fill in your complaint details clearly and submit.</p>
          </div>

          <div className="step">
            <h4>3. Track Progress</h4>
            <p>Follow real-time updates until your complaint is resolved.</p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="stats professional-stats">
        <div className="stats-grid">
          <div className="stat-box">
            <h3>5,000+</h3>
            <p>Complaints Resolved</p>
          </div>
          <div className="stat-box">
            <h3>1,200+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-box">
            <h3>98%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="footer professional-footer">
        <div className="footer-grid">
          <div className="footer-column">
            <h4>ComplaintPortal</h4>
            <p>A centralized solution for efficient complaint handling.</p>
            <p>© {new Date().getFullYear()} ComplaintPortal. All rights reserved.</p>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <p>Email: support@complaintportal.com</p>
            <p>Phone: +250 787103047</p>
          </div>

          <div className="footer-column">
            <h4>Location</h4>
            <p>Kigali, Rwanda</p>
            <p>Head Office</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
