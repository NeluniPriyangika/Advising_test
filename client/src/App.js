import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/homePage/HomePage';
import LoginPage from './pages/loginPage/LoginPage';
import LoginPage1 from './pages/loginPage1/LoginPage1';
import LoginFBPage from './pages/LoginFBPage/LoginFBPage';
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
import AdvisorsPage from './pages/advisorPage/AdvisorsPage';


// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
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
          <Route path="/advisor-update-profile/:userId" element={<PrivateRoute><AdvisorUpdateProfilePage /></PrivateRoute>} />
          <Route path="/seeker-update-profile/:userId" element={<PrivateRoute><SeekerUpdateProfilePage /></PrivateRoute>} />
          <Route path="/seeker-home" element={<PrivateRoute><SeekerHomePage /></PrivateRoute> } />
          <Route path="/advisor-profile/:userId" element={<PrivateRoute><AdvisorProfilePage /></PrivateRoute>} />
          <Route path="/seeker-profile/:userId" element={<PrivateRoute><SeekerProfilePage /></PrivateRoute> } />
          <Route path="/seeker-middle-chat" element={<PrivateRoute><SeekerMiddleChatPage /></PrivateRoute> } />
          <Route path="/seeker-chat" element={<PrivateRoute><SeekerChatPage /></PrivateRoute> } />
          <Route path="/advisor-pending" element={<PrivateRoute>< AdvisorPendingPage/></PrivateRoute> } />
          <Route path="/advisor-chat" element={<PrivateRoute>< AdvisorChatPage/></PrivateRoute> } />
          <Route path="/advisor-public-chat" element={<PrivateRoute>< AdvisorPublicChatPage/></PrivateRoute> } />
          <Route path="/payment" element={<PrivateRoute>< PaymentPage/></PrivateRoute> } />
          <Route path="/privacy-policy" element={<PrivateRoute>< PrivacyPolicyPage/></PrivateRoute> } />
          <Route path="/advisors" element={<PrivateRoute>< AdvisorsPage/></PrivateRoute> } />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;