import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-section footer-brand">
              <h3 className="footer-title">🍲 Maesai Phayao</h3>
              <p className="footer-description">
                Authentic Northern Thai cuisine with a modern twist. Bringing the flavors of Phayao to your table.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">
                  f
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                  📷
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter">
                  𝕏
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-subtitle">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="#news">News</a></li>
                <li><a href="#menu">Menu</a></li>
                <li><a href="/gallery">Gallery</a></li>
              </ul>
            </div>

            {/* Hours */}
            <div className="footer-section">
              <h4 className="footer-subtitle">Hours</h4>
              <ul className="footer-links">
                <li><span className="day">Mon - Thu:</span> 10:00 AM - 10:00 PM</li>
                <li><span className="day">Fri - Sat:</span> 10:00 AM - 11:00 PM</li>
                <li><span className="day">Sunday:</span> 10:00 AM - 9:00 PM</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-section">
              <h4 className="footer-subtitle">Contact</h4>
              <ul className="footer-links">
                <li>📍 123 Phayao Road, Phayao</li>
                <li>📞 +66 (0) 54-000-1234</li>
                <li>📧 info@maesaiphayao.com</li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider"></div>

          {/* Bottom */}
          <div className="footer-bottom">
            <p>&copy; {currentYear} Maesai Phayao. All rights reserved.</p>
            <div className="footer-links-bottom">
              <a href="#privacy">Privacy Policy</a>
              <span className="separator">•</span>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;