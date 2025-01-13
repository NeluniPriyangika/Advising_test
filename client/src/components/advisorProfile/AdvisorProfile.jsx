import React, { useEffect, useState } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import './advisorPrifile.css';
import Navbar2 from '../navbar2/Navbar2';
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
  const navigate = useNavigate ();
  const { userId } = useParams();
  const [advisor, setAdvisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [currentUserType, setCurrentUserType] = useState(null);
  
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token'); 

    const fetchAdvisorData = async () => {
      try {
        console.log('Current user:', currentUser); // Debug log

        if (!userId) {
          setError('No user ID found');
          return;
        }

        console.log('Fetching advisor data for userId:', userId); // Debug log

        const response = await fetch(`http://localhost:5000/api/advisor-profile/${userId}`,
        { method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add JWT token here
          },
        }
        );
        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch advisor data');
        }

        const data = await response.json();
        console.log('Received advisor data:', data); // Debug log
        setAdvisor(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching advisor data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAdvisorData();
  }, [userId]);

    // Function to determine if the messaging button should be shown
    const shouldShowMessageButton = () => {
      // Don't show if it's the advisor's own profile
      if (isOwnProfile) return false;
      
      // Only show if the viewer is a seeker
      return currentUserType === 'seeker';
    };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!advisor) return <div>No advisor data found</div>;

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
      <Navbar2 />
      <div className='advisorprofile-container'>
        <div className='advisorprofile-sidebar'>
          <AdvisorSideBar />
        </div>
        <div className='advisorprofile-rightcontainer'>
          <div className='advisorprofile-rightcontainer-top'>
            <div className='advisorprofile-userdetails1'>
              <div className='advisorprofile-header'>
                <h1>{advisor.name}</h1>
                <div className='advisorprofile-onlinestatus'></div>
              </div>
              <hr />
              <div className='advisorprofile-rating'>
                <h4>Rating</h4>
                <ReadOnlyRating /*value={advisor.rating}*/ />
              </div>
              <div className='advisorprofile-profexperiance-cont'>
                <h4 className='advisorprofile-profexperiance'>{advisor.experience}</h4>
                <h1>|</h1>
                <h4 className='advisorprofile-profexperiance-years'>{advisor.experience}</h4>
              </div>
              <p className='advisorprofile-bio'>{advisor.bio}</p>
              <h4>Certifications or Qualifications</h4>
              <p>{advisor.certifications}</p>
              <h4>Available Days</h4>
              <div className='advisorprofile-vailabledays'>
                <h6>{advisor.availableDays?.join(', ')}</h6>
              </div>
              <h4>Available Time</h4>
              <div className='advisorprofile-vailabledays'>
                <h6>{advisor.availableTimeStart} to {advisor.availableTimeEnd}</h6>
              </div>
            </div>

            <div className='advisorprofile-userdetails2'>
              <div>
                <img 
                  className='advisorprofile-image' 
                  src={advisor.profilePhotoUrl || Advisor1} 
                  alt={advisor.name} 
                />
              </div>
              {/* Conditional rendering of the message button */}
              {shouldShowMessageButton() && (
                <button 
                  className='advisorprofile-messagingbutton' 
                  onClick={() => navigate('/seeker-middle-chat')}
                >
                  Start Messaging
                </button>
              )}
              <h2 className='advisorprofile-perminuterate'>
                {advisor.ratePerMinute} USD / 1 min
              </h2>
              <h2 className='advisorprofile-language'>
                  Language: {advisor.languages || 'English'}
              </h2>
            </div>
          </div>
          
          <div className='advisorprofile-rightcontainer-bottom'>
            <div className='advisorprofile-seeker-rewiews-content'>
              <SeekerReviewsContainer reviews={seekerReviews} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdvisorProfile