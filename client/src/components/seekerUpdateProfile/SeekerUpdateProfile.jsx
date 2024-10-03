import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SeekerUpdateProfile = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    email: '',
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
    <form onSubmit={handleSubmit}>
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
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
      />
      <input
        type="tel"
        name="phoneNumber"
        value={profileData.phoneNumber}
        onChange={handleInputChange}
        placeholder="Phone Number"
      />
      <input
        type="email"
        name="email"
        value={profileData.email}
        onChange={handleInputChange}
        placeholder="Email"
        required
      />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default SeekerUpdateProfile;