import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" onClick={closeMenu} className="logo">
            <span className="logo-text">แอบต. แม่สายไทย</span>
          </Link>
        </div>

        <button 
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>
              หน้าแรก
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={closeMenu}>
              เกี่ยวกับเรา
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/news" className="nav-link" onClick={closeMenu}>
              ข่าวสาร
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/announcements" className="nav-link" onClick={closeMenu}>
              ประกาศ
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/eservice" className="nav-link" onClick={closeMenu}>
              e-Service
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/complaint" className="nav-link" onClick={closeMenu}>
              ร้องเรียน
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={closeMenu}>
              ติดต่อเรา
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
