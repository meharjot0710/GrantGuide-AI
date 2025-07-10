"use client";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ChatbotPage() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', message: '👋 Hello! I am GrantGuide. How can I help you today?' },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleUserMessage = async () => {
    if (userMessage.trim()) {
      setChatHistory((prev) => [...prev, { sender: 'user', message: userMessage }]);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/ask', { question: userMessage }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatHistory((prev) => [
          ...prev,
          { sender: 'bot', message: response.data.answer },
        ]);
      } catch (error) {
        setChatHistory((prev) => [
          ...prev,
          { sender: 'bot', message: 'Something went wrong. Please try again.' },
        ]);
      }
      setUserMessage('');
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <h2>GrantGuide Chatbot</h2>
        <div style={{ height: 400, overflowY: 'auto', border: '1px solid #ccc', padding: 8, marginBottom: 16 }}>
          {chatHistory.map((chat, idx) => (
            <div key={idx} style={{ textAlign: chat.sender === 'user' ? 'right' : 'left' }}>
              <span>{chat.message}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ flex: 1 }}
            type="text"
            placeholder="Type your message..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUserMessage()}
          />
          <button onClick={handleUserMessage}>
            Send
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
} 