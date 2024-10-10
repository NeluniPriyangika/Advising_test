import React from 'react';
import "./home.css";
import Navbar from '../navbar/Navbar';
//import Advisor1 from "../../assets/Advisor1.jpg";
import Footer from '../footer/Footer';
import ReadOnlyRating from '../readOnlyRating/ReadOnlyRating';


const Card = (props) => (
  <div className="card">
    <div className='card-content1'>
      <img src={ props.imgUrl } 
      alt={ props.alt || 'Image' } />
      <p>{props.timeText}</p>
    </div>
    <div className="card-content2">
      <h2>{ props.title }</h2>
      <div>{props.homeRating}</div>
      <p className='card-Subtitle'>"{props.subtitle}</p>
      <p className='personaldescription'>{ props.personalDes }</p>
    </div>
  </div>
);

const CardContainer = (props) => (
  <div className="cards-container">
    {
      props.cards.map((card) => (
        <Card title={ card.title }
          personalDes={ card.personalDes }
          imgUrl={ card.imgUrl }
          timeText = {card.timeText} 
          homeRating = {card.homeRating}
          subtitle = {card.subtitle}/>
      ))
    }
  </div>
);



function Home() {

  const cardsData = [
    {id: 1, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:'Psychic Reading, Astrology, Tarot Readings ', personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Clark Kent',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/200/200'},
    {id: 2, homeRating:<ReadOnlyRating/>, title: 'Michel Jackson',subtitle:'Psychic Reading, Astrology, Tarot Readings ', personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Bruce Wayne',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/201/200'},
    {id: 3, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:'Psychic Reading, Astrology, Tarot Readings ', personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Peter Parker',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/200/201'},
    {id: 4, homeRating:<ReadOnlyRating/>, title: 'Leo Doe',subtitle:'Psychic Reading, Astrology, Tarot Readings ', personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Tony Stark',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/201/201'},
    {id: 5, homeRating:<ReadOnlyRating/>, title: 'Kasun Gayantha',subtitle:'Psychic Reading, Astrology, Tarot Readings ', personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Reed Richards',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/202/200'},
    {id: 6, homeRating:<ReadOnlyRating/>, title: 'Neluni Priyangika',subtitle:'Psychic Reading, Astrology, Tarot Readings ', personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Wade Wilson',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/200/199'},
    {id: 7, homeRating:<ReadOnlyRating/>, title: 'Jony Dep',subtitle:'Psychic Reading, Astrology, Tarot Readings ', personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Peter Quill',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/199/199'},
    {id: 8, homeRating:<ReadOnlyRating/>, title: 'Karoline Jude',subtitle:'Psychic Reading, Astrology, Tarot Readings ', personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Steven Rogers',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/199/200'},
    {id: 9, homeRating:<ReadOnlyRating/>, title: 'Christine Jeo',subtitle:'Psychic Reading, Astrology, Tarot Readings ', personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Bruce Banner',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/200/198'},
    {id: 10, homeRating:<ReadOnlyRating/>, title: 'charle Jhosep',subtitle:'Psychic Reading, Astrology, Tarot Readings ', personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Vincent Strange',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/198/199'},
  ]

  return (
    <div className='homemain'>
        <Navbar />
        <div className='homebgimage'>
            <div className='homemaintext'>
                <div className='welcometext'>WELCOME</div>
                <div className='username'>To</div>
            </div>
            <h1 className='sitename'>Spiritual Insights</h1>
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
