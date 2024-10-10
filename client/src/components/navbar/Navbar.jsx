import React, { useState, useEffect } from 'react';
import "./navbar.css";
import { BsChatDotsFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import LoginPage from '../../pages/loginPage/LoginPage';
import Logo from "../../assets/logo.png";

function Navbar() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleJoinUsClick = () => {
    setShowLoginPopup(true);
  };

  const handleClosePopup = () => {
    setShowLoginPopup(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      
      <a href="/"><img className="logo-navbar" src={Logo} alt="" /></a>
      
      <nav className='navbar'>
        <a href="/" className='navlink'>Explore Advisors</a>
        <a href="/" className='navlink'>Let's Chat</a>
        <a href="/" className='navlink'>Search</a>
      </nav>
      
      <button className='joinusButton' onClick={handleJoinUsClick}>Join Us</button>
      
      <nav className='navicons'>
        <a href="/"><BsChatDotsFill className='navbaricon'/></a>
        <a href="/"><BiSolidUser className='navbaricon' /></a>
      </nav>

      {showLoginPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={handleClosePopup}>×</button>
            <img src={Logo} alt="" />
            <LoginPage />
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;