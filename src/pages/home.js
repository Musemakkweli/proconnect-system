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
          {/* Professional illustration placeholder - will show business chart emoji */}
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
            <h4>Technicians</h4>
            <p>Professional technicians for installations, repairs of electronics & appliances.</p>
          </div>
          <div className="service-box">
            <h4>Craftsmen</h4>
            <p>Skilled artisans for furniture, decoration, and other quality crafts.</p>
          </div>
          <div className="service-box">
            <h4>Tailors</h4>
            <p>Expert tailors for custom clothes, alterations and design services.</p>
          </div>
          <div className="service-box">
            <h4>Mechanics</h4>
            <p>Certified automotive experts for car repairs & maintenance services.</p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="team">
        <h3>Meet Our Team</h3>
        <div className="team-grid">
          <div className="team-member">
            <div className="team-photo"></div>
            <h4>John Musemakweli</h4>
            <div className="role">CEO & Founder</div>
            <div className="contact">john@proconnect.rw</div>
          </div>
          <div className="team-member">
            <div className="team-photo"></div>
            <h4>Belyse Uwimana</h4>
            <div className="role">Co-Founder & Operations</div>
            <div className="contact">belyse@proconnect.rw</div>
          </div>
          <div className="team-member">
            <div className="team-photo"></div>
            <h4>David Niyonshuti</h4>
            <div className="role">Technical Director</div>
            <div className="contact">david@proconnect.rw</div>
          </div>
          <div className="team-member">
            <div className="team-photo"></div>
            <h4>Grace Mukamana</h4>
            <div className="role">Marketing Manager</div>
            <div className="contact">grace@proconnect.rw</div>
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
   
  </div>
</footer>
    </div>
  );
}
