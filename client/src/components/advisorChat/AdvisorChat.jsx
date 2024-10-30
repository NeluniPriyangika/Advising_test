import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook'; // Import the timer hook
import './advisorChat.css';
import Navbar from '../navbar/Navbar';
import AdvisorSideBar from '../advisorSideBar/AdvisorSideBar';
import Footer from '../footer/Footer';
import Seeker1 from '../../assets/seeker1.png';
import io from 'socket.io-client';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';


const AdvisorChatHistory = (props) => (
    <div className="AdvisorChat-chat-history">
      <div className='AdvisorChat-chat-history-content1'>
        <img src={ props.imgUrl } 
        alt={ props.alt || 'Image' } />
      </div>
      <div className="AdvisorChat-chat-history-content2">
        <h6>{ props.title }</h6>
        <p className='AdvisorChat-chat-history-desc'>"{props.message1}</p>
        <p className='AdvisorChat-chat-history-desc'>"{props.message2}</p>
      </div>  
    </div>
  );
  
  const AdvisorChatHistoryContainer = (props) => (
    <div className="AdvisorChat-chat-history-container">
      {
        props.reviews.map((review) => (
          <AdvisorChatHistory title={ review.title }
            imgUrl={ review.imgUrl }
            timeText = {review.timeText} 
            message1 = {review.message1}
            message2 = {review.message2}/>
        ))
      }
    </div>
  );

const socket = io('http://localhost:5000');

function AdvisorChat() {
  const [messages, setMessages] = useState([
    { position: 'left', type: 'text', text: 'Hi, Hello Kasuni.', date: new Date() },
    { position: 'right', type: 'text', text: 'Hello! How can I help you today?', date: new Date() },
    { position: 'left', type: 'text', text: 'I need some advice regarding my career.', date: new Date() },
  ]);

  const [messageInput, setMessageInput] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Set initial time to 0
  const initialTime = new Date();
  initialTime.setSeconds(initialTime.getSeconds()); // Start at 0

  // Use the react-timer-hook
  const { seconds, minutes, hours, restart, pause } = useTimer({
    expiryTimestamp: initialTime,
    onExpire: () => console.warn("Timer expired"),
    autoStart: false, // Start the timer manually
  });

  const handleTimerToggle = () => {
    if (isTimerActive) {
      pause(); // Pause the timer
    } else {
      // Restart the timer from 1 hour
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
      };
      socket.emit('message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput(''); // Clear the input after sending
    }
  };

  const AdvisorChatsHis = [
    {id: 1, title: 'Serenity Stone',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`, imgUrl: 'https://unsplash.it/200/200'},
    {id: 2, title: 'Michel Jackson',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`, imgUrl: 'https://unsplash.it/201/200'},
    {id: 3, title: 'Serenity Stone',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`,  imgUrl: 'https://unsplash.it/200/201'},
    {id: 4, title: 'Leo Doe',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`,  imgUrl: 'https://unsplash.it/200/199'},
    {id: 5, title: 'Jony Dep',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`,  imgUrl: 'https://unsplash.it/200/198'},
    {id: 6, title: 'Karoline Jude',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`,  imgUrl: 'https://unsplash.it/200/200'},
    {id: 7, title: 'charle Jhosep',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`,  imgUrl: 'https://unsplash.it/200/201'},  ]

  return (
    <div className="AdvisorChat-main">
      <Navbar />
      <div className="AdvisorChat-container">
        <div className="AdvisorChat--sidebar">
          <AdvisorSideBar />
        </div>
        <hr />
        <div className="AdvisorChat-Middlecontainer">
          <div className="AdvisorChat-Middlecontainer-top">
            <div className="AdvisorChat-Middlecontainer-top1">
              <img className="AdvisorChat-Middlecontainer-proPick" src={Seeker1} alt="Advisor" />
              <h2>Chamika Perera</h2>
              <div className="AdvisorChat-Status"></div>
            </div>
            <div className="AdvisorChat-Middlecontainer-top2">
              <div className="Advisor-timer">
                {`${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`}
              </div>
              <button className="Advisor-timer-controller" onClick={handleTimerToggle}>
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
                    onChange={(e) => setMessageInput(e.target.value)} // Update the input state
                />
                <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
        <hr />
        <div className="AdvisorChat-RightContainer">
          <h3>Chat History</h3>
          <div className="AdvisorChat-chat-history-content">
            <AdvisorChatHistoryContainer reviews={ AdvisorChatsHis } />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdvisorChat;
