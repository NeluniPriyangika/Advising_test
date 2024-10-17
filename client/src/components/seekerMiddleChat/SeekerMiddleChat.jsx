import React from 'react'
import './seekerMiddleChat.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import SeekerSideBar from '../seekerSideBar/SeekerSideBar';
import Advisor1 from '../../assets/Advisor1.jpg';


function SeekerMiddleChat() {
  return (
    <div className='SeekerMCP-main'>
      <Navbar />
      <div className='SeekerMCP-container'>
        <div className='SeekerMCP--sidebar'>
            <SeekerSideBar />
        </div>
        <div className='SeekerMCP-rightcontainer'>
          <h1>Start Message With Kasun Gayantha</h1>
          <div className='SeekerMCP-rightcontainer-content'>
            <div className='SeekerMCP-profile-image-div'>
              <img className='SeekerMCP-profile-image' src={Advisor1} alt="" />
              <button  className='SeekerMCP-pay-sendMessage' type="submit">Pay and send message</button>
            </div>
            <div className='SeekerMCP-right-form'>
              <h3>2 USD / min</h3>
              <hr />
              <p>Add Number of minutes you need to chat</p>
              <input 
                className='SeekerMCP-minutes'
                type="number" 
                placeholder='Number of minutes'
                step="1"
                min="1"
                required
              />
              <p>Explain about what you need to discuss</p>
              <textarea 
                className='SeekerMCP-disc'
                placeholder='Explain about what you need to discuss'
                required
              />
              <p>Add your first message here</p>
              <textarea 
                className='SeekerMCP-firstMessage'
                placeholder='Your Message for advisor'
                required
              />
              <h6 className='SeekerMCP-permin-rate-message'>You will be charged 30 USD for 10 mins</h6>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default SeekerMiddleChat
