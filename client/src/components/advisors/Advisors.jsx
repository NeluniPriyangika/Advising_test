import React, { useEffect, useState } from 'react';
import Footer from '../footer/Footer';
import ReadOnlyRating from '../readOnlyRating/ReadOnlyRating';
import axios from 'axios';
import Navbar2 from '../navbar2/Navbar2';

const Card = (props) => (
    <div className="card">
      <div className='card-content1'>
        <img src={props.imgUrl} alt={props.alt || 'Image'} />
        <p>{props.timeText}</p>
      </div>
      <div className="card-content2">
        <h2>{props.title}</h2>
        <div><ReadOnlyRating /></div>
        <p className='card-Subtitle'>{props.subtitle}</p>
        <p className='personaldescription'>{props.personalDes}</p>
      </div>
    </div>
  );
  
  const CardContainer = (props) => (
    <div className="cards-container">
      {
        props.cards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            personalDes={card.personalDes}
            imgUrl={card.imgUrl}
            timeText={card.timeText}
            homeRating={card.homeRating}
            subtitle={card.subtitle}
          />
        ))
      }
    </div>
  );

function Advisors() {
    const [advisors, setAdvisors] = useState([]);
    const [loading, setLoading] = useState(true);
  
    // Fetch advisors from the backend
    useEffect(() => {
      const fetchAdvisors = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/advisors', {
            headers: {
              Authorization: `Bearer yourAccessToken`, // Replace with a valid token
            },
          });
  
          setAdvisors(response.data.advisors);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching advisors:', error);
          setLoading(false);
        }
      };
  
      fetchAdvisors();
    }, []);
  
    return (
      <div className='homemain'>
        <Navbar2/>
        <div className='home-find-advisors-container'>
          <div className="home-find-advisors-container-card-container">
            <h1 style={{ 'text-align': "start" }}>
              Find Advisors
            </h1>
  
            {loading ? <p>Loading...</p> : <CardContainer cards={advisors} />}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
export default Advisors
