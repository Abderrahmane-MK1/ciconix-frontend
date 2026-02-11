import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../Utils/auth';
import './Navbar.css';

const Navbar = () => {
  const teamName = localStorage.getItem('team_name') || 'Team';
  const [isMenuOpen, setIsMenuOpen] = useState(false); //humbruger menu state
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-header">
            <Link to="/dashboard" onClick={closeMenu}>
              <img src="images/Beige logo.png" alt="CICONIX Logo" className='ciconix-logo'/>
            </Link>
          </div>
          
          <div className="navbar-links">
            <Link to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
            <Link to="/ctf-platform" className="nav-link" onClick={closeMenu}>CTF Challenges</Link>
            <Link to="/submit-token" className="nav-link" onClick={closeMenu}>Submit Token</Link>
            <Link to="/submit-project" className="nav-link" onClick={closeMenu}>Submit Project</Link>
            <Link to="/leaderboard" className="nav-link" onClick={closeMenu}>Leaderboard</Link>
          </div>
          
          <div className="team-infos">
            <span className="team-name">{teamName}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
          
          {/* Hamburger Menu */}
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
      
      {/* Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <span className="mobile-team-name">{teamName}</span>
        </div>
        
        <div className="mobile-menu-links">
          <Link to="/dashboard" className="mobile-nav-link" onClick={closeMenu}>
            <span>Dashboard</span>
          </Link>
          <Link to="/ctf-platform" className="mobile-nav-link" onClick={closeMenu}>
            <span>CTF Challenges</span>
          </Link>
          <Link to="/submit-token" className="mobile-nav-link" onClick={closeMenu}>
            <span>Submit Tokens</span>
          </Link>
          <Link to="/submit-project" className="mobile-nav-link" onClick={closeMenu}>
            <span>Submit Project</span>
          </Link>
          <Link to="/leaderboard" className="mobile-nav-link" onClick={closeMenu}>
            <span>Leaderboard</span>
          </Link>
        </div>
        
        <div className="mobile-menu-footer">
          <button onClick={handleLogout} className="mobile-logout-btn">
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;