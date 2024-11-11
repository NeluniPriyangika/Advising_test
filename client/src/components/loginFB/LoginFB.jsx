import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import './loginFB.css';
import { useNavigate } from 'react-router-dom';

function LoginFB() {
  const [userType, setUserType] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const responseFacebook = async (response) => {
    // Clear any previous errors
    setError(null);

    // Check if the response is valid
    if (!response || response.status === 'unknown' || !response.accessToken) {
      setError('Facebook login failed or was cancelled');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/facebook-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: response.accessToken,
          userID: response.id, // Changed from response.userID to response.id
          email: response.email,
          name: response.name,
          userType: userType,
        }),
        credentials: 'include'
      });

      // Handle non-200 responses
      if (!res.ok) {
        const errorData = await res.text(); // Use text() instead of json() first
        try {
          const parsedError = JSON.parse(errorData);
          throw new Error(parsedError.error || 'Authentication failed');
        } catch (e) {
          throw new Error(errorData || 'Authentication failed');
        }
      }

      const data = await res.json();
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate(data.redirectTo);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      setError(error.message || 'Failed to authenticate with Facebook');
    }
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  return (
    <div className="login-container">
      <h2 className='signintitle'>Sign In</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="user-type-selection">
        <div className="user-type-buttons">
          <button
            className={`user-type-button ${userType === 'advisor' ? 'selected' : ''}`}
            onClick={() => handleUserTypeSelect('advisor')}
          >
            Sign in as Advisor
          </button>
          <button
            className={`user-type-button ${userType === 'seeker' ? 'selected' : ''}`}
            onClick={() => handleUserTypeSelect('seeker')}
          >
            Sign in as Seeker
          </button>
        </div>
        {userType && (
          <FacebookLogin
            appId="2001351663675828"
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            cssClass="facebook-login-button"
            icon="fa-facebook"
            textButton={`Continue with Facebook as ${userType}`}
            disableMobileRedirect={true}
            onFailure={(error) => {
              console.error('Facebook login failed:', error);
              setError('Failed to connect with Facebook');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default LoginFB;