import React, { useState, useEffect } from 'react';
import "./advisorUpdateProfile.css";
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer'; 

const AdvisorUpdateProfile = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    address: '',
    perMinuteRate: {
      amount: 0,
      minutes: 0,
      currency: 'USD'
    },
    description: '',
    phoneNumber: '',
    email: '',
    employmentInfo: '',
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
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRateChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      perMinuteRate: {
        ...prevData.perMinuteRate,
        [name]: name === 'amount' || name === 'minutes' ? parseFloat(value) : value
      }
    }));
  };

  const handlePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(profileData).forEach(key => {
      if (key === 'perMinuteRate') {
        formData.append(key, JSON.stringify(profileData[key]));
      } else {
        formData.append(key, profileData[key]);
      }
    });

    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    try {
      const res = await fetch('http://localhost:5000/api/update-advisor-profile', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        navigate('/advisor-home');
      } else {
        // Handle error
        console.error('Profile update failed:', data.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className='advisor-profile-update-main'>
      <Navbar />
      <div className='advisor-profile-update-container'>
        <div className='advisor-profile-update-tipstobuildprofile'>
          <h2 className='advisor-profile-update-tipstobuildprofile-tittle'>Tips to build a good profile</h2>
          <ul className='advisor-profile-update-tipstobuildprofile-list'>
            <li className='advisor-profile-update-tipstobuildprofile-list-item'>Professional Profile Picture: Use a clear, high-quality headshot that reflects your professionalism.</li>
            <li className='advisor-profile-update-tipstobuildprofile-list-item'>Compelling Bio: Write a brief, engaging bio that highlights your expertise and how you can help Seeker.</li>
            <li className='advisor-profile-update-tipstobuildprofile-list-item'>Relevant Expertise: Select categories that best represent your skills—focus on what you excel at.</li>
            <li className='advisor-profile-update-tipstobuildprofile-list-item'>Competitive Rate: Research other Advisors' rates and set a price that reflects your experience.</li>
            <li className='advisor-profile-update-tipstobuildprofile-list-item'>Show Experience: Highlight certifications, qualifications, and years of experience.</li>
            <li className='advisor-profile-update-tipstobuildprofile-list-item'>Update Availability: Keep your schedule current to attract more consultations</li>
            <li className='advisor-profile-update-tipstobuildprofile-list-item'>Use Keywords: Add relevant keywords naturally to increase profile visibilit</li>
            <li className='advisor-profile-update-tipstobuildprofile-list-item'>Transparency: Clearly explain what Seekers can expect from your advic</li>
            <li className='advisor-profile-update-tipstobuildprofile-list-item'>Unique Selling Point: Highlight what makes you stand out—your experience, method, or results.</li>
            <li className='advisor-profile-update-tipstobuildprofile-list-item'>Stay Updated: Regularly refresh your profile with new achievements and experiences.</li>
          </ul>
        </div>
        <form className="advisor-profile-update-form-container" onSubmit={handleSubmit}>
          <h1 className='advisor-profile-update-form-tittle'>Update Your Profile</h1>
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
          />
          <div className='advisor-profile-update-perminutesrate'>
            <input
              type="number"
              name="minutes"
              value={profileData.perMinuteRate.minutes}
              onChange={handleRateChange}
              placeholder="Minutes"
              step="0.01"
              min="0"
              required
            />
            <input
              type="number"
              name="amount"
              value={profileData.perMinuteRate.amount}
              onChange={handleRateChange}
              placeholder="Per Minute Rate"
              step="1"
              min="1"
              required
            />
            <select
              name="currency"
              value={profileData.perMinuteRate.currency}
              onChange={handleRateChange}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <textarea 
            className='advisor-profile-update-description'
            name="description"
            value={profileData.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
          />
          <label htmlFor=""> 
            <h4>Add your Profile Photo</h4>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              aria-labelledby="firstname"
            />
          </label>      
          <input
            type="tel"
            name="phoneNumber"
            value={profileData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Phone Number"
            required
          />
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="employmentInfo"
            value={profileData.employmentInfo}
            onChange={handleInputChange}
            placeholder="Employment Info"
          />
          <button  className='profileUpdatebutton' type="submit">Update Profile</button>
        </form>
        <div className='advisor-profile-update-advantagesasAdvisor'>
          <h2 className='advisor-profile-update-advantagesasAdvisor-tittle'>What advantages you get by becomming an advisor on spiritual insights</h2>
          <ul className='advisor-profile-update-advantagesasAdvisor-tittle-list'>
            <li className='advisor-profile-update-advantagesasAdvisor-tittle-list-item'>
              <h5>Earn on Your Own Terms</h5>
              <p>Set your own rates and get paid per minute for the advice you offer. The more consultations you have, the more you earn. </p>
            </li>
            <li className='advisor-profile-update-advantagesasAdvisor-tittle-list-item'>
              <h5>Flexible Schedule</h5>
              <p>Work when it suits you. You can set your own availability and manage your hours based on your lifestyle. </p>
            </li>
            <li className='advisor-profile-update-advantagesasAdvisor-tittle-list-item'>
              <h5>Build Your Reputation</h5>
              <p>Showcase your expertise, gain reviews from satisfied Seekers, and grow your credibility in your field. </p>
            </li>
            <li className='advisor-profile-update-advantagesasAdvisor-tittle-list-item'>
              <h5>Expand Your Network</h5>
              <p>Connect with people from diverse backgrounds who value your knowledge. Each session is an opportunity to build new professional relationships. </p>
            </li>
            <li className='advisor-profile-update-advantagesasAdvisor-tittle-list-item'>
              <h5>Help Others</h5>
              <p>Use your knowledge and experience to guide Seekers through challenges and help them achieve their goals.  </p>
            </li>
            <li className='advisor-profile-update-advantagesasAdvisor-tittle-list-item'>
              <h5>Grow Professionally</h5>
              <p>Advising others often enhances your own skills and understanding, making you better at your profession while helping. </p>
            </li>
            <li className='advisor-profile-update-advantagesasAdvisor-tittle-list-item'>
              <h5>Global Reach</h5>
              <p>Work with clients from around the world. There are no geographical limitations, allowing you to expand your influence glob.</p>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdvisorUpdateProfile;