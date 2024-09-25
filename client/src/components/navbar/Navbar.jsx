import React, { useState } from 'react';
import "./navbar.css";
import { BsChatDotsFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import LoginPage from '../../pages/loginPage/LoginPage';

function Navbar() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleJoinUsClick = () => {
    setShowLoginPopup(true);
  };

  const handleClosePopup = () => {
    setShowLoginPopup(false);
  };

  return (
    <header className='header'>
      <a href="/" className='logo'>logo</a>
      
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
            <LoginPage />
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;