import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './styles.css';
import Home from './Home';

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatHistory([
      { sender: 'bot', message: '👋 Hello! I am GrantGuide. How can I help you today?' },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleUserMessage = async () => {
    if (userMessage.trim()) {
      setChatHistory(prevHistory => [...prevHistory, { sender: 'user', message: userMessage }]);

      console.log('User message:', userMessage);
      try {
        const response = await axios.post('http://localhost:5000/ask', {
          question: userMessage,
        });

        setChatHistory(prevHistory => [
          ...prevHistory,
          { sender: 'bot', message: response.data.answer },
        ]);
      } catch (error) {
        console.error('Error fetching data', error);
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { sender: 'bot', message: 'Something went wrong. Please try again.' },
        ]);
      }

      setUserMessage('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(event.target.value);
  };

  return (
    <>
    <Home />
    <div className="chat-container">
      <div className="chat-window">
        <div className="chat-header">
          <h2>GrantGuide Chatbot</h2>
        </div>
        <div className="chat-body">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`message ${chat.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <span>{chat.message}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-footer">
          <input
            type="text"
            placeholder="Type your message..."
            value={userMessage}
            onChange={handleInputChange}
          />
          <button onClick={handleUserMessage}>Send</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Chatbot;
