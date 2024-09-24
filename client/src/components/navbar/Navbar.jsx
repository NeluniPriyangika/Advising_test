import React from 'react';
import "./navbar.css";
import { BsChatDotsFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";

function Navbar() {
  return (
    <header className='header'>
        <a href="/" className='logo'>logo</a>

        <nav className='navbar'>
            <a href="/" className='navlink'>Explore Advisors</a>
            <a href="/" className='navlink'>Let's Chat</a>
            <a href="/" className='navlink'>Search</a>
        </nav>

        <nav className='navicons'>
            <a href="/"><BsChatDotsFill className='navbaricon'/></a>
            <a href="/"><BiSolidUser className='navbaricon' /></a>
        </nav>



    </header>
  )
}

export default Navbar
