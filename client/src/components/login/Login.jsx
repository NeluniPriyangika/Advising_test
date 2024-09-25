import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';


const Login = () => {
  const [userType, setUserType] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google-login', {
        credential: credentialResponse.credential,
        userType,
      });

      // Store user data in localStorage or context
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect based on user type
      window.location.href = res.data.redirectTo;
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoogleFailure = () => {
    console.error('Google Sign-In was unsuccessful. Try again later');
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <div className="user-type-buttons">
        <button onClick={() => setUserType('advisor')}>Sign in as Advisor</button>
        <button onClick={() => setUserType('seeker')}>Sign in as Seeker</button>
      </div>
      {userType && (
        <div className="google-login-button">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            useOneTap
          />
        </div>
      )}
    </div>
  );
};

export default Login;