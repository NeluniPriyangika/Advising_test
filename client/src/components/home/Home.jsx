import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './home.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import ReadOnlyRating from '../readOnlyRating/ReadOnlyRating';
import axios from 'axios';

const Card = ({ imgUrl, timeText, title, subtitle, personalDes, onClick }) => (
  <div className="card" onClick={onClick}>
    <div className='card-content1'>
      <img 
        src={imgUrl} 
        alt={title} 
        onError={(e) => {
          e.target.src = '/default-avatar.png';
        }}
      />
      <p>{timeText}</p>
    </div>
    <div className="card-content2">
      <h2>{title}</h2>
      <div><ReadOnlyRating /></div>
      <p className='card-Subtitle'>{subtitle}</p>
      <p className='personaldescription'>{personalDes}</p>
    </div>
  </div>
);

const CardContainer = ({ cards, onCardClick }) => (
  <div className="cards-container">
    {cards.map((card) => (
      <Card
        key={card._id}
        {...card}
        onClick={() => onCardClick(card._id)}
      />
    ))}
  </div>
);

function Home() {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const params = useParams(); // Get URL parameters

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/advisors');
        setAdvisors(response.data.advisors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching advisors:', error);
        setError('Failed to load advisors. Please try again later.');
        setLoading(false);
      }
    };

    fetchAdvisors();
  }, []);

  const handleCardClick = (advisorId) => {
    const user = localStorage.getItem('user');
    
    if (user) {
      const userData = JSON.parse(user);
      
      if (userData.userType === 'advisor') {
        // If the logged-in advisor is viewing their own profile
        if (userData._id === advisorId) {
          navigate(`/advisor-profile/${advisorId}`);
        } else {
          // If an advisor is viewing another advisor's profile
          navigate(`/advisor-public-profile/${advisorId}`);
        }
      } else if (userData.userType === 'seeker') {
        // If a seeker is viewing an advisor's profile
        navigate(`/advisor-public-profile/${advisorId}`);
      }
    } else {
      // If user is not logged in, redirect to login
      navigate('/login', {
        state: { 
          redirectTo: `/advisor-public-profile/${advisorId}`
        }
      });
    }
  };

  // Determine if we're on a specific user's home page
  const isUserSpecificHome = params.userId || params.seekerId || params.advisorId;

  return (
    <div className='homemain'>
      <Navbar />
      <div className='homebgimage'>
        <div className='homemaintext'>
          <div className='welcometext'>WELCOME</div>
          <div className='username'>
            {isUserSpecificHome ? 'Back' : 'To'}
          </div>
        </div>
        <h1 className='sitename'>Spiritual Insights</h1>
      </div>

      <div className='home-find-advisors-container'>
        <div className="home-find-advisors-container-card-container">
          <h1>Find Advisors</h1>
          
          {loading ? (
            <div className="loading">Loading advisors...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : advisors.length === 0 ? (
            <div className="no-advisors">No advisors available at the moment</div>
          ) : (
            <CardContainer 
              cards={advisors}
              onCardClick={handleCardClick}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;