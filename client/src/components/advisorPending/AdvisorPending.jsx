import React from 'react'
import './advisorPending.css'
import Navbar from '../navbar/Navbar'

function AdvisorPending() {
  return (
    <div className='advisorPending-main'>
        <Navbar />
        <div className='advisorPending-container'>
          <div className='advisorPending-container-header'>
            <h1>Your Account will be approved by the admin...</h1>
          </div>
        </div>

    </div>
  )
}

export default AdvisorPending
