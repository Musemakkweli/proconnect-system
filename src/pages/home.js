import React from "react";
import "../styles/home.css";

export default function HomePage() {
  return (
    <div className="homepage">
      {/* HEADER */}
      <header className="header">
        <h1 className="logo">ProConnect</h1>
        <nav className="nav">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#how">How it Works</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h2>Find Trusted Professionals — Fast & Easy</h2>
          <p>
            Whether you need a mechanic, tailor, technician or more — we connect
            you with qualified help in Rwanda.
          </p>
          <button className="cta">Get Started</button>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stat-box">
          <h3>1,500+</h3>
          <p>Jobs Completed</p>
        </div>
        <div className="stat-box">
          <h3>400+</h3>
          <p>Verified Professionals</p>
        </div>
        <div className="stat-box">
          <h3>700+</h3>
          <p>Satisfied Clients</p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about split-about">
  <div className="about-text">
    <h3>About ProConnect</h3>
    <p>
      ProConnect connects clients with skilled professionals across Rwanda.
      From mechanics, tailors, and chefs to developers, IT support, and more,
      we make finding trusted services easy and reliable.
    </p>
    <p>
      Our co-founder, <strong>Belyse</strong>, started ProConnect to empower
      local talent and help people access professional services conveniently.
      Her vision is to bridge the gap between skilled workers and clients,
      creating opportunities for growth.
    </p>
    <p>
      By using ProConnect, you contribute to economic growth, employment, and
      better access to services throughout Rwanda.
    </p>
  </div>
  <div className="about-image">
    {/* You can add an <img src="..." /> or stickers here */}
    <img src="../assets/about-illustration.png" alt="ProConnect illustration" />
  </div>
</section>

      {/* HOW IT WORKS */}
      <section id="how" className="how-it-works">
        <h3>How It Works</h3>
        <div className="steps">
          <div className="step">
            <h4>1. Post Your Task</h4>
            <p>Tell us what you need and when.</p>
          </div>
          <div className="step">
            <h4>2. We Match</h4>
            <p>We find professionals near you.</p>
          </div>
          <div className="step">
            <h4>3. Hire & Review</h4>
            <p>Choose, hire and rate the service.</p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services">
        <h3>Our Services</h3>
        <div className="services-grid">
          <div className="service-box">
            <h4>Mechanics</h4>
            <p>Certified experts for car repairs & maintenance.</p>
          </div>
          <div className="service-box">
            <h4>Tailors</h4>
            <p>Custom clothes, alterations and design.</p>
          </div>
          <div className="service-box">
            <h4>Technicians</h4>
            <p>Installations, repairs of electronics & appliances.</p>
          </div>
          <div className="service-box">
            <h4>Chefs</h4>
            <p>Professional chefs for events, catering, and home services.</p>
          </div>
          <div className="service-box">
            <h4>Cleaners</h4>
            <p>Reliable cleaning services for homes and offices.</p>
          </div>
          <div className="service-box">
            <h4>Accountants</h4>
            <p>Financial experts to help manage books and taxes.</p>
          </div>
          <div className="service-box">
            <h4>Drivers</h4>
            <p>Professional drivers for transport and deliveries.</p>
          </div>
          <div className="service-box">
            <h4>Customer Service</h4>
            <p>Support staff to manage client inquiries efficiently.</p>
          </div>
          <div className="service-box">
            <h4>IT Support & Developers</h4>
            <p>Technical support and development for websites, apps, and software.</p>
          </div>
          <div className="service-box">
            <h4>Craftsmen</h4>
            <p>Skilled artisans for furniture, decoration, and other crafts.</p>
          </div>
        </div>
      </section>

    <footer id="contact" className="footer">
  <div className="footer-grid">
    <div className="footer-column">
      <h4>ProConnect</h4>
      <p>Connecting clients with verified professionals across Rwanda.</p>
      <p>© {new Date().getFullYear()} ProConnect. All rights reserved.</p>
    </div>
    <div className="footer-column">
      <h4>Contact</h4>
      <p>Email: info@proconnect.rw</p>
      <p>Phone: +250 788 123 456</p>
    </div>
    <div className="footer-column">
      <h4>Location</h4>
      <p>Kigali, Rwanda</p>
      <p>Next to XYZ landmark, Gasabo District</p>
    </div>
    <div className="footer-column">
      <h4>Follow Us</h4>
      <p>Facebook | Twitter | Instagram | LinkedIn</p>
    </div>
  </div>
</footer>
    </div>
  );
}
