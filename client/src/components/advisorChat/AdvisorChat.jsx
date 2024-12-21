import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import './advisorChat.css';
import Navbar2 from '../navbar2/Navbar2';
import AdvisorSideBar from '../advisorSideBar/AdvisorSideBar';
import Footer from '../footer/Footer';
import Seeker1 from '../../assets/seeker1.png';
import io from 'socket.io-client';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import axios from 'axios';

const SOCKET_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/advisor-chat';
const socket = io(SOCKET_URL);

function AdvisorChat() {
  // States....
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [advisorSession, setAdvisorSession] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Timer setup
  const initialTime = new Date();
  initialTime.setSeconds(initialTime.getSeconds());
  
  const { seconds, minutes, hours, restart, pause } = useTimer({
    expiryTimestamp: initialTime,
    onExpire: () => console.warn("Timer expired"),
    autoStart: false,
  });

  // Load chat history function
  const loadChatHistory = async () => {
    if (!currentUser) return;

    try {
      const response = await axios.get(`${API_URL}/advisor-history`, {
        params: { userId: currentUser._id }
      });
      setChatHistory(response.data);
    } catch (error) {
      console.error('Error loading chat history:', error.response?.data || error.message);
    }
  };

  // Fetch current user effect
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // First try Google
        const googleResponse = await axios.get('/api/auth/google-current-user', {
          params: {
            email: sessionStorage.getItem('userEmail') // Get email from session storage
          }
        });
        
        if (googleResponse.data.user) {
          setCurrentUser(googleResponse.data.user);
          setLoading(false);
          return;
        }
      } catch (googleError) {
        // If Google fails, try Facebook
        try {
          const fbResponse = await axios.get('/api/auth/facebook-current-user', {
            params: {
              email: sessionStorage.getItem('userEmail') // Get email from session storage
            }
          });
          
          if (fbResponse.data.user) {
            setCurrentUser(fbResponse.data.user);
          }
        } catch (fbError) {
          console.error('Error fetching user:', fbError);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  // Initialize chat session effect
  useEffect(() => {
    const initializeSession = async () => {
      if (!currentUser || currentUser.userType !== 'advisor') return;

      try {
        const response = await axios.post(`${API_URL}/advisor-session`, {
          email: currentUser.email,
          userId: currentUser._id,
          seekerId: 'SEEKER_ID' // Get this from route params
        });
        
        setAdvisorSession(response.data);
        socket.emit('join', response.data._id);
        await loadChatHistory();
      } catch (error) {
        console.error('Error creating chat session:', error);
      }
    };

    initializeSession();
  }, [currentUser]);

  // Socket message handling effect
  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    return () => socket.off('message');
  }, []);

  // Timer handling
  const handleTimerToggle = async () => {
    if (!currentUser || !advisorSession) return;

    if (isTimerActive) {
      pause();
      try {
        await axios.put(`${API_URL}/advisor-session/${advisorSession._id}/end`, {
          userId: currentUser._id,
          email: currentUser.email
        });
      } catch (error) {
        console.error('Error ending chat session:', error);
      }
    } else {
      const newTime = new Date();
      newTime.setSeconds(newTime.getSeconds() + 3600);
      restart(newTime);
    }
    setIsTimerActive(!isTimerActive);
  };

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim() || !advisorSession || !currentUser) return;

    const messageData = {
      advisorSessionId: advisorSession._id,
      advisorText: messageInput,
      advisorPosition: 'right',
      type: 'text',
      userId: currentUser._id,
      email: currentUser.email
    };

    try {
      const response = await axios.post(`${API_URL}/advisor-message`, messageData);
      socket.emit('message', { 
        advisorSessionId: advisorSession._id, 
        advisorMessage: response.data 
      });
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Access check
  if (!currentUser || currentUser.userType !== 'advisor') {
    return <div>Access denied. Only advisors can access this page.</div>;
  }

  // Chat history components
  const AdvisorChatHistory = (props) => (
    <div className="AdvisorChat-chat-history">
      <div className='AdvisorChat-chat-history-content1'>
        <img src={props.imgUrl} alt={props.alt || 'Image'} />
      </div>
      <div className="AdvisorChat-chat-history-content2">
        <h6>{props.title}</h6>
        <p className='AdvisorChat-chat-history-desc'>"{props.message1}</p>
        <p className='AdvisorChat-chat-history-desc'>"{props.message2}</p>
      </div>
    </div>
  );

  const AdvisorChatHistoryContainer = (props) => (
    <div className="AdvisorChat-chat-history-container">
      {props.reviews.map((review) => (
        <AdvisorChatHistory
          key={review.id}
          title={review.title}
          imgUrl={review.imgUrl}
          timeText={review.timeText}
          message1={review.message1}
          message2={review.message2}
        />
      ))}
    </div>
  );

  return (
    <div className="AdvisorChat-main">
      <Navbar2 />
      <div className="AdvisorChat-container">
        <div className="AdvisorChat--sidebar">
          <AdvisorSideBar />
        </div>
        <hr />
        <div className="AdvisorChat-Middlecontainer">
          <div className="AdvisorChat-Middlecontainer-top">
            <div className="AdvisorChat-Middlecontainer-top1">
              <img 
                className="AdvisorChat-Middlecontainer-proPick" 
                src={currentUser.profilePhotoUrl || Seeker1} 
                alt="Advisor" 
              />
              <h2>{currentUser.name}</h2>
              <div className="AdvisorChat-Status"></div>
            </div>
            <div className="AdvisorChat-Middlecontainer-top2">
              <div className="Advisor-timer">
                {`${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`}
              </div>
              <button 
                className="Advisor-timer-controller" 
                onClick={handleTimerToggle}
                disabled={!advisorSession}
              >
                {isTimerActive ? "End Timer" : "Start Timer"}
              </button>
            </div>
          </div>
          <hr />
          <div className="AdvisorChat-Middlecontainer-bottom">
            <div className="AdvisorChat-chatwindow">
              {messages.map((message, index) => (
                <MessageBox
                  key={index}
                  position={message.position}
                  type={message.type}
                  text={message.text}
                  date={message.date}
                />
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={!advisorSession}
              />
              <button 
                onClick={sendMessage}
                disabled={!advisorSession || !messageInput.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="AdvisorChat-RightContainer">
          <h3>Chat History</h3>
          <div className="AdvisorChat-chat-history-content">
            <AdvisorChatHistoryContainer reviews={chatHistory} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdvisorChat;