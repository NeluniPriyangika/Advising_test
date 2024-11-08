import React from 'react'
import './advisorPending.css'
import Navbar2 from '../navbar2/Navbar2'
import Footer from '../footer/Footer'

function AdvisorPending() {
  return (
    <div className='advisorPending-main'>
        <Navbar2 />
        <div className='advisorPending-container'>
          <div className='advisorPending-container-header'>
            <h1>Your Account will be approved by the admin...</h1>
          </div>
        </div>
        <Footer />

    </div>
  )
}

export default AdvisorPending
