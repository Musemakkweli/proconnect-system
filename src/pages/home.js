import React from "react";
import "../styles/home.css";
import img2 from "../assets/img2.jpg";
import { useNavigate } from "react-router-dom";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faCogs,
  faHandsHelping,
  faEnvelope,
  faCar,
  faScissors,
  faTools,
  faUtensils,
  faBroom,
  faCalculator,
  faCarSide,
  faHeadset,
  faLaptopCode,
  faHammer,
  faUserTie,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* HEADER */}
      <header className="header">
        <h1 className="logo">
          <FontAwesomeIcon icon={faHome} /> ProConnect
        </h1>
        <nav className="nav">
          <a href="#about">
            <FontAwesomeIcon icon={faInfoCircle} /> About
          </a>
          <a href="#services">
            <FontAwesomeIcon icon={faCogs} /> Services
          </a>
          <a href="#how">
            <FontAwesomeIcon icon={faHandsHelping} /> How it Works
          </a>
          <a href="#team">
            <FontAwesomeIcon icon={faUserTie} /> Our Team
          </a>
          <a href="#contact">
            <FontAwesomeIcon icon={faEnvelope} /> Contact
          </a>
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
          <button className="cta" onClick={() => navigate("/login")}>
            Get Started
          </button>
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
            From mechanics, tailors, and chefs to developers, IT support, and
            more, we make finding trusted services easy and reliable.
          </p>
          <p>
            Our co-founder, <strong>Belyse</strong>, started ProConnect to empower
            local talent and help people access professional services conveniently.
          </p>
          <p>
            By using ProConnect, you contribute to economic growth, employment,
            and better access to services throughout Rwanda.
          </p>
        </div>
        <div className="about-image">
          <img src={img2} alt="ProConnect illustration" />
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

      {/* OUR TEAM */}
      <section id="team" className="team">
        <h3>Our Team</h3>
        <div className="team-grid">
          <div className="team-member">
            <img src="/images/belyse.jpg" alt="Belyse Arlande" className="team-photo"/>
            <h4>Belyse Arlande</h4>
            <p>Co-Founder & CEO</p>
            <p>Leads company strategy and growth, ensuring high-quality service for clients.</p>
          </div>
          <div className="team-member">
            <img src="/images/john.jpg" alt="John Doe" className="team-photo"/>
            <h4>John Doe</h4>
            <p>HR Manager</p>
            <p>Manages recruitment, employee relations, and team well-being.</p>
          </div>
          <div className="team-member">
            <img src="/images/jane.jpg" alt="Jane Smith" className="team-photo"/>
            <h4>Jane Smith</h4>
            <p>Operations Head</p>
            <p>Coordinates daily operations and ensures smooth delivery of services.</p>
          </div>
          <div className="team-member">
            <img src="/images/michael.jpg" alt="Michael" className="team-photo"/>
            <h4>Michael</h4>
            <p>IT Lead</p>
            <p>Oversees technical systems, website, and software development projects.</p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services">
        <h3>Our Services</h3>
        <div className="services-grid">
          <div className="service-box">
            <FontAwesomeIcon icon={faCar} size="2x" />
            <h4>Mechanics</h4>
            <p>Certified experts for car repairs & maintenance.</p>
          </div>
          <div className="service-box">
            <FontAwesomeIcon icon={faScissors} size="2x" />
            <h4>Tailors</h4>
            <p>Custom clothes, alterations and design.</p>
          </div>
          <div className="service-box">
            <FontAwesomeIcon icon={faTools} size="2x" />
            <h4>Technicians</h4>
            <p>Installations, repairs of electronics & appliances.</p>
          </div>
          <div className="service-box">
            <FontAwesomeIcon icon={faUtensils} size="2x" />
            <h4>Chefs</h4>
            <p>Professional chefs for events, catering, and home services.</p>
          </div>
          <div className="service-box">
            <FontAwesomeIcon icon={faBroom} size="2x" />
            <h4>Cleaners</h4>
            <p>Reliable cleaning services for homes and offices.</p>
          </div>
          <div className="service-box">
            <FontAwesomeIcon icon={faCalculator} size="2x" />
            <h4>Accountants</h4>
            <p>Financial experts to help manage books and taxes.</p>
          </div>
          <div className="service-box">
            <FontAwesomeIcon icon={faCarSide} size="2x" />
            <h4>Drivers</h4>
            <p>Professional drivers for transport and deliveries.</p>
          </div>
          <div className="service-box">
            <FontAwesomeIcon icon={faHeadset} size="2x" />
            <h4>Customer Service</h4>
            <p>Support staff to manage client inquiries efficiently.</p>
          </div>
          <div className="service-box">
            <FontAwesomeIcon icon={faLaptopCode} size="2x" />
            <h4>IT Support & Developers</h4>
            <p>Technical support and development for websites, apps, and software.</p>
          </div>
          <div className="service-box">
            <FontAwesomeIcon icon={faHammer} size="2x" />
            <h4>Craftsmen</h4>
            <p>Skilled artisans for furniture, decoration, and other crafts.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="footer">
        <div className="footer-grid">
          <div className="footer-column">
            <h4>ProConnect</h4>
            <p>Connecting clients with verified professionals across Rwanda.</p>
            <p>© {new Date().getFullYear()} ProConnect. All rights reserved.</p>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <p>
              <FontAwesomeIcon icon={faEnvelope} /> Email: info@proconnect.rw
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} /> Phone: +250 788 123 456
            </p>
          </div>
          <div className="footer-column">
            <h4>Location</h4>
            <p>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Kigali, Rwanda
            </p>
            <p>Next to XYZ landmark, Gasabo District</p>
          </div>
          <div className="footer-column">
            <h4>Follow Us</h4>
            <p>
              <FontAwesomeIcon icon={faFacebook} /> Facebook
            </p>
            <p>
              <FontAwesomeIcon icon={faTwitter} /> Twitter
            </p>
            <p>
              <FontAwesomeIcon icon={faInstagram} /> Instagram
            </p>
            <p>
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
