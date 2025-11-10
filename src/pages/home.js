// Cleaned HomePage component without any icons
import React from "react";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* HEADER */}
      <header className="header">
        <h1
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ComplaintPortal
        </h1>

        <nav className="nav">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Home
          </span>
          <a href="#about">About</a>
          <a href="#services">Complaint Types</a>
          <a href="#how">How it Works</a>
          <a href="#team">Our Team</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h2>Submit Your Complaints — Quick & Easy</h2>
          <p>
            A platform that allows customers to submit, track and resolve complaints
            easily while ensuring faster responses.
          </p>
          <button className="cta" onClick={() => navigate("/login")}>
            Submit Complaint
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
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
      </section>

      {/* ABOUT */}
      <section id="about" className="about split-about">
        <div className="about-text">
          <h3>About the Portal</h3>
          <p>
            ComplaintPortal is a system that allows users to register and submit
            service complaints for fast resolution.
          </p>
          <p>
            It is designed to be adaptable for any organization, providing a
            reliable, transparent customer-care solution.
          </p>
        </div>
        <div className="about-image"></div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="how-it-works">
        <h3>How It Works</h3>

        <div className="steps">
          <div className="step">
            <h4>1. Create an Account</h4>
            <p>Register using your basic information.</p>
          </div>

          <div className="step">
            <h4>2. Submit Complaint</h4>
            <p>Describe your complaint clearly and submit.</p>
          </div>

          <div className="step">
            <h4>3. Track Progress</h4>
            <p>Monitor status updates until resolution.</p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="team">
        <h3>Our Team</h3>
        <div className="team-grid">
          <div className="team-member">
            <img src="/images/person1.jpg" alt="Team Member" className="team-photo" />
            <h4>Alex Carter</h4>
            <p>Founder</p>
            <p>Oversees platform development and strategy.</p>
          </div>

          <div className="team-member">
            <img src="/images/person2.jpg" alt="Team Member" className="team-photo" />
            <h4>Morgan Lee</h4>
            <p>Support Lead</p>
            <p>Ensures customer complaints are resolved efficiently.</p>
          </div>

          <div className="team-member">
            <img src="/images/person3.jpg" alt="Team Member" className="team-photo" />
            <h4>Chris Taylor</h4>
            <p>Technical Lead</p>
            <p>Responsible for system performance.</p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services">
        <h3>Complaint Categories</h3>
        <div className="services-grid">
          <div className="service-box">
            <h4>Service Quality</h4>
            <p>Concerns about the quality of received services.</p>
          </div>

          <div className="service-box">
            <h4>Billing Issues</h4>
            <p>Incorrect billing, delayed invoices, and related issues.</p>
          </div>

          <div className="service-box">
            <h4>Technical Problems</h4>
            <p>System failures, technical errors, and interruptions.</p>
          </div>

          <div className="service-box">
            <h4>Customer Service</h4>
            <p>Poor handling, lack of feedback or delays.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="footer">
        <div className="footer-grid">
          <div className="footer-column">
            <h4>ComplaintPortal</h4>
            <p>A neutral platform for managing customer complaints.</p>
            <p>© {new Date().getFullYear()} ComplaintPortal. All rights reserved.</p>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <p>Email: support@complaintportal.com</p>
            <p>Phone: +250 787103047</p>
          </div>

          <div className="footer-column">
            <h4>Location</h4>
            <p>Kigali, RWANDA</p>
            <p>Main Office</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
