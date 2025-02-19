import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>CA Firm</h2>
          <p>Providing expert financial, taxation, and auditing services with a commitment to integrity and professionalism.</p>
        </div>
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>Email: info@cafirm.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: 123 Financial Street, Business City, India</p>
        </div>
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/services">Services</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 CA Firm. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;