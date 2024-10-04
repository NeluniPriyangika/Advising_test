import React, { useState, useEffect } from 'react';
import "./advisorUpdateProfile.css";
import { useNavigate } from 'react-router-dom';

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
    <form className='advisor-profile-update-container' onSubmit={handleSubmit}>
      <h1 className='advisor-profile-update-tittle'>Update Your Profile</h1>
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
  );
};

export default AdvisorUpdateProfile;