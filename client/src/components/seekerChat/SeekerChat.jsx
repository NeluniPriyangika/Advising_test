import React, { useEffect, useState } from 'react';
import './seekerChat.css';
import Navbar from '../navbar/Navbar';
import SeekerSideBar from '../seekerSideBar/SeekerSideBar';
import Footer from '../footer/Footer';
import Advisor1 from '../../assets/Advisor1.jpg';
import io from 'socket.io-client';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css'; // Import chat elements CSS
import { Message } from 'rsuite';
import ReadOnlyRating from '../readOnlyRating/ReadOnlyRating';


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
          <SeekerChatHistory title={ review.title }
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

  // Current message input
  const [chatMessages, setChatMessages] = useState([]);

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
    if (messages.trim()) {
      socket.emit('message', messages); // Emit message to the server
      setMessages(''); // Clear the input field
    }
  };


  const seekerChatsHis = [
    {id: 1, title: 'Serenity Stone',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`, imgUrl: 'https://unsplash.it/200/200'},
    {id: 2, title: 'Michel Jackson',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`, imgUrl: 'https://unsplash.it/201/200'},
    {id: 3, title: 'Serenity Stone',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`,  imgUrl: 'https://unsplash.it/200/201'},
    {id: 4, title: 'Leo Doe',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`,  imgUrl: 'https://unsplash.it/200/199'},
    {id: 5, title: 'Jony Dep',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`,  imgUrl: 'https://unsplash.it/200/198'},
    {id: 6, title: 'Karoline Jude',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`,  imgUrl: 'https://unsplash.it/200/200'},
    {id: 7, title: 'charle Jhosep',message1:`Hello, I'm Shanaya`, message2:`How can i help you?`,  imgUrl: 'https://unsplash.it/200/201'},  ]


  return (
    <div className='SeekerChat-main'>
      <Navbar />
      <div className='SeekerChat-container'>
        <div className='SeekerChat--sidebar'>
          <SeekerSideBar />
        </div>
        <hr />
        <div className='SeekerChat-Middlecontainer'>
          <div className='SeekerChat-Middlecontainer-top'>
            <img className='SeekerChat-Middlecontainer-proPick' src={Advisor1} alt="Advisor" />
            <h2>Kasun Gayantha</h2>
            <div className='SeekerChat-Status'></div>
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
                //value={messages}
                //onChange={(e) => setMessages(e.target.value)}
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
