import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/homePage/HomePage';
import LoginPage from './pages/loginPage/LoginPage';
import LoginPage1 from './pages/loginPage1/LoginPage1';
import LoginFBPage from './pages/LoginFBPage/LoginFBPage';
import AdvisorHomePage from './pages/advisorHomePage/AdvisorHomePage';
import SeekerHomePage from './pages/seekerHomePage/SeekerHomePage';
import AdvisorUpdateProfilePage from './pages/advisorUpdateProfilePage/AdvisorUpdateProfilePage';
import SeekerUpdateProfilePage from './pages/seekerUpdateProfilePage/SeekerUpdateProfilePage';
import AdvisorProfilePage from './pages/advisorProfilePage/AdvisorProfilePage';
import SeekerProfilePage from './pages/seekerProfilePage/SeekerProfilePage';
import SeekerMiddleChatPage from './pages/seekerMiddleChatPage/SeekerMiddleChatPage';
import SeekerChatPage from './pages/SeekerChatPage/SeekerChatPage';
import AdvisorPendingPage from './pages/advisorPendingPage/AdvisorPendingPage';
import AdvisorChatPage from './pages/advisorChatPage/AdvisorChatPage';
import AdvisorPublicChatPage from './pages/advisorPublicChatPage/AdvisorPublicChatPage';
import PaymentPage from './pages/paymentPage/PaymentPage';
import PrivacyPolicyPage from './pages/privacyPolicyPage/PrivacyPolicyPage';


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
          <Route path="/login" element={<LoginPage1 />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/login-FBpage" element={<LoginFBPage />} />
          <Route path="/advisor-update-profile" element={<PrivateRoute><AdvisorUpdateProfilePage /></PrivateRoute>} />
          <Route path="/seeker-update-profile" element={<PrivateRoute><SeekerUpdateProfilePage /></PrivateRoute>} />
          <Route path="/advisor-home" element={<PrivateRoute><AdvisorHomePage /></PrivateRoute>} />
          <Route path="/seeker-home" element={<PrivateRoute><SeekerHomePage /></PrivateRoute> } />
          <Route path="/advisor-profile" element={<PrivateRoute><AdvisorProfilePage /></PrivateRoute> } />
          <Route path="/seeker-profile" element={<PrivateRoute><SeekerProfilePage /></PrivateRoute> } />
          <Route path="/seeker-middle-chat" element={<PrivateRoute><SeekerMiddleChatPage /></PrivateRoute> } />
          <Route path="/seeker-chat" element={<PrivateRoute><SeekerChatPage /></PrivateRoute> } />
          <Route path="/advisor-pending" element={<PrivateRoute>< AdvisorPendingPage/></PrivateRoute> } />
          <Route path="/advisor-chat" element={<PrivateRoute>< AdvisorChatPage/></PrivateRoute> } />
          <Route path="/advisor-public-chat" element={<PrivateRoute>< AdvisorPublicChatPage/></PrivateRoute> } />
          <Route path="/payment" element={<PrivateRoute>< PaymentPage/></PrivateRoute> } />
          <Route path="/privacy-policy" element={<PrivateRoute>< PrivacyPolicyPage/></PrivateRoute> } />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;