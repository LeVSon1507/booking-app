import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { hotelApi } from 'api/hotelApi';
import chatbotApi from 'api/chatbotApi';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch hotels data when component mounts
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await hotelApi.getAllHotels('');
        setHotels(response.data || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };
    fetchHotels();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Prepare hotel context
      const hotelContext = hotels.map((hotel) => ({
        name: hotel.name,
        city: hotel.city,
        description: hotel.description,
        amenities: hotel.amenities || [],
        price: hotel.price,
        rating: hotel.rating,
        address: hotel.address,
      }));

      // Call backend API using chatbotApi
      const response = await chatbotApi.sendMessage(userMessage, hotelContext);

      if (response.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: response.response,
          },
        ]);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <FaRobot />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Hotel Assistant</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="message ai-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
