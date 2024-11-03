import React, {useState} from 'react'
import './loginFB.css'
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import FBLogo from '../../assets/FBLogo.png';

function LoginFB() {
    const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({
          credential: credentialResponse.credential,
          userType: userType,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (data.user) {
        // Save user data to your app's state or localStorage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on the server's response
        navigate(data.redirectTo);
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Login failed', error);
    // Handle the error (e.g., show an error message to the user)
  };

  return (
    <div className="login-container">
      <h2 className='signintitle'>Sign In</h2>
      <div className="user-type-buttons">
        <button className='user-type-button' onClick={() => setUserType('advisor')}><img className='googleSignInImag' src={FBLogo} alt=''/> Sign in as Advisor</button>
        <button className="user-type-button" onClick={() => setUserType('seeker')}><img className='googleSignInImag' src={FBLogo} alt=''/>Sign in as Seeker</button>
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
  )
}

export default LoginFB
