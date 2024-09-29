import React from 'react';
import "./home.css";
import Navbar from '../navbar/Navbar';
import Advisor1 from "../../assets/Advisor1.jpg";
import Footer from '../footer/Footer';


const Card = (props) => (
  <div className="card">
    <img src={ props.imgUrl } 
      alt={ props.alt || 'Image' } />
    <div className="card-content">
      <h2>{ props.title }</h2>
      <p>{ props.content }</p>
    </div>
  </div>
);

const CardContainer = (props) => (
  <div className="cards-container">
    {
      props.cards.map((card) => (
        <Card title={ card.title }
          content={ card.content }
          imgUrl={ card.imgUrl } />
      ))
    }
  </div>
);



function Home() {

  const cardsData = [
    {id: 1, title: 'CARD 1', content: 'Clark Kent', imgUrl: 'https://unsplash.it/200/200'},
    {id: 2, title: 'CARD 2', content: 'Bruce Wayne', imgUrl: 'https://unsplash.it/201/200'},
    {id: 3, title: 'CARD 3', content: 'Peter Parker', imgUrl: 'https://unsplash.it/200/201'},
    {id: 4, title: 'CARD 4', content: 'Tony Stark', imgUrl: 'https://unsplash.it/201/201'},
    {id: 5, title: 'CARD 5', content: 'Reed Richards', imgUrl: 'https://unsplash.it/202/200'},
    {id: 6, title: 'CARD 6', content: 'Wade Wilson', imgUrl: 'https://unsplash.it/200/199'},
    {id: 7, title: 'CARD 7', content: 'Peter Quill', imgUrl: 'https://unsplash.it/199/199'},
    {id: 8, title: 'CARD 8', content: 'Steven Rogers', imgUrl: 'https://unsplash.it/199/200'},
    {id: 9, title: 'CARD 9', content: 'Bruce Banner', imgUrl: 'https://unsplash.it/200/198'},
    {id: 10, title: 'CARD 10', content: 'Vincent Strange', imgUrl: 'https://unsplash.it/198/199'},
  ]

  return (
    <div className='homemain'>
        <Navbar />
        <div className='homebgimage'>
            <div className='homemaintext'>
                <div className='welcometext'>
                    WELCOME</div>
                <div className='username'>To the ...</div>
            </div>
        </div> 
        <div className='home-find-advisors-container'>
          <div className="home-find-advisors-container-card-container">
            <h1 style={{ 'text-align': "start" }}>
              Find Advisors
            </h1>
        
            <CardContainer cards={ cardsData } />
          </div>
        </div>
        <Footer />
    </div>
  )
}

export default Home
