import React, { useState, useEffect } from 'react';
import './seekerUpdateProfile.css';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import Seeker1 from '../../assets/seeker1.png';
import Seeker2 from '../../assets/seeker2.png';
import Seeker3 from '../../assets/seeker3.png';
import ReadOnlyRating from '../readOnlyRating/ReadOnlyRating';


const SeekerReviews = (props) => (
  <div className="seekerReviews">
    <div className='seekerReviews-content1'>
      <img src={ props.imgUrl } 
      alt={ props.alt || 'Image' } />
    </div>
    <div className="seekerReviews-content2">
      <h2>{ props.title }</h2>
      <div className='seekerReviews-rating'> {props.homeRating}</div>
      <p className='seekerReviews-desc'>"{props.subtitle}</p>
    </div>  
  </div>
);

const SeekerReviewsContainer = (props) => (
  <div className="seekerReviews-container">
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

const SeekerUpdateProfile = () => {

  const seekerReviews = [
    {id: 1, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Clark Kent',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/200/200'},
    {id: 2, homeRating:<ReadOnlyRating/>, title: 'Michel Jackson',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Bruce Wayne',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/201/200'},
    {id: 3, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Peter Parker',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/200/201'},
    {id: 3, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, personalDes:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", content: 'Peter Parker',timeText:'5 minutes for  $1', imgUrl: 'https://unsplash.it/200/201'},
  ]

  const [profileData, setProfileData] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    email: '',
    description: '',
    language : '',
    birthday : ''

  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing user data if available
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/google-login');
        if (response.ok) {
          const userData = await response.json();
          setProfileData(prevData => ({...prevData, ...userData}));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      // Automatically prepend the "+" sign if it's not there
      let formattedValue = value;
      if (!formattedValue.startsWith("+")) {
        formattedValue = "+" + formattedValue;
      }
      setProfileData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      // Handle other fields
      setProfileData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date) => {
    setProfileData((prevData) => ({
      ...prevData,
      birthday: date
    }));
  };

  const handlePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(profileData).forEach(key => {
      formData.append(key, profileData[key]);
    });

    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }  

    try {
      const res = await fetch('http://localhost:5000/api/update-seeker-profile', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        navigate('/seeker-home');
      } else {
        // Handle error
        console.error('Profile update failed:', data.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className='seeker-updateprofile-main'>
      <Navbar/>
      <div className='seeker-updateprofile-container'>
        <div className='seeker-updateprofile-leftcontainer'>

            <h3 className='seeker-updateprofile-leftcontainer-header'>Seeker Reviews</h3>

            <div className='seeker-rewiews-container'>
              <div className='seeker-rewiews-content'>
                <SeekerReviewsContainer reviews={ seekerReviews } />
              </div>

            </div>
        </div>
        <div className='seeker-updateprofile-form-container'>
          <form className='seeker-updateprofile-form' onSubmit={handleSubmit}>
            
            <input
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
            />

            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              placeholder="Address"
              required
            />
    
            <input
                type="tel"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                required
            />

            <h4>Add Your Registerd Email</h4>

            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />


            <DatePicker
              className='datepicker'
              selected={profileData.birthday}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Birthday"
              showYearDropdown
              showMonthDropdown
              scrollableYearDropdown
              required
            />

            <textarea 
                className='seeker-profile-update-description'
                name="description"
                value={profileData.description}
                onChange={handleInputChange}
                placeholder="Short Bio or Description"
            />

            <input
                type="text"
                name="language"
                value={profileData.language}
                onChange={handleInputChange}
                placeholder="Language"
                required
            />

            <h4>Add your Profile Picture</h4>

            <label htmlFor="">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                required
              />
            </label>

            <button className='seeker-profile-update-button' type="submit">Update Profile</button>
          </form>

        </div>
  
        <div className='seeker-updateprofile-rightcontainer'>
          right
        </div>

      </div>
      
      <Footer/>
    </div>
  );
};

export default SeekerUpdateProfile;