import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/homePage/HomePage';
import LoginPage from './pages/loginPage/LoginPage';
import AdvisorHomePage from './pages/advisorHomePage/AdvisorHomePage';
import SeekerHomePage from './pages/seekerHomePage/SeekerHomePage';
import AdvisorUpdateProfile from './components/advisorUpdateProfile/AdvisorUpdateProfile';
import SeekerUpdateProfile from './components/seekerUpdateProfile/SeekerUpdateProfile';

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/advisor-update-profile" element={<PrivateRoute><AdvisorUpdateProfile /></PrivateRoute>} />
          <Route path="/seeker-update-profile" element={<PrivateRoute><SeekerUpdateProfile /></PrivateRoute>} />
          <Route path="/advisor-home" element={<PrivateRoute><AdvisorHomePage /></PrivateRoute>} />
          <Route path="/seeker-home" element={<PrivateRoute><SeekerHomePage /></PrivateRoute> } />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;