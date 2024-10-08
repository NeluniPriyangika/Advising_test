import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

const SeekerUpdateProfile = () => {
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
    <div>
      <div></div>
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

        <h4>Add your registerd email</h4>

        <input
          type="email"
          name="email"
          value={profileData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />


        <DatePicker
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

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          required
        />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default SeekerUpdateProfile;