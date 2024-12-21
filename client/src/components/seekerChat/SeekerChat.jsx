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

const socket = io('http://localhost:5000'); // Connect to your backend server

function SeekerChat() {
  const [messages, setMessages] = useState([
    {
        position: 'right',
        type: 'text',
        text: 'Hi, Hello Kasuni.',
        date: new Date(),
      },
    {
      position: 'left',
      type: 'text',
      text: 'Hello! How can I help you today?',
      date: new Date(),
    },
    {
      position: 'right',
      type: 'text',
      text: 'I need some advice regarding my career.',
      date: new Date(),
    },
  ]);

  const [messageInput, setMessageInput] = useState(''); // New state for the input message


    // Set initial time to 0
    const initialTime = new Date();
    initialTime.setSeconds(initialTime.getSeconds()); // Start at 0
  
    // Use the react-timer-hook
    const { seconds, minutes, hours } = useTimer({
      expiryTimestamp: initialTime,
      onExpire: () => console.warn("Timer expired"),
      autoStart: false, // Start the timer manually
    });

  useEffect(() => {
    // Receive message from server
    socket.on('message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

    // Cleanup on component unmount
    return () => {
        socket.off('message');
      };
    }, []);

  // Send message to server
  const sendMessage = () => {
    if (messageInput.trim()) { // Check if message input is not empty
      const newMessage = {
        position: 'right',
        type: 'text',
        text: messageInput,
        date: new Date(),
      };
      
      socket.emit('message', newMessage); // Emit the new message to the server
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add to local messages
      setMessageInput(''); // Clear the input field
    }
  };

  const seekerChatsHis = [
    {id: 1, title: 'Serenity Stone',message1:`Hello, I'm Shanaya`, message2:`How can I help you?`, imgUrl: 'https://unsplash.it/200/200'},
    {id: 2, title: 'Michel Jackson',message1:`Hello, I'm Shanaya`, message2:`How can I help you?`, imgUrl: 'https://unsplash.it/201/200'},
    {id: 3, title: 'Serenity Stone',message1:`Hello, I'm Shanaya`, message2:`How can I help you?`,  imgUrl: 'https://unsplash.it/200/201'},
    {id: 4, title: 'Leo Doe',message1:`Hello, I'm Shanaya`, message2:`How can I help you?`,  imgUrl: 'https://unsplash.it/200/199'},
    {id: 5, title: 'Jony Dep',message1:`Hello, I'm Shanaya`, message2:`How can I help you?`,  imgUrl: 'https://unsplash.it/200/198'},
    {id: 6, title: 'Karoline Jude',message1:`Hello, I'm Shanaya`, message2:`How can I help you?`,  imgUrl: 'https://unsplash.it/200/200'},
    {id: 7, title: 'charle Jhosep',message1:`Hello, I'm Shanaya`, message2:`How can I help you?`,  imgUrl: 'https://unsplash.it/200/201'},  
  ];

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
              <img className='SeekerChat-Middlecontainer-proPick' src={Advisor2} alt="Advisor" />
              <h2>Kasun Gayantha</h2>
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
                value={messageInput} // Bind the input value to the messageInput state
                onChange={(e) => setMessageInput(e.target.value)} // Update the message input state on change
                placeholder='Type a message...'
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
        <hr />
        <div className='SeekerChat-RightContainer'>
            <h3>Chat History</h3>
            <div className='SeekerChat-chat-history-content'>
                <SeekerChatHistoryContainer reviews={ seekerChatsHis } />
            </div>      
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SeekerChat;
