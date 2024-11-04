import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import './advisorPublicChat.css';
import Navbar2 from '../navbar2/Navbar2'
import AdvisorSideBar from '../advisorSideBar/AdvisorSideBar';
import Footer from '../footer/Footer';
import Seeker1 from '../../assets/seeker1.png';
import io from 'socket.io-client';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';

const AdvisorPublicChatHistory = ({ imgUrl, title, message1, message2 }) => (
  <div className="chat-history">
    <img src={imgUrl} alt={title} className="chat-history-img" />
    <div className="chat-history-text">
      <h6>{title}</h6>
      <p className="chat-history-desc">{message1}</p>
      <p className="chat-history-desc">{message2}</p>
    </div>
  </div>
);

const AdvisorPublicChatHistoryContainer = ({ reviews }) => (
  <div className="chat-history-container">
    {reviews.map((review) => (
      <AdvisorPublicChatHistory
        key={review.id}
        title={review.title}
        imgUrl={review.imgUrl}
        message1={review.message1}
        message2={review.message2}
      />
    ))}
  </div>
);

const socket = io('http://localhost:5000');

function AdvisorPublicChat() {
  const [messages, setMessages] = useState([
    { position: 'left', type: 'text', text: 'Hi, Hello Kasuni.', date: new Date(), isAdvisor: false },
    { position: 'right', type: 'text', text: 'Hello! How can I help you today?', date: new Date(), isAdvisor: true },
    { position: 'left', type: 'text', text: 'I need some advice regarding my career.', date: new Date(), isAdvisor: false },
  ]);

  const [messageInput, setMessageInput] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  const initialTime = new Date();
  initialTime.setSeconds(initialTime.getSeconds());

  const { seconds, minutes, hours, restart, pause } = useTimer({
    expiryTimestamp: initialTime,
    onExpire: () => console.warn("Timer expired"),
    autoStart: false,
  });

  const handleTimerToggle = () => {
    if (isTimerActive) {
      pause();
    } else {
      const newTime = new Date();
      newTime.setSeconds(newTime.getSeconds() + 3600);
      restart(newTime);
    }
    setIsTimerActive(!isTimerActive);
  };

  useEffect(() => {
    socket.on('message', (msg) => setMessages((prevMessages) => [...prevMessages, msg]));
    return () => socket.off('message');
  }, []);

  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        position: 'right',
        type: 'text',
        text: messageInput,
        date: new Date(),
        isAdvisor: true,
        replyTo: replyMessage ? replyMessage.text : null,
      };
      socket.emit('message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput('');
      setReplyMessage(null);
    }
  };

  const handleReply = (message) => {
    setReplyMessage(message);
  };

  const AdvisorPublicChatsHis = [
    { id: 1, title: 'Serenity Stone', message1: "Hello, I'm Shanaya", message2: 'How can I help you?', imgUrl: 'https://unsplash.it/200/200' },
    { id: 2, title: 'Michel Jackson', message1: "Hello, I'm Shanaya", message2: 'How can I help you?', imgUrl: 'https://unsplash.it/201/200' },
    { id: 3, title: 'Serenity Stone', message1: "Hello, I'm Shanaya", message2: 'How can I help you?', imgUrl: 'https://unsplash.it/200/201' },
    { id: 4, title: 'Leo Doe', message1: "Hello, I'm Shanaya", message2: 'How can I help you?', imgUrl: 'https://unsplash.it/200/199' },
    { id: 5, title: 'Jony Dep', message1: "Hello, I'm Shanaya", message2: 'How can I help you?', imgUrl: 'https://unsplash.it/200/198' },
  ];

  return (
    <div className="AdvisorPublicChat-main">
      <Navbar2 />
      <div className="AdvisorPublicChat-container">
        <AdvisorSideBar />
        <div className="chat-middle-container">
          <h3>Public Chat</h3>
          <div className="chat-window">
            {messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.isAdvisor ? 'advisor-message' : 'seeker-message'}`}>
                {message.isAdvisor && (
                  <div className="advisor-info">
                    <img src={Seeker1} alt="Advisor" className="advisor-pic" />
                    <span className="advisor-name">Advisor</span>
                  </div>
                )}
                <MessageBox
                  position={message.position}
                  type={message.type}
                  text={message.text}
                  date={message.date}
                  replyButton
                  onReplyClick={() => handleReply(message)}
                />
                {message.replyTo && <div className="reply-to">Replying to: {message.replyTo}</div>}
              </div>
            ))}
          </div>
          <div className="chat-input">
            {replyMessage && (
              <div className="reply-preview">
                Replying to: {replyMessage.text}
                <button onClick={() => setReplyMessage(null)}>Cancel</button>
              </div>
            )}
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
        <div className="chat-history-section">
          <h3>Chat History</h3>
          <AdvisorPublicChatHistoryContainer reviews={AdvisorPublicChatsHis} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdvisorPublicChat;
