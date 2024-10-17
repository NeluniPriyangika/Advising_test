import React from 'react';
import './advisorPrifile.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import AdvisorSideBar from '../advisorSideBar/AdvisorSideBar';
import ReadOnlyRating from '../readOnlyRating/ReadOnlyRating';
import Advisor1 from '../../assets/Advisor1.jpg';


const SeekerReviews = (props) => (
  <div className="advisorprofile-seekerReviews">
    <div className='advisorprofile-seekerReviews-content1'>
      <img src={ props.imgUrl } 
      alt={ props.alt || 'Image' } />
    </div>
    <div className="advisorprofile-seekerReviews-content2">
      <h2>{ props.title }</h2>
      <div className='advisorprofile-seekerReviews-rating'> {props.homeRating}</div>
      <p className='advisorprofile-seekerReviews-desc'>"{props.subtitle}</p>
    </div>  
  </div>
);

const SeekerReviewsContainer = (props) => (
  <div className="advisorprofile-seekerReviews-container">
    {
      props.reviews.map((review) => (
        <SeekerReviews title={ review.title }
          personalDes={ review.personalDes }
          imgUrl={ review.imgUrl }
          timeText = {review.timeText} 
          homeRating = {review.homeRating}
          subtitle = {review.subtitle}/>
      ))
    }
  </div>
);

function AdvisorProfile() {

  const seekerReviews = [
    {id: 1, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:`“I’ve always struggled with budgeting, but the financial Advisor I connected with made everything so simple. I feel confident in managing my money now`, imgUrl: 'https://unsplash.it/200/200'},
    {id: 2, homeRating:<ReadOnlyRating/>, title: 'Michel Jackson',subtitle:`“I’ve always struggled with budgeting, but the financial Advisor I connected with made everything so simple. I feel confident in managing my money now`, imgUrl: 'https://unsplash.it/201/200'},
    {id: 3, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:`“I’ve always struggled with budgeting, but the financial Advisor I connected with made everything so simple. I feel confident in managing my money now`, imgUrl: 'https://unsplash.it/200/201'},
    {id: 4, homeRating:<ReadOnlyRating/>, title: 'Leo Doe',subtitle:`“I’ve always struggled with budgeting, but the financial Advisor I connected with made everything so simple. I feel confident in managing my money now`, imgUrl: 'https://unsplash.it/200/199'},
    {id: 5, homeRating:<ReadOnlyRating/>, title: 'Jony Dep',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/198'},
    {id: 6, homeRating:<ReadOnlyRating/>, title: 'Karoline Jude',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/200'},
    {id: 7, homeRating:<ReadOnlyRating/>, title: 'charle Jhosep',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/201'},  
  ]

  return (
    <div className='advisorProfile-main'>
      <Navbar />
      <div className='advisorprofile-container'>
        <div className='advisorprofile-sidebar'>
          <AdvisorSideBar />
        </div>
        <div className='advisorprofile-rightcontainer'>
            <div className='advisorprofile-rightcontainer-top'>
              <div className='advisorprofile-userdetails1'>
                  <div className='advisorprofile-header' >
                    <h1>Kasun Gayantha</h1>
                    <div className='advisorprofile-onlinestatus'></div>
                  </div>
                  <hr />
                  <div className='advisorprofile-rating'>
                    <h4>Rating</h4>
                    <ReadOnlyRating/>
                  </div>
                  <div className='advisorprofile-profexperiance-cont'>
                    <h4 className='advisorprofile-profexperiance'>Love & Financial Advisor</h4>
                    <h1>|</h1>
                    <h4 className='advisorprofile-profexperiance-years'> 15+ Years of Experience</h4>
                  </div>
                  <p className='advisorprofile-bio'>
                    Hi, I’m Sukumal, a seasoned business consultant specializing in helping entrepreneurs 
                    and small business owners grow and
                    optimize their ventures. With over 15 years of experience across various industries, I’ve worked with startups, established
                    businesses, and everything in between. My expertise ranges from business strategy, financial planning, and operations management 
                    to scaling businesses and improving profitability. <br />
                    My passion is helping others succeed by providing actionable insights and personalized strategies that make a real difference. Whether you’re looking to launch a new business, streamline your operations, or plan for long-term growth, I’m here to help guide
                    you every step of the way. Let’s work together to turn your goals into reality!
                  </p>
                  <h4>Certifications or Qualifications</h4>
                  <p>Certified business advisor /
                    certified mental consultant USA
                  </p>
                  <h4>Available Days</h4>
                  <div className='advisorprofile-vailabledays'>
                    <h6>Sunday, Monday, Friday</h6>
                  </div>
                  <h4>Available Time</h4>
                  <div className='advisorprofile-vailabledays'>
                    <h6>From 08.00am EST to 05.00pm EST</h6>
                  </div> 
              </div>

              <div className='advisorprofile-userdetails2'>
                <div>
                    <img className='advisorprofile-image' src={Advisor1} alt="" />
                </div>
                <button className='advisorprofile-messagingbutton'>Start Messaging</button>
                <h2 className='advisorprofile-perminuterate'>2 USD / 1 min</h2>
                <h2 className='advisorprofile-language'>Language : English</h2>
                
              </div>


            </div>
            <div className='advisorprofile-rightcontainer-bottom'>
              <div className='advisorprofile-seeker-rewiews-content'>
                <SeekerReviewsContainer reviews={ seekerReviews } />
              </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdvisorProfile
