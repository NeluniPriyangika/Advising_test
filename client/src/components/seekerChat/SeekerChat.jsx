import React, { useEffect, useState } from 'react'; 
import { useTimer } from 'react-timer-hook'; 
import './seekerChat.css';
import Navbar2 from '../navbar2/Navbar2';
import SeekerSideBar from '../seekerSideBar/SeekerSideBar';
import Footer from '../footer/Footer';
import Advisor2 from '../../assets/Advisor2.jpg';
import io from 'socket.io-client';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css'; // Import chat elements CSS..
import axios from 'axios';

const SeekerChatHistory = (props) => (
    <div className="SeekerChat-chat-history">
      <div className='SeekerChat-chat-history-content1'>
        <img src={ props.imgUrl } 
        alt={ props.alt || 'Image' } />
      </div>
      <div className="SeekerChat-chat-history-content2">
        <h6>{ props.title }</h6>
        <p className='SeekerChat-chat-history-desc'>"{props.message1}</p>
        <p className='SeekerChat-chat-history-desc'>"{props.message2}</p>
      </div>  
    </div>
);

const SeekerChatHistoryContainer = (props) => (
    <div className="SeekerChat-chat-history-container">
      {
        props.reviews.map((review) => (
          <SeekerChatHistory key={review.id} title={ review.title }
            imgUrl={ review.imgUrl }
            timeText = {review.timeText} 
            message1 = {review.message1}
            message2 = {review.message2}/>
        ))
      }
    </div>
);

const SOCKET_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api/seeker-chat';
const socket = io(SOCKET_URL);

function SeekerChat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [seekerSession, setSeekerSession] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAdvisor, setCurrentAdvisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Timer setup
  const initialTime = new Date();
  initialTime.setSeconds(initialTime.getSeconds());
  
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: initialTime,
    onExpire: () => console.warn("Timer expired"),
    autoStart: false,
  });

  // Load chat history
  const loadChatHistory = async (userId) => {
    if (!userId) return;

    try {
      const response = await axios.get(`${API_URL}/seeker-history/${userId}`);
      setChatHistory(response.data);
      
      if (response.data.length > 0) {
        const latestSession = response.data[response.data.length - 1];
        setMessages(latestSession.messages || []);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Failed to load chat history');
    }
  };

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        setError('No user ID found. Please log in again.');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/seeker/${userId}`);
        if (response.data.user) {
          setCurrentUser(response.data.user);
          await loadChatHistory(userId);
        } else {
          setError('User not found');
        }
      } catch (error) {
        setError('Failed to authenticate user');
        console.error('Error fetching user:', error);
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  // Initialize chat session
  useEffect(() => {
    const initializeSession = async () => {
      if (!currentUser?.userId || currentUser.userType !== 'seeker') return;

      try {
        const response = await axios.post(`${API_URL}/seeker-session/${currentUser.userId}`, {
          seekerId: currentUser.userId,
          advisorId: sessionStorage.getItem('currentAdvisorId') // Should be set when selecting an advisor
        });
        
        setSeekerSession(response.data);
        setCurrentAdvisor(response.data.advisor);
        socket.emit('join', response.data._id);
      } catch (error) {
        console.error('Error creating chat session:', error);
        setError('Failed to create chat session');
      }
    };

    initializeSession();
  }, [currentUser]);

  // Socket message handling
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => socket.off('message');
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim() || !seekerSession?._id || !currentUser?.userId) return;

    try {
      const response = await axios.post(`${API_URL}/seeker-message/${currentUser.userId}`, {
        sessionId: seekerSession._id,
        text: messageInput,
        position: 'right'
      });

      socket.emit('message', {
        sessionId: seekerSession._id,
        message: response.data
      });

      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentUser || currentUser.userType !== 'seeker') {
    return <div>Access denied. Only seekers can access this page.</div>;
  }

  return (
    <div className='SeekerChat-main'>
      <Navbar2 />
      <div className='SeekerChat-container'>
        <div className='SeekerChat--sidebar'>
          <SeekerSideBar />
        </div>
        <hr />
        <div className='SeekerChat-Middlecontainer'>
          <div className='SeekerChat-Middlecontainer-top'>
            <div className='SeekerChat-Middlecontainer-top1'>
              <img 
                className='SeekerChat-Middlecontainer-proPick' 
                src={currentAdvisor?.profilePhotoUrl || Advisor2} 
                alt="Advisor" 
              />
              <h2>{currentAdvisor?.name || 'Select an Advisor'}</h2>
              <div className='SeekerChat-Status'></div>
            </div>
            <div className='SeekerChat-Middlecontainer-top2'>
              <div className="Seeker-timer">
                {`${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`}
              </div>
            </div>
          </div>
          <hr />
          <div className='SeekerChat-Middlecontainer-bottom'>
            <div className='SeekerChat-chatwindow'>
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
            <div className='chat-input'>
              <input
                type='text'
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder='Type a message...'
                disabled={!seekerSession}
              />
              <button 
                onClick={sendMessage}
                disabled={!seekerSession || !messageInput.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className='SeekerChat-RightContainer'>
          <h3>Chat History</h3>
          <div className='SeekerChat-chat-history-content'>
            <SeekerChatHistoryContainer reviews={chatHistory} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SeekerChat;
