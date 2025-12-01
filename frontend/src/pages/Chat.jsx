import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FaPaperPlane, 
  FaRobot, 
  FaUser, 
  FaTrash, 
  FaMicrophone, 
  FaSpinner,
  FaLanguage 
} from 'react-icons/fa';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    loadChatHistory();
    
    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/chat/history`); //Api call to fetch chat history
      if (response.data.messages) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/chat/message`, {
        message: inputMessage,
        language: language
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(response.data.timestamp)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        const errorMessage = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/chat/history`);
        setMessages([]);
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const formatMessageContent = (content) => {
    // Split by newlines and create paragraphs
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') return null;
      
      // Check if line is a header (starts with ##)
      if (line.startsWith('##')) {
        return <h3 key={index} className="message-header">{line.replace(/##/g, '').trim()}</h3>;
      }
      
      // Check if line is a bullet point
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return <li key={index} className="message-list-item">{line.replace(/^[-•]\s*/, '')}</li>;
      }
      
      // Check if line is bold (wrapped in **)
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="message-text">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      }
      
      return <p key={index} className="message-text">{line}</p>;
    });
  };

  return (
    <div className="chat-page">
      <Navbar />
      
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-left">
            <h2>Medical Assistant</h2>
            <p>Ask about symptoms, get doctor suggestions & health precautions</p>
          </div>
          <div className="chat-header-right">
            <div className="language-selector">
              <FaLanguage className="language-icon" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी</option>
                <option value="Kannada">ಕನ್ನಡ</option>
              </select>
            </div>
            <button onClick={handleClearChat} className="clear-btn" title="Clear Chat">
              <FaTrash /> Clear
            </button>
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <FaRobot className="welcome-icon" />
              <h3>Welcome to MediCare AI! 👋</h3>
              <p>I'm here to help you with:</p>
              <ul className="welcome-list">
                <li>🩺 Disease prediction based on symptoms</li>
                <li>👨‍⚕️ Doctor specialist recommendations</li>
                <li>💊 Health precautions and advice</li>
                <li>🌍 Support in English, Hindi & Kannada</li>
              </ul>
              <p className="welcome-disclaimer">
                <strong>Note:</strong> I provide general health information. 
                Always consult a qualified healthcare professional for proper diagnosis.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-avatar">
                  {message.role === 'user' ? <FaUser /> : <FaRobot />}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {formatMessageContent(message.content)}
                  </div>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="message assistant-message">
              <div className="message-avatar">
                <FaRobot />
              </div>
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-container">
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            title="Voice Input"
            disabled={loading}
          >
            {isListening ? <FaSpinner className="spinner" /> : <FaMicrophone />}
          </button>
          
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Describe your symptoms or ask a health question..."
            className="chat-input"
            disabled={loading}
          />
          
          <button 
            type="submit" 
            className="send-btn"
            disabled={loading || !inputMessage.trim()}
          >
            {loading ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Chat;