import React from 'react';
import "./home.css"
import Navbar from '../navbar/Navbar'



function Home() {
  return (
    <div className='homemain'>
        <Navbar />
        <div className='homebgimage'>
            <div className='homemaintext'>
                <div className='welcometext'>
                    WELCOME</div>
                <div className='username'>Username</div>
            </div>
        </div> 
    </div>
  )
}

export default Home
